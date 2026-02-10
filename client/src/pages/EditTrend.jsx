import React, { useEffect, useMemo, useState } from 'react';
import {
  LoadingBar,
  ScrollToTop,
  SEOProtected,
  DangerousHTML,
  AddTrendModal,
  CustomErrorToast,
  CustomSuccessToast,
  ScrollSpyComponent,
  EditTrendComponent,
  TrendOfficialLinkEditor,
} from '../components';
import EditMarkdown from '../components/EditMarkdown.client';
import EditMarkdownSmall from '../components/EditMarkdownSmall.client';
import { EDIT_PAGE_USE, EDIT_PAGE_POST } from '../utils/constants.js';
import { normalizeUrlForSend } from '../utils/urlHelper';
import Container from '../assets/wrappers/EditTrendContainer';
// import Container from '../assets/wrappers/TrendPageContainer';
import {
  Form,
  redirect,
  useLoaderData,
  useNavigate,
  useRevalidator,
  useNavigation,
} from 'react-router-dom';
import { toast } from 'react-toastify';
import customFetch from '../utils/customFetch';
/**
 * Edit Page is only accessible to admin user to edit certain felids of the trend and POST them
 * @returns
 *
 */
//Fetching the trend data
export const loader = async ({ params }) => {
  try {
    const { data } = await customFetch.get('/users/current-user'); // Fetch current user
    if (!data.user || data.user.role !== 'admin') {
      toast.error(
        <CustomErrorToast message="Unauthorized access to this Resource!" />
      );
      return redirect('/dashboard');
    }
    const trendResponse = await customFetch.get(`/trends/edit/${params.slug}`);
    const trendObject = trendResponse.data.trendObject;
    try {
      if (!trendObject?.isSubmittedForApproval) {
        await customFetch.patch(`/trends/${params.slug}/submit-for-approval`);
      }// only call if not already submitted
    } catch (err) {
      console.warn('submit-for-approval failed (non-blocking):', err);// swallow errors so page still loads
    }// VISIT REVIEW APPROVAL: flips flag on visit (admin only) - DO NOT block page if this fails 
    return { user: data.user, trendObject };// returning trend data to page
  } catch (error) {
    console.error('Loader error:', error);
    toast.error(<CustomErrorToast message={error?.response?.data?.msg} />);
    return redirect('/dashboard');
  }
};
//action for editing the trend
export const action = async ({ request, params }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  try {
    const response = await customFetch.patch(
      `/trends/edit/${params.slug}`,
      data
    );
    const result = response.data;
    if (result.redirectTo) {
      toast.success(<CustomSuccessToast message="Trend Edited" />);
      return redirect(result.redirectTo);
    }
    toast.success(<CustomSuccessToast message="Trend Edited" />);
    return null; // letting react router re-run the loader normally
  } catch (error) {
    toast.error(
      <CustomErrorToast
        message={
          error?.response?.data?.msg ||
          error?.message ||
          'Unknown error in action'
        }
      />
    );
    return error;
  }
};

