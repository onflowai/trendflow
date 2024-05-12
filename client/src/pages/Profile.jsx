import React, { useState, useEffect, useRef } from 'react';
import { Form, useLoaderData, useNavigation } from 'react-router-dom';
import {
  CustomSuccessToast,
  CustomErrorToast,
  StatComponent,
  FormComponent,
  ProfileHeader,
  UserImgLarge,
  UserTrends,
} from '../components';
import customFetch from '../utils/customFetch';
import { useOutletContext } from 'react-router-dom';
import Container from '../assets/wrappers/ProfileContainer';
import { toast } from 'react-toastify';
import { FcApprove, FcCheckmark, FcLineChart, FcCancel } from 'react-icons/fc';

/**
 * Profile utilizes few components it uses From with encType='multipart/form-data' to pass data with files in this case
 * images.
 * @returns
 */
export const loader = async () => {
  try {
    const { data: savedTrendsData } = await customFetch.get(
      '/users/saved-trends'
    );
    const savedTrendIds = savedTrendsData.savedTrends.map((trend) => trend._id);
    //NOTE: this is done to reuse the /users/saved-trends GET in Profile as full fetch for user bookmarked trends (instead of _id fetch)
    const savedTrends = savedTrendsData.savedTrends || [];
    return {
      trends: savedTrends,
      savedTrendIds,
    };
  } catch (error) {
    toast.error(<CustomErrorToast message={error?.response?.data?.msg} />);
    return { error: error?.response?.data?.msg || 'An error occurred' };
  }
};
export const action = async ({ request }) => {
  const formData = await request.formData(); //getting the form data out of the request where it is loaded with react
  const file = formData.get('profile_img'); //pointing to the image upload by user
  if (file && file.size > 50000000) {
    toast.error('image size too large'); //changed to automatic compression on backend and user can upload whatever image with npm sharp
    return null;
  }
  try {
    await customFetch.patch('users/update-user', formData); //uploading users Image
    toast.success(
      <CustomSuccessToast message={'Profile Updated Successfully'} />
    );
  } catch (error) {
    toast.error(<CustomErrorToast message={error?.response?.data?.msg} />);
  }
  return null;
};
const Profile = () => {
  const { trends, savedTrendIds } = useLoaderData(); //bookmarked trends from loader
  const [localSavedTrends, setLocalSavedTrends] = useState(trends);
  console.log('trends in PROFILE: ', trends);
  const { user, stats } = useOutletContext();
  console.log('PROFILE: ', user.savedTrends);
  const { username, name, lastName, email } = user;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);
  const handleEditClick = () => {
    setIsDropdownVisible(!isDropdownVisible); // toggles dropdown visibility
  };
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownVisible(false); // closing dropdown if clicked outside
    }
  };
  // Function to refetch trends
  const refetchTrends = async () => {
    try {
      const { data: savedTrendsData } = await customFetch.get(
        '/users/saved-trends'
      );
      setLocalSavedTrends(savedTrendsData.savedTrends || []);
    } catch (error) {
      toast.error(<CustomErrorToast message={error?.response?.data?.msg} />);
    }
  };
  //function for removing bookmarked trends
  const onRemove = async (_id) => {
    try {
      const response = await customFetch.patch('/users/remove-trend', { _id });
      if (response.status === 200) {
        toast.success('Trend unmarked successfully');
        await refetchTrends();
      } else {
        toast.error('Failed to unmarked trend');
      }
    } catch (error) {
      toast.error('An error occurred');
      console.error(error);
    }
  };
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
    <Container>
      <ProfileHeader user={user} />
      <StatComponent
        stats={[
          {
            title: 'Approved Trends',
            value: stats.approvedTrends,
            icon: <FcApprove />,
          },
          {
            title: 'Total Trend Views',
            value: stats.totalTrendViews,
            icon: <FcLineChart />,
          },
          {
            title: 'Submitted Trends',
            value: stats.submittedTrends,
            icon: <FcCheckmark />,
          },
          {
            title: 'Total Site Trends',
            value: stats.totalSiteTrends,
            icon: <FcCancel />,
          },
        ]}
      />
      <div className="profile-content">
        <div className="user-form-container">
          <Form method="post" encType="multipart/form-data">
            <div className="user-image">
              <UserImgLarge user_img={user.profile_img} />
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
                    />
                    <label className="dropdown-option">Remove</label>
                  </div>
                )}
              </div>
            </div>
            <h5>{username}</h5>
            <div className="form-and-trends-container">
              <div>
                <div className="form-user">
                  <FormComponent
                    type="text"
                    name="name"
                    defaultValue={name}
                  ></FormComponent>
                  <FormComponent
                    type="email"
                    name="email"
                    defaultValue={email}
                  ></FormComponent>
                  <FormComponent
                    type="text"
                    name="lastName"
                    defaultValue={lastName}
                  ></FormComponent>
                  <button
                    className="btn btn-block from-btn"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'submitting...' : 'submit'}
                  </button>
                </div>
                <div className="form-user-settings">
                  <h5>User Settings</h5>
                  {/* Add your settings components here */}
                </div>
              </div>
              <div className="trends-container">
                <UserTrends
                  className="bookmark-trends"
                  trends={localSavedTrends}
                  savedTrends={savedTrendIds}
                  onRemove={onRemove}
                />
              </div>
            </div>
          </Form>
        </div>
      </div>
    </Container>
  );
};

export default Profile;
