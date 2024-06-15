import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PiHashLight, PiEyeLight, PiTrendUp } from 'react-icons/pi';
import { BsFillBookmarkFill, BsBookmark } from 'react-icons/bs';
import { IoIosCloseCircle } from 'react-icons/io';
import { RiEdit2Fill } from 'react-icons/ri';
import { MdDelete } from 'react-icons/md';
import { FaSquareCheck } from 'react-icons/fa6';
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
  trend,
  views,
  trendTech,
  trendCategory,
  slug,
  upDate,
  onSave,
  onRemove,
  savedTrends,
  flashChart,
  updatedAt,
  isLoading,
  isApproved,
  isAdminPage,
  createdBy,
  onApprove,
  isGridView,
  trendDesc,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isSaved, setIsSaved] = useState(savedTrends?.includes(_id));
  const navigate = useNavigate();

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
    <Container onClick={handleCardClick}>
      <header className="trend-small-card">
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
            <div className="trend-title">
              <h4 className="mono-heading-bold">{trend}</h4>
              <h6 className="mono-heading">{trendCategory}</h6>
              {!isGridView && (
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
              <UserImgSmall user_img={createdBy.profile_img} />
            </div>
            <div className="bottom-info">
              <span className="info-item">
                {!isAdminPage ? (
                  <span className="icon-tech">
                    <PiHashLight />
                    {trendTech.split(' ').slice(0, 2).join(' ')}
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
