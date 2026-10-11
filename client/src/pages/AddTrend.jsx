import React, { useEffect, useMemo, useState, useRef } from 'react';
import {
  UserImgLarge,
  SEOProtected,
  CustomInfoToast,
  SkillReviewModal,
  CustomErrorToast,
  SubmitTrendPanel,
  FormSelectorIcon,
  FormSelectorIcons,
  AdminSettingModal,
  FormComponentLogos,
  CustomSuccessToast,
  TrendFallbackSuccess,
  TrendsFallbackEffect,
} from '../components';
import { useUser } from '../context/UserContext';
import { useDashboardContext } from '../pages/DashboardLayout.jsx';
import Container from '../assets/wrappers/SubmitFormContainer';
import { Form, useNavigation, useActionData } from 'react-router-dom';
import { toast } from 'react-toastify';
import customFetch from '../utils/customFetch';
import useWindowSize from '../hooks/useWindowSize';
import useLocalStorage from '../hooks/useLocalStorage';
import {
  TECH_FALLBACK_ICON,
  CATEGORY_FALLBACK_ICON,
  getTechDisplayImage,
  getCategoryDisplayImage,
} from '../utils/iconFallbacks';
const SKILL_TYPE_FALLBACK_ICON =
  '/assets/skill-types/fallback-skill-type.svg';
import skillFlowBlack from '../assets/images/skillflow-black.svg';
import skillFlowWhite from '../assets/images/skillflow-white.svg';
import skillFlowColor from '../assets/images/skillflow-color.svg';
import skillFlowGreen from '../assets/images/skillflow-green.svg';

//6. Load /skills/options when Skill mode is activated

/**
 * AddTrend submits the trend after user types it in the from and selects category and technology it lets user edit the description and guide
 * lets user save the progress of their edit and it lets user submit the edits for approval. lets user modify the official link additionally 
 * lets user bookmark the trend if they are admin role
 * @param {*} param0
 * @returns
 */
// const TECH_FALLBACK_ICON = '/assets/fallback-tech.svg';
// const CATEGORY_FALLBACK_ICON = '/assets/cat/fallback-cat.svg';
const MAX_TREND_TECHS = 5;

const ensureAssetPath = (value = '') => {
  const v = String(value || '').trim();
  if (!v) return '';
  if (v.startsWith('http://') || v.startsWith('https://') || v.startsWith('/')) return v;
  return `/assets/${v}`;
};

// const getTechDisplayImage = (tech) => {
//   const fullImageUrl = String(tech?.fullImageUrl || '').trim();
//   if (fullImageUrl) return fullImageUrl;

//   const image = String(tech?.image || '').trim();
//   if (image) return image;

//   const fileName = String(tech?.fileName || '').trim();
//   if (fileName) return ensureAssetPath(fileName);

//   const techIconUrl = String(tech?.techIconUrl || '').trim();
//   if (techIconUrl) return techIconUrl.endsWith('.svg') ? techIconUrl : `${techIconUrl}.svg`;

//   return TECH_FALLBACK_ICON;
// };

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

const buildSkillSlug = (technologies = [], skillType = '') => {
  const slugify = (value) =>
    String(value || '')
      .trim()
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

  const techSlug = technologies
    .map((technology) => slugify(technology?.value || technology?.label))
    .filter(Boolean)
    .join('-');

  const typeSlug = slugify(skillType);

  return [techSlug, typeSlug].filter(Boolean).join('-');
};//end buildSkillSlug

