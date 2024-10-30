import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PiHashLight, PiEyeLight, PiTrendUp } from 'react-icons/pi';
import { BsFillBookmarkFill, BsBookmark } from 'react-icons/bs';
import { IoIosCloseCircle } from 'react-icons/io';
import { RiEdit2Fill } from 'react-icons/ri';
import { MdDelete } from 'react-icons/md';
import { FaSquareCheck } from 'react-icons/fa6';
import { githubFullUrl } from '../utils/urlHelper';
import { getFullIconUrl } from '../utils/urlHelper';
import {
  TrendFlashChart,
  Loading,
  TrendFallFlashChart,
  UserImgSmall,
  Tooltip,
} from '../components';
import Container from '../assets/wrappers/TrendSmallContainer';
import day from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
day.extend(advancedFormat);
/**
 * This component is used in the mobile screens with less info, data is passed from Trend.jsx
 * @returns
 */
function TrendSmall({
  _id,
  slug,
  trend,
  views,
  upDate,
  onSave,
  onRemove,
  onDelete,
  updatedAt,
  isLoading,
  createdBy,
  trendTech,
  onApprove,
  trendDesc,
  isApproved,
  isGridView,
  flashChart,
  savedTrends,
  techIconUrl,
  isAdminPage,
  relatedStyle,
  trendCategory,
  chartHeight,
  chartMarginTop,
  chartMarginBottom,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isSaved, setIsSaved] = useState(savedTrends?.includes(_id));
  const navigate = useNavigate();
  const githubUrl = createdBy.githubUsername
    ? `${githubFullUrl()}${createdBy.githubUsername}`
    : null; //creating the github url of user who created trend

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  const handleCardClick = () => navigate(`/dashboard/trend/${slug}`);
  const handleInnerClick = (event) => event.stopPropagation();
  const handleBookmarkClick = async (e) => {
    e.stopPropagation();
    if (isSaved) {
      await onRemove(_id);
      setIsSaved(false); // Update state immediately
    } else {
      await onSave(_id);
      setIsSaved(true); // Update state immediately
    }
  };
  return (
    <Container style={relatedStyle} onClick={handleCardClick}>
      <header className="trend-small-card">
        <div className="overlay">
          <div className="info">
            {isLoading && (
              <div className="loading-styling">
                <Loading />
              </div>
            )}
            {isApproved ? (
              <TrendFlashChart
                data={flashChart}
                chartHeight={chartHeight}
                chartMarginTop={chartMarginTop}
                chartMarginBottom={chartMarginBottom}
              />
            ) : (
              <TrendFallFlashChart />
            )}
            <div className="trend-title">
              <h4 className="mono-heading-bold">
                {trend.length > 21 ? trend.substring(0, 21) + '...' : trend}
              </h4>
              <h6 className="mono-heading">{trendCategory}</h6>
              {!isGridView && trendDesc && trendDesc.trim() && (
                <div className="trend-desc">
                  <p className="mono-heading-thin">
                    {trendDesc.length > 60
                      ? trendDesc.substring(0, 60) + '...'
                      : trendDesc}
                  </p>
                </div>
              )}
            </div>
          </div>
          <footer className="bottom-row">
            <div className="user-icon">
              <UserImgSmall
                user_img={createdBy.profile_img}
                githubUrl={githubUrl}
              />
            </div>
            <div className="bottom-info">
              <span className="info-item">
                {!(isAdminPage && isGridView) ? (
                  <span className="icon-tech">
                    {!techIconUrl ? (
                      <PiHashLight />
                    ) : (
                      <img
                        src={getFullIconUrl(techIconUrl)}
                        alt="Technology Icon"
                        style={{ width: '20px', marginRight: '10px' }}
                      />
                    )}
                    <h5>{trendTech.split(' ').slice(0, 2).join(' ')}</h5>
                  </span>
                ) : (
                  <span></span>
                )}
              </span>
            </div>
            <div className="actions">
              <div className="icon-views">
                <PiEyeLight />
                <span>{views}</span>
              </div>
              {isAdminPage ? (
                <>
                  <Tooltip description="Edit Trend">
                    <Link
                      to={`/dashboard/edit-trend/${slug}`}
                      className="btn-icon edit-btn"
                      onClick={handleInnerClick}
                    >
                      <RiEdit2Fill size={20} />
                    </Link>
                  </Tooltip>
                  {isApproved ? (
                    <Tooltip description="Unapprove Trend">
                      <button
                        className="btn-icon action-btn"
                        onClick={(e) => {
                          handleInnerClick(e);
                          onUnapprove(slug);
                        }}
                      >
                        <IoIosCloseCircle size={20} />
                      </button>
                    </Tooltip>
                  ) : (
                    <Tooltip description="Approve Trend">
                      <button
                        className="btn-icon action-btn"
                        onClick={(e) => {
                          handleInnerClick(e);
                          onApprove(slug);
                        }}
                      >
                        <FaSquareCheck size={20} />
                      </button>
                    </Tooltip>
                  )}
                  <Tooltip description="Delete Trend">
                    <button
                      className="btn-icon btn-icon-danger"
                      onClick={(e) => {
                        handleInnerClick(e);
                        onDelete(slug);
                      }}
                    >
                      <MdDelete size={20} />
                    </button>
                  </Tooltip>
                </>
              ) : (
                <span
                  className="bookmark-btn"
                  onClick={handleBookmarkClick}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  {isSaved || isHovered ? (
                    <BsFillBookmarkFill size="20px" />
                  ) : (
                    <BsBookmark size="20px" />
                  )}
                </span>
              )}
            </div>
          </footer>
        </div>
      </header>
    </Container>
  );
}

export default TrendSmall;
