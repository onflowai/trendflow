import React, { useState, useEffect, useRef } from 'react';
import { Form, useLoaderData, redirect, useNavigation } from 'react-router-dom';
import {
  CustomSuccessToast,
  CustomErrorToast,
  StatComponent,
  FormComponent,
  ProfileHeader,
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
  const { user, stats } = useOutletContext();
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
      <Form
        method="post"
        className="user-form-container"
        encType="multipart/form-data"
      >
        <div className="user-image">
          {user.profile_img ? (
            <img src={user.profile_img} alt="user image" className="img" />
          ) : (
            <FaUserCircle className="user" /> // Fallback User Icon
          )}
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
      </Form>
    </Container>
  );
};

export default Profile;