export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const createSkill = data.createSkill === 'true';
  const skillType = String(data.skillType || '').trim();
  const skillSlug = String(data.skillSlug || '').trim();

  let skillTrendTechs = [];

  if (typeof data.skillTrendTechs === 'string') {
    try {
      skillTrendTechs = JSON.parse(data.skillTrendTechs);
    } catch {
      skillTrendTechs = [];
    }
  }

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

  /*
   * These fields belong only to the Skill endpoint.
   * Do not send them to /trends/submit.
   */
  delete data.createSkill;
  delete data.skillType;
  delete data.skillTrendTechs;
  delete data.skillSlug;

  try {
    const trendResponse = await customFetch.post('/trends/submit', data);
    const trendResult = trendResponse.data;

    /*
     * Existing behavior remains unchanged when Skill mode is disabled.
     */
    if (!createSkill) {
      toast.success(
        <CustomSuccessToast message="Thank You, Trend Was Submitted" />
      );

      return trendResult;
    }

    const trendSlug = trendResult?.trendObject?.slug;

    if (!trendSlug) {
      const message =
        'Trend was created, but its slug was missing, so the Skill could not be generated.';

      toast.error(<CustomErrorToast message={message} />);

      return {
        ...trendResult,
        skillError: message,
        partialSuccess: true,
      };
    }

    const normalizedSkillTechs = (
      Array.isArray(skillTrendTechs) ? skillTrendTechs : []
    )
      .filter((item) => item?.value)
      .slice(0, MAX_TREND_TECHS)
      .map((item, index) => ({
        value: item.value,

        /*
         * Order controls the default role:
         * first = primary
         * remaining = supporting
         */
        role: index === 0 ? 'primary' : item.role || 'supporting',
      }));

    try {
      const skillResponse = await customFetch.post(
        `/skills/submit/${trendSlug}`,
        {
          skillSlug,
          type: skillType,
          trendTechs: normalizedSkillTechs,
          removeTrendFromGeneration: false,
          useTrendBlogForGeneration: true,
        }
      );

      toast.success(
        <CustomSuccessToast message="Trend and draft Skill were created" />
      );

      return {
        ...trendResult,
        skillCreated: true,
        skill: skillResponse.data?.skill || null,
      };
    } catch (skillError) {
      /*
       * The Trend already exists at this point. Preserve it in the UI even
       * when the second Skill request fails.
       */
      const message =
        skillError?.response?.data?.msg ||
        'Trend was created, but Skill generation failed.';

      toast.error(<CustomErrorToast message={message} />);

      return {
        ...trendResult,
        skillError: message,
        partialSuccess: true,
      };
    }
  } catch (error) {
    const message =
      error?.response?.data?.msg || 'Error submitting trend';

    toast.error(<CustomErrorToast message={message} />);

    return {
      error: message,
    };
  }
};//end action

