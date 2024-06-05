import React, { useState } from 'react';
import Trend from './Trend';
import Container from '../assets/wrappers/TrendsContainer';
import useLocalStorage from '../hooks/useLocalStorage';
import { MdViewStream } from 'react-icons/md';
import { BsGrid3X2GapFill } from 'react-icons/bs';

/**
 * Trends Component displays all of the Trends in the AllTrends page. Here styling is created for the layout of the trend cards
 * and it is where values from AllTrends and Admin is passed then used in child component trend which displays very single trend
 * @returns
 */

function Trends({
  trends,
  onApprove,
  onDelete,
  isAdminPage,
  loadingSlug,
  onSave,
  onRemove,
  savedTrends,
}) {
  const [isGridView, setIsGridView] = useLocalStorage('isGridView', false); // Use custom hook
  const toggleGridView = () => {
    setIsGridView(!isGridView);
  };
  // console.log('TRENDS:', trends);
  if (trends.length === 0) {
    return (
      <Container>
        <h2>NO TRENDS</h2>
      </Container>
    );
  }
  return (
    <Container isGridView={isGridView}>
      <div className="toggle-container">
        <button className="grid-view-btn" onClick={toggleGridView}>
          {isGridView ? <MdViewStream /> : <BsGrid3X2GapFill />}
        </button>
      </div>
      <div className="trends">
        {trends.map((trend) => {
          return (
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
            ></Trend>
          );
        })}
      </div>
    </Container>
  );
}

export default Trends;
