import React, { useState, useEffect, useRef } from 'react';
import {
  Checkbox,
  FormSelectorIconLocal,
  FormSelectorIconFilter,
  SearchComponentStill,
} from './index.js';
import { toast } from 'react-toastify';
import Container from '../assets/wrappers/FilterTrendsContainer.js';
import { useCombinedContext } from '../context/CombinedContext.jsx';
import { useDashboardContext } from '../pages/DashboardLayout.jsx';
import useLocalStorage from '../hooks/useLocalStorage.jsx';
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
  STATUS,
  ADMIN_STATUS,
  SORT_OPTIONS,
  TIME,
} from '../utils/constants.js';
import { useNavigate, useLocation } from 'react-router-dom'; // Use useNavigate instead of useSubmit

/**
 * Search Trends Large is used in AllTrends & Admin Page. it is used to filter trends using query params which are fetched from
 * frontend as well as backend
 * @returns
 */
function FilterTrendsLarge({
  trendCategory,
  technologies,
  isClosed,
  setIsClosed,
  isAdminPage,
  saveFilters,
  resetFilters,
  onFiltersApply,
}) {
  const { searchValues } = useCombinedContext(); // Context for search parameters
  const navigate = useNavigate(); // updating the URL without form submission
  const location = useLocation(); // getting the current URL parameters
  const isFirstRender = useRef(true); // tracking the first render
  const { showSidebar, toggleSidebar } = useDashboardContext();
  const [isCollapsed, setIsCollapsed] = useLocalStorage('isCollapsed', false); // state to track if the filter is collapsed
  const [isSticky, setIsSticky] = useLocalStorage('isSticky', false); // state to track if the collapsed group is sticky
  const [isArrowBack, setIsArrowBack] = useLocalStorage('isArrowBack', true); //change for side bar button
  // const [isClosed, setIsClosed] = useLocalStorage('isClosed', false);//state to track if the filter is closed
  const [isFilterActive, setIsFilterActive] = useState(false); //filters indicator light
  const [hasSavedFilters, setHasSavedFilters] = useState(false); //tracking if saved filters are loaded or saved
  const handleToggleSidebar = () => {
    toggleSidebar(); // Existing toggle function
    setIsArrowBack(!isArrowBack); // Toggle the arrow state
  };

  const handleStickyToggle = () => {
    setIsSticky(!isSticky);
  };

  // state to track filter values
  const [filterValues, setFilterValues] = useState({
    trendCategory: searchValues.trendCategory || 'all',
    trendTech: searchValues.trendTech || 'all',
    status: searchValues.status || 'all',
    topRated: searchValues.topRated || '', // initializing as empty or from context
    topViewed: searchValues.topViewed || '', // initializing as empty or from context
    updated: searchValues.updated || 'all',
    search: searchValues.search || '',
  });
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const hasUrlParams = [...params.keys()].length > 0;

    const initialValues = {
      trendCategory:
        params.get('trendCategory') || searchValues.trendCategory || 'all',
      trendTech: params.get('trendTech') || searchValues.trendTech || 'all',
      status: hasUrlParams
        ? params.get('status') || 'all'
        : searchValues.status || 'all',
      topRated: hasUrlParams
        ? params.get('topRated') || ''
        : searchValues.topRated || '',
      topViewed: hasUrlParams
        ? params.get('topViewed') || ''
        : searchValues.topViewed || '',
      updated: hasUrlParams
        ? params.get('updated') || 'all'
        : searchValues.updated || 'all',
    };
    setFilterValues((prevValues) => {
      const isDifferent = Object.keys(initialValues).some(
        (key) => prevValues[key] !== initialValues[key]
      ); // updating filterValues only if different from the current state to avoid infinite loop
      return isDifferent ? initialValues : prevValues; // update if there's a difference
    });

    const hasInitialSavedFilters = Object.keys(searchValues).some(
      (key) =>
        searchValues[key] &&
        searchValues[key] !== 'all' &&
        searchValues[key] !== ''
    );
    setHasSavedFilters(hasInitialSavedFilters);
    //onFiltersApply(filterValues);
    isFirstRender.current = false;
  }, [location.search, searchValues]); // dependency array run once on mount

  const [indicatorState, setIndicatorState] = useState({
    trendCategory: searchValues.trendCategory
      ? searchValues.trendCategory !== 'all'
      : false,
    trendTech: searchValues.trendTech
      ? searchValues.trendTech !== 'all'
      : false,
    status: searchValues.status ? searchValues.status !== 'all' : false,
    updated: searchValues.updated ? searchValues.updated !== 'all' : false,
    search: searchValues.search ? searchValues.search !== '' : false,
  });

  // useEffect to update URL params whenever filterValues change
  useEffect(() => {
    const isActive =
      hasSavedFilters &&
      Object.keys(filterValues).some(
        (key) =>
          filterValues[key] &&
          filterValues[key] !== 'all' &&
          filterValues[key] !== ''
      );
    setIsFilterActive(isActive);
    if (!isFirstRender.current) {
      updateQueryParams();
    } // updating URL params only if `filterValues` truly changed
  }, [filterValues, hasSavedFilters]); // dependency array ensures the effect runs on filterValues change

  // Function to handle changes in dropdown and checkbox values
  const handleChange = (name, option) => {
    const value = option ? option.value : 'all';

    const newFilterValues = {
      ...filterValues,
      [name]: filterValues[name] === value ? '' : value, // Toggle off if the value is already set
    };
    setFilterValues(newFilterValues);

    setIndicatorState((prev) => ({
      ...prev,
      [name]: value !== 'all' && value !== '', // Update indicator state
    }));
    onFiltersApply(newFilterValues); // Pass the updated filter values
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

  const handleSave = () => {
    if (
      filterValues.trendCategory === 'all' &&
      filterValues.trendTech === 'all' &&
      filterValues.status === 'all' &&
      !filterValues.topRated &&
      !filterValues.topViewed &&
      filterValues.updated === 'all'
    ) {
      toast.success('No Filters to saved');
      return;
    }
    saveFilters(filterValues);
    setHasSavedFilters(true);
  };

  const handleReset = async () => {
    try {
      // Clear filter values in the state immediately
      setFilterValues({
        trendCategory: 'all',
        trendTech: 'all',
        status: 'all',
        topRated: '',
        topViewed: '',
        updated: 'all',
      });
      setHasSavedFilters(false); // clear the saved filters indicator
      navigate('/dashboard', { replace: true }); // update the URL immediately by removing all query parameters
      await resetFilters(); // synchronize the backend filters reset
      // Add a slight delay to ensure backend sync before re-render
      setTimeout(() => {
        toast.success('Filters reset successfully');
      }, 100);
    } catch (error) {
      toast.error('Failed to reset filters');
      console.error(error);
    }
  };

  const handleSearchChange = (value) => {
    const newFilterValues = {
      ...filterValues,
      search: value,
    };
    setFilterValues(newFilterValues);

    setIndicatorState((prev) => ({
      ...prev,
      search: value !== '',
    }));

    onFiltersApply(newFilterValues);
  };

  const handleSearchClear = () => {
    const newFilterValues = {
      ...filterValues,
      search: '',
    };
    setFilterValues(newFilterValues);

    setIndicatorState((prev) => ({
      ...prev,
      search: false,
    }));

    onFiltersApply(newFilterValues);
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
                          checked={isChecked('topRated', option.value)} // Ensure 'topRated' is checked
                          onChange={() => handleChange('topRated', option)} // Pass the whole option
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
                          checked={isChecked('topViewed', option.value)} // Ensure 'topViewed' is checked
                          onChange={() => handleChange('topViewed', option)} // Pass the whole option
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
                        <FormSelectorIconFilter
                          labelText="Choose Category:"
                          name="trendCategory"
                          defaultValue={filterValues.trendCategory}
                          list={[
                            {
                              value: 'all',
                              label: 'All',
                              image: null,
                              icon: FaInfinity,
                            },
                            ...trendCategory.map((cate) => ({
                              value: cate.label,
                              label: cate.label,
                              image: cate.image,
                            })),
                          ]}
                          onChange={handleChange}
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
                        <FormSelectorIconFilter
                          labelText="Choose Technology:"
                          name="trendTech"
                          defaultValue={filterValues.trendTech}
                          list={[
                            {
                              value: 'all',
                              label: 'All',
                              image: null,
                              icon: FaInfinity,
                            },
                            ...technologies.map((tech) => ({
                              value: tech.label,
                              label: tech.label,
                              image: tech.image,
                            })),
                          ]}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="search">
                      <div className="indicator-container">
                        <div
                          className={`indicator ${
                            indicatorState.search ? 'active' : ''
                          }`}
                        ></div>
                        <SearchComponentStill
                          labelText="Search:"
                          name="search"
                          value={filterValues.search}
                          onChange={(e) => handleSearchChange(e.target.value)}
                          onClear={handleSearchClear}
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
                        {isAdminPage ? (
                          <FormSelectorIconLocal
                            labelText="Status:"
                            name="status"
                            defaultValue={filterValues.status}
                            list={[
                              { value: 'all', label: 'All', icon: FaInfinity },
                              ...Object.values(ADMIN_STATUS),
                            ]}
                            onChange={(name, value) =>
                              handleChange(name, value)
                            }
                          />
                        ) : (
                          <FormSelectorIconLocal
                            labelText="Status:"
                            name="status"
                            defaultValue={filterValues.status}
                            list={[
                              { value: 'all', label: 'All', icon: FaInfinity },
                              ...Object.values(STATUS),
                            ]}
                            onChange={(name, value) =>
                              handleChange(name, value)
                            }
                          />
                        )}
                      </div>
                    </div>
                    <div className="select">
                      <div className="indicator-container">
                        <div
                          className={`indicator ${
                            indicatorState.updated ? 'active' : ''
                          }`}
                        ></div>
                        <FormSelectorIconLocal
                          labelText="Updated:"
                          name="updated"
                          defaultValue={filterValues.updated}
                          list={[
                            { value: 'all', label: 'All', icon: FaInfinity },
                            ...Object.values(TIME),
                          ]}
                          onChange={(name, value) => handleChange(name, value)}
                        />
                      </div>
                      <div className="button-row">
                        <div
                          className={`indicator ${
                            isFilterActive ? 'active' : ''
                          }`}
                        ></div>
                        <div className="save-button">
                          <button
                            className="btn btn-block form-btn"
                            onClick={handleSave}
                          >
                            Save
                          </button>
                        </div>
                        <div className="reset-button">
                          <button
                            className="btn btn-block form-btn"
                            onClick={handleReset}
                          >
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
                          handleChange('topRated', {
                            value: SORT_OPTIONS.TOP_RATED_NOW.value,
                          })
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
                          handleChange('topViewed', {
                            value: SORT_OPTIONS.TOP_VIEWED_NOW.value,
                          })
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
                        <FormSelectorIconFilter
                          labelText="Choose Category:"
                          name="trendCategory"
                          defaultValue={filterValues.trendCategory}
                          list={trendCategory.map((cate) => ({
                            value: cate.label, // Keep value as label for filtering
                            label: cate.label,
                            image: cate.image,
                          }))}
                          onChange={handleChange}
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
                        <FormSelectorIconFilter
                          labelText="Choose Technology:"
                          name="trendTech"
                          defaultValue={filterValues.trendTech}
                          list={technologies.map((tech) => ({
                            value: tech.label, // Keep value as label for filtering
                            label: tech.label,
                            image: tech.image,
                          }))}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="button-row">
                    <div
                      className={`indicator ${isFilterActive ? 'active' : ''}`}
                    ></div>
                    <div className="save-button">
                      <button
                        className="btn btn-block form-btn"
                        onClick={handleSave}
                      >
                        Save
                      </button>
                    </div>
                    <div className="reset-button">
                      <button
                        className="btn btn-block form-btn"
                        onClick={handleReset}
                      >
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

export default FilterTrendsLarge;
