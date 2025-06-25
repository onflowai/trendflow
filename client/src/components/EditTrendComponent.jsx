import React, { useState } from 'react';
import openSourceLogo from '../assets/images/open-source-fill.svg';
import partialLogo from '../assets/images/open-source.svg';
import closedLogo from '../assets/images/open-source-fill-grey.svg';
import unknownLogo from '../assets/images/open-source-grey.svg';
import {
  ToggleSlider,
  FormSelector,
  FallbackChart,
  FormComponent,
  FormComponentLock,
  ChartEditTrendComponent,
} from '.';
import { Form, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { BsPlusLg, BsCheck2 } from 'react-icons/bs';
import { PiFileSvgFill } from 'react-icons/pi';
import { IoLockClosed } from 'react-icons/io5';
import { RxUpdate } from 'react-icons/rx';

const EditTrendComponent = ({
  svgUrl,
  trendObject,
  isSubmitting,
  selectedTech,
  trendTechList,
  setSelectedTech,
  handleSVGChange,
  selectedCategory,
  openSourceStatus,
  trendCategoryList,
  handleManualUpdate,
  handleApproveClick,
  setOpenSourceStatus,
  setSelectedCategory,
  handleManualApprove,
}) => {
  const navigate = useNavigate();
  const navigateToTrend = () => {
    navigate(`/dashboard/trend/${trendObject.slug}`);
  };
  console.log('trendObject', trendObject);
  console.log('trendObject in openSourceStatus', openSourceStatus);
  const [trend, setTrend] = useState(trendObject.trend);
  const openSourceOptions = [
    { label: 'Open', value: 'open', icon: openSourceLogo },
    { label: 'Partial', value: 'partial', icon: partialLogo },
    { label: 'Closed', value: 'closed', icon: closedLogo },
    { label: 'Unknown', value: 'unknown', icon: unknownLogo },
  ];
  return (
    <Container>
      <Form method="post" className="">
        <div className="">
          <div className="edit-trend-content">
            <div className="edit-trend">
              <div className="add-svg">
                <label htmlFor="svgFile" className="svg-upload-label">
                  {svgUrl ? (
                    <div className="svg-display">
                      <img
                        src={svgUrl}
                        alt="Uploaded SVG"
                        className="uploaded-svg"
                      />
                      <PiFileSvgFill className="svg-upload-icon overlay-icon" />
                    </div>
                  ) : (
                    <PiFileSvgFill className="svg-upload-icon" />
                  )}
                  <input
                    type="file"
                    id="svgFile"
                    accept=".svg"
                    onChange={handleSVGChange}
                    className="svg-upload-input"
                  />
                </label>
              </div>
              {trendObject.isApproved ? (
                <div className="button-group">
                  <button
                    type="button"
                    className="circle-button"
                    onClick={handleManualUpdate}
                  >
                    <RxUpdate className="circle-button-icon" />
                  </button>
                </div>
              ) : (
                <div className="button-group">
                  <div>
                    <button
                      type="button"
                      className="circle-button"
                      onClick={handleApproveClick}
                    >
                      <BsCheck2 className="circle-button-icon" />
                    </button>
                  </div>
                  <div>
                    <button
                      type="button"
                      className="circle-button"
                      onClick={handleManualApprove}
                    >
                      <BsPlusLg className="circle-button-icon" />
                    </button>
                  </div>
                </div>
              )}
              <div className="trend-input-container">
                {trendObject.isApproved ? (
                  <>
                    <FormComponentLock
                      type="text"
                      defaultValue={trendObject.trend}
                    />
                  </>
                ) : (
                  <>
                    <FormComponent
                      type="text"
                      name="trend"
                      value={trend}
                      onChange={(e) => setTrend(e.target.value)}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <div>
          {trendObject.isApproved ? (
            <ChartEditTrendComponent
              data={trendObject.interestOverTime}
              forecast={trendObject.forecast}
            />
          ) : (
            <FallbackChart />
          )}
        </div>
        <div className="content">
          <div className="content-selectors">
            <div className="selector">
              {trendObject.isApproved ? (
                <div className="select-locked-input-container">
                  <IoLockClosed className="select-lock-icon" />
                  <div className="locked-input">
                    <p>{trendObject.trendCategory}</p>
                  </div>
                </div>
              ) : (
                <>
                  <FormSelector
                    className="form-selector"
                    name="trendCategory"
                    value={selectedCategory} // parent's string state
                    list={trendCategoryList} // e.g. an array of {label, value}
                    onChange={(name, val) => setSelectedCategory(val)}
                  />
                </>
              )}
            </div>
            <div className="selector">
              {trendObject.isApproved ? (
                <div className="select-locked-input-container">
                  <IoLockClosed className="select-lock-icon" />
                  <div className="locked-input">
                    <p>{trendObject.trendTech}</p>
                  </div>
                </div>
              ) : (
                <>
                  <FormSelector
                    className="form-selector"
                    name="trendTech"
                    value={selectedTech}
                    list={trendTechList}
                    onChange={(name, val) => setSelectedTech(val)}
                  />
                </>
              )}
            </div>
          </div>
          <div id="Edit"></div>
          <div className="form-actions">
            <div className="toggle-slider-container">
              <ToggleSlider
                options={openSourceOptions}
                value={openSourceStatus}
                onChange={setOpenSourceStatus}
              />
              <input
                type="hidden"
                name="openSourceStatus"
                value={openSourceStatus}
              />
            </div>
            <div className="submit-btn">
              {trendObject.isApproved ? (
                <button
                  onClick={navigateToTrend}
                  className="btn btn-block from-btn"
                  style={{ marginLeft: 'auto' }}
                >
                  View Trend
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn btn-block from-btn"
                  disabled={isSubmitting}
                  style={{ marginLeft: 'auto' }}
                >
                  {isSubmitting ? 'editing...' : 'edit'}
                </button>
              )}
            </div>
          </div>
        </div>
      </Form>
    </Container>
  );
};

const Container = styled.div`
  .form-label{
    display: none;
  }
  .form-center {
    display: flex;
  align-items: center;
  }
  .circle-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid var(--grey-50);
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-left: 0.5rem; /* Optional spacing between your two buttons */
}
.circle-button svg {
  color: var(--black);
}

.circle-button:hover {
  background-color: var(--grey-50);
}

.circle-button .circle-button-icon {
  font-size: 1.25rem;        
  transition: color 0.3s ease;
}

.circle-button:hover .circle-button-icon {
  color: var(--primary-900);
}

  .form-edit-container {
    display: flex;
    flex-direction: column;
    align-items: left;
    gap: 1rem;
  } /* overriding global styling */

  .edit-trend-content {
    display: flex;
    align-items: center;
  }

  .edit-trend {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 0.1rem;
  }

  .add-svg {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1.5px solid var(--grey-50);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .add-svg:hover {
    background-color: var(--grey-50);
  }

  .svg-upload-label {
    display: inline-block;
    cursor: pointer;
    position: relative;
  }

  .svg-display {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    overflow: hidden;
  }

  .uploaded-svg {
    width: 30px;
    height: 30px;
    object-fit: cover;
    margin: auto;
  }

  .overlay-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 16px;
    height: 16px;
    color: rgba(0, 0, 0, 0);
    pointer-events: none;
  }

  .svg-upload-icon {
    width: 24px;
    height: 24px;
    transition: color 0.3s ease;
  }

  .add-svg:hover .svg-upload-icon {
    color: var(--primary-900);
  }

  .svg-upload-input {
    display: none;
  }

  .button-group {
    display: flex;
    gap: 0.1rem;
    align-items: center;
  }

  .trend-input-container {
    flex: 1; 
    min-width: 0;
    align-items: center;
    margin-left: 0.5rem;
  }
  
  .trend-input-container .form-row {
    width: 100%;
    display: flex;
    align-items: center;
  }
  
  .form-row {
    margin-bottom: 0rem;
  }//removing global styling

  .add-button {
    margin-left: auto;
  }

  .content {
    flex-direction: column;
    gap: 1rem;
  }

  .content-selectors {
    display: flex;
    gap: 1rem;
    justify-content: space-between;
    width: 100%;
  }

  .selector {
    flex: 1;
  }

  .locked-input-container {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%; /* Full width override */
  }
  
  .select-locked-input-container {
    display: flex;
    align-items: center;
    border: 1.5px solid var(--grey-50);
    border-radius: var(--input-radius-rounded);
    padding: 0.5rem;
    background: var(--background-color);
    width: 100%;
  }

  .select-lock-icon {
    margin-right: 0.5rem;
    color: var(--grey-400);
  }

  .locked-input p {
    margin: 0;
    color: var(--text-color);
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
  }
  .btn{
    background-color: var(--white);
  }
  .btn:hover{
    background-color: var(--grey-70);
  }

  .submit-btn {
    margin-top: 1rem;
    margin-bottom: 1rem;
    display: flex;
    justify-content: flex-end;
  }
  
  .toggle-slider-container {
    flex: 1 1 0;
    min-width: 0; /* Allow it to shrink, but not below its content */
    display: flex;
    align-items: center;
  }
  
  @media (max-width: 500px) {
  .form-actions {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }
  .toggle-slider, .submit-btn {
    width: 100%;
  }
}
`;

export default EditTrendComponent;