const AddTrend = () => {
  const { user, updateUserImage } = useUser();
  //const { user } = useOutletContext(); //getting the user from DashboardLayout
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  const [showSubmitSpinner, setShowSubmitSpinner] = useState(false);
  const submitSpinnerTimerRef = useRef(null);
  const { isDarkTheme } = useDashboardContext();
  const actionData = useActionData();

  const isAdmin = user?.role === 'admin' || user?.role === 'superAdmin';

  const autoSelectedTechValueRef = useRef(''); //tracking the current auto-added tech value
  const dismissedAutoTechRef = useRef({ input: '', techValue: '' }); //tracking auto-added tech for the current input

  const [trendValue, setTrendValue] = useState('');

  const [isSkillMode, setIsSkillMode] = useState(false);
  const [skillTypes, setSkillTypes] = useState([]);
  const [skillTechnologies, setSkillTechnologies] = useState([]);
  const [selectedSkillType, setSelectedSkillType] = useState('');
  const [selectedSkillTechs, setSelectedSkillTechs] = useState([]);
  const [skillTechsManuallyEdited, setSkillTechsManuallyEdited] = useState(false);
  const [isLoadingSkillOptions, setIsLoadingSkillOptions] = useState(false);
  const [draggedSkillTechValue, setDraggedSkillTechValue] = useState('');

  const [existsState, setExistsState] = useState({ exists: false, trend: null });
  const debounceRef = useRef(null);
  const lastToastIdRef = useRef(null);

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);

  const ADMIN_DRAFT_KEY = 'tf_add_trend_admin_draft_v1';
  const [adminDraft, setAdminDraft] = useLocalStorage(ADMIN_DRAFT_KEY, null);

  const [trendCategory, setTrendCategory] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [defaultTrendCategory, setDefaultTrendCategory] = useState(null);

  const [selectedTrendTechs, setSelectedTrendTechs] = useState([]); //multi-trend

  const [techLabel, setTechLabel] = useState(''); // storing tech label
  const [cateLabel, setCateLabel] = useState(''); // storing category label
  const [techIconUrl, setTechIconUrl] = useState(''); //storing tech icon URL
  const [cateIconUrl, setCateIconUrl] = useState(''); //storing category icon URL

  const [skillObject, setSkillObject] = useState(null);
  //const [isSkillReviewOpen, setIsSkillReviewOpen] = useState(false);

  const [trendObject, setTrendObject] = useState(null); //generated content state
  const { isMobile } = useWindowSize();
  const showFallback = isSubmitting || !trendObject;

  const trendTechsPayload = useMemo(
    () => buildTrendTechsPayload(selectedTrendTechs),
    [selectedTrendTechs]
  );

  const setAndPersistSkillObject = (nextSkillObject) => {
    setSkillObject(nextSkillObject);
    setAdminDraft((currentDraft) => {
      if (!currentDraft?.slug) {
        return currentDraft;
      }
      return {
        ...currentDraft,
        skillObject: nextSkillObject || null,
        updatedAt: Date.now(),
      };
    });
  };

  const skillSlug = useMemo(() => {
    return buildSkillSlug(selectedSkillTechs, selectedSkillType);
  }, [selectedSkillTechs, selectedSkillType]);

  const resetAfterApproval = () => {
    setTrendObject(null);
    setTrendValue('');
    setExistsState({ exists: false, trend: null });

    setSelectedTrendTechs([]);
    setTechLabel('');
    setTechIconUrl('');

    setSkillObject(null);
    //setIsSkillReviewOpen(false);

    setCateLabel('');
    setCateIconUrl('');

    setIsSkillMode(false);
    setSelectedSkillType('');
    setSelectedSkillTechs([]);
    setSkillTechsManuallyEdited(false);
    setDraggedSkillTechValue('');

    dismissedAutoTechRef.current = { input: '', techValue: '' };
    autoSelectedTechValueRef.current = '';

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (lastToastIdRef.current) toast.dismiss(lastToastIdRef.current);
  };

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

  const handleSubmitBlock = (event) => {
    if (existsState.exists) {
      event.preventDefault();
      toast.error(
        <CustomErrorToast message="That project already exists. Pick a different name." />
      );
      return;
    }

    if (!trendTechsPayload.length) {
      event.preventDefault();

      toast.error(
        <CustomErrorToast message="Pick at least one technology." />
      );

      return;
    }

    if (!isSkillMode) {
      return;
    }

    if (!selectedSkillType) {
      event.preventDefault();

      toast.error(
        <CustomErrorToast message="Pick a Skill Type." />
      );

      return;
    }

    if (!skillTrendTechsPayload.length) {
      event.preventDefault();

      toast.error(
        <CustomErrorToast message="Pick at least one technology for the Skill." />
      );
    }
  };//end handleSubmitBlock

  useEffect(() => {
    if (!isAdmin) return;
    if (!isSkillMode) return;

    if (
      skillTypes.length > 0 &&
      skillTechnologies.length > 0
    ) {
      return;
    }

    let isMounted = true;

    const fetchSkillOptions = async () => {
      try {
        setIsLoadingSkillOptions(true);

        const { data } = await customFetch.get(
          '/skills/options'
        );

        if (!isMounted) return;

        const nextSkillTypes = (
          Array.isArray(data?.skillTypes)
            ? data.skillTypes
            : []
        ).map(normalizeSkillTypeOption);

        const nextSkillTechnologies = (
          Array.isArray(data?.relatedTechs)
            ? data.relatedTechs
            : []
        ).map((technology) =>
          normalizeTechnologyOption({
            ...technology,
            image:
              technology.techIconUrl ||
              technology.image ||
              technology.fullImageUrl ||
              TECH_FALLBACK_ICON,
          })
        );

        setSkillTypes(nextSkillTypes);
        setSkillTechnologies(
          nextSkillTechnologies
        );

        setSelectedSkillType((current) => {
          return (
            current ||
            nextSkillTypes[0]?.value ||
            ''
          );
        });
      } catch (error) {
        const message =
          error?.response?.data?.msg ||
          'Unable to load Skill options.';

        toast.error(
          <CustomErrorToast message={message} />
        );

        setIsSkillMode(false);
      } finally {
        if (isMounted) {
          setIsLoadingSkillOptions(false);
        }
      }
    };

    fetchSkillOptions();

    return () => {
      isMounted = false;
    };
  }, [
    isAdmin,
    isSkillMode,
    skillTypes.length,
    skillTechnologies.length,
  ]);//end useEffect that loads /skills/options when skill mode is activated

  useEffect(() => {
    if (!isSkillMode) return;

    /*
    * Once the admin edits the Skill stack, it becomes independent from
    * the Trend selector.
    */
    if (skillTechsManuallyEdited) return;

    const mirroredTechnologies = selectedTrendTechs.map((selectedTrendTech) => {
      const skillTechnology = skillTechnologies.find(
        (technology) =>
          technology.value === selectedTrendTech.value
      );

      return skillTechnology || selectedTrendTech;
    });

    setSelectedSkillTechs(mirroredTechnologies);
  }, [
    isSkillMode,
    selectedTrendTechs,
    skillTechnologies,
    skillTechsManuallyEdited,
  ]);//end useEffect that mirrors the existing trend technology selection

  useEffect(() => {
    if (!isAdmin) return;
    if (!adminDraft?.slug) return;
    if (!trendObject) {
      setTrendObject({
        slug: adminDraft.slug,
        generatedBlogPost:
          adminDraft.generatedBlogPost || '',
        trendUse: adminDraft.trendUse || '',
        trendOfficialLink:
          adminDraft.trendOfficialLink || '',
        trendTechs: adminDraft.trendTechs || [],
        isSubmittedForApproval: Boolean(
          adminDraft.isSubmittedForApproval
        ),
      });
    }

    if (
      !skillObject &&
      adminDraft?.skillObject?.slug
    ) {
      setSkillObject(adminDraft.skillObject);
    }
  }, [
    isAdmin,
    adminDraft,
    trendObject,
    skillObject,
  ]);//end useEffect restores objects

  const lastAppliedSlugRef = useRef('');

  useEffect(() => {
    if (!actionData) return;
    if (actionData?.error) return;
    const nextSkillObject = actionData?.skill || null;
    setSkillObject(nextSkillObject);
    const nextTrendObject = actionData?.trendObject;
    const nextSlug = nextTrendObject?.slug || '';

    if (!nextSlug) return;
    if (lastAppliedSlugRef.current === nextSlug) return; //prevents re-apply loop
    lastAppliedSlugRef.current = nextSlug; //

    setTrendObject(nextTrendObject);

    if (isAdmin && nextTrendObject?.slug) {
      setAdminDraft({
        slug: nextTrendObject.slug,
        generatedBlogPost: nextTrendObject.generatedBlogPost || '',
        trendUse: nextTrendObject.trendUse || '',
        trendOfficialLink: nextTrendObject.trendOfficialLink || '',
        trendTechs: nextTrendObject.trendTechs || [],
        isSubmittedForApproval: Boolean(nextTrendObject.isSubmittedForApproval),
        skillObject: nextSkillObject,
        updatedAt: Date.now(),
      });// save initial draft only for admin (so refresh keeps it)
    }//saving initial draft only for admin so refresh keeps it
  }, [actionData, isAdmin]);// when submit returns treat it as the new source of truth
  //+ persist a draft snapshot applying actionData after submit completes as single source of truth
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await customFetch.get('icons/icon-data');
        const { TREND_CATEGORY, TECHNOLOGIES } = response.data;

        const trendCategoryList = Object.values(TREND_CATEGORY || {}).map((cate) => {
          const normalized = normalizeCategoryOption(cate);

          return {
            ...normalized,
            image: getCategoryDisplayImage(normalized),
          };
        });
        const technologiesList = Object.values(TECHNOLOGIES || {}).map((tech) => {
          const normalized = normalizeTechnologyOption(tech);

          return {
            ...normalized,
            image: getTechDisplayImage(normalized),
          };
        });

        setTrendCategory(trendCategoryList);
        setTechnologies(technologiesList);

        if (trendCategoryList.length > 0) {
          setDefaultTrendCategory(trendCategoryList[0].value);
          setCateLabel(trendCategoryList[0].label || '');
          setCateIconUrl(trendCategoryList[0].image || CATEGORY_FALLBACK_ICON);
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

  const normalizeSkillTypeOption = (skillType) => ({
    ...skillType,
    value: skillType?.value || '',
    label:
      skillType?.label ||
      skillType?.value ||
      '',
    image:
      String(skillType?.fullImageUrl || '').trim() ||
      String(skillType?.image || '').trim() ||
      String(skillType?.iconUrl || '').trim() ||
      SKILL_TYPE_FALLBACK_ICON,
  });//end normalizeSkillTypeOption

  const skillTrendTechsPayload = useMemo(() => {
    return selectedSkillTechs.map((item, index) => ({
      value: item.value,
      role: index === 0 ? 'primary' : item.role || 'supporting',
    }));
  }, [selectedSkillTechs]);

  const handleSkillModeToggle = () => {
    if (!isAdmin) return;

    setIsSkillMode((current) => {
      const nextValue = !current;
      if (nextValue) {
        setSkillTechsManuallyEdited(false);//every time Skill mode is newly activated, begin by mirroring the Trend technologies until the admin edits the Skill stack
      }
      return nextValue;
    });
  };//end handleSkillModeToggle adds the Skill mode toggle handler

  const moveSkillTechnology = (
    index,
    direction
  ) => {
    setSkillTechsManuallyEdited(true);

    setSelectedSkillTechs(
      (currentTechnologies) => {
        const destinationIndex =
          index + direction;

        if (
          destinationIndex < 0 ||
          destinationIndex >=
            currentTechnologies.length
        ) {
          return currentTechnologies;
        }

        const reorderedTechnologies = [
          ...currentTechnologies,
        ];

        [
          reorderedTechnologies[index],
          reorderedTechnologies[
            destinationIndex
          ],
        ] = [
          reorderedTechnologies[
            destinationIndex
          ],
          reorderedTechnologies[index],
        ];

        return reorderedTechnologies;
      }
    );
  };//end moveSkillTechnology

  const handleSkillTechDragStart = (
    event,
    technologyValue
  ) => {
    setDraggedSkillTechValue(technologyValue);

    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData(
      'text/plain',
      technologyValue
    );
  };

  const handleSkillTechDragOver = (
    event,
    targetTechnologyValue
  ) => {
    event.preventDefault();

    const sourceTechnologyValue =
      draggedSkillTechValue ||
      event.dataTransfer.getData(
        'text/plain'
      );

    if (
      !sourceTechnologyValue ||
      sourceTechnologyValue ===
        targetTechnologyValue
    ) {
      return;
    }

    setSkillTechsManuallyEdited(true);

    setSelectedSkillTechs(
      (currentTechnologies) => {
        const sourceIndex =
          currentTechnologies.findIndex(
            (technology) =>
              technology.value ===
              sourceTechnologyValue
          );

        const targetIndex =
          currentTechnologies.findIndex(
            (technology) =>
              technology.value ===
              targetTechnologyValue
          );

        if (
          sourceIndex === -1 ||
          targetIndex === -1 ||
          sourceIndex === targetIndex
        ) {
          return currentTechnologies;
        }

        const nextTechnologies = [
          ...currentTechnologies,
        ];

        const [movedTechnology] =
          nextTechnologies.splice(
            sourceIndex,
            1
          );

        nextTechnologies.splice(
          targetIndex,
          0,
          movedTechnology
        );

        return nextTechnologies;
      }
    );
  };//end handleSkillTechDragOver

  const handleSkillTechDragEnd = () => {
    setDraggedSkillTechValue('');
  };

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
              <div
                className={[
                  'trend-input-with-skill',
                  isSkillMode ? 'is-active' : '',
                  !isAdmin ? 'without-skill-toggle' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <FormComponentLogos
                  type="text"
                  name="trend"
                  labelText="Project"
                  placeholder="Any tech on your mind?"
                  value={trendValue}
                  onChange={(event) =>
                    setTrendValue(event.target.value)
                  }
                  disabled={isSubmitting}
                  isDarkTheme={isDarkTheme}
                  showToolButton={isAdmin}
                  toolButtonActive={isSkillMode}
                  toolButtonDisabled={isSubmitting}
                  onToolButtonClick={handleSkillModeToggle}
                  toolButtonLabel="Enable Skill build"
                  toolButtonActiveLabel="Disable Skill build"
                  toolIconLight={skillFlowBlack}
                  toolIconDark={skillFlowWhite}
                  toolIconHover={skillFlowColor}
                  toolIconEnabled={skillFlowGreen}
                />
              </div>
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
                value={cateIconUrl || CATEGORY_FALLBACK_ICON}
              />

              {/* MULTI TECH SELECTOR */}
              <FormSelectorIcons
                hight="47px"
                isClearable={true}
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
                onChange={(name, selectedOptions, meta) => {
                  applyTrendTechSelection(selectedOptions || [], { isManual: true });
                  if (meta?.action === 'clear') {
                    dismissedAutoTechRef.current = { input: '', techValue: '' };
                    autoSelectedTechValueRef.current = '';
                  }
                }}
                isDarkTheme={isDarkTheme}
              />
              {isAdmin && isSkillMode && (
                <>
                  <input
                    type="hidden"
                    name="createSkill"
                    value="true"
                  />

                  <div className="skill-field skill-type-field">
                    {isLoadingSkillOptions ? (
                      <div className="skill-options-loading">
                        Loading Skill Types...
                      </div>
                    ) : (
                      <FormSelectorIcon
                        key={`skill-type-${selectedSkillType}`}
                        hight="47px"
                        labelText="Skill Type:"
                        name="skillType_display"
                        defaultValue={selectedSkillType}
                        list={skillTypes.map(
                          (skillType) => ({
                            ...skillType,
                            value: skillType.value,
                            label: skillType.label,
                            image:
                              skillType.image ||
                              SKILL_TYPE_FALLBACK_ICON,
                          })
                        )}
                        onChange={(
                          name,
                          selectedOption
                        ) => {
                          setSelectedSkillType(
                            selectedOption?.value || ''
                          );
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
                    )}

                    <input
                      type="hidden"
                      name="skillType"
                      value={selectedSkillType}
                    />
                  </div>

                  <div className="skill-field skill-tech-field">
                    {isLoadingSkillOptions ? (
                      <div className="skill-options-loading">
                        Loading Skill Technologies...
                      </div>
                    ) : (
                      <FormSelectorIcons
                        hight="47px"
                        isClearable={true}
                        labelText="Skill Technologies:"
                        name="skillTrendTechs_display"
                        list={skillTechnologies}
                        value={selectedSkillTechs}
                        maxSelections={MAX_TREND_TECHS}
                        placeholder="Select Skill technologies..."
                        borderColor="var(--grey-70)"
                        hoverBorderColor="var(--primary-200)"
                        focusBorderColor="var(--primary-300)"
                        focusBoxShadowColor="var(--primary-100)"
                        labelFontSize="0.8rem"
                        labelColor="var(--grey-400)"
                        labelFontWeight="400"
                        onChange={(
                          name,
                          selectedOptions
                        ) => {
                          setSkillTechsManuallyEdited(
                            true
                          );

                          setSelectedSkillTechs(
                            dedupeTrendTechs(
                              selectedOptions || []
                            )
                          );
                        }}
                        isDarkTheme={isDarkTheme}
                      />
                    )}

                    {selectedSkillTechs.length > 0 && (
                      <div className="skill-build-field">
                        <div className="skill-build-label">
                          Skill Build:
                        </div>

                        <div
                          className="skill-tech-order"
                          aria-label="Skill technology build order"
                        >
                          {selectedSkillTechs.map(
                            (technology, index) => {
                              const isFirst = index === 0;
                              const isLast =
                                index ===
                                selectedSkillTechs.length -
                                  1;

                              const isDragging =
                                draggedSkillTechValue ===
                                technology.value;

                              return (
                                <React.Fragment
                                  key={technology.value}
                                >
                                  <div
                                    className={[
                                      'skill-tech-pill',
                                      isFirst
                                        ? 'is-primary'
                                        : '',
                                      isDragging
                                        ? 'is-dragging'
                                        : '',
                                    ]
                                      .filter(Boolean)
                                      .join(' ')}
                                    draggable
                                    onDragStart={(event) =>
                                      handleSkillTechDragStart(
                                        event,
                                        technology.value
                                      )
                                    }
                                    onDragOver={(event) =>
                                      handleSkillTechDragOver(
                                        event,
                                        technology.value
                                      )
                                    }
                                    onDragEnd={
                                      handleSkillTechDragEnd
                                    }
                                    title={
                                      isFirst
                                        ? `${
                                            technology.label ||
                                            technology.value
                                          } — Primary`
                                        : `${
                                            technology.label ||
                                            technology.value
                                          } — Supporting`
                                    }
                                  >
                                    <span
                                      className="skill-tech-drag-handle"
                                      aria-hidden="true"
                                    >
                                      ⋮⋮
                                    </span>

                                    <img
                                      src={
                                        technology.image ||
                                        technology.techIconUrl ||
                                        TECH_FALLBACK_ICON
                                      }
                                      alt=""
                                      draggable={false}
                                    />

                                    <span className="skill-tech-pill-name">
                                      {technology.label ||
                                        technology.value}
                                    </span>

                                    <div className="skill-pill-order-actions">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          moveSkillTechnology(
                                            index,
                                            -1
                                          )
                                        }
                                        disabled={isFirst}
                                        aria-label={`Move ${
                                          technology.label ||
                                          technology.value
                                        } left`}
                                        title="Move left"
                                      >
                                        ←
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() =>
                                          moveSkillTechnology(
                                            index,
                                            1
                                          )
                                        }
                                        disabled={isLast}
                                        aria-label={`Move ${
                                          technology.label ||
                                          technology.value
                                        } right`}
                                        title="Move right"
                                      >
                                        →
                                      </button>
                                    </div>
                                  </div>

                                  {!isLast && (
                                    <span
                                      className="skill-order-arrow"
                                      aria-hidden="true"
                                    >
                                      →
                                    </span>
                                  )}
                                </React.Fragment>
                              );
                            }
                          )}
                        </div>
                      </div>
                    )}

                    <input
                      type="hidden"
                      name="skillTrendTechs"
                      value={JSON.stringify(
                        skillTrendTechsPayload
                      )}
                    />
                    <input
                      type="hidden"
                      name="skillSlug"
                      value={skillSlug}
                    />
                  </div>
                </>
              )}

              {!isSkillMode && (
                <input
                  type="hidden"
                  name="createSkill"
                  value="false"
                />
              )}

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
                value={selectedTrendTechs[0]?.techIconUrl || selectedTrendTechs[0]?.image || TECH_FALLBACK_ICON}
              />

              <input
                type="hidden"
                id="trendTechs"
                name="trendTechs"
                value={JSON.stringify(trendTechsPayload)}
              />
              <div
                className={[
                  'submit-row',
                  isAdmin
                    ? 'has-settings'
                    : 'no-settings',
                  isSkillMode
                    ? 'skill-submit-full-width'
                    : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <div className="submit-action">
                  <button
                    type="submit"
                    className="btn btn-block form-btn"
                    disabled={
                      isSubmitting ||
                      (isSkillMode &&
                        isLoadingSkillOptions)
                    }
                  >
                    {isSubmitting
                      ? 'submitting'
                      : isSkillMode
                        ? 'Submit Trend & Build Skill'
                        : 'submit'}
                  </button>
                </div>

                {isAdmin && (
                  <div className="submit-gear">
                    <AdminSettingModal
                      currentUser={user}
                      className="settings-icon"
                    />
                  </div>
                )}
              </div>
            </div>
          </Form>
          <div className='skill-review-container'>
            {isAdmin && skillObject?.slug && (
              <SkillReviewModal
                key={skillObject.slug}
                skillObject={skillObject}
                setSkillObject={setAndPersistSkillObject}
                isAdmin={isAdmin}
                isDarkTheme={isDarkTheme}
              />
            )}
          </div>
          <SubmitTrendPanel
            trendObject={trendObject}
            setTrendObject={setTrendObject}
            isSubmitting={isSubmitting}
            showSubmitSpinner={showSubmitSpinner}
            isAdmin={isAdmin}
            isDarkTheme={isDarkTheme}
            techIconUrl={techIconUrl} 
            techLabel={techLabel}
            trendTechsPayload={trendTechsPayload}
            setAdminDraft={setAdminDraft}
            onApprovalComplete={resetAfterApproval}
          />
        </div>
        <div className="">
          {showFallback ? (
            <TrendsFallbackEffect active={true} iconCount={14} spinSpeed={25} />
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