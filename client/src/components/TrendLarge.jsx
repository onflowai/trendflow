import React from 'react';
import { Link } from 'react-router-dom';
import {
  FcElectricity,
  FcCalendar,
  FcApproval,
  FcCheckmark,
  FcCancel,
} from 'react-icons/fc';
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
  trend,
  trendTech,
  trendCategory,
  trendDesc,
  updatedAt,
  isLoading,
  upDate,
  interestOverTime,
  isAdminPage,
  onApprove,
  createdBy,
  isApproved,
}) {
  // const upDate = day(updatedAt).format('MM YYYY');
  // const isLoading = loadingSlug === slug; // determining if this specific trend is loading
  return (
    <Container>
      {console.log(interestOverTime)}
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
            <div className="content">
              <div className="content-center">
                {/* Inline the icon and text presentation */}
                <div className="info-section">
                  <span className="icon">
                    <FcElectricity />
                  </span>
                  <span className="text">{trendTech}</span>
                </div>
                <div className="info-section">
                  <span className="icon">
                    <FcCalendar />
                  </span>
                  <span className="text">{upDate}</span>
                </div>
                <div className="info-section">
                  <span className="icon">
                    <FcApproval />
                  </span>
                  <span className="text">{createdBy.username}</span>
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
              <footer className="actions">
                <Link to={`/dashboard/trend/${slug}`} className="btn info-btn">
                  {trend}
                </Link>
                <Link
                  to={`/dashboard/edit-trend/${slug}`}
                  className="btn info-btn"
                >
                  Edit
                </Link>
                {isAdminPage &&
                  (isApproved ? (
                    <button
                      className="btn danger-btn"
                      onClick={() => onRemove(slug)}
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      className="btn info-btn"
                      onClick={() => onApprove(slug)}
                    >
                      Approve
                    </button>
                  ))}
              </footer>
            </div>
          </div>
        </div>
      </header>
    </Container>
  );
}

export default TrendLarge;
