import React from 'react';
import { Link } from 'react-router-dom';
import {
  FcElectricity,
  FcCalendar,
  FcApproval,
  FcCheckmark,
  FcCancel,
} from 'react-icons/fc';
import { TrendFlashChart, Loading, TrendFallFlashChart } from '../components';
import Container from '../assets/wrappers/TrendSmallContainer';
import day from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
day.extend(advancedFormat);
/**
 * This component is used in the mobile screens with less info, data is passed from Trend.jsx
 * @returns
 */
function TrendSmall({
  trend,
  trendTech,
  trendCategory,
  slug,
  upDate,
  flashChart,
  updatedAt,
  isLoading,
  isApproved,
  isAdminPage,
  onApprove,
}) {
  return (
    <Container>
      <header>
        <div className="overlay">
          <div className="info">
            {isLoading && (
              <div className="loading-styling">
                <Loading />
              </div>
            )}
            {isApproved ? (
              <TrendFlashChart data={flashChart} />
            ) : (
              <TrendFallFlashChart />
            )}
            <p>{trendCategory}</p>
            <div className="content">
              <div className="content-center">
                {/* Inline the icon and text presentation */}
                <div className="info-section">
                  <span className="icon">
                    <FcElectricity />
                  </span>
                  <span className="text">{trendTech}</span>
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

export default TrendSmall;
