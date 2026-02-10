import React, { useEffect, useMemo, useState, useRef } from 'react';
import {
  UserImgLarge,
  SEOProtected,
  TrendBookMark,
  CustomErrorToast,
  FormSelectorIcon,
  DangerousMarkdown,
  FormComponentLogos,
  CustomSuccessToast,
  TrendFallbackSuccess,
  TrendsFallbackEffect,
  ContentBoxHighlighted,
  TrendOfficialLinkEditor,
} from '../components';
import TrendBlogLoading from '../components/TrendBlogLoading';
import EditMarkdown from '../components/EditMarkdown.client';
import EditMarkdownSmall from '../components/EditMarkdownSmall.client';
import { useUser } from '../context/UserContext';
import { useDashboardContext } from '../pages/DashboardLayout.jsx';
import Container from '../assets/wrappers/SubmitFormContainer';
import { normalizeUrlForSend } from '../utils/urlHelper';
import { normalizeUrlForOpen } from '../utils/urlHelper';
import { useOutletContext } from 'react-router-dom';
import { Form, useNavigation, redirect, useActionData } from 'react-router-dom';
import { toast } from 'react-toastify';
import customFetch from '../utils/customFetch';
import useWindowSize from '../hooks/useWindowSize';
import useLocalStorage from '../hooks/useLocalStorage';
/**
 * AddTrend submits the trend after user types it in the from and selects category and technology
 * @param {*} param0
 * @returns
 */
