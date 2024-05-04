import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FcElectricity,
  FcCalendar,
  FcApproval,
  FcCheckmark,
  FcCancel,
} from 'react-icons/fc';
import { CiEdit } from 'react-icons/ci';
import {
  PiUserCircleThin,
  PiHashLight,
  PiEyeThin,
  PiTimerThin,
  PiTrendUpLight,
} from 'react-icons/pi'; //PiEyeThin
import { TrendChartComponent, Loading } from '../components';
import Container from '../assets/wrappers/TrendLargeContainer';
import day from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
day.extend(advancedFormat);
/**
 * This component is used in the large screens with more info, data is passed from Trend.jsx
 * @returns
 */
function TrendLarge({
  slug,
  views,
  trend,
  trendTech,
  trendCategory,
  trendDesc,
  trendStatus,
  isLoading,
  upDate,
  interestOverTime,
  isAdminPage,
  onApprove,
  onDelete,
  createdBy,
  isApproved,
}) {
  const navigate = useNavigate(); // Use navigate for navigation
  const navigateToTrend = () => {
    navigate(`/dashboard/trend/${slug}`);
  };
  const handleInnerClick = (event) => {
    event.stopPropagation(); // stops the click from reaching the container
  };
  // const upDate = day(updatedAt).format('MM YYYY');
  // const isLoading = loadingSlug === slug; // determining if this specific trend is loading
  return (
    <Container onClick={navigateToTrend} className="trend-large-card">
      <header>
        <div className="overlay">
          <div className="info">
            {isLoading && (
              <div className="loading-styling">
                <Loading />
              </div>
            )}
            <TrendChartComponent data={interestOverTime} />
            <div className="trend-title-container">
              <h3 className="mono-heading-bold">{trend}</h3>
              <h6 className="mono-heading">{trendCategory}</h6>
            </div>
            <div className="description-container">
              <h5 className="mono-heading">{trendDesc}</h5>
            </div>
            {/* INFO SECTION */}
            <div className="content">
              <div className="content-center">
                {/* Inline the icon and text presentation */}
                <div className="info-section">
                  <span className="icon">
                    <PiHashLight />
                  </span>
                  <span className="text">{trendTech}</span>
                </div>
                <div className="info-section">
                  <span className="icon">
                    <PiTrendUpLight />
                  </span>
                  <span className="text">{trendStatus}</span>
                </div>
                <div className="info-section">
                  <span className="icon">
                    <PiEyeThin />
                  </span>
                  <span className="text">{views}</span>
                </div>
                <div className="info-section">
                  <span className="icon">
                    <PiTimerThin />
                  </span>
                  <span className="text">{upDate}</span>
                </div>
                {isAdminPage && (
                  <div className="info-section">
                    <span className="icon">
                      {isApproved ? <FcCheckmark /> : <FcCancel />}
                    </span>
                    <span className="text">
                      {isApproved ? 'Approved' : 'Not Approved'}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <footer className="actions">
              <div className="info-section">
                <span className="icon">
                  <PiUserCircleThin />
                </span>
                <span className="text">{createdBy.username}</span>
              </div>
              <Link
                to={`/dashboard/edit-trend/${slug}`}
                className="edit-btn"
                onClick={handleInnerClick}
              >
                <CiEdit />
              </Link>
              {isAdminPage &&
                (isApproved ? (
                  <button
                    className="btn danger-btn"
                    onClick={(e) => {
                      handleInnerClick(e);
                      onDelete(slug);
                    }}
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    className="btn action-btn"
                    onClick={(e) => {
                      handleInnerClick(e);
                      onApprove(slug);
                    }}
                  >
                    Approve
                  </button>
                ))}
            </footer>
          </div>
        </div>
      </header>
    </Container>
  );
}

export default TrendLarge;
