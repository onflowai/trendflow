import React, { useState, useEffect } from 'react';
import { Checkbox, FormSelectorIcon, FormSelector } from '../components';
import Container from '../assets/wrappers/SearchTrendsContainer.js';
import { useCombinedContext } from '../context/CombinedContext.jsx';
import { useDashboardContext } from '../pages/DashboardLayout';
import useLocalStorage from '../hooks/useLocalStorage';
import { FaInfinity } from 'react-icons/fa6';
import { HiMenu } from 'react-icons/hi';
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';
import { FaFilter } from 'react-icons/fa';
import day from 'dayjs';
import {
  AiFillCloseSquare,
  AiFillMinusCircle,
  AiFillDownCircle,
  AiFillUpCircle,
} from 'react-icons/ai';
import {
  TREND_CATEGORY,
  TECHNOLOGIES,
  STATUS,
  SORT_OPTIONS,
  TIME,
} from '../utils/constants.js';
import { useNavigate, useLocation, Link } from 'react-router-dom'; // Use useNavigate instead of useSubmit
/**
 * Search Trends Large is used in AllTrends & Admin Page. it is used to
 * @returns
 */
function SearchTrendsLarge() {
  const { searchValues } = useCombinedContext(); // Context for search parameters
  const navigate = useNavigate(); // updating the URL without form submission
  const location = useLocation(); // getting the current URL parameters
  const { showSidebar, toggleSidebar } = useDashboardContext();
  console.log('showSidebar: ', showSidebar);
  console.log('toggleSidebar: ', toggleSidebar);
  // state to track if the filter is collapsed
  const [isCollapsed, setIsCollapsed] = useLocalStorage('isCollapsed', false);
  // state to track if the collapsed group is sticky
  const [isSticky, setIsSticky] = useLocalStorage('isSticky', false);
  //change for side bar button
  const [isArrowBack, setIsArrowBack] = useLocalStorage('isArrowBack', true);
  //state to track if the filter is closed
  const [isClosed, setIsClosed] = useLocalStorage('isClosed', false);
  const handleToggleSidebar = () => {
    toggleSidebar(); // Existing toggle function
    setIsArrowBack(!isArrowBack); // Toggle the arrow state
  };

  const handleStickyToggle = () => {
    setIsSticky(!isSticky);
  };

  // State to track filter values
  const [filterValues, setFilterValues] = useState({
    trendCategory: searchValues.trendCategory || 'all',
    trendTech: searchValues.trendTech || 'all',
    status: searchValues.status || 'all',
    topRated: searchValues.topRated || '', // initializing as empty or from context
    topViewed: searchValues.topViewed || '', // initializing as empty or from context
    updated: searchValues.updated || 'all',
  });

  const [indicatorState, setIndicatorState] = useState({
    trendCategory: searchValues.trendCategory
      ? searchValues.trendCategory !== 'all'
      : false,
    trendTech: searchValues.trendTech
      ? searchValues.trendTech !== 'all'
      : false,
    status: searchValues.status ? searchValues.status !== 'all' : false,
    updated: searchValues.updated ? searchValues.updated !== 'all' : false,
  });
  console.log('searchValues.trendCategory : ', searchValues.trendCategory);

  // Effect to update URL params whenever filterValues change
  useEffect(() => {
    updateQueryParams();
  }, [filterValues]); // dependency array ensures the effect runs on filterValues change

  // Function to handle changes in dropdown and checkbox values
  const handleChange = (name, value) => {
    setFilterValues((prev) => ({
      ...prev,
      [name]: prev[name] === value ? 'all' : value, // Toggle or set the value
    }));

    setIndicatorState((prev) => ({
      ...prev,
      [name]: value !== 'all', // Update indicator state
    }));
  };

  // Function to update query parameters and navigate
  const updateQueryParams = () => {
    const params = new URLSearchParams(location.search); // preserving other params in the URL

    // Add all filter values to params if they are not empty and not 'all'
    Object.keys(filterValues).forEach((key) => {
      if (filterValues[key] && filterValues[key] !== 'all') {
        params.set(key === 'sort' ? 'sort' : key, filterValues[key]);
      } else {
        params.delete(key); // Remove the param if it's empty or 'all'
      }
    });
    // navigate to the new URL with updated query params
    navigate(`?${params.toString()}`, { replace: true }); // updating the URL without reloading
  };
  const isChecked = (name, value) => filterValues[name] === value; // utility function to check if a checkbox is checked
  const date = new Date().toLocaleDateString();
  const currentDate = day(date).format('MM YYYY');

  return (
    <Container>
      {!isClosed ? (
        <div className="submit-container">
          <div
            className={`filter-app ${isSticky ? 'sticky' : ''} ${
              isSticky && showSidebar ? 'shrink' : ''
            }`}
          >
            <div className="action-buttons">
              <div className="buttons">
                {isCollapsed ? (
                  <AiFillUpCircle
                    size={18}
                    className="icon icon-collapse"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                  />
                ) : (
                  <AiFillDownCircle
                    size={18}
                    className="icon icon-collapse"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                  />
                )}
                <AiFillMinusCircle
                  size={18}
                  className="icon icon-sticky"
                  onClick={handleStickyToggle}
                />
                <AiFillCloseSquare
                  size={19}
                  className="icon icon-close"
                  onClick={() => {
                    if (isSticky) {
                      handleStickyToggle();
                    } else {
                      setIsClosed(true);
                    }
                  }}
                />
                {isSticky &&
                  (window.innerWidth >= 992 ? (
                    isArrowBack ? (
                      <IoIosArrowBack
                        size={19}
                        className="icon icon-sidebar-toggle"
                        onClick={handleToggleSidebar}
                      />
                    ) : (
                      <IoIosArrowForward
                        size={19}
                        className="icon icon-sidebar-toggle"
                        onClick={handleToggleSidebar}
                      />
                    )
                  ) : (
                    <HiMenu
                      size={19}
                      className="icon icon-sidebar-toggle"
                      onClick={toggleSidebar}
                    />
                  ))}
              </div>
            </div>
            {!isCollapsed ? (
              <>
                <div className="checkbox-group">
                  <div className="checkbox">
                    <h5 className="checkbox-label">Top Rated:</h5>
                    {[
                      SORT_OPTIONS.TOP_RATED_NOW,
                      SORT_OPTIONS.TOP_RATED_YEAR,
                      SORT_OPTIONS.TOP_RATED_MONTH,
                    ].map((option) => (
                      <div key={option.value}>
                        <Checkbox
                          checked={isChecked('sort', option.value)}
                          onChange={() => handleChange('sort', option.value)}
                          label={option.label}
                        />
                        <p className="checkbox-description">
                          {option.description}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="checkbox">
                    <h5 className="checkbox-label">Top Viewed:</h5>
                    {[
                      SORT_OPTIONS.TOP_VIEWED_NOW,
                      SORT_OPTIONS.TOP_VIEWED_YEAR,
                      SORT_OPTIONS.TOP_VIEWED_MONTH,
                    ].map((option) => (
                      <div key={option.value}>
                        <Checkbox
                          checked={isChecked('sort', option.value)}
                          onChange={() => handleChange('sort', option.value)}
                          label={option.label}
                        />
                        <p className="checkbox-description">
                          {option.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="select-group">
                  <div className="select-group-one">
                    <div className="select">
                      <div className="indicator-container">
                        <div
                          className={`indicator ${
                            indicatorState.trendCategory ? 'active' : ''
                          }`}
                        ></div>
                        <FormSelectorIcon
                          labelText="Choose Category:"
                          name="trendCategory"
                          defaultValue={filterValues.trendCategory}
                          list={[
                            { value: 'all', label: 'All', icon: FaInfinity },
                            ...Object.values(TREND_CATEGORY),
                          ]}
                          onChange={(name, value) =>
                            handleChange('trendCategory', value)
                          }
                        />
                      </div>
                    </div>
                    <div className="select">
                      <div className="indicator-container">
                        <div
                          className={`indicator ${
                            indicatorState.trendTech ? 'active' : ''
                          }`}
                        ></div>
                        <FormSelectorIcon
                          labelText="Choose Technology:"
                          name="trendTech"
                          defaultValue={filterValues.trendTech}
                          list={[
                            { value: 'all', label: 'All', icon: FaInfinity },
                            ...Object.values(TECHNOLOGIES),
                          ]}
                          onChange={(name, value) =>
                            handleChange('trendTech', value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="select-group-two">
                    <div className="select">
                      <div className="indicator-container">
                        <div
                          className={`indicator ${
                            indicatorState.status ? 'active' : ''
                          }`}
                        ></div>
                        <FormSelectorIcon
                          labelText="Status:"
                          name="status"
                          defaultValue={filterValues.status}
                          list={[
                            { value: 'all', label: 'All', icon: FaInfinity },
                            ...Object.values(STATUS),
                          ]}
                          onChange={(name, value) =>
                            handleChange('status', value)
                          }
                        />
                      </div>
                    </div>
                    <div className="select">
                      <div className="indicator-container">
                        <div
                          className={`indicator ${
                            indicatorState.updated ? 'active' : ''
                          }`}
                        ></div>
                        <FormSelector
                          labelText="Updated:"
                          name="updated"
                          defaultValue={filterValues.updated}
                          list={[
                            TIME.NEWEST,
                            TIME.OLDEST,
                            TIME.NEWEST_MONTH,
                            TIME.NEWEST_YEAR,
                          ]}
                          onChange={(name, value) =>
                            handleChange('updated', value)
                          }
                        />
                      </div>
                      <div className="button-row">
                        <div className="save-button">
                          <button className="btn btn-block form-btn">
                            Save
                          </button>
                        </div>
                        <div className="reset-button">
                          <button className="btn btn-block form-btn">
                            Reset Filter
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="collapsed-group">
                  <div className="checkbox">
                    <h5 className="checkbox-label">Top Rated:</h5>
                    <div>
                      <Checkbox
                        checked={isChecked(
                          'topRated',
                          SORT_OPTIONS.TOP_RATED_NOW.value
                        )}
                        onChange={() =>
                          handleChange(
                            'topRated',
                            SORT_OPTIONS.TOP_RATED_NOW.value
                          )
                        }
                        label={SORT_OPTIONS.TOP_RATED_NOW.label}
                      />
                    </div>
                  </div>
                  <div className="checkbox">
                    <h5 className="checkbox-label">Top Viewed:</h5>
                    <div>
                      <Checkbox
                        checked={isChecked(
                          'topViewed',
                          SORT_OPTIONS.TOP_VIEWED_NOW.value
                        )}
                        onChange={() =>
                          handleChange(
                            'topViewed',
                            SORT_OPTIONS.TOP_VIEWED_NOW.value
                          )
                        }
                        label={SORT_OPTIONS.TOP_VIEWED_NOW.label}
                      />
                    </div>
                  </div>
                  <div className="select-group-one">
                    <div className="select">
                      <div className="indicator-container">
                        <div
                          className={`indicator ${
                            indicatorState.trendCategory ? 'active' : ''
                          }`}
                        ></div>
                        <FormSelectorIcon
                          labelText="Choose Category:"
                          name="trendCategory"
                          defaultValue={filterValues.trendCategory}
                          list={[
                            { value: 'all', label: 'All', icon: FaInfinity },
                            ...Object.values(TREND_CATEGORY),
                          ]}
                          onChange={(name, value) =>
                            handleChange('trendCategory', value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="select-group-one">
                    <div className="select">
                      <div className="indicator-container">
                        <div
                          className={`indicator ${
                            indicatorState.trendTech ? 'active' : ''
                          }`}
                        ></div>
                        <FormSelectorIcon
                          labelText="Choose Technology:"
                          name="trendTech"
                          defaultValue={filterValues.trendTech}
                          list={[
                            { value: 'all', label: 'All', icon: FaInfinity },
                            ...Object.values(TECHNOLOGIES),
                          ]}
                          onChange={(name, value) =>
                            handleChange('trendTech', value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="button-row">
                    <div className="save-button">
                      <button className="btn btn-block form-btn">Save</button>
                    </div>
                    <div className="reset-button">
                      <button className="btn btn-block form-btn">
                        Reset Filter
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="filter-toggle">
          <div className="filter-icon" onClick={() => setIsClosed(false)}>
            <FaFilter className="icon" size={24} />
          </div>
          <div className="line"></div>
          <div className="current-date">{currentDate}</div>
        </div>
      )}
    </Container>
  );
}

export default SearchTrendsLarge;
