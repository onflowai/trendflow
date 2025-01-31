import React, { useState } from 'react';
import styled from 'styled-components';
import Select from 'react-select';
import { FaFilter } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { LuSearch } from 'react-icons/lu';
import { MdOutlineFilterAltOff } from 'react-icons/md';
import { AiFillCloseSquare } from 'react-icons/ai';
import Container from '../assets/wrappers/FilterSmallContainer.js';
/**
 *
 */
const TOP_RATED_OPTIONS = [
  { label: 'Top Rated Now', value: 'topRatedNow' },
  { label: 'Top Rated Year', value: 'topRatedYear' },
  { label: 'Top Rated Month', value: 'topRatedMonth' },
];
const TOP_VIEWED_OPTIONS = [
  { label: 'Top Viewed Now', value: 'topViewedNow' },
  { label: 'Top Viewed Year', value: 'topViewedYear' },
  { label: 'Top Viewed Month', value: 'topViewedMonth' },
];

function FilterTrendsSmall({
  trendCategory = [],
  technologies = [],
  isClosed,
  setIsClosed,
  onFiltersApply,
  resetFilters,
}) {
  const [topRated, setTopRated] = useState(''); //topRated only one selection each or empty string
  const [topViewed, setTopViewed] = useState(''); //topViewed only one selection each or empty string
  const [selectedTech, setSelectedTech] = useState(null); // single select tech
  const [selectedCategory, setSelectedCategory] = useState(null); //single select category
  const [showTechSelect, setShowTechSelect] = useState(false); //toggle for showing the tech <Select> search dropdown

  const techOptions = technologies.map((tech) => ({
    value: tech.label,
    label: tech.label,
    image: tech.image,
  }));
  const categoryOptions = trendCategory.map((cate) => ({
    value: cate.label,
    label: cate.label,
    image: cate.image,
  }));

  const updateFilters = (newState = {}) => {
    onFiltersApply({
      topRated: newState.hasOwnProperty('topRated')
        ? newState.topRated
        : topRated,
      topViewed: newState.hasOwnProperty('topViewed')
        ? newState.topViewed
        : topViewed,
      trendTech: newState.hasOwnProperty('selectedTech')
        ? newState.selectedTech
          ? newState.selectedTech.value
          : ''
        : selectedTech
        ? selectedTech.value
        : '',
      trendCategory: newState.hasOwnProperty('selectedCategory')
        ? newState.selectedCategory
          ? newState.selectedCategory.value
          : ''
        : selectedCategory
        ? selectedCategory.value
        : '',
    }); // if newState has topRated/topViewed use them else fallback to current state
  }; // helper calling to onFiltersApply with the latest states

  const handleTopRatedClick = (value) => {
    const newValue = topRated === value ? '' : value;
    setTopRated(newValue);
    updateFilters({ topRated: newValue });
  }; //handle for topRated / topViewed (user clicks the same value it toggles it off)

  const handleTopViewedClick = (value) => {
    const newValue = topViewed === value ? '' : value;
    setTopViewed(newValue);
    updateFilters({ topViewed: newValue });
  }; // user clicks the same value toggle it off

  const handleTechChange = (option) => {
    setSelectedTech(option);
    updateFilters({ selectedTech: option });
  }; //tech handler

  const handleSelectTechFromCarousel = (techLabel) => {
    const found = techOptions.find((t) => t.value === techLabel);
    setSelectedTech(found || null);
    updateFilters({ selectedTech: found || null });
  };

  const removeSelectedTech = () => {
    setSelectedTech(null);
    updateFilters({ selectedTech: null });
  };

  const handleCategoryChange = (option) => {
    setSelectedCategory(option);
    updateFilters({ selectedCategory: option });
  }; //handler for category

  const removeSelectedCategory = () => {
    setSelectedCategory(null);
    updateFilters({ selectedCategory: null });
  };

  const handleResetAll = async () => {
    setTopRated('');
    setTopViewed('');
    setSelectedTech(null);
    setSelectedCategory(null);

    await resetFilters();

    onFiltersApply({
      topRated: '',
      topViewed: '',
      trendTech: '',
      trendCategory: '',
    });
  };

  const hasAnySelected =
    topRated || topViewed || selectedTech || selectedCategory;

  if (isClosed) {
    return (
      <FilterIconContainer>
        <div className="filter-toggle">
          <div className="filter-icon" onClick={() => setIsClosed(false)}>
            <FaFilter className="icon" size={24} />
          </div>
        </div>
      </FilterIconContainer>
    );
  }

  return (
    <Container>
      <button className="close-button" onClick={() => setIsClosed(true)}>
        <AiFillCloseSquare size={22} />
      </button>
      <div className="selected-filters">
        {topRated && (
          <div className="filter-pill">
            <span>{topRated}</span>
            <button onClick={() => handleTopRatedClick(topRated)}>
              <IoClose size={16} />
            </button>
          </div>
        )}
        {topViewed && (
          <div className="filter-pill">
            <span>{topViewed}</span>
            <button onClick={() => handleTopViewedClick(topViewed)}>x</button>
          </div>
        )}
        {selectedTech && (
          <div className="filter-pill">
            <img src={selectedTech.image} alt={selectedTech.label} />
            <button onClick={removeSelectedTech}>x</button>
          </div>
        )}
        {selectedCategory && (
          <div className="filter-pill">
            <img src={selectedCategory.image} alt={selectedCategory.label} />
            <button onClick={removeSelectedCategory}>x</button>
          </div>
        )}
        {hasAnySelected && (
          <button className="reset-filter-btn" onClick={handleResetAll}>
            <MdOutlineFilterAltOff size={19} />
          </button>
        )}
      </div>
      <div className="available-filters">
        <div className="basic-filters">
          {TOP_RATED_OPTIONS.map((option) => (
            <button
              key={option.value}
              className="basic-filter-btn"
              onClick={() => handleTopRatedClick(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
        <div className="basic-filters">
          {TOP_VIEWED_OPTIONS.map((option) => (
            <button
              key={option.value}
              className="basic-filter-btn"
              onClick={() => handleTopViewedClick(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
        <div className="tech-carousel-wrapper">
          <div className="tech-carousel">
            {technologies.map((tech) => (
              <div
                key={tech.label}
                className="tech-item"
                onClick={() => handleSelectTechFromCarousel(tech.label)}
              >
                <img src={tech.image} alt={tech.label} />
              </div>
            ))}
            <div className="fade-overlay"></div>
          </div>
          <button
            className="search-button"
            onClick={() => setShowTechSelect(!showTechSelect)}
          >
            <LuSearch size={24} />
          </button>
        </div>
        {showTechSelect && (
          <div className="tech-select">
            <Select
              value={selectedTech}
              onChange={handleTechChange}
              options={techOptions}
              isClearable
              styles={customStyles}
              placeholder="Search"
              getOptionLabel={(option) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img
                    src={option.image}
                    alt={option.label}
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      marginRight: 8,
                    }}
                  />
                  {option.label}
                </div>
              )}
            />
          </div>
        )}
        <div className="category-select">
          <Select
            value={selectedCategory}
            onChange={handleCategoryChange}
            options={categoryOptions}
            styles={customStyles}
            isClearable
            placeholder="Category"
            getOptionLabel={(option) => (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img
                  src={option.image}
                  alt={option.label}
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    marginRight: 8,
                  }}
                />
                {option.label}
              </div>
            )}
          />
        </div>
      </div>
    </Container>
  );
}

const FilterIconContainer = styled.div`
  .filter-toggle {
  border-radius: none;
  border: none;
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-icon {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(45deg, var(--primary-600), var(--primary2-400));
  border-radius: var(--border-radius);
  padding: 10px;
  cursor: pointer;
  transition: background 0.3s ease-in-out;
}

.filter-icon:hover {
  background: linear-gradient(45deg, var(--primary-700), var(--primary-500));
}

.icon {
  color: var(--white);
}
`;

const customStyles = {
  control: (styles) => ({
    ...styles,
    borderRadius: 'var(--input-radius-rounded)',
    border: '1.5px solid var(--grey-70)',
    backgroundColor: 'var(--selector-main-color)',
  }),
  menu: (styles) => ({
    ...styles,
    borderRadius: '10px',
    marginTop: '0px', // Adjust the top margin to reduce or eliminate the gap
    backgroundColor: 'var(--selector-dropdown-main-color)',
  }),
  menuList: (styles) => ({
    ...styles,
    paddingTop: '0px', // Reduce or eliminate padding at the top of the menu list
    paddingBottom: '0px', // Adjust bottom padding if needed
    // Further adjust spacing to ensure the dropdown fits snugly against the control
  }),
  option: (styles, { isFocused, isSelected }) => ({
    ...styles,
    backgroundColor: isSelected
      ? 'var(--primary-200)'
      : isFocused
      ? 'var(--primary-50)'
      : null,
    color: isSelected
      ? 'var(--text-color)'
      : isFocused
      ? 'var(--text-color)'
      : 'var(--text-color)',
    ':first-of-type': {
      borderTopLeftRadius: '10px',
      borderTopRightRadius: '10px',
    },
    ':last-of-type': {
      borderBottomLeftRadius: '10px',
      borderBottomRightRadius: '10px',
    },
  }),
  singleValue: (styles) => ({
    ...styles,
    color: 'var(--text-color)',
  }),
};

export default FilterTrendsSmall;