const EditTrend = () => {
  const { trendObject } = useLoaderData();
  const navigate = useNavigate();
  //const navigation = useLoaderData();
  const navigation = useNavigation(); 
  const { revalidate } = useRevalidator();

  const isSubmitting = navigation.state === 'submitting';
  const [svgFile, setSvgFile] = useState(null);
  const [svgUrl, setSvgUrl] = useState(trendObject.svg_url || '');
  const [selectedCategory, setSelectedCategory] = useState(
    trendObject.trendCategory
  );
  const [selectedTech, setSelectedTech] = useState(trendObject.trendTech);
  const [showAddTrendModal, setShowAddTrendModal] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState(null);
  const [loadingSlug, setLoadingSlug] = useState(null);
  const [isApproving, setIsApproving] = useState(false);
  const [manualMode, setManualMode] = useState('approve');
  const [openSourceStatus, setOpenSourceStatus] = useState(
    trendObject.openSourceStatus || 'unknown'
  );
  const [trendCategoryList, setTrendCategoryList] = useState([]);
  const [trendTechList, setTrendTechList] = useState([]);

  const [generatedBlogPost, setGeneratedBlogPost] = useState(trendObject.generatedBlogPost || '');// blog edit fields
  const [trendUse, setTrendUse] = useState(trendObject.trendUse || '');// trend use edit fields
  const [trendOfficialLink, setTrendOfficialLink] = useState(trendObject.trendOfficialLink || '');// link edit fields

  const [isSavingUse, setIsSavingUse] = useState(false);// per-section loading state
  const [isSavingBlog, setIsSavingBlog] = useState(false);// per-section loading state
  const [isSavingLink, setIsSavingLink] = useState(false);// per-section loading state

  const initial = useMemo(() => ({
      generatedBlogPost: trendObject.generatedBlogPost || '',
      trendUse: trendObject.trendUse || '',
      trendOfficialLink: trendObject.trendOfficialLink || '',
    }), [trendObject.generatedBlogPost, trendObject.trendUse, trendObject.trendOfficialLink]);

  const isUseDirty = trendUse !== initial.trendUse;
  const isBlogDirty = generatedBlogPost !== initial.generatedBlogPost;
  const isLinkDirty = trendOfficialLink !== initial.trendOfficialLink;

  useEffect(() => {
    const fetchIconData = async () => {
      try {
        const response = await customFetch.get('icons/icon-data');
        const { TREND_CATEGORY, TECHNOLOGIES } = response.data;
        setTrendCategoryList(Object.values(TREND_CATEGORY));
        setTrendTechList(Object.values(TECHNOLOGIES));
      } catch (error) {
        console.error('Error fetching trend icon-data:', error);
      }
    };

    fetchIconData();
  }, []);

  // approve a trend
  const approveTrend = async (slug) => {
    try {
      setIsApproving(true); // start loading
      await customFetch.patch(`trends/${slug}/approve`);
      toast.success(<CustomSuccessToast message={'Trend Approved'} />);
      revalidate();
    } catch (error) {
      toast.error(error?.response?.data?.msg || 'Error approving trend');
    } finally {
      setIsApproving(false); //stop loading
    }
  };

  //manualApproveTrend accepts JSON data
  const manualApproveTrend = async (slug, data) => {
    try {
      setIsApproving(true); // start loading
      setShowAddTrendModal(false); //close modal
      await customFetch.patch(`trends/${slug}/manual-approve`, {
        data,
        openSourceStatus,
      });
      toast.success(<CustomSuccessToast message={'Trend Manually Approved'} />);
      revalidate();
    } catch (error) {
      toast.error(error?.response?.data?.msg || 'Error approving trend');
    } finally {
      setIsApproving(false); //stop loading
    }
  };

  // manualUpdateTrend accepts JSON data (c: updateTrendManual)
  const manualUpdateTrend = async (slug, data) => {
    try {
      setIsApproving(true); // start loading
      setShowAddTrendModal(false); //close modal
      await customFetch.patch(`trends/${slug}/manual-update`, {
        data,
        openSourceStatus,
      });
      toast.success(<CustomSuccessToast message={'Trend Data Updated'} />);
      revalidate();
    } catch (error) {
      toast.error(error?.response?.data?.msg || 'Error approving trend');
    } finally {
      setIsApproving(false); //stop loading
    }
  };

  useEffect(() => {
    const fetchSVG = async () => {
      try {
        const response = await customFetch.get(
          `/trends/get-trend-svg/${trendObject.slug}`
        );
        setSvgUrl(response.data.svg_url);
      } catch (error) {
        console.error('Error fetching SVG:', error);
      }
    };

    fetchSVG();
  }, [trendObject.slug]);

  const handleSVGUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await customFetch.patch(
        `/trends/upload-trend-svg/${trendObject.slug}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      toast.success('SVG uploaded successfully');
    } catch (error) {
      toast.error('SVG upload failed');
    }
  };

  const handleSVGChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSvgFile(file);
      handleSVGUpload(file);
    }
  };

  const handleDelete = async () => {
    try {
      await customFetch.delete(`/trends/edit/${trendObject.slug}`);
      toast.success(<CustomSuccessToast message={'Trend Deleted'} />);
      navigate('/dashboard'); // Redirect after deletion
    } catch (error) {
      toast.error(<CustomErrorToast message={error?.response?.data?.msg} />);
    }
  };

  const handleApproveClick = () => {
    approveTrend(trendObject.slug);
  };

  // When the modal is triggered for manual approve
  const handleManualApprove = () => {
    setSelectedSlug(trendObject.slug);
    setManualMode('approve');
    setShowAddTrendModal(true);
  };

  // When the modal is triggered for manual update
  const handleManualUpdate = () => {
    setSelectedSlug(trendObject.slug);
    setManualMode('update');
    setShowAddTrendModal(true);
  };

  // Unified modal submission handler
  const handleModalSubmit = (data) => {
    if (manualMode === 'update') {
      manualUpdateTrend(selectedSlug, data);
    } else {
      manualApproveTrend(selectedSlug, data);
    }
  };

  const patchTrendBlogFields = async (partial) => {
    // Only send what you’re updating
    return customFetch.patch(`/trends/${trendObject.slug}/update-trend-blog`, partial);
  };

  const handleUpdateTrendUse = async () => {
    try {
      setIsSavingUse(true);
      await patchTrendBlogFields({ trendUse });
      toast.success(<CustomSuccessToast message="trendUse updated" />);
      revalidate();
    } catch (error) {
      toast.error(
        <CustomErrorToast message={error?.response?.data?.msg || 'Error updating trendUse'} />
      );
    } finally {
      setIsSavingUse(false);
    }
  };

  const handleUpdateGeneratedBlogPost = async () => {
    try {
      setIsSavingBlog(true);
      await patchTrendBlogFields({ generatedBlogPost });
      toast.success(<CustomSuccessToast message="Blog post updated" />);
      revalidate();
    } catch (error) {
      toast.error(
        <CustomErrorToast message={error?.response?.data?.msg || 'Error updating blog post'} />
      );
    } finally {
      setIsSavingBlog(false);
    }
  };

  const handleUpdateTrendOfficialLink = async () => {
    try {
      setIsSavingLink(true);

      // Normalize only if user omitted scheme; server validates anyway
      const normalized = normalizeUrlForSend(trendOfficialLink);
      await patchTrendBlogFields({ trendOfficialLink: normalized });
      toast.success(<CustomSuccessToast message="Official link updated" />);
      revalidate();
    } catch (error) {
      toast.error(
        <CustomErrorToast message={error?.response?.data?.msg || 'Error updating official link'} />
      );
    } finally {
      setIsSavingLink(false);
    }
  };

  console.log('trendObject in EditTrend', trendObject);
  return (
    <Container>
      <SEOProtected />
      <ScrollToTop />
      <div id="Approve"></div>
      <div className="trend-page-container">
        <div className="page-layout">
          <div className="trend">
            <div className="content">
              <div className="loading-bar">{isApproving && <LoadingBar />}</div>
              <div id="Submit"></div>
              <EditTrendComponent
                svgUrl={svgUrl}
                handleSVGChange={handleSVGChange}
                trendObject={trendObject}
                isSubmitting={isSubmitting}
                trendCategoryList={trendCategoryList}
                trendTechList={trendTechList}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedTech={selectedTech}
                setSelectedTech={setSelectedTech}
                handleApproveClick={handleApproveClick}
                handleManualApprove={handleManualApprove}
                handleManualUpdate={handleManualUpdate}
                openSourceStatus={openSourceStatus}
                setOpenSourceStatus={setOpenSourceStatus}
              />
              <div className="trend-use-container">
                <EditMarkdownSmall
                  initialContent={trendUse}
                  onContentChange={(v) => setTrendUse(v)}
                  previewOpen={false}
                  height="220px"
                />
              </div>
              <div className="section-header">
                <div className="update-button">
                  <button
                    type="button"
                    className="btn info-btn"
                    onClick={handleUpdateTrendUse}
                    disabled={!isUseDirty || isSavingUse}
                    title={!isUseDirty ? 'No changes to save' : 'Update trendUse'}
                  >
                    {isSavingUse ? 'updating…' : 'Update trendUse'}
                  </button>
                </div>
              </div>
              <div className="trend-blog-post">
                <EditMarkdown
                  initialContent={generatedBlogPost}
                  onContentChange={(v) => setGeneratedBlogPost(v)}
                  previewOpen={false}
                  height="700px"
                />
              </div>
              <div className="section-header">
                <div className="update-button">
                  <button
                  type="button"
                  className="btn info-btn"
                  onClick={handleUpdateGeneratedBlogPost}
                  disabled={!isBlogDirty || isSavingBlog}
                  title={!isBlogDirty ? 'No changes to save' : 'Update blog'}
                >
                  {isSavingBlog ? 'updating…' : 'Update blog'}
                </button>
                </div>
              </div>
              <TrendOfficialLinkEditor
                value={trendOfficialLink}
                onChange={setTrendOfficialLink}
                onUpdate={handleUpdateTrendOfficialLink}
                isUpdating={isSavingLink}
                iconUrl="/assets/trend-link.svg"
              />
              <div id="Delete"></div>
            </div>
            <div className="form-actions">
              <div className="delete-btn">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="btn info-btn"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
          <aside className="scroll-spy-sidebar-aside">
            <div className="scroll-spy-sidebar">
              <ScrollSpyComponent sectionIds={['Approve', 'Edit', 'Delete']} />
              <div></div>
            </div>
          </aside>
        </div>
      </div>
      {showAddTrendModal && (
        <AddTrendModal
          onClose={() => setShowAddTrendModal(false)}
          onAdd={handleModalSubmit}
          slug={selectedSlug}
          onManualApprove={manualApproveTrend} // Not strictly required if your handleAddTrend calls it
        />
      )}
    </Container>
  );
};

export default EditTrend;