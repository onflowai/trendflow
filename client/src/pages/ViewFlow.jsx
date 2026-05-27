import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLoaderData } from 'react-router-dom';
import { toast } from 'react-toastify';
import Container from '../assets/wrappers/ViewFlowContainer';
import useLocalStorage from '../hooks/useLocalStorage';
import { useTheme } from '../context/ThemeContext'; 
import useWindowSize from '../hooks/useWindowSize';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
} from 'd3-force';
import customFetch from '../utils/customFetch';
import { getFullIconUrl } from '../utils/urlHelper';
import {
  ContentRowComponent,
  CustomErrorToast,
  IconCategory,
  IconTechnology,
  SEOProtected,
} from '../components';
import { PiHashDuotone, PiEyeLight, PiTrendUp } from 'react-icons/pi';


/**
 * ViewFlow responsible for displaying the ReactFlow relationship diagram using getApprovedViewFlow controller
 * which provides nodes and edges 
 */
const GRAPH_WIDTH = 1400;
const GRAPH_HEIGHT = 900;
//const VIEW_LIMIT = 72;// requesting limit for authenticated users
const INITIAL_ZOOM_CLICKS = 7;// zoom-in of about 7
const ZOOM_CLICK_FACTOR = 1.2;// reactflow-style zoom multiplier

const DESKTOP_VIEW_LIMIT = 72;
const MOBILE_VIEW_LIMIT = 26;

export const loader = async ({ request }) => {
  const params = Object.fromEntries([
    ...new URL(request.url).searchParams.entries(),
  ]);

  const isMobileRequest =
  typeof window !== 'undefined' &&
  window.matchMedia?.('(max-width: 768px)').matches;
  params.viewMode = isMobileRequest ? 'mobile' : 'desktop'; //HERE
  params.limit = params.limit || (isMobileRequest ? MOBILE_VIEW_LIMIT : DESKTOP_VIEW_LIMIT); //HERE

  try {
    const { data } = await customFetch.get('/views/approved-view-flow', {
      params,
    });

    const defaultTrendSlug = data?.meta?.defaultTrendSlug;

    let initialTrendPreview = null;

    if (defaultTrendSlug) {
      const { data: previewData } = await customFetch.get(
        `/views/trend-preview/${defaultTrendSlug}`
      );

      initialTrendPreview = previewData.trendPreview || null;
    }

    const { data: savedTrendsData } = await customFetch.get(
      '/users/saved-trends'
    );

    const savedTrendIds =
      savedTrendsData?.savedTrends?.map((trend) => trend._id) || [];

    return {
      graphData: {
        nodes: data.nodes || [],
        edges: data.edges || [],
        meta: data.meta || null,
      },
      initialTrendPreview,
      savedTrendIds,
      searchValues: params,
    };
  } catch (error) {
    toast.error(<CustomErrorToast message={error?.response?.data?.msg} />);

    const msg = error?.response?.data?.msg ?? 'An error occurred';

    return {
      graphData: {
        nodes: [],
        edges: [],
        meta: null,
      },
      initialTrendPreview: null,
      savedTrendIds: [],
      searchValues: {},
      error: msg,
    };
  }
};

const resolveIconUrl = (iconUrl, type) => {
  if (!iconUrl) {
    return type === 'category'
      ? '/assets/cat/fallback-cat.svg'
      : '/assets/fallback-tech.svg';
  }

  if (/^https?:\/\//i.test(iconUrl)) {
    return iconUrl;
  }

  return getFullIconUrl(iconUrl);
};

const getNodeSize = (type) => {
  if (type === 'trend') return 92;
  if (type === 'category') return 72;
  return 64;
};

const buildDashboardLink = (paramName, paramValue) => {
  if (!paramValue) return '/dashboard';

  const encodedValue = encodeURIComponent(paramValue);
  return `/dashboard?${paramName}=${encodedValue}`;
};

const buildSelectedTrendItems = (selectedTrendPreview) => {
  if (!selectedTrendPreview) return [];

  const techItems =
    selectedTrendPreview.trendTechs?.map((tech, index) => ({
      label: tech.value,
      icon: tech.techIconUrl ? (
        <IconTechnology
          src={resolveIconUrl(tech.techIconUrl, 'tech')}
          fallbackSrc="/assets/fallback-tech.svg"
          alt={`${tech.value} Icon`}
          size={20}
        />
      ) : (
        <PiHashDuotone />
      ),
      link: buildDashboardLink('trendTech', tech.value),
      styled: true,
      key: `tech-${tech.value}-${index}`,
    })) || [];

  return [
    ...techItems,
    {
      label: selectedTrendPreview.trendCategory,
      icon: selectedTrendPreview.cateIconUrl ? (
        <IconCategory
          src={resolveIconUrl(selectedTrendPreview.cateIconUrl, 'category')}
          fallbackSrc="/assets/cat/fallback-cat.svg"
          alt="Category Icon"
          size={20}
        />
      ) : (
        <PiHashDuotone />
      ),
      link: buildDashboardLink(
        'trendCategory',
        selectedTrendPreview.trendCategory
      ),
      styled: true,
      key: `category-${selectedTrendPreview.trendCategory}`,
    },
    {
      label: selectedTrendPreview.trendStatus,
      icon: <PiTrendUp />,
      styled: true,
      key: `status-${selectedTrendPreview.trendStatus}`,
    },
    {
      label: selectedTrendPreview.views,
      icon: <PiEyeLight />,
      styled: false,
      key: `views-${selectedTrendPreview.views}`,
    },
  ].filter((item) => item.label !== undefined && item.label !== null);
};

const VisualNode = ({ data }) => {
  const { isDarkTheme } = useTheme();

  const size = getNodeSize(data.nodeType);
  const iconUrl = resolveIconUrl(data.iconUrl, data.nodeType);

  const nodeBackground =
    data.nodeType === 'trend'
      ? isDarkTheme
        ? 'var(--primary-500)' //dark trend node
        : 'var(--primary-400)' //light trend node
      : data.nodeType === 'tech'
      ? isDarkTheme
        ? 'var(--primary-400)' //dark tech node
        : 'var(--primary-100)' //light tech node
      : isDarkTheme
        ? 'var(--grey-200)' //dark tech/category node
        : '#fff'; //light tech/category node

  const nodeBorder =
    data.nodeType === 'trend'
      ? isDarkTheme
        ? 'var(--primary-800)'
        : 'var(--primary-100)'
      : data.nodeType === 'tech'
      ? isDarkTheme
        ? 'var(--primary-500)'
        : 'var(--primary-50)'
      : isDarkTheme
        ? 'var(--grey-300)'
        : '#d1d5db';

  return (
    <div
      className="visual-node"
      style={{
        width: size,
        minHeight: size + 28,
      }}
      title={data.label}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{
          opacity: 0,
          pointerEvents: 'none',
          left: '50%',
          top: '50%',
        }}
      />

      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          opacity: 0,
          pointerEvents: 'none',
          left: '50%',
          top: '50%',
        }}
      />

      <div
        className={`visual-node-icon ${data.nodeType}`}
        style={{
          width: size,
          height: size,
          background: nodeBackground,
          borderColor: nodeBorder,
        }}
      >
        <img
          src={iconUrl}
          alt={data.label}
          style={{
            width: data.nodeType === 'trend' ? '62%' : '58%',
            height: data.nodeType === 'trend' ? '62%' : '58%',
          }}
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src =
              data.nodeType === 'category'
                ? '/assets/cat/fallback-cat.svg'
                : '/assets/fallback-tech.svg';
          }}
        />
      </div>

      <div
        className="visual-node-label"
        style={{
          maxWidth: size + 42,
          fontSize: data.nodeType === 'trend' ? '12px' : '11px',
          fontWeight: data.nodeType === 'trend' ? 800 : 600,
        }}
      >
        {data.label}
      </div>
    </div>
  );
};

const nodeTypes = {
  visualNode: VisualNode,
};

const buildForceLayout = (graphNodes, graphEdges, isMobile = false) => {
  const tickCount = isMobile ? 100 : 280;
  const chargeStrength = isMobile ? -420 : -650;
  const centerX = isMobile ? 700 : GRAPH_WIDTH / 2;
  const centerY = isMobile ? 520 : GRAPH_HEIGHT / 2;
  const simulationNodes = graphNodes.map((node, index) => ({
    ...node,
    x:
      node.type === 'trend'
        ? GRAPH_WIDTH / 2 + Math.cos(index) * 160
        : GRAPH_WIDTH / 2 + Math.cos(index) * 420,
    y:
      node.type === 'trend'
        ? GRAPH_HEIGHT / 2 + Math.sin(index) * 160
        : GRAPH_HEIGHT / 2 + Math.sin(index) * 420,
  }));

  const simulationEdges = graphEdges.map((edge) => ({
    source: edge.source,
    target: edge.target,
  }));

  const simulation = forceSimulation(simulationNodes)
    .force(
      'link',
      forceLink(simulationEdges)
        .id((node) => node.id)
        .distance((edge) => {
          const sourceType = edge.source?.type;
          const targetType = edge.target?.type;

          if (sourceType === 'trend' && targetType === 'category') return 170;
          if (sourceType === 'trend' && targetType === 'tech') return 220;

          return 200;
        })
        .strength(0.55)
    )
    .force('charge', forceManyBody().strength(chargeStrength))
    .force('center', forceCenter(centerX, centerY))
    .force(
      'collide',
      forceCollide().radius((node) => {
        if (node.type === 'trend') return 90;
        if (node.type === 'category') return 74;
        return 68;
      })
    )
    .stop();

  for (let i = 0; i < tickCount; i += 1) {
    simulation.tick();
  }

  const reactFlowNodes = simulationNodes.map((node) => ({
    id: node.id,
    type: 'visualNode',
    position: {
      x: node.x,
      y: node.y,
    },
    data: {
      ...node,
      nodeType: node.type,
    },
  }));

  const reactFlowEdges = graphEdges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    type: 'straight',
    animated: false,
    data: {
      relation: edge.relation,
    },
    style: {
      strokeWidth: edge.relation === 'primary-tech' ? 2.4 : 1.4,
      opacity: edge.relation === 'category' ? 0.55 : 0.38,
    },
  }));

  return {
    nodes: reactFlowNodes,
    edges: reactFlowEdges,
  };
};//end buildForceLayout

  const buildTrendPanelFromPreview = (trendPreview) => {
    if (!trendPreview) return null;

    return {
      nodeType: 'trend',
      label: trendPreview.trend,
      iconUrl: trendPreview.iconUrl,
      slug: trendPreview.slug,
    };
  };

  const buildPanelFromNode = (node) => {
    if (!node?.data) return null;

    return {
      nodeType: node.data.nodeType,
      label: node.data.label,
      iconUrl: node.data.iconUrl,
      slug: node.data.slug || '',
    };
  };

const ViewFlow = () => {
  const navigate = useNavigate();
  const { isDarkTheme } = useTheme();
  const { isMobile } = useWindowSize();

  const handleFlowInit = async (reactFlowInstance) => {
    await reactFlowInstance.fitView({
      padding: 0.18,
    });

    const fittedZoom = reactFlowInstance.getZoom();

    const nextZoom = Math.min(
      fittedZoom * Math.pow(ZOOM_CLICK_FACTOR, INITIAL_ZOOM_CLICKS),
      2 //respects your maxZoom
    );

    reactFlowInstance.zoomTo(nextZoom, {
      duration: 0,
    });
  };

  const {
    graphData,
    initialTrendPreview,
    savedTrendIds: initialSavedTrendIds,
    error,
  } = useLoaderData();

  const [savedTrendIds, setSavedTrendIds] = useState(
    initialSavedTrendIds || []
  );

  const defaultTrendPanel = useMemo(() => {
  return buildTrendPanelFromPreview(initialTrendPreview);
}, [initialTrendPreview]); //stable object, prevents loop

const [savedViewFlowPanel, setSavedViewFlowPanel] = useLocalStorage(
  'viewFlowSelectedPanel',
  defaultTrendPanel
);

const [selectedPanel, setSelectedPanel] = useState(
  savedViewFlowPanel || defaultTrendPanel
);

const [selectedTrendPreview, setSelectedTrendPreview] = useState(
  savedViewFlowPanel?.nodeType === 'trend' &&
    savedViewFlowPanel?.slug === initialTrendPreview?.slug
    ? initialTrendPreview
    : null
);

const [isPreviewLoading, setIsPreviewLoading] = useState(false);
const [selectedCategoryPreview, setSelectedCategoryPreview] = useState(null);
const [isCategoryPreviewLoading, setIsCategoryPreviewLoading] = useState(false);

const panelData = selectedPanel;

const selectedPanelKey = selectedPanel
  ? `${selectedPanel.nodeType}:${selectedPanel.slug || selectedPanel.label}`
  : ''; //stable dependency key

  const selectedTrendItems = useMemo(() => {
    return buildSelectedTrendItems(selectedTrendPreview);
  }, [selectedTrendPreview]);

  const selectedTrendIsSaved = Boolean(
    selectedTrendPreview?.trendId &&
      savedTrendIds.includes(selectedTrendPreview.trendId)
  );

  const layoutedGraph = useMemo(() => {
    if (!graphData?.nodes?.length) {
      return {
        nodes: [],
        edges: [],
      };
    }
  return buildForceLayout(graphData.nodes, graphData.edges, isMobile);
}, [graphData, isMobile]);

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedGraph.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedGraph.edges);

  useEffect(() => {
    setNodes(layoutedGraph.nodes);
    setEdges(layoutedGraph.edges);
  }, [layoutedGraph, setNodes, setEdges]);

  useEffect(() => {
    if (!selectedPanel) {
      if (defaultTrendPanel) {
        setSelectedPanel(defaultTrendPanel);
        setSavedViewFlowPanel(defaultTrendPanel);
      }

      return;
    }

    let isMounted = true;

    const fetchCategoryPreview = async () => {
      try {
        setIsCategoryPreviewLoading(true);
        setSelectedTrendPreview(null);

        const { data } = await customFetch.get(
          `/views/category-preview/${encodeURIComponent(selectedPanel.label)}`
        );

        if (!isMounted) return;

        setSelectedCategoryPreview(data.categoryPreview || null);
      } catch (error) {
        console.error('Failed to load selected ViewFlow category:', error);

        if (!isMounted) return;

        setSelectedCategoryPreview(null);
      } finally {
        if (isMounted) {
          setIsCategoryPreviewLoading(false);
        }
      }
    };

    const fetchTrendPreview = async () => {
      if (!selectedPanel.slug) return;

      if (selectedTrendPreview?.slug === selectedPanel.slug) {
        return;
      }

      try {
        setIsPreviewLoading(true);
        setSelectedCategoryPreview(null);

        const { data } = await customFetch.get(
          `/views/trend-preview/${selectedPanel.slug}`
        );

        if (!isMounted) return;

        setSelectedTrendPreview(data.trendPreview || null);
      } catch (error) {
        console.error('Failed to load selected ViewFlow trend:', error);

        if (!isMounted) return;

        setSelectedTrendPreview(initialTrendPreview || null);

        if (defaultTrendPanel) {
          setSelectedPanel(defaultTrendPanel);
          setSavedViewFlowPanel(defaultTrendPanel);
        }
      } finally {
        if (isMounted) {
          setIsPreviewLoading(false);
        }
      }
    };

    if (selectedPanel.nodeType === 'category') {
      fetchCategoryPreview();

      return () => {
        isMounted = false;
      };
    }

    if (selectedPanel.nodeType === 'tech') {
      setSelectedTrendPreview(null); //no ContentRowComponent for tech
      setSelectedCategoryPreview(null); //no category description for tech
      return;
    }

    if (selectedPanel.nodeType === 'trend') {
      fetchTrendPreview();

      return () => {
        isMounted = false;
      };
    }

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPanelKey]);

  const onSave = async (_id) => {
    try {
      await customFetch.patch('/users/save-trend', { _id });
      setSavedTrendIds((prev) => [...new Set([...prev, _id])]);
      toast.success('Trend saved successfully');
    } catch (error) {
      toast.error('An error occurred while saving trend');
      console.error(error);
    }
  };

  const onRemove = async (_id) => {
    try {
      await customFetch.patch('/users/remove-trend', { _id });
      setSavedTrendIds((prev) => prev.filter((id) => id !== _id));
      toast.success('Trend unmarked successfully');
    } catch (error) {
      toast.error('An error occurred');
      console.error(error);
    }
  };

  const onToggleBookmark = async (trendId, nextIsSaved) => {
    if (nextIsSaved) {
      await onSave(trendId);
    } else {
      await onRemove(trendId);
    }
  };

  const handleBookmarkClick = async (event) => {
    event.stopPropagation();

    if (!selectedTrendPreview?.trendId) return;

    if (selectedTrendIsSaved) {
      await onRemove(selectedTrendPreview.trendId);
    } else {
      await onSave(selectedTrendPreview.trendId);
    }
  };

  const handleNodeClick = (_, node) => {
  const nextPanel = buildPanelFromNode(node);

  if (!nextPanel) return;

  setSelectedPanel(nextPanel);
  setSavedViewFlowPanel(nextPanel); //persists trend/category/tech
};

  const handleNodeDoubleClick = (_, node) => {
    if (node?.data?.nodeType === 'trend' && node?.data?.slug) {
      navigate(`/dashboard/trend/${node.data.slug}`);
      return;
    }
    if (node?.data?.nodeType === 'tech') {
      navigate(buildDashboardLink('trendTech', node.data.label));
      return;
    }

    if (node?.data?.nodeType === 'category') {
      navigate(buildDashboardLink('trendCategory', node.data.label));
    }
  };
  if (error) {
    return <div>Error loading data: {error}</div>;
  }

  const activePanelData = panelData || defaultTrendPanel; 

  return (
    <>
      <SEOProtected />

      <Container>
        <div className="view-flow-header">
          {graphData?.meta && (
            <div className="view-flow-meta">
              {graphData.meta.nodeCount} nodes / {graphData.meta.edgeCount}{' '}
              edges
            </div>
          )}
        </div>
          <div className="selected-flow-panel">
            <div className="selected-flow-main">
              {activePanelData.nodeType === 'trend' && activePanelData.slug ? (
                <button
                  type="button"
                  className="selected-flow-trend-button"
                  onClick={() => navigate(`/dashboard/trend/${activePanelData.slug}`)}
                >
                  <span className="selected-flow-icon">
                    <img
                      src={resolveIconUrl(activePanelData.iconUrl, activePanelData.nodeType)}
                      alt={activePanelData.label}
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = '/assets/fallback-tech.svg';
                      }}
                    />
                  </span>

                  <span className="selected-flow-label">{activePanelData.label}</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="selected-flow-trend-button secondary"
                  onClick={() => {
                    if (activePanelData.nodeType === 'tech') {
                      navigate(buildDashboardLink('trendTech', activePanelData.label));
                      return;
                    }

                    if (activePanelData.nodeType === 'category') {
                      navigate(buildDashboardLink('trendCategory', activePanelData.label));
                    }
                  }}
                >
                  <span className="selected-flow-icon secondary">
                    <img
                      src={resolveIconUrl(activePanelData.iconUrl, activePanelData.nodeType)}
                      alt={activePanelData.label}
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src =
                          activePanelData.nodeType === 'category'
                            ? '/assets/cat/fallback-cat.svg'
                            : '/assets/fallback-tech.svg';
                      }}
                    />
                  </span>

                  <span className="selected-flow-label">
                    {activePanelData.nodeType === 'category'
                      ?  activePanelData.label
                      :  activePanelData.label}
                  </span>
                </button>
              )}
            </div>

            {activePanelData.nodeType === 'category' && (
              <div className="selected-flow-description">
                {isCategoryPreviewLoading ? (
                  <span className="selected-flow-loading">Loading category...</span>
                ) : (
                  selectedCategoryPreview?.description || 'No category description yet.'
                )}
              </div>
            )}

            {activePanelData.nodeType === 'trend' && (
              <div className="selected-flow-row">
                {isPreviewLoading && (
                  <span className="selected-flow-loading">Loading...</span>
                )}

                {selectedTrendPreview && (
                  <ContentRowComponent
                    items={selectedTrendItems}
                    openSourceStatus={selectedTrendPreview.openSourceStatus}
                    trendId={selectedTrendPreview.trendId}
                    onToggleBookmark={onToggleBookmark}
                    handleBookmarkClick={handleBookmarkClick}
                    isSaved={selectedTrendIsSaved}
                  />
                )}
              </div>
            )}
          </div>
        <div className={`graph-shell ${panelData ? 'has-selected' : ''}`}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            nodeOrigin={[0.5, 0.5]}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={handleNodeClick}
            onNodeDoubleClick={handleNodeDoubleClick}
            onlyRenderVisibleElements={isMobile}
            onInit={handleFlowInit}
            minZoom={isMobile ? 0.10 : 0.15}
            maxZoom={isMobile ? 1.20 : 2}
            nodesDraggable
            nodesConnectable={false}
            elementsSelectable
            panOnDrag
          >
            {!isMobile && (
            <Background
              gap={28}
              size={1}
              color={isDarkTheme ? '#4b5563' : '#d1d5db'}
            />
          )}

          <Controls />

          {!isMobile && (
            <MiniMap
              zoomable
              pannable
              maskColor={
                isDarkTheme
                  ? 'rgba(17, 24, 39, 0.72)'
                  : 'rgba(248, 250, 252, 0.72)'
              }
              nodeColor={(node) => {
                if (node?.data?.nodeType === 'trend') {
                  return isDarkTheme ? '#625eda' : '#c1bff6';
                }

                return isDarkTheme ? '#a0a1a0' : '#ffffff';
              }}
            />
          )}
          </ReactFlow>
        </div>
      </Container>
    </>
  );
};

export default ViewFlow;