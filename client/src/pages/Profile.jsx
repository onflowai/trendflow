import React, { useState, useEffect, useRef } from 'react';
import { Form, useLoaderData, useNavigation } from 'react-router-dom';
import {
  Logo,
  UserTrends,
  UserSettings,
  SEOProtected,
  UserImgLarge,
  StatComponent,
  FormComponent,
  ProfileHeader,
  CustomErrorToast,
  UserConfirmModal,
  FormComponentLock,
  CustomSuccessToast,
} from '../components';
import customFetch from '../utils/customFetch';
import { useOutletContext } from 'react-router-dom';
import { useUser } from '../context/UserContext'; // importing UserContext
import { useDashboardContext } from './DashboardLayout';
import Container from '../assets/wrappers/ProfileContainer';
import { toast } from 'react-toastify';
import {
  IoCheckmarkDoneOutline,
  IoEyeOutline,
  IoArrowUp,
  IoAlbumsOutline,
} from 'react-icons/io5';
import { FaUserLargeSlash } from 'react-icons/fa6';
import { FaArrowRightLong } from 'react-icons/fa6';

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
  const { user, stats } = useOutletContext(); //hook is part of React Router which is set up in DashboardLayout
  const dashboardContext = useDashboardContext();
  const updateUserImage = dashboardContext?.updateUserImage; //DashboardContext (the reason why both used is for farther consistency when more features will be added)
  const { updateUserImage: updateUserImageGlobal } = useUser(); // UserContext (the reason why both used is for farther consistency when more features will be added)
  const {
    username,
    name,
    lastName,
    email,
    githubUsername: gitUsername,
    privacy,
    verified,
  } = user;
  console.log('USER: ', user);
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [githubUsername, setGithubUsername] = useState(gitUsername || '');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const dropdownRef = useRef(null);
  const isVerified = verified;
  const handleEditClick = () => {
    setIsDropdownVisible(!isDropdownVisible); // toggles dropdown visibility
  };
  //HANDLE CLICK OUTSIDE
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownVisible(false); // closing dropdown if clicked outside
    }
  };
  //HANDLE PROFILE IMG CHANGE
  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (file && file.size > 50000000) {
      toast.error('Image size too large.');
      return;
    }

    if (file) {
      const uploadFormData = new FormData();
      uploadFormData.append('profile_img', file);

      try {
        const response = await customFetch.patch(
          'users/upload-user-image',
          uploadFormData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        );

        if (response.status === 200) {
          const updatedUser = response.data.user;
          toast.success(
            <CustomSuccessToast
              message={'Profile Image Updated Successfully'}
            />
          );
          updateUserImage(updatedUser.profile_img, updatedUser.profile_img_id); // update DashboardContext
          updateUserImageGlobal(
            updatedUser.profile_img,
            updatedUser.profile_img_id
          ); // update UserContext
        } else {
          toast.error('Failed to update profile image');
        }
      } catch (error) {
        toast.error(
          <CustomErrorToast
            message={error?.response?.data?.msg || error.message}
          />
        );
      }
    }
  };
  // Function to handle GitHub username update
  const onUpdateGithubUsername = async ({ body }) => {
    try {
      const response = await customFetch.patch(
        '/users/add-github-username',
        body,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.status === 200) {
        const data = response.data;
        setGithubUsername(data.githubUsername);
        toast.success('GitHub username linked');
      } else {
        toast.error(response.data?.msg || 'Failed to link GitHub username.');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    }
  };
  //call to delete profile
  const handleDeleteProfile = async () => {
    try {
      await customFetch.delete('/users/delete-account');
      toast.success('Account deleted successfully');
      // HERE redirect to landing
      window.location.href = '/';
    } catch (error) {
      toast.error('Failed to delete account');
    } finally {
      setIsDeleteModalOpen(false);
    }
  };
  // action to perform Dropdown.jsx actions
  const handleOptionClick = (action) => {
    switch (action) {
      case 'verify':
        //HERE
        // Perform verify profile action
        console.log('Verify profile action triggered');
        // Example: API call to verify profile
        break;
      case 'delete':
        // Perform delete profile action
        setIsDeleteModalOpen(true);
        console.log('Delete profile action triggered');
        // Example: API call to delete profile
        break;
      default:
        break;
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
  //async func for updating the email
  const onUpdateEmail = async ({ request }) => {
    const formData = request.formData;
    try {
      await customFetch.patch('users/update-user', formData);
      toast.success(
        <CustomSuccessToast message={'Profile Updated Successfully'} />
      );
    } catch (error) {
      toast.error(<CustomErrorToast message={error?.response?.data?.msg} />);
    }
  }; //TEMPORARY
  //async for privacy PATCH
  const onTogglePrivacy = async () => {
    try {
      const { data } = await customFetch.patch('/users/toggle-privacy', {});
      setPrivacy(data.privacy); // Update privacy state based on response
      toast.success('Privacy setting updated successfully');
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
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
      <SEOProtected />
      <ProfileHeader
        user={user}
        message="Here is the information about your trends"
      />
      <StatComponent
        stats={[
          {
            title: 'Approved Trends',
            value: stats.approvedTrends,
            icon: <IoCheckmarkDoneOutline />,
          },
          {
            title: 'Total Trend Views',
            value: stats.totalTrendViews,
            icon: <IoEyeOutline />,
          },
          {
            title: 'Submitted Trends',
            value: stats.submittedTrends,
            icon: <IoArrowUp />,
          },
          {
            title: 'Total Site Trends',
            value: stats.totalSiteTrends,
            icon: <IoAlbumsOutline />,
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
                      onChange={(e) => handleFileChange(e)}
                    />
                    <label className="dropdown-option">Remove</label>
                  </div>
                )}
              </div>
            </div>
            <div className="form-and-trends-container">
              <div>
                <div className="form-user">
                  <FormComponentLock
                    type="text"
                    name="username"
                    defaultValue={username}
                  ></FormComponentLock>
                  <FormComponent
                    type="text"
                    name="name"
                    defaultValue={name}
                  ></FormComponent>
                  <FormComponent
                    type="text"
                    name="lastName"
                    defaultValue={lastName}
                  ></FormComponent>
                  <button
                    className="btn btn-block form-btn"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
                <div className="form-user-settings">
                  <UserSettings
                    onOptionClick={handleOptionClick}
                    email={email}
                    isVerified={isVerified}
                    onUpdateEmail={onUpdateEmail}
                    githubUsername={githubUsername}
                    onUpdateGithubUsername={onUpdateGithubUsername}
                    onTogglePrivacy={onTogglePrivacy}
                    privacy={privacy}
                  />
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
      <UserConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteProfile}
        userImg={user.profile_img}
        userName={`${name} ${lastName}`}
        icons={[
          <Logo size={36} color="red" />,
          <FaArrowRightLong size={36} color="var(--grey-400)" />,
          <FaUserLargeSlash size={36} color="var(--primary-500)" />,
        ]}
        confirmMessage="Delete Account?"
        subMessage="Note you will not be able to recover your account."
      />
    </Container>
  );
};

export default Profile;
