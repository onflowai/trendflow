import React from 'react';
import {
  FcElectricity,
  FcCalendar,
  FcApproval,
  FcCheckmark,
  FcCancel,
} from 'react-icons/fc';
import TrendChart from './TrendChart';
import { Link } from 'react-router-dom';
import Container from '../assets/wrappers/TrendContainer';
import day from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
day.extend(advancedFormat);
/**
 * This component is used by Trends.jsx to display each trend in a trend card with its detail like the chart, trend,
 *
 * @returns
 */
function Trend({
  interestOverTime,
  isAdminPage,
  onApprove,
  createdAt,
  createdBy,
  isApproved,
  slug,
  trend,
  trendCategory,
  trendDesc,
  trendTech,
  _id,
  updatedAt,
}) {
  const upDate = day(updatedAt).format('MM YYYY');

  return (
    <Container>
      {console.log(interestOverTime)}

      <div className="info">
        <TrendChart data={interestOverTime} />
        <h5>{trend}</h5>
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
            <Link to={`/dashboard/edit-trend/${slug}`} className="btn info-btn">
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
    </Container>
  );
}

export default Trend;
