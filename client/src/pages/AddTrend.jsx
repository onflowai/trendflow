import React, { useEffect, useState, useRef } from 'react';
import {
  UserImgLarge,
  SEOProtected,
  FallbackChart,
  CustomErrorToast,
  FormSelectorIcon,
  FormComponentLogos,
  CustomSuccessToast,
} from '../components';
import { useDashboardContext } from '../pages/DashboardLayout.jsx';
import Container from '../assets/wrappers/SubmitFormContainer';
import { useOutletContext } from 'react-router-dom';
import { Form, useNavigation, redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import customFetch from '../utils/customFetch';
/**
 *
 * @param {*} param0
 * @returns
 */
export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  try {
    await customFetch.post('/trends/submit', data);
    toast.success(
      <CustomSuccessToast message={'Thank You, Trend Was Submitted'} />
    );
    return redirect('/dashboard');
  } catch (error) {
    toast.error(<CustomErrorToast message={error?.response?.data?.msg} />);
    return error;
  }
};
const AddTrend = () => {
  const { user } = useOutletContext(); //getting the user from DashboardLayout
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  const { isDarkTheme } = useDashboardContext();

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);

  const [trendCategory, setTrendCategory] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [defaultTrendCategory, setDefaultTrendCategory] = useState(null);
  const [defaultTrendTech, setDefaultTrendTech] = useState(null);
  const [techLabel, setTechLabel] = useState(''); // storing tech label
  const [cateLabel, setCateLabel] = useState(''); // storing category label
  const [techIconUrl, setTechIconUrl] = useState(''); // storing tech icon URL
  const [cateIconUrl, setCateIconUrl] = useState(''); // storing category icon URL

  //fetching the icon data from the node server
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await customFetch.get('trends/icon-data');
        const { TREND_CATEGORY, TECHNOLOGIES } = response.data;
        console.log(
          'TREND_CATEGORY, TECHNOLOGIES: ',
          TREND_CATEGORY,
          TECHNOLOGIES
        );
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

    // Optional file-size check:
    if (file.size > 50000000) {
      toast.error('Image size too large.');
      return;
    }

    // Prepare FormData
    const uploadFormData = new FormData();
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

  return (
    <Container>
      <SEOProtected />
      <div className="user-container clearfix">
        <div className="user-info">
          {!user?.profile_img ? (
            <div className="user-image no-image">
              <div className="user-profile">
                <UserImgLarge user_img={user.profile_img} />
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
            <h4 className="form-title">Submit Tech:</h4>
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
                  image: cate.image,
                }))}
                onChange={(name, value) => {
                  setCateLabel(value ? value.label : '');
                  setCateIconUrl(value ? value.value : '');
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
                  image: tech.image,
                }))}
                onChange={(name, value) => {
                  setTechLabel(value ? value.label : '');
                  setTechIconUrl(value ? value.value : '');
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
        </div>
        <div className="chart-container">
          <FallbackChart />
        </div>
      </div>
    </Container>
  );
};

export default AddTrend;
