import { StatusCodes } from 'http-status-codes';
import trendModel from '../models/trendModel.js';
import trendCategoryModel from '../models/categoryModel.js'; 

import {
  DEFAULT_VISUAL_LIMIT,
  addNode,
  addEdge,
  buildNodeId,
  createEdgeId,
  getTrendIconUrl,
  buildVisualQuery,
  getSafeVisualLimit,
  getVisualLimitConfig,
  getCanonicalTrendNodeId,
  doesPrimaryTechMatchTrend,
  shouldSkipPrimaryTechEdge,
} from '../utils/viewFlowUtils.js';

/**
 * GET APPROVED VIEW FLOW
 * Returns graph-ready relationship data for approved trends
 *
 * Relationships:
 * trend - category
 * trend -technology
 */
export const getApprovedViewFlow = async (req, res) => {
  const {
    search,
    trendCategory,
    trendTech,
    status,
    limit,
  } = req.query;

  const userRole = req.user?.role || 'guestUser';
  const safeLimit = getSafeVisualLimit(limit, userRole);
  const { defaultLimit, minLimit, maxLimit, canUseRequestedLimit } =
    getVisualLimitConfig(userRole);

  const queryObject = buildVisualQuery({
    search,
    trendCategory,
    trendTech,
    status,
  });

  try {
    const trends = await trendModel
      .find(queryObject)
      .select(
        '_id trend slug trendCategory cateIconUrl trendTechs svg_url trendStatus views combinedScore updatedAt'
      )
      .sort({ combinedScore: -1, views: -1, updatedAt: -1 })
      .limit(safeLimit)
      .lean();

    const nodeMap = new Map();
    const edgeMap = new Map();

    const defaultTrend = trends.reduce((topTrend, currentTrend) => {
      if (!topTrend) return currentTrend;

      return Number(currentTrend.views || 0) > Number(topTrend.views || 0)
        ? currentTrend
        : topTrend;
    }, null); //chooses highest-view trend from returned graph set

    trends.forEach((trend) => {
      const trendNodeId = getCanonicalTrendNodeId(trend);
      const primaryTechMatchesTrend = doesPrimaryTechMatchTrend(trend);

      addNode(nodeMap, {
        id: trendNodeId,
        type: 'trend',
        label: trend.trend,
        slug: trend.slug,//required for click fetch and navigation
        iconUrl: getTrendIconUrl(trend),
        trendStatus: trend.trendStatus,
        views: trend.views || 0,
        combinedScore: trend.combinedScore || 0,
        isCanonicalTrendTech: primaryTechMatchesTrend,
      });
      if (trend.trendCategory) {
        const categoryNodeId = buildNodeId('category', trend.trendCategory);
        addNode(nodeMap, {
          id: categoryNodeId,
          type: 'category',
          label: trend.trendCategory,
          iconUrl: trend.cateIconUrl || '/assets/cat/fallback-cat.svg',
        });
        addEdge(edgeMap, {
          id: createEdgeId(trendNodeId, categoryNodeId, 'category'),
          source: trendNodeId,
          target: categoryNodeId,
          relation: 'category',
        });
      }

      trend.trendTechs?.forEach((tech, index) => {
        if (!tech?.value) return;
        const skipPrimarySelfEdge = shouldSkipPrimaryTechEdge(trend, tech, index);
        const techNodeId = buildNodeId('tech', tech.value);

        addNode(nodeMap, {
          id: techNodeId,
          type: skipPrimarySelfEdge ? 'trend' : 'tech', //primary matching tech remains visual trend
          label: tech.value,
          iconUrl: tech.techIconUrl || '/assets/fallback-tech.svg',
          slug: skipPrimarySelfEdge ? trend.slug : undefined, //keep clickable trend slug
          trendStatus: skipPrimarySelfEdge ? trend.trendStatus : undefined,
          views: skipPrimarySelfEdge ? trend.views || 0 : undefined,
          combinedScore: skipPrimarySelfEdge ? trend.combinedScore || 0 : undefined,
          isPrimaryTech: index === 0,
          isCanonicalTrendTech: skipPrimarySelfEdge,
        });

        if (skipPrimarySelfEdge) return; //do not create tech-solidjs tech-solidjs edge

        addEdge(edgeMap, {
          id: createEdgeId(trendNodeId, techNodeId, 'tech'),
          source: trendNodeId,
          target: techNodeId,
          relation: index === 0 ? 'primary-tech' : 'tech',
        });
      });
    });

    res.status(StatusCodes.OK).json({
      nodes: Array.from(nodeMap.values()),
      edges: Array.from(edgeMap.values()),
      meta: {
        trendCount: trends.length,
        nodeCount: nodeMap.size,
        edgeCount: edgeMap.size,
        limit: safeLimit,
        requestedLimit: limit || null,
        defaultLimit,
        minLimit,
        maxLimit,
        canUseRequestedLimit,
        role: userRole,
        defaultTrendSlug: defaultTrend?.slug || null,
      },
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: error.message,
    });
  }
};//end getApprovedViewFlow

/**
 * GET VIEW TREND PREVIEW
 * Returns only the lightweight data needed for the selected ViewFlow panel
 */
export const getViewTrendPreview = async (req, res) => {
  const { slug } = req.params;

  try {
    const trend = await trendModel
      .findOne({ slug, isApproved: true })
      .select(
        '_id trend slug trendCategory cateIconUrl trendTechs svg_url trendStatus views openSourceStatus'
      ) //lightweight only
      .lean();
    if (!trend) {
      return res.status(StatusCodes.NOT_FOUND).json({
        msg: 'Trend not found',
      });
    }

    res.status(StatusCodes.OK).json({
      trendPreview: {
        trendId: trend._id,
        trend: trend.trend,
        slug: trend.slug,
        iconUrl: getTrendIconUrl(trend),
        trendCategory: trend.trendCategory,
        cateIconUrl: trend.cateIconUrl,
        trendTechs: trend.trendTechs || [],
        trendStatus: trend.trendStatus,
        views: trend.views || 0,
        openSourceStatus: trend.openSourceStatus,
      },
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: error.message,
    });
  }
};//end getViewTrendPreview


/**
 * GET VIEW CATEGORY PREVIEW
 * Returns lightweight category data for ViewFlow selected category panel.
 */
export const getViewCategoryPreview = async (req, res) => {
  const categoryValue = decodeURIComponent(req.params.categoryValue || '').trim();

  if (!categoryValue) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: 'Category value is required',
    });
  }
  const categoryKey = categoryValue
    .toUpperCase()
    .replace(/\s+/g, '_')
    .replace(/[^A-Z0-9_]/g, '');

  try {
    const category = await trendCategoryModel
      .findOne({
        $or: [
          { value: categoryValue },
          { label: categoryValue },
          { key: categoryKey },
        ],
      })
      .select('key label value image fullImageUrl description')
      .lean();

    if (!category) {
      return res.status(StatusCodes.NOT_FOUND).json({
        msg: 'Category not found',
      });
    }
    res.status(StatusCodes.OK).json({
      categoryPreview: {
        key: category.key,
        label: category.label,
        value: category.value,
        iconUrl: category.fullImageUrl || category.image,
        description: category.description || '',
      },
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: error.message,
    });
  }
};//end getViewCategoryPreview