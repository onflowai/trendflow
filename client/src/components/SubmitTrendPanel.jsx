import React, { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import {
  ContentBoxHighlighted,
  CustomErrorToast,
  CustomSuccessToast,
  DangerousMarkdown,
  TrendBlogLoading,
  TrendBookMark,
  TrendOfficialLinkEditor,
} from '../components';
import EditMarkdown from './EditMarkdown.client';
import EditMarkdownSmall from './EditMarkdownSmall.client';
import customFetch from '../utils/customFetch';
import { normalizeUrlForOpen, normalizeUrlForSend } from '../utils/urlHelper';

/**
 * Generated trend review/edit panel.
 *
 * The parent owns the submitted trend object and form reset behavior. This
 * component owns editable markdown/link state, dirty tracking, persistence,
 * bookmarks, and submit-for-approval behavior.
 */
const SubmitTrendPanel = ({
  trendObject,
  setTrendObject,
  isSubmitting,
  showSubmitSpinner,
  isAdmin,
  isDarkTheme,
  techIconUrl,
  techLabel,
  trendTechsPayload = [],
  setAdminDraft,
  onApprovalComplete,
}) => {
  const [generatedBlogPost, setGeneratedBlogPost] = useState('');
  const [trendUse, setTrendUse] = useState('');
  const [trendOfficialLink, setTrendOfficialLink] = useState('');

  const [isSavingUse, setIsSavingUse] = useState(false);
  const [isSavingBlog, setIsSavingBlog] = useState(false);
  const [isSavingLink, setIsSavingLink] = useState(false);
  const [isSubmittingForApproval, setIsSubmittingForApproval] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const draftWriteTimerRef = useRef(null);

  useEffect(() => {
    setGeneratedBlogPost(trendObject?.generatedBlogPost || '');
    setTrendUse(trendObject?.trendUse || '');
    setTrendOfficialLink(trendObject?.trendOfficialLink || '');
  }, [
    trendObject?.slug,
    trendObject?.generatedBlogPost,
    trendObject?.trendUse,
    trendObject?.trendOfficialLink,
  ]);

  const initial = useMemo(
    () => ({
      generatedBlogPost: trendObject?.generatedBlogPost || '',
      trendUse: trendObject?.trendUse || '',
      trendOfficialLink: trendObject?.trendOfficialLink || '',
    }),
    [
      trendObject?.generatedBlogPost,
      trendObject?.trendUse,
      trendObject?.trendOfficialLink,
    ]
  );

  const isUseDirty = trendUse !== initial.trendUse;
  const isBlogDirty = generatedBlogPost !== initial.generatedBlogPost;

  useEffect(() => {
    if (!isAdmin || !trendObject?.slug || !setAdminDraft) return;

    if (draftWriteTimerRef.current) clearTimeout(draftWriteTimerRef.current);

    draftWriteTimerRef.current = setTimeout(() => {
      setAdminDraft({
        slug: trendObject.slug,
        generatedBlogPost: generatedBlogPost || '',
        trendUse: trendUse || '',
        trendOfficialLink: trendOfficialLink || '',
        trendTechs:
          trendObject?.trendTechs?.length > 0
            ? trendObject.trendTechs
            : trendTechsPayload,
        isSubmittedForApproval: Boolean(trendObject?.isSubmittedForApproval),
        updatedAt: Date.now(),
      });
    }, 350);

    return () => {
      if (draftWriteTimerRef.current) clearTimeout(draftWriteTimerRef.current);
    };
  }, [
    isAdmin,
    trendObject?.slug,
    trendObject?.trendTechs,
    trendObject?.isSubmittedForApproval,
    generatedBlogPost,
    trendUse,
    trendOfficialLink,
    trendTechsPayload,
    setAdminDraft,
  ]);

  const patchTrendBlogFields = async (partial) => {
    if (!trendObject?.slug) throw new Error('Missing slug');
    return customFetch.patch(
      `/trends/${trendObject.slug}/update-trend-blog`,
      partial
    );
  };

  const handleUpdateTrendUse = async () => {
    try {
      setIsSavingUse(true);
      await patchTrendBlogFields({ trendUse });
      setTrendObject((prev) => ({ ...(prev || {}), trendUse }));
      toast.success(<CustomSuccessToast message="trendUse updated" />);
    } catch (error) {
      toast.error(
        <CustomErrorToast
          message={error?.response?.data?.msg || 'Error updating trendUse'}
        />
      );
    } finally {
      setIsSavingUse(false);
    }
  };

  const handleUpdateGeneratedBlogPost = async () => {
    try {
      setIsSavingBlog(true);
      await patchTrendBlogFields({ generatedBlogPost });
      setTrendObject((prev) => ({ ...(prev || {}), generatedBlogPost }));
      toast.success(<CustomSuccessToast message="Blog post updated" />);
    } catch (error) {
      toast.error(
        <CustomErrorToast
          message={error?.response?.data?.msg || 'Error updating blog post'}
        />
      );
    } finally {
      setIsSavingBlog(false);
    }
  };

  const handleUpdateTrendOfficialLink = async () => {
    try {
      setIsSavingLink(true);
      const normalized = normalizeUrlForSend(trendOfficialLink);
      await patchTrendBlogFields({ trendOfficialLink: normalized });
      setTrendOfficialLink(normalized);
      setTrendObject((prev) => ({
        ...(prev || {}),
        trendOfficialLink: normalized,
      }));
      toast.success(<CustomSuccessToast message="Official link updated" />);
    } catch (error) {
      toast.error(
        <CustomErrorToast
          message={error?.response?.data?.msg || 'Error updating official link'}
        />
      );
    } finally {
      setIsSavingLink(false);
    }
  };

  const onToggleBookmark = async (trendId, nextIsSaved) => {
    try {
      const endpoint = nextIsSaved
        ? '/users/save-trend'
        : '/users/remove-trend';
      const response = await customFetch.patch(endpoint, { _id: trendId });
      if (response.status !== 200) throw new Error('Bookmark update failed');

      setIsSaved(nextIsSaved);
      toast.success(
        <CustomSuccessToast
          message={nextIsSaved ? 'Trend saved successfully' : 'Trend removed'}
        />
      );
    } catch (error) {
      toast.error(
        error?.response?.data?.msg || error?.message || 'Bookmark error'
      );
    }
  };

  const handleSubmitForApproval = async () => {
    if (!trendObject?.slug) return;

    try {
      setIsSubmittingForApproval(true);
      await customFetch.patch(
        `/trends/${trendObject.slug}/submit-for-approval`
      );
      toast.success(<CustomSuccessToast message="Submitted for approval" />);
      if (isAdmin && setAdminDraft) setAdminDraft(null);
      onApprovalComplete?.();
    } catch (error) {
      toast.error(
        <CustomErrorToast
          message={
            error?.response?.data?.msg || 'Error submitting for approval'
          }
        />
      );
    } finally {
      setIsSubmittingForApproval(false);
    }
  };

  return (
    <div className="generated-panel">
      {showSubmitSpinner && <TrendBlogLoading />}

      {!isSubmitting && trendObject && (
        <>
          <div className="trend-header-row">
            <div className="trend-header-left">
              {techIconUrl ? (
                <img
                  className="trend-tech-icon"
                  src={techIconUrl}
                  alt=""
                  draggable={false}
                />
              ) : (
                <div className="trend-tech-icon placeholder" />
              )}
              <div className="trend-header-title">
                <div className="trend-tech-label">
                  {techLabel || 'Technology'}
                </div>
                <div className="trend-name">
                  {trendObject?.trend || trendObject?.title || 'Trend'}
                </div>
              </div>
            </div>

            <TrendBookMark
              trendId={trendObject?._id}
              isSaved={isSaved}
              onToggle={onToggleBookmark}
              disabled={!trendObject?._id}
              title="Save this trend"
              className="trend-header-bookmark"
            />
          </div>

          <div className="section">
            {isAdmin ? (
              <EditMarkdownSmall
                initialContent={trendUse}
                onContentChange={setTrendUse}
                previewOpen={false}
                height={250}
              />
            ) : (
              <div className="box-highlighted">
                <ContentBoxHighlighted
                  trendUse={trendUse}
                  isDarkTheme={isDarkTheme}
                />
              </div>
            )}
            <div className="section-header">
              {isAdmin && (
                <button
                  type="button"
                  className="btn info-btn"
                  onClick={handleUpdateTrendUse}
                  disabled={!isUseDirty || isSavingUse}
                >
                  {isSavingUse ? 'saving…' : 'Save'}
                </button>
              )}
            </div>
          </div>

          <div className="section">
            {isAdmin ? (
              <EditMarkdown
                initialContent={generatedBlogPost}
                onContentChange={setGeneratedBlogPost}
                previewOpen={false}
                height="700px"
              />
            ) : (
              <DangerousMarkdown
                content={generatedBlogPost}
                small={false}
                isDarkTheme={isDarkTheme}
              />
            )}
            <div className="section-header">
              {isAdmin && (
                <button
                  type="button"
                  className="btn info-btn"
                  onClick={handleUpdateGeneratedBlogPost}
                  disabled={!isBlogDirty || isSavingBlog}
                >
                  {isSavingBlog ? 'saving…' : 'Save'}
                </button>
              )}
            </div>
          </div>

          <div className="section-link">
            {isAdmin ? (
              <TrendOfficialLinkEditor
                value={trendOfficialLink}
                onChange={setTrendOfficialLink}
                onUpdate={handleUpdateTrendOfficialLink}
                isUpdating={isSavingLink}
                iconUrl="/assets/trend-link.svg"
              />
            ) : (
              <a
                className="official-link-btn"
                href={normalizeUrlForOpen(trendOfficialLink)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  className="official-link-icon"
                  src="/assets/trend-link.svg"
                  alt="Official link"
                />
                <span className="official-link-text">visit for more</span>
              </a>
            )}
          </div>

          {isAdmin && (
            <div className="section approval-row">
              <div className="approval-left">
                <TrendBookMark
                  trendId={trendObject?._id}
                  isSaved={isSaved}
                  onToggle={onToggleBookmark}
                  disabled={!trendObject?._id}
                  title="Bookmark this trend"
                />
              </div>
              <button
                type="button"
                className="btn-action btn-block form-btn"
                onClick={handleSubmitForApproval}
                disabled={
                  isSubmittingForApproval ||
                  trendObject?.isSubmittedForApproval === true
                }
              >
                {trendObject?.isSubmittedForApproval
                  ? 'Already submitted'
                  : isSubmittingForApproval
                    ? 'submitting…'
                    : 'Submit for Approval'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SubmitTrendPanel;
