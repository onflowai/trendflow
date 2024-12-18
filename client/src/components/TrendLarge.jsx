import { React, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BsFillBookmarkFill, BsBookmark } from 'react-icons/bs'; //bookmark
import { LiaClock } from 'react-icons/lia'; //updatedAt icon
import { MdCategory } from 'react-icons/md';
import { useDashboardContext } from '../pages/DashboardLayout.jsx';
import { PiHashLight, PiEyeLight } from 'react-icons/pi'; //views icon & fallback icon
//Status icons
import { PiTrendUp, PiTrendDown } from 'react-icons/pi'; //trending icons, cool-off icons
import {
  HiOutlineArrowLongUp,
  HiOutlineArrowLongRight,
  HiOutlineArrowLongDown,
} from 'react-icons/hi2'; //breakout icon, static icon, arrow down sublevel
//Admin icons
import { RiEdit2Fill } from 'react-icons/ri'; //edit button
import { FaSquareCheck } from 'react-icons/fa6'; //approve trend button
import { IoIosCloseCircle } from 'react-icons/io'; //delete
import { MdDelete } from 'react-icons/md';
import { githubFullUrl } from '../utils/urlHelper';
import { getFullIconUrl } from '../utils/urlHelper';
import {
  TrendChartComponent,
  Loading,
  UserImgSmall,
  Tooltip,
} from '../components';
import Container from '../assets/wrappers/TrendLargeContainer';
import day from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { useTheme } from '../context/ThemeContext';
day.extend(advancedFormat);
/**
 * This component is used in the large screens with more info, data is passed from Trend.jsx
 * @returns
 */
function TrendLarge({
  _id,
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
  onUnapprove,
  onApprove,
  onDelete,
  onSave,
  onRemove,
  savedTrends,
  techIconUrl,
  cateIconUrl,
  createdBy,
  isApproved,
}) {
  const { isDarkTheme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  const navigate = useNavigate(); // Use navigate for navigation
  const [isSaved, setIsSaved] = useState(savedTrends?.includes(_id)); // checking if the current trend is saved
  const githubUrl = createdBy.githubUsername
    ? `${githubFullUrl()}${createdBy.githubUsername}`
    : null; //creating the github url of user who created trend

  const navigateToTrend = () => {
    if (isAdminPage && !isApproved) {
      navigate(`/dashboard/edit-trend/${slug}`);
    } else {
      navigate(`/dashboard/trend/${slug}`);
    }
  };
  const handleInnerClick = (event) => {
    event.stopPropagation(); // stops the click from reaching the container
  };
  const handleBookmarkClick = async (e) => {
    e.stopPropagation(); // Prevent event from propagating further
    if (isSaved) {
      await onRemove(_id);
      setIsSaved(false); // Update isSaved state on successful remove
    } else {
      await onSave(_id);
      setIsSaved(true); // Update isSaved state on successful save
    }
  };
  //STATUS Icons
  const getTrendIcon = (trendStatus) => {
    switch (trendStatus) {
      case 'breakout':
        return <HiOutlineArrowLongUp />;
      case 'trending':
        return <PiTrendUp />;
      case 'cool-off':
        return <PiTrendDown />;
      case 'static':
        return <HiOutlineArrowLongRight />;
      case 'sublevel':
        return <HiOutlineArrowLongDown />;
      default:
        return null; // No icon for undefined and other cases
    }
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
            <TrendChartComponent
              data={interestOverTime}
              isApproved={isApproved}
            />
            <div className="trend-title-container">
              <h3 className="mono-heading-bold">
                {trend.length > 21 ? trend.substring(0, 21) + '...' : trend}
              </h3>
              <div
                className="category-container"
                style={{ display: 'flex', alignItems: 'center' }}
              >
                {cateIconUrl === 'undefined' || !cateIconUrl ? (
                  <MdCategory
                    style={{
                      width: '16px',
                      height: '16px',
                      marginRight: '5px',
                    }}
                  />
                ) : (
                  <img
                    src={getFullIconUrl(cateIconUrl)}
                    alt="Category Icon"
                    style={{
                      width: '17px',
                      height: '17px',
                      marginRight: '5px',
                      backgroundColor: isDarkTheme
                        ? 'var(--off-white)'
                        : 'transparent', // Add white background in dark mode
                      borderRadius: '20%', // Optional: Make the background circular
                      padding: isDarkTheme ? '1px' : '0', // Add some padding for better appearance
                    }}
                  />
                )}
                <h6 className="mono-heading">{trendCategory}</h6>
              </div>
            </div>
            <div className="description-container">
              <h5 className="description">
                {trendDesc.length > 70
                  ? trendDesc.substring(0, 70) + '...'
                  : trendDesc}
              </h5>
            </div>
            {/* INFO SECTION */}
            <div className="content">
              <div className="content-center">
                {/* Inline the icon and text presentation */}
                <div className="info-section">
                  <span className="icon">
                    {techIconUrl === 'undefined' || !techIconUrl ? (
                      <PiHashLight
                        style={{
                          width: '20px',
                          height: '20px',
                        }}
                      />
                    ) : (
                      <img
                        src={getFullIconUrl(techIconUrl)}
                        alt="Category Icon"
                        style={{
                          width: '20px',
                          height: '20px',
                        }}
                      />
                    )}
                  </span>
                  <span className="trend-item">
                    {trendTech.split(' ').slice(0, 2).join(' ')}
                  </span>
                </div>
                <div className="info-section">
                  <span className="icon">{getTrendIcon(trendStatus)}</span>
                  <span className="trend-item">{trendStatus}</span>
                </div>
                <div className="info-section">
                  <span className="icon">
                    <PiEyeLight />
                  </span>
                  <span className="trend-item">{views}</span>
                </div>
                <div className="info-section">
                  <span className="icon">
                    <LiaClock />
                  </span>
                  <span className="trend-item">{upDate}</span>
                </div>
              </div>
            </div>
            {/* USER & BUTTONS */}
            <footer className="actions">
              <div className="user-section">
                <UserImgSmall
                  user_img={createdBy.profile_img}
                  githubUrl={githubUrl}
                />
                <span className="username">{createdBy.username}</span>
              </div>
              <div className="admin-buttons">
                {isAdminPage ? (
                  <Tooltip description="Edit Trend" xOffset={-90} yOffset={-65}>
                    <Link
                      to={`/dashboard/edit-trend/${slug}`}
                      className="btn-icon edit-btn"
                      onClick={handleInnerClick}
                    >
                      <RiEdit2Fill size={25} />
                    </Link>
                  </Tooltip>
                ) : (
                  <Link
                    className="bookmark-btn"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onClick={handleBookmarkClick}
                  >
                    {isSaved || isHovered ? (
                      <BsFillBookmarkFill size="20px" />
                    ) : (
                      <BsBookmark size="20px" />
                    )}
                  </Link>
                )}
                {isAdminPage && (
                  <>
                    {isApproved ? (
                      // When approved, show the delete button and the unapprove button
                      <>
                        <Tooltip
                          description="Remove Trend"
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
                            <IoIosCloseCircle size={25} />
                          </button>
                        </Tooltip>
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
                            <MdDelete size={25} />
                          </button>
                        </Tooltip>
                      </>
                    ) : (
                      // When not approved, show the delete button and the approve button
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
                            <FaSquareCheck size={23} />
                          </button>
                        </Tooltip>
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
                            <MdDelete size={25} />
                          </button>
                        </Tooltip>
                      </>
                    )}
                  </>
                )}
              </div>
            </footer>
          </div>
        </div>
      </header>
    </Container>
  );
}

export default TrendLarge;
