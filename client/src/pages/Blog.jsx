import React, { useState, useEffect, useRef } from 'react';
import { Form, useLoaderData, useNavigation } from 'react-router-dom';
import {
  CustomSuccessToast,
  FormComponentLock,
  CustomErrorToast,
  UserSettings,
  StatComponent,
  FormComponent,
  ProfileHeader,
  UserImgLarge,
  UserTrends,
} from '../components';
import customFetch from '../utils/customFetch';
import { useOutletContext } from 'react-router-dom';
import { useUser } from '../context/UserContext'; // importing UserContext
import { useDashboardContext } from './DashboardLayout';
import Container from '../assets/wrappers/BlogContainer';
import { toast } from 'react-toastify';
import { FcApprove, FcCheckmark, FcLineChart, FcCancel } from 'react-icons/fc';

/**
 * Blog.jsx displays the infoHub cards (lets user create and delete them) and displays the blog posts
 * @returns
 */
export const loader = async () => {};
export const action = async ({ request }) => {};

const Blog = () => {
  return (
    <Container>
      <ProfileHeader
        user={user}
        message="here is useful information about tech"
      />
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
                    onTogglePrivacy={onTogglePrivacy}
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
    </Container>
  );
};

export default Blog;
