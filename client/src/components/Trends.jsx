import React, { useState, useEffect } from 'react'; // Import necessary hooks
import Trend from './Trend';
import Container from '../assets/wrappers/TrendsContainer'; // Styled container
import useLocalStorage from '../hooks/useLocalStorage'; // Custom hook for local storage
import { MdViewStream } from 'react-icons/md'; // Icon for list view
import { BsGrid3X2GapFill } from 'react-icons/bs'; // Icon for grid view
import { TbRectangleFilled } from 'react-icons/tb'; // Icon for large view

function Trends({
  trends,
  onApprove,
  onDelete,
  isAdminPage,
  loadingSlug,
  onSave,
  onRemove,
  savedTrends,
  totalTrends,
  pagesNumber,
  currentPage,
  nextCursor,
  hasNextPage,
}) {
  console.log('trends in component: ', trends);
  //Values used to style recharts in AllTrends & Admin pages
  const chartHeight = 240;
  const chartMarginTop = 5;
  const chartMarginBottom = -40;

  // State for managing grid view with persistence
  const [isGridView, setIsGridView] = useLocalStorage('isGridView', false);
  // State for managing which button is active with persistence
  const [activeButton, setActiveButton] = useLocalStorage(
    'activeButton',
    'grid'
  );
  // State for managing large trend view with persistence
  const [isLargeTrendView, setIsLargeTrendView] = useLocalStorage(
    'isLargeTrendView',
    false
  );

  // Effect to synchronize states based on the active button from local storage
  useEffect(() => {
    if (activeButton === 'grid') {
      setIsGridView(true);
      setIsLargeTrendView(false);
    } else if (activeButton === 'stream') {
      setIsGridView(false);
      setIsLargeTrendView(false);
    } else if (activeButton === 'large') {
      setIsGridView(false);
      setIsLargeTrendView(true);
    }
  }, [activeButton, setIsGridView, setIsLargeTrendView]);

  // Function to handle button clicks and set the respective states
  const handleButtonClick = (view) => {
    setActiveButton(view); // Update the active button state
    if (view === 'grid') {
      setIsGridView(true); // Set grid view on
      setIsLargeTrendView(false); // Set large view off
    } else if (view === 'stream') {
      setIsGridView(false); // Set grid view off
      setIsLargeTrendView(false); // Set large view off
    } else if (view === 'large') {
      setIsGridView(false); // Set grid view off
      setIsLargeTrendView(true); // Set large view on
    }
  };

  // Function to toggle the large screen view
  const toggleLargeScreenView = () => {
    const newView = !isLargeTrendView;
    setIsLargeTrendView(newView); // Toggle large view
    setActiveButton(newView ? 'large' : 'stream'); // Update active button based on the new view
  };

  // Check if there are no trends to display
  if (trends.length === 0) {
    return (
      <Container>
        <h2>NO TRENDS</h2>
      </Container>
    );
  }

  return (
    <Container isGridView={isGridView}>
      {/* Button container for small screens */}
      <div className="toggle-container">
        <button
          className={`view-btn ${activeButton === 'grid' ? 'active' : ''}`}
          onClick={() => handleButtonClick('grid')}
        >
          <BsGrid3X2GapFill size={30} />
        </button>
        <button
          className={`view-btn ${activeButton === 'stream' ? 'active' : ''}`}
          onClick={() => handleButtonClick('stream')}
        >
          <MdViewStream size={30} />
        </button>
        <button
          className={`view-btn ${activeButton === 'large' ? 'active' : ''}`}
          onClick={() => handleButtonClick('large')}
        >
          <TbRectangleFilled size={27} />
        </button>
      </div>
      {/* Button container for large screens */}
      <div className="toggle-container-large">
        <button className="grid-view-btn" onClick={toggleLargeScreenView}>
          {isLargeTrendView ? (
            <BsGrid3X2GapFill size={30} />
          ) : (
            <MdViewStream size={30} />
          )}
        </button>
      </div>
      {/* Trends display */}
      <div className="trends">
        {trends.map((trend) => (
          <Trend
            key={trend._id}
            {...trend}
            onDelete={onDelete}
            onApprove={onApprove}
            isAdminPage={isAdminPage}
            loadingSlug={loadingSlug}
            onSave={onSave}
            onRemove={onRemove}
            savedTrends={savedTrends}
            isGridView={isGridView}
            isLargeTrendView={isLargeTrendView}
            chartHeight={chartHeight}
            chartMarginTop={chartMarginTop}
            chartMarginBottom={chartMarginBottom}
          />
        ))}
      </div>
    </Container>
  );
}

export default Trends;
