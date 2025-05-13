import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PiHashLight, PiEyeLight, PiTrendUp } from 'react-icons/pi';
import { BsFillBookmarkFill, BsBookmark } from 'react-icons/bs';
import { IoIosCloseCircle } from 'react-icons/io';
import { RiEdit2Fill } from 'react-icons/ri';
import { MdDelete } from 'react-icons/md';
import { FaSquareCheck, FaSquarePlus } from 'react-icons/fa6';
import { githubFullUrl } from '../utils/urlHelper';
import { getFullIconUrl } from '../utils/urlHelper';
import {
  Loading,
  Tooltip,
  UserImgSmall,
  AddTrendModal,
  TrendFlashChart,
  TrendFallFlashChart,
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
  guestUser,
  isLoading,
  createdBy,
  trendTech,
  onApprove,
  trendDesc,
  isApproved,
  isFeatured,
  isGridView,
  flashChart,
  chartHeight,
  savedTrends,
  techIconUrl,
  isAdminPage,
  relatedFlag,
  relatedStyle,
  featuredFlag,
  isMobileTrend,
  trendCategory,
  chartMarginTop,
  onApproveManual,
  chartMarginBottom,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isSaved, setIsSaved] = useState(savedTrends?.includes(_id));
  const navigate = useNavigate();
  const isDeleted = createdBy?.isDeleted; //for deleted user
  const githubUrl = createdBy?.githubUsername
    ? `${githubFullUrl()}${createdBy.githubUsername}`
    : null; //creating the github url of user who created trend

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  //const handleCardClick = () => navigate(`/dashboard/trend/${slug}`);
  const handleCardClick = async () => {
    if (guestUser) {
      await guestUser();
      navigate(`/dashboard/trend/${slug}`);
    } else {
      navigate(`/dashboard/trend/${slug}`);
    }
  };
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
          <div className={featuredFlag || relatedFlag ? 'info-mini' : 'info'}>
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
              <TrendFallFlashChart
                chartHeight={chartHeight}
                chartMarginTop={chartMarginTop}
                chartMarginBottom={chartMarginBottom}
              />
            )}
            <div className="trend-title">
              <h4 className="underlay-heading">
                {trend.length > (isMobileTrend ? 18 : 21)
                  ? trend.substring(0, isMobileTrend ? 11 : 21) + '...'
                  : trend}
              </h4>
              <div className="description-container">
                <h6 className="underlay-heading">{trendCategory}</h6>
                {!isGridView && trendDesc && trendDesc.trim() && (
                  <div className="trend-desc">
                    <p className="">
                      {trendDesc.length > 60
                        ? trendDesc.substring(0, 60) + '...'
                        : trendDesc}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <footer className="bottom-row">
            {(isApproved || !(isMobileTrend && isAdminPage && isGridView)) && (
              <div className="user-icon">
                <UserImgSmall
                  isDeleted={isDeleted}
                  user_img={createdBy.profile_img}
                  githubUrl={githubUrl}
                />
              </div>
            )}
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
                    {!isGridView && (
                      <h5>{trendTech.split(' ').slice(0, 2).join(' ')}</h5>
                    )}
                  </span>
                ) : (
                  <span></span>
                )}
              </span>
            </div>
            <div className="actions">
              {!(isMobileTrend && isAdminPage && isGridView) && (
                <div className="icon-views">
                  <PiEyeLight />
                  <span>{views}</span>
                </div>
              )}
              {isAdminPage ? (
                <>
                  <Tooltip description="Edit Trend" xOffset={-90} yOffset={-65}>
                    <Link
                      to={`/dashboard/edit-trend/${slug}`}
                      className="btn-icon edit-btn"
                      onClick={handleInnerClick}
                    >
                      <RiEdit2Fill size={20} />
                    </Link>
                  </Tooltip>
                  {isApproved ? (
                    <Tooltip
                      description="Unapprove Trend"
                      xOffset={-90}
                      yOffset={-65}
                    >
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
                    <>
                      <Tooltip
                        description="Approve Trend"
                        xOffset={-90}
                        yOffset={-65}
                      >
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

                      <Tooltip
                        description="Manual Approve"
                        xOffset={-90}
                        yOffset={-65}
                      >
                        <button
                          className="btn-icon action-btn"
                          onClick={(e) => {
                            handleInnerClick(e);
                            onApproveManual(slug);
                          }}
                        >
                          <FaSquarePlus size={20} />
                        </button>
                      </Tooltip>
                    </>
                  )}
                  <Tooltip
                    description="Delete Trend"
                    xOffset={-90}
                    yOffset={-65}
                  >
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
                !isFeatured && ( // Check if `isFeatured` is false
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
                )
              )}
            </div>
          </footer>
        </div>
      </header>
    </Container>
  );
}

export default TrendSmall;