export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  try {
    const res = await customFetch.post('/trends/submit', data); 
    toast.success(
      <CustomSuccessToast message={'Thank You, Trend Was Submitted'} />
    );
    //return redirect('/dashboard');
    return res.data;//expecting { trendObject }
  } catch (error) {
    toast.error(<CustomErrorToast message={error?.response?.data?.msg} />);
    return { error: error?.response?.data?.msg || 'Error submitting trend' };
  }
};
const AddTrend = () => {
  const { user, updateUserImage } = useUser();
  //const { user } = useOutletContext(); //getting the user from DashboardLayout
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  const [showSubmitSpinner, setShowSubmitSpinner] = useState(false);
  const submitSpinnerTimerRef = useRef(null);
  const { isDarkTheme } = useDashboardContext();
  const actionData = useActionData();
  const isAdmin = user?.role === 'admin';

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);

  const ADMIN_DRAFT_KEY = 'tf_add_trend_admin_draft_v1';
  const [adminDraft, setAdminDraft] = useLocalStorage(ADMIN_DRAFT_KEY, null);
  const draftWriteTimerRef = useRef(null);

  const [trendCategory, setTrendCategory] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [defaultTrendCategory, setDefaultTrendCategory] = useState(null);
  const [defaultTrendTech, setDefaultTrendTech] = useState(null);

  const [techLabel, setTechLabel] = useState(''); // storing tech label
  const [cateLabel, setCateLabel] = useState(''); // storing category label
  const [techIconUrl, setTechIconUrl] = useState(''); // storing tech icon URL
  const [cateIconUrl, setCateIconUrl] = useState(''); // storing category icon URL

  const [trendObject, setTrendObject] = useState(null); //generated content state
  const [generatedBlogPost, setGeneratedBlogPost] = useState(''); //generated content state setGeneratedBlogPost
  const [trendUse, setTrendUse] = useState(''); //generated content state setTrendUse
  const [trendOfficialLink, setTrendOfficialLink] = useState(''); //generated content state setTrendOfficialLink

  const [isSavingUse, setIsSavingUse] = useState(false); //saving vars
  const [isSavingBlog, setIsSavingBlog] = useState(false); //saving vars
  const [isSavingLink, setIsSavingLink] = useState(false); //saving vars
  const [isSubmittingForApproval, setIsSubmittingForApproval] = useState(false); //saving vars

  const { isMobile } = useWindowSize();
  const showFallback = isSubmitting || !trendObject; 

  useEffect(() => {
    if (!isAdmin) return;
    if (trendObject) return;
    if (!adminDraft?.slug) return;

    setTrendObject({
      slug: adminDraft.slug,
      generatedBlogPost: adminDraft.generatedBlogPost || '',
      trendUse: adminDraft.trendUse || '',
      trendOfficialLink: adminDraft.trendOfficialLink || '',
      isSubmittedForApproval: Boolean(adminDraft.isSubmittedForApproval),
    });// minimal object only what your page needs slug+ fields

    setGeneratedBlogPost(adminDraft.generatedBlogPost || '');
    setTrendUse(adminDraft.trendUse || '');
    setTrendOfficialLink(adminDraft.trendOfficialLink || '');
    setTechIconUrl(adminDraft.techIconUrl || '');
  }, [isAdmin, adminDraft, trendObject]);

  useEffect(() => {
    if (!actionData) return;
    if (actionData?.error) return;
    const nextTrendObject = actionData?.trendObject;
    if (!nextTrendObject) return;

    setTrendObject(nextTrendObject);
    setGeneratedBlogPost(nextTrendObject.generatedBlogPost || '');
    setTrendUse(nextTrendObject.trendUse || '');
    setTrendOfficialLink(nextTrendObject.trendOfficialLink || '');

    if (isAdmin && nextTrendObject?.slug) {
      setAdminDraft({
        slug: nextTrendObject.slug,
        generatedBlogPost: nextTrendObject.generatedBlogPost || '',
        trendUse: nextTrendObject.trendUse || '',
        trendOfficialLink: nextTrendObject.trendOfficialLink || '',
        techIconUrl: techIconUrl || '',
        isSubmittedForApproval: Boolean(nextTrendObject.isSubmittedForApproval),
        updatedAt: Date.now(),
      });// save initial draft only for admin (so refresh keeps it)
    }//saving initial draft only for admin so refresh keeps it
  }, [actionData, isAdmin]);// when submit returns treat it as the new source of truth + persist a draft snapshot applying actionData after submit completes as single source of truth

  useEffect(() => {
    if (!isAdmin) return;
    if (!trendObject?.slug) return;

    if (draftWriteTimerRef.current) clearTimeout(draftWriteTimerRef.current);

    draftWriteTimerRef.current = setTimeout(() => {
      setAdminDraft({
        slug: trendObject.slug,
        generatedBlogPost: generatedBlogPost || '',
        trendUse: trendUse || '',
        trendOfficialLink: trendOfficialLink || '',
        techIconUrl: techIconUrl || '',
        isSubmittedForApproval: Boolean(trendObject?.isSubmittedForApproval),
        updatedAt: Date.now(),
      });
    }, 350);//fast enough not spammy

    return () => {
      if (draftWriteTimerRef.current) clearTimeout(draftWriteTimerRef.current);
    };
  }, [isAdmin, trendObject?.slug, generatedBlogPost, trendUse, trendOfficialLink, techIconUrl]);//persist draft as admin edits debounced to avoid writing on every keystroke

  //fetching the icon data from the node server
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await customFetch.get('icons/icon-data');
        const { TREND_CATEGORY, TECHNOLOGIES } = response.data;
        setTrendCategory(Object.values(TREND_CATEGORY));
        setTechnologies(Object.values(TECHNOLOGIES));
        const trendCategoryList = Object.values(TREND_CATEGORY);
        const technologiesList = Object.values(TECHNOLOGIES);

        if (trendCategoryList.length > 0) {
          setDefaultTrendCategory(trendCategoryList[0].value);
        }

        if (technologiesList.length > 0) {
          setDefaultTrendTech(technologiesList[0].value);
        }
      } catch (error) {
        console.error('Error fetching trend icon-data:', error);
      }
    };
    fetchData();
  }, []); //end fetch svg useEffect


  const handleEditClick = () => {
    setIsDropdownVisible((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 50000000) {
      toast.error(<CustomErrorToast message='Image size too large.'/>);
      return;
    }// optional file-size check
    const uploadFormData = new FormData();// preparing FormData
    uploadFormData.append('profile_img', file);
    try {
      const response = await customFetch.patch(
        '/users/upload-user-image',
        uploadFormData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      if (response.status === 200) {
        const updatedUser = response.data.user;
        toast.success(
          <CustomSuccessToast message={'Profile Image Updated Successfully'} />
        );
        // updating user context or dashboard context so the new image re-renders
        updateUserImage(updatedUser.profile_img, updatedUser.profile_img_id);
        //TODO: set up ie: updateUserGlobal(updatedUser.profile_img, updatedUser.profile_img_id);
      } else {
        toast.error('Failed to update profile image.');
      }
    } catch (error) {
      toast.error(
        <CustomErrorToast
          message={error?.response?.data?.msg || error.message}
        />
      );
    }
  }; //end handleFileChange

  const initial = useMemo(
    () => ({
      generatedBlogPost: trendObject?.generatedBlogPost || '',
      trendUse: trendObject?.trendUse || '',
      trendOfficialLink: trendObject?.trendOfficialLink || '',
    }),
    [trendObject?.generatedBlogPost, trendObject?.trendUse, trendObject?.trendOfficialLink]
  );

  const isUseDirty = trendUse !== initial.trendUse;
  const isBlogDirty = generatedBlogPost !== initial.generatedBlogPost;
  const isLinkDirty = trendOfficialLink !== initial.trendOfficialLink;

  const handleUpdateTrendUse = async () => {
    try {
      setIsSavingUse(true);
      await patchTrendBlogFields({ trendUse });
      toast.success(<CustomSuccessToast message="trendUse updated" />);
      setTrendObject((prev) => ({ ...(prev || {}), trendUse }));
      // keep draft in sync after successful save
      if (isAdmin && trendObject?.slug) setAdminDraft((d) => ({ ...(d || {}), trendUse, updatedAt: Date.now() }));
    } catch (error) {
      toast.error(<CustomErrorToast message={error?.response?.data?.msg || 'Error updating trendUse'} />);
    } finally {
      setIsSavingUse(false);
    }
  };

  const handleUpdateGeneratedBlogPost = async () => {
    try {
      setIsSavingBlog(true);
      await patchTrendBlogFields({ generatedBlogPost });
      toast.success(<CustomSuccessToast message="Blog post updated" />);
      setTrendObject((prev) => ({ ...(prev || {}), generatedBlogPost }));
      if (isAdmin && trendObject?.slug) setAdminDraft((d) => ({ ...(d || {}), generatedBlogPost, updatedAt: Date.now() }));
    } catch (error) {
      toast.error(<CustomErrorToast message={error?.response?.data?.msg || 'Error updating blog post'} />);
    } finally {
      setIsSavingBlog(false);
    }
  };

  const handleUpdateTrendOfficialLink = async () => {
    try {
      setIsSavingLink(true);
      const normalized = normalizeUrlForSend(trendOfficialLink);
      await patchTrendBlogFields({ trendOfficialLink: normalized });
      toast.success(<CustomSuccessToast message="Official link updated" />);
      setTrendOfficialLink(normalized);
      setTrendObject((prev) => ({ ...(prev || {}), trendOfficialLink: normalized }));
      if (isAdmin && trendObject?.slug) setAdminDraft((d) => ({ ...(d || {}), trendOfficialLink: normalized, updatedAt: Date.now() }));
    } catch (error) {
      toast.error(<CustomErrorToast message={error?.response?.data?.msg || 'Error updating official link'} />);
    } finally {
      setIsSavingLink(false);
    }
  };

  const handleSubmitForApproval = async () => {
    try {
      if (!trendObject?.slug) return;
      setIsSubmittingForApproval(true);
      await customFetch.patch(`/trends/${trendObject.slug}/submit-for-approval`);
      toast.success(<CustomSuccessToast message="Submitted for approval" />);
      setTrendObject((prev) => ({ ...(prev || {}), isSubmittedForApproval: true }));
      if (isAdmin) setAdminDraft(null);
    } catch (error) {
      toast.error(<CustomErrorToast message={error?.response?.data?.msg || 'Error submitting for approval'} />);
    } finally {
      setIsSubmittingForApproval(false);
    }// once submitted for approval clearing local draft prevents haunted resurrection on refresh
  };

  const [isSaved, setIsSaved] = useState(false);

  const onSave = async (_id) => {
    const response = await customFetch.patch('/users/save-trend', { _id });
    if (response.status !== 200) throw new Error('Failed to save trend');
  };

  const onRemove = async (_id) => {
    const response = await customFetch.patch('/users/remove-trend', { _id });
    if (response.status !== 200) throw new Error('Failed to remove trend');
  };

  const patchTrendBlogFields = async (partial) => {
    if (!trendObject?.slug) throw new Error('Missing slug');
    return customFetch.patch(`/trends/${trendObject.slug}/update-trend-blog`, partial);
  };//admin patch helpers which only send changed fields

  const onToggleBookmark = async (trendId, nextIsSaved) => {
    try {
      if (nextIsSaved) {
        await onSave(trendId);
        toast.success(<CustomSuccessToast message='Trend saved successfully'/>);
        setIsSaved(true);
      } else {
        await onRemove(trendId);
        toast.success(<CustomSuccessToast message='Trend removed'/>);
        setIsSaved(false);
      }
    } catch (e) {
      toast.error(e?.response?.data?.msg || e?.message || 'Bookmark error');
    }
  };

  useEffect(() => {
  if (submitSpinnerTimerRef.current) clearTimeout(submitSpinnerTimerRef.current);

  if (isSubmitting) {
    submitSpinnerTimerRef.current = setTimeout(() => {
      setShowSubmitSpinner(true);
    }, 220);//sweet spot 150-300ms
  } else {
    setShowSubmitSpinner(false);
  }

  return () => {
    if (submitSpinnerTimerRef.current) clearTimeout(submitSpinnerTimerRef.current);
  };
}, [isSubmitting]);

  return (
    <Container>
      <SEOProtected />
      <div className="user-container clearfix">
        <div className="user-info">
          {!user?.profile_img ? (
            <div className="user-image no-image">
              <div className="user-profile">
                <UserImgLarge user_img={user?.profile_img} />
              </div>
              <div className="edit-button-wrapper">
                <button
                  className="edit-button"
                  type="button"
                  onClick={handleEditClick}
                >
                  Edit
                </button>
                {isDropdownVisible && (
                  <div className="dropdown" ref={dropdownRef}>
                    <label htmlFor="profile_img" className="dropdown-option">
                      Upload
                    </label>
                    <input
                      type="file"
                      name="profile_img"
                      id="profile_img"
                      className="form-input"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <button className="dropdown-option" type="button">
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="user-image">
              <UserImgLarge user_img={user.profile_img} />
            </div>
          )}
          <div className="username">
            <h5>{user?.username}</h5>
          </div>
        </div>
      </div>
      <div className="submit-container">
        <div>
          <Form method="post" className="form">
            <h4 className="form-title">Submit A Project:</h4>
            <div className="form-center">
              {/* <LogoCarousel /> */}
              <FormComponentLogos
                type="text"
                name="trend"
                placeholder="Any tech on your mind?"
                className="form-input"
              />
              {/* CATEGORY SELECTOR */}
              <FormSelectorIcon
                labelText="Choose Category:"
                name="trendCategory"
                defaultValue={defaultTrendCategory}
                list={trendCategory.map((cate) => ({
                  ...cate,
                  value: cate.value,
                  label: cate.label,
                  image: cate.image || '/assets/cat/fallback-cat.svg',
                }))}
                onChange={(name, selectedOption) => {
                  setCateLabel(selectedOption?.label || '');
                  setCateIconUrl(selectedOption?.fullImageUrl || '/assets/cat/fallback-cat.svg'); 
                }}
                isDarkTheme={isDarkTheme}
              />
              <input
                type="hidden"
                id="cateLabel"
                name="trendCategory"
                value={cateLabel || ''}
              />
              <input
                type="hidden"
                id="cateIconUrl"
                name="cateIconUrl"
                value={cateIconUrl || ''}
              />
              {/* TECH SELECTOR */}
              <FormSelectorIcon
                labelText="Choose Technology:"
                name="trendTech"
                defaultValue={defaultTrendTech}
                list={technologies.map((tech) => ({
                  ...tech,
                  value: tech.value,
                  label: tech.label,
                  image: tech.image || '/assets/cat/fallback-tech.svg',
                }))}
                onChange={(name, selectedOption) => {
                  setTechLabel(selectedOption?.label || '');
                  setTechIconUrl(selectedOption?.fullImageUrl || '/assets/cat/fallback-tech.svg'); 
                }}
                isDarkTheme={isDarkTheme}
              />
              <input
                type="hidden"
                id="techLabel"
                name="trendTech"
                value={techLabel || ''}
              />
              <input
                type="hidden"
                id="techIconUrl"
                name="techIconUrl"
                value={techIconUrl || ''}
              />
              <button
                type="submit"
                className="btn btn-block form-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'submitting' : 'submit'}
              </button>
            </div>
          </Form>
           <div className="generated-panel">
            {showSubmitSpinner && <TrendBlogLoading />}

            {!isSubmitting && trendObject && (
              <>
              <div className="trend-header-row"> {/*HERE*/}
                  <div className="trend-header-left"> {/*HERE*/}
                    {techIconUrl ? (
                      <img className="trend-tech-icon" src={techIconUrl} alt="" draggable={false} />
                    ) : (
                      <div className="trend-tech-icon placeholder" />
                    )}
                    <div className="trend-header-title"> {/*HERE*/}
                      <div className="trend-tech-label">{techLabel || 'Technology'}</div> {/*HERE*/}
                      <div className="trend-name">{trendObject?.trend || trendObject?.title || 'Trend'}</div> {/*HERE*/}
                    </div>
                  </div>

                  {/* right-side bookmark (user + admin) */} {/*HERE*/}
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
                      onContentChange={(val) => setTrendUse(val)}
                      previewOpen={false}
                      height={250}
                    />
                  ) : (
                    <div className="box-highlighted">
                      <ContentBoxHighlighted trendUse={trendUse} isDarkTheme={isDarkTheme} />
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
                      onContentChange={(val) => setGeneratedBlogPost(val)}
                      previewOpen={false}
                      height="700px"
                    />
                  ) : (
                    <DangerousMarkdown content={generatedBlogPost} small={false} isDarkTheme={isDarkTheme} />
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
                      <img className="official-link-icon" src="/assets/trend-link.svg" alt="Official link" />
                      <span className="official-link-text">visit for more</span>
                    </a>
                  )}
                </div>
                {isAdmin && (
                  <div className="section approval-row">
                    <div className="approval-left"> {/*HERE*/}
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
                      className="btn btn-block form-btn"
                      onClick={handleSubmitForApproval}
                      disabled={isSubmittingForApproval || trendObject?.isSubmittedForApproval === true}
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
        </div>
        <div className="">
          {showFallback ? (
            <TrendsFallbackEffect active={true} iconCount={14} spinSpeed={55} />
          ) : (
            <TrendFallbackSuccess
              icon={techIconUrl}
              iconMovement={true}
              isMobile={isMobile}
              iconSize={1000} // desktop
              iconSizeSmall={500} // mobile
              speed={0.38}
            />
          )}
        </div>
      </div>
    </Container>
  );
};

export default AddTrend;