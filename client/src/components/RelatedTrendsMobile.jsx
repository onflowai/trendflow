import React, { useState, useEffect } from 'react';
import Trend from './Trend';
import Container from '../assets/wrappers/RelatedTrendMobile';
import { MdViewStream } from 'react-icons/md';
import { BsGrid3X2GapFill } from 'react-icons/bs';
import { TbRectangleFilled } from 'react-icons/tb';
import useLocalStorage from '../hooks/useLocalStorage';
/**
 * Related Trends Mobile takes on data from TrendPage to display related trends
 * @param {*} relatedTrends
 * @param {*}
 * @returns
 */
const RelatedTrendsMobile = ({
  relatedTrends,
  savedTrends,
  onSave,
  onRemove,
}) => {
  //Values used to style recharts in TrendPage
  const chartHeight = 190;
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
  if (!relatedTrends || relatedTrends.length === 0) {
    return (
      <Container>
        <h2>No Related Trends</h2>
      </Container>
    );
  }
  // Fetch related trends or pass them as props
  return (
    <Container isGridView={isGridView}>
      {/* Button container for switching views */}
      <div className="related-toggle-container">
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
        <div>
          <h4>Related:</h4>
        </div>
      </div>
      <div className="related-trends-mobile">
        {relatedTrends.map((trend) => (
          <Trend
            key={trend._id} // Ensure unique key for each trend
            {...trend} // Spread the trend data as props to the Trend component
            isGridView={isGridView}
            isLargeTrendView={isLargeTrendView}
            chartHeight={chartHeight}
            chartMarginTop={chartMarginTop}
            chartMarginBottom={chartMarginBottom}
            savedTrends={savedTrends}
            onSave={onSave}
            onRemove={onRemove}
          />
        ))}
      </div>
    </Container>
  );
};

export default RelatedTrendsMobile;
