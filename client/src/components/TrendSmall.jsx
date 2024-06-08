import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PiHashLight, PiEyeLight, PiTrendUp } from 'react-icons/pi';
import { BsFillBookmarkFill, BsBookmark } from 'react-icons/bs';
import {
  TrendFlashChart,
  Loading,
  TrendFallFlashChart,
  UserImgSmall,
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
                  <p>
                    {trendDesc.length > 60
                      ? trendDesc.substring(0, 60) + '...'
                      : trendDesc}
                  </p>
                </div>
              )}
            </div>
          </div>
          <footer className="bottom-row">
            <div className="bottom-info">
              <div className="user-icon">
                <UserImgSmall user_img={createdBy.profile_img} />
              </div>
              <span className="info-item">
                <PiHashLight />
                <span>{trendTech}</span>
              </span>
              <span className="info-item">
                <PiEyeLight />
                <span>{views}</span>
              </span>
              <span className="bookmark-btn" onClick={handleBookmarkClick}>
                {isSaved || isHovered ? (
                  <BsFillBookmarkFill size="20px" />
                ) : (
                  <BsBookmark size="20px" />
                )}
              </span>
            </div>
          </footer>
        </div>
      </header>
    </Container>
  );
}

export default TrendSmall;
