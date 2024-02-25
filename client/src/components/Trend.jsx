import React from 'react';
import { FcElectricity, FcCalendar, FcApproval } from 'react-icons/fc';
import { Link } from 'react-router-dom';
import Container from '../assets/wrappers/Trend';
import day from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
day.extend(advancedFormat);
/**
 * Trend displays a trend
 *
 * @returns
 */
function Trend({
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
      <header>
        <div className="main-icon">{trend.charAt(0)}</div>
        <div className="info">
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
                <span className="text">{createdBy}</span>
              </div>
            </div>
            <footer className="actions">
              <Link className="btn info-btn">{trend}</Link>
            </footer>
          </div>
        </div>
      </header>
    </Container>
  );
}

export default Trend;
