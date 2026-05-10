import React, { useEffect, useMemo, useState, useRef } from 'react';
import {
  UserImgLarge,
  SEOProtected,
  TrendBookMark,
  CustomInfoToast,
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
import FormSelectorIcons from '../components/FormSelectorIcons';
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
const TECH_FALLBACK_ICON = '/assets/fallback-tech.svg';
const CATEGORY_FALLBACK_ICON = '/assets/cat/fallback-cat.svg';
const MAX_TREND_TECHS = 5;

const stripSvgExtension = (value = '') => String(value).replace(/\.svg$/i, '');

const ensureAssetPath = (value = '') => {
  const v = String(value || '').trim();
  if (!v) return '';
  if (v.startsWith('http://') || v.startsWith('https://') || v.startsWith('/')) return v;
  return `/assets/${v}`;
};

const getTechDisplayImage = (tech) => {
  const fullImageUrl = String(tech?.fullImageUrl || '').trim();
  if (fullImageUrl) return fullImageUrl;

  const image = String(tech?.image || '').trim();
  if (image) return image;

  const fileName = String(tech?.fileName || '').trim();
  if (fileName) return ensureAssetPath(fileName);

  const techIconUrl = String(tech?.techIconUrl || '').trim();
  if (techIconUrl) return techIconUrl.endsWith('.svg') ? techIconUrl : `${techIconUrl}.svg`;

  return TECH_FALLBACK_ICON;
};

const getStoredTechIconUrl = (tech) => {
  const fullImageUrl = String(tech?.fullImageUrl || '').trim();//fullImageUrl since it always carries the complete path with .svg extension
  if (fullImageUrl) return fullImageUrl;

  const image = String(tech?.image || '').trim();
  if (image) return image;

  const fileName = String(tech?.fileName || '').trim();
  if (fileName) return ensureAssetPath(fileName);
  const techIconUrl = String(tech?.techIconUrl || '').trim();// default techIconUrl already on the item — ensure it has .svg
  if (techIconUrl) return techIconUrl.endsWith('.svg') ? techIconUrl : `${techIconUrl}.svg`;

  return '';
};

const normalizeTechnologyOption = (tech) => ({
  ...tech,
  value: tech?.value || '',
  label: tech?.label || tech?.value || '',
  image: getTechDisplayImage(tech),
  techIconUrl: getStoredTechIconUrl(tech),
});

const normalizeCategoryOption = (cate) => ({
  ...cate,
  value: cate?.value || '',
  label: cate?.label || cate?.value || '',
  image:
    String(cate?.fullImageUrl || '').trim() ||
    String(cate?.image || '').trim() ||
    CATEGORY_FALLBACK_ICON,
});

const dedupeTrendTechs = (items = []) => {
  const seen = new Set();
  return (Array.isArray(items) ? items : [])
    .filter((item) => {
      const value = String(item?.value || '').trim();
      if (!value || seen.has(value)) return false;
      seen.add(value);
      return true;
    })
    .slice(0, MAX_TREND_TECHS);
};

const buildTrendTechsPayload = (items = []) => {
  return dedupeTrendTechs(items).map((item) => ({
    value: item.value,
    techIconUrl: item.techIconUrl || '',
  }));
};

const hydrateStoredTrendTechs = (storedTrendTechs = [], technologies = []) => {
  if (!Array.isArray(storedTrendTechs)) return [];

  return dedupeTrendTechs(
    storedTrendTechs
      .map((item) => {
        const match = technologies.find((tech) => tech.value === item?.value);
        if (match) return match;

        return normalizeTechnologyOption({
          value: item?.value || '',
          label: item?.value || '',
          techIconUrl: item?.techIconUrl || '',
        });
      })
      .filter((item) => item?.value)
  );
};

/**
 * AddTrend submits the trend after user types it in the from and selects category and technology
 * @param {*} param0
 * @returns
 */
export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  if (typeof data.trendTechs === 'string') {
    try {
      data.trendTechs = JSON.parse(data.trendTechs);
    } catch {
      data.trendTechs = [];
    }
  }

  if (!Array.isArray(data.trendTechs)) {
    data.trendTechs = [];
  }
  data.trendTechs = data.trendTechs
    .filter((item) => item?.value)
    .slice(0, MAX_TREND_TECHS);
  if (!data.trendTech && data.trendTechs[0]?.value) {
    data.trendTech = data.trendTechs[0].value;
  }
  if (!data.techIconUrl && data.trendTechs[0]?.techIconUrl) {
    data.techIconUrl = data.trendTechs[0].techIconUrl;
  }

  try {
    const res = await customFetch.post('/trends/submit', data);
    toast.success(
      <CustomSuccessToast message={'Thank You, Trend Was Submitted'} />
    );
    return res.data;
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

  const role = user?.role;
  const isAdmin = role === 'admin';

  const autoSelectedTechValueRef = useRef(''); //tracking the current auto-added tech value
  const dismissedAutoTechRef = useRef({ input: '', techValue: '' }); //tracking auto-added tech for the current input

  const [trendValue, setTrendValue] = useState('');
  const [existsState, setExistsState] = useState({ exists: false, trend: null });
  const debounceRef = useRef(null);
  const lastToastIdRef = useRef(null);

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);

  const ADMIN_DRAFT_KEY = 'tf_add_trend_admin_draft_v1';
  const [adminDraft, setAdminDraft] = useLocalStorage(ADMIN_DRAFT_KEY, null);
  const draftWriteTimerRef = useRef(null);

  const [trendCategory, setTrendCategory] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [defaultTrendCategory, setDefaultTrendCategory] = useState(null);
  const [defaultTrendTech, setDefaultTrendTech] = useState(null);

  const [selectedTrendTechs, setSelectedTrendTechs] = useState([]); //multi-trend

  const [techLabel, setTechLabel] = useState(''); // storing tech label
  const [cateLabel, setCateLabel] = useState(''); // storing category label
  const [techIconUrl, setTechIconUrl] = useState(''); //storing tech icon URL
  const [cateIconUrl, setCateIconUrl] = useState(''); //storing category icon URL

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

  const trendTechsPayload = useMemo(
    () => buildTrendTechsPayload(selectedTrendTechs),
    [selectedTrendTechs]
  );

  useEffect(() => {
    const v = String(trendValue ?? '').trim();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (v.length < 2) {
      setExistsState({ exists: false, trend: null });
      return;
    }
    debounceRef.current = setTimeout(async () => {
      try {
        console.log('[exists-check] calling exists for:', v);
        const { data } = await customFetch.get(
          `/trends/exists?q=${encodeURIComponent(v)}`
        );
        if (!data?.exists) {
          setExistsState({ exists: false, trend: null });
          return;
        }
        setExistsState({ exists: true, trend: data.trend });
        const canLink = isAdmin || data?.trend?.isApproved;
        const slug = data?.trend?.slug;
        const toastBody = (
          <CustomInfoToast
            trendName={data?.trend?.trend || v}
            to={canLink && slug ? `/dashboard/trend/${slug}` : null}
            linkText="Visit"
            onClick={() => toast.dismiss(lastToastIdRef.current)}
            isDarkTheme={isDarkTheme}
          />
        );
        toast.dismiss(lastToastIdRef.current);
        lastToastIdRef.current = toast.info(toastBody, {
          autoClose: false,//keeping toast on screen
          closeOnClick: false,
        });
      } catch (err) {
        console.error('[exists-check] failed:', err?.message);
      }
    }, 350);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [trendValue, isAdmin, isDarkTheme]);//end /exists debounce search

  const handleSubmitBlock = (e) => {
    if (existsState.exists) {
      e.preventDefault();
      toast.error(
        <CustomErrorToast message={'That project already exists. Pick a different name.'} />
      );
      return;
    }

    if (!trendTechsPayload.length) {
      e.preventDefault();
      toast.error(
        <CustomErrorToast message={'Pick at least one technology.'} />
      );
    }
  };

  useEffect(() => {
    if (!isAdmin) return;
    if (trendObject) return;
    if (!adminDraft?.slug) return;

    setTrendObject({
      slug: adminDraft.slug,
      generatedBlogPost: adminDraft.generatedBlogPost || '',
      trendUse: adminDraft.trendUse || '',
      trendOfficialLink: adminDraft.trendOfficialLink || '',
      trendTechs: adminDraft.trendTechs || [],
      isSubmittedForApproval: Boolean(adminDraft.isSubmittedForApproval),
    });

    setGeneratedBlogPost(adminDraft.generatedBlogPost || '');
    setTrendUse(adminDraft.trendUse || '');
    setTrendOfficialLink(adminDraft.trendOfficialLink || '');
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
        trendTechs: nextTrendObject.trendTechs || [],
        isSubmittedForApproval: Boolean(nextTrendObject.isSubmittedForApproval),
        updatedAt: Date.now(),
      });// save initial draft only for admin (so refresh keeps it)
    }//saving initial draft only for admin so refresh keeps it
  }, [actionData, isAdmin, setAdminDraft]);// when submit returns treat it as the new source of truth
  //+ persist a draft snapshot applying actionData after submit completes as single source of truth
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
        trendTechs:
          trendObject?.trendTechs?.length > 0 ? trendObject.trendTechs : trendTechsPayload,
        isSubmittedForApproval: Boolean(trendObject?.isSubmittedForApproval),
        updatedAt: Date.now(),
      });
    }, 350);//fast enough not spammy

    return () => {
      if (draftWriteTimerRef.current) clearTimeout(draftWriteTimerRef.current);
    };
  //fetching the icon data from the node server
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
  ]);//persist draft as admin edits debounced to avoid writing on every keystroke

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await customFetch.get('icons/icon-data');
        const { TREND_CATEGORY, TECHNOLOGIES } = response.data;

        const trendCategoryList = Object.values(TREND_CATEGORY || {}).map(normalizeCategoryOption);
        const technologiesList = Object.values(TECHNOLOGIES || {}).map(normalizeTechnologyOption);

        setTrendCategory(trendCategoryList);
        setTechnologies(technologiesList);

        if (trendCategoryList.length > 0) {
          setDefaultTrendCategory(trendCategoryList[0].value);
          setCateLabel(trendCategoryList[0].label || '');
          setCateIconUrl(trendCategoryList[0].image || CATEGORY_FALLBACK_ICON);
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

  useEffect(() => {
    const normalizedInput = String(trendValue || '').trim().toLowerCase();
    if (!normalizedInput) return; //
    if (!technologies.length) return; //
    if (existsState.exists) return; //only auto-add if trend itself does not already exist

    const matchedTechnology = technologies.find((tech) => {
      const techValue = String(tech?.value || '').trim().toLowerCase();
      const techLabel = String(tech?.label || '').trim().toLowerCase();
      return techValue === normalizedInput || techLabel === normalizedInput; //exact match only
    });

    if (!matchedTechnology) return;

    const wasDismissedForThisInput =
      dismissedAutoTechRef.current.input === normalizedInput &&
      dismissedAutoTechRef.current.techValue === matchedTechnology.value;

    if (wasDismissedForThisInput) return; //user removed it already, respect that

    const alreadySelected = selectedTrendTechs.some(
      (item) => item?.value === matchedTechnology.value
    );

    if (alreadySelected) {
      autoSelectedTechValueRef.current = matchedTechnology.value; //keep ref in sync
      return;
    }

    applyTrendTechSelection(
      [matchedTechnology, ...selectedTrendTechs], //prepend so it becomes primary
      { isManual: false }
    );
    autoSelectedTechValueRef.current = matchedTechnology.value; //remember what was auto-added
  }, [trendValue, technologies, existsState.exists, selectedTrendTechs]);

  useEffect(() => {
    const normalizedInput = String(trendValue || '').trim().toLowerCase();

    if (dismissedAutoTechRef.current.input !== normalizedInput) {
      dismissedAutoTechRef.current = { input: '', techValue: '' }; //reset dismissal when the user changes the input
    }

    if (!normalizedInput) {
      autoSelectedTechValueRef.current = ''; //no active auto-tech when input is empty
    }
  }, [trendValue]);

  useEffect(() => {
    if (!technologies.length) return;

    const sourceTrendTechs =
      trendObject?.trendTechs?.length > 0
        ? trendObject.trendTechs
        : adminDraft?.trendTechs?.length > 0
          ? adminDraft.trendTechs
          : null;

    if (sourceTrendTechs?.length > 0) {
      const hydrated = hydrateStoredTrendTechs(sourceTrendTechs, technologies);
      if (hydrated.length > 0) {
        setSelectedTrendTechs(hydrated);
        setTechLabel(hydrated[0]?.label || '');
        setTechIconUrl(hydrated[0]?.image || TECH_FALLBACK_ICON);
        return;
      }
    }

    setSelectedTrendTechs((prev) => {
      if (prev.length > 0) return prev;
      const firstTech = technologies[0];
      if (!firstTech) return [];
      setTechLabel(firstTech?.label || '');
      setTechIconUrl(firstTech?.image || TECH_FALLBACK_ICON);
      return [firstTech];
    });
  }, [technologies, trendObject?.trendTechs, adminDraft?.trendTechs]);

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

  const applyTrendTechSelection = (nextOptions = [], meta = {}) => { //centralizes selection updates
  const next = dedupeTrendTechs(nextOptions || []); //keep uniqueness logic in one place
    if (meta.isManual && autoSelectedTechValueRef.current) {
      const stillHasAutoTech = next.some(
        (item) => item?.value === autoSelectedTechValueRef.current
      );

      if (!stillHasAutoTech) {
        dismissedAutoTechRef.current = {
          input: String(trendValue || '').trim().toLowerCase(),
          techValue: autoSelectedTechValueRef.current,
        };
      }
    }// if user manually removed the currently auto-added dont add it again
    setSelectedTrendTechs(next);
    setTechLabel(next[0]?.label || '');
    setTechIconUrl(next[0]?.image || '');
  };//end auto tech selection

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 50000000) {
      toast.error(<CustomErrorToast message='Image size too large.' />);
      return;
    } // optional file-size check
    const uploadFormData = new FormData(); // preparing FormData
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
        updateUserImage(updatedUser.profile_img, updatedUser.profile_img_id);
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
    [
      trendObject?.generatedBlogPost,
      trendObject?.trendUse,
      trendObject?.trendOfficialLink,
    ]
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
      if (isAdmin && trendObject?.slug) {
        setAdminDraft((d) => ({ ...(d || {}), trendUse, updatedAt: Date.now() }));
      }
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
      toast.success(<CustomSuccessToast message="Blog post updated" />);
      setTrendObject((prev) => ({ ...(prev || {}), generatedBlogPost }));
      if (isAdmin && trendObject?.slug) {
        setAdminDraft((d) => ({
          ...(d || {}),
          generatedBlogPost,
          updatedAt: Date.now(),
        }));
      }
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
      toast.success(<CustomSuccessToast message="Official link updated" />);
      setTrendOfficialLink(normalized);
      setTrendObject((prev) => ({ ...(prev || {}), trendOfficialLink: normalized }));
      if (isAdmin && trendObject?.slug) {
        setAdminDraft((d) => ({
          ...(d || {}),
          trendOfficialLink: normalized,
          updatedAt: Date.now(),
        }));
      }
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

  const handleSubmitForApproval = async () => {
    try {
      if (!trendObject?.slug) return;
      setIsSubmittingForApproval(true);
      await customFetch.patch(`/trends/${trendObject.slug}/submit-for-approval`);
      toast.success(<CustomSuccessToast message="Submitted for approval" />);
      setTrendObject((prev) => ({ ...(prev || {}), isSubmittedForApproval: true }));
      if (isAdmin) setAdminDraft(null);
    } catch (error) {
      toast.error(
        <CustomErrorToast
          message={error?.response?.data?.msg || 'Error submitting for approval'}
        />
      );
    } finally {
      setIsSubmittingForApproval(false);
    }
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
  };

  const onToggleBookmark = async (trendId, nextIsSaved) => {
    try {
      if (nextIsSaved) {
        await onSave(trendId);
        toast.success(<CustomSuccessToast message='Trend saved successfully' />);
        setIsSaved(true);
      } else {
        await onRemove(trendId);
        toast.success(<CustomSuccessToast message='Trend removed' />);
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
      }, 220); //sweet spot 150-300ms
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
          <Form method="post" className="form" onSubmit={handleSubmitBlock}>
            <h4 className="form-title">Submit A Project:</h4>
            <div className="form-center">
              <FormComponentLogos
                type="text"
                name="trend"
                placeholder="Any tech on your mind?"
                value={trendValue}
                onChange={(e) => setTrendValue(e.target.value)}
              />

              {/* CATEGORY SELECTOR */}
              <FormSelectorIcon
                hight="47px"
                labelText="Choose Category:"
                name="trendCategory"
                defaultValue={defaultTrendCategory}
                list={trendCategory.map((cate) => ({
                  ...cate,
                  value: cate.value,
                  label: cate.label,
                  image: cate.image || CATEGORY_FALLBACK_ICON,
                }))}
                onChange={(name, selectedOption) => {
                  setCateLabel(selectedOption?.label || '');
                  setCateIconUrl(selectedOption?.image || CATEGORY_FALLBACK_ICON);
                }}
                isDarkTheme={isDarkTheme}
                borderColor="var(--grey-70)"
                hoverBorderColor="var(--primary-200)"
                focusBorderColor="var(--primary-300)"
                focusBoxShadowColor="var(--primary-100)"
                labelFontSize="0.8rem"
                labelColor="var(--grey-400)"
                labelFontWeight="400"
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

              {/* MULTI TECH SELECTOR */}
              <FormSelectorIcons
                hight="47px"
                labelText="Choose Technologies:"
                name="trendTechs_display"
                list={technologies}
                value={selectedTrendTechs}
                maxSelections={MAX_TREND_TECHS}
                placeholder="Select up to 5 technologies..."
                borderColor="var(--grey-70)"
                hoverBorderColor="var(--primary-200)"
                focusBorderColor="var(--primary-300)"
                focusBoxShadowColor="var(--primary-100)"
                labelFontSize="0.8rem"
                labelColor="var(--grey-400)"
                labelFontWeight="400"
                onChange={(name, selectedOptions) => {
                  applyTrendTechSelection(selectedOptions || [], { isManual: true }); //manual user changes go through the central helper
                }}
                isDarkTheme={isDarkTheme}
              />

              <input
                type="hidden"
                id="trendTech"
                name="trendTech"
                value={selectedTrendTechs[0]?.value || ''}
              />

              <input
                type="hidden"
                id="techLabel"
                name="trendTech_display"
                value={selectedTrendTechs[0]?.label || techLabel || ''}
              />

              <input
                type="hidden"
                id="techIconUrl"
                name="techIconUrl"
                value={selectedTrendTechs[0]?.techIconUrl || ''}
              />

              <input
                type="hidden"
                id="trendTechs"
                name="trendTechs"
                value={JSON.stringify(trendTechsPayload)}
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
                      <div className="trend-tech-label">{techLabel || 'Technology'}</div>
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
                      className="btn btn-block form-btn"
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
        </div>

        <div className="">
          {showFallback ? (
            <TrendsFallbackEffect active={true} iconCount={14} spinSpeed={55} />
          ) : (
            <TrendFallbackSuccess
              icon={techIconUrl}
              iconMovement={true}
              isMobile={isMobile}
              iconSize={1000}
              iconSizeSmall={500}
              speed={0.38}
            />
          )}
        </div>
      </div>
    </Container>
  );
};

export default AddTrend;