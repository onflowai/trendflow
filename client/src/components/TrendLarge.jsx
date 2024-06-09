import { React, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BsFillBookmarkFill, BsBookmark } from 'react-icons/bs';
import { LiaClock } from 'react-icons/lia';
import { RiEdit2Fill } from 'react-icons/ri';
import { FaSquareCheck } from 'react-icons/fa6';
import { PiHashLight, PiEyeLight, PiTrendUp } from 'react-icons/pi'; //PiEyeThin
import { RiDeleteBin2Fill } from 'react-icons/ri';
import { IoIosCloseCircle } from 'react-icons/io';
import { MdDelete } from 'react-icons/md';
import { CgClose } from 'react-icons/cg';
import {
  TrendChartComponent,
  Loading,
  UserImgSmall,
  Tooltip,
} from '../components';
import Container from '../assets/wrappers/TrendLargeContainer';
import day from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
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
  createdBy,
  isApproved,
}) {
  // console.log('ID____: ', _id);
  const [isHovered, setIsHovered] = useState(false);
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  const navigate = useNavigate(); // Use navigate for navigation
  const [isSaved, setIsSaved] = useState(savedTrends?.includes(_id)); // checking if the current trend is saved
  const navigateToTrend = () => {
    navigate(`/dashboard/trend/${slug}`);
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
              <h3 className="mono-heading-bold">{trend}</h3>
              <h6 className="mono-heading">{trendCategory}</h6>
            </div>
            <div className="description-container">
              <h5 className="description">
                {trendDesc.length > 80
                  ? trendDesc.substring(0, 80) + '...'
                  : trendDesc}
              </h5>
            </div>
            {/* INFO SECTION */}
            <div className="content">
              <div className="content-center">
                {/* Inline the icon and text presentation */}
                <div className="info-section">
                  <span className="icon">
                    <PiHashLight />
                  </span>
                  <span className="trend-item">
                    {trendTech.split(' ').slice(0, 2).join(' ')}
                  </span>
                </div>
                <div className="info-section">
                  <span className="icon">
                    <PiTrendUp />
                  </span>
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
                <UserImgSmall user_img={createdBy.profile_img} />
                <span className="username">{createdBy.username}</span>
              </div>
              <div className="admin-buttons">
                {isAdminPage ? (
                  <Tooltip description="Edit Trend">
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
                        <Tooltip description="Remove Trend">
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
                        <Tooltip description="Delete Trend">
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
                        <Tooltip description="Approve Trend">
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
                        <Tooltip description="Delete Trend">
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
