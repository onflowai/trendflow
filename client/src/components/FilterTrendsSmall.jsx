import React, { useState } from 'react';
import styled from 'styled-components';
import Select from 'react-select';
import { FaFilter } from 'react-icons/fa';
import { AiOutlineClose } from 'react-icons/ai';
import { LuSearch } from 'react-icons/lu';
import Container from '../assets/wrappers/FilterSmallContainer.js';

function FilterTrendsSmall({
  trendCategory = [],
  technologies = [],
  isClosed,
  setIsClosed,
  onFiltersApply,
  resetFilters,
}) {
  const basicFilters = [
    'rated now',
    'rated year',
    'rated month',
    'views now',
    'views year',
    'views month',
  ];

  const [selectedBasicFilters, setSelectedBasicFilters] = useState([]);
  const [selectedTech, setSelectedTech] = useState(null); // single tech
  const [selectedCategory, setSelectedCategory] = useState(null); // single category
  const [showTechSelect, setShowTechSelect] = useState(false);

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

  const hasAnySelected =
    selectedBasicFilters.length > 0 || selectedTech || selectedCategory;

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
        <AiOutlineClose size={16} />
      </button>
      <div className="selected-filters">
        {/* Basic text filters */}
        {selectedBasicFilters.map((filter) => (
          <div key={filter} className="filter-pill">
            <span>{filter}</span>
            <button onClick={() => handleRemoveBasicFilter(filter)}>x</button>
          </div>
        ))}
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
            Reset Filter
          </button>
        )}
      </div>
      <div className="available-filters">
        <div className="basic-filters">
          {basicFilters.map((filter) => (
            <button
              key={filter}
              className="basic-filter-btn"
              onClick={() => handleSelectBasicFilter(filter)}
            >
              {filter}
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
            isClearable
            placeholder="Choose Category..."
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

export default FilterTrendsSmall;
