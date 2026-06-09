import styled from 'styled-components';

const Container = styled.section`
  border-radius: var(--border-radius);
  border: 1.5px solid var(--grey-50);
  width: 100%;
  max-width: 100%;
  background: var(--white);
  padding: 2rem 2rem 4rem;
  //overflow-x: hidden; //stops random sideways scrolling when editor/content gets spicy

  .clearfix::after {
    content: "";
    display: table;
    clear: both;
  }

  .user-container {
    float: left;
    max-width: 100%;
  }

  .user-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start; /* align user-info to the left */
    width: auto; /* auto width to fit content */
    margin-bottom: 1rem; /* adds space below user-info */
  }

  .user-profile {
    display: flex; /* add flex display to center content inside */
    justify-content: center; /* center content horizontally */
    width: 100%; /* full width within its block */
  }

  .username {
    text-align: center; /* ensure the text is centered */
    align-self: center; /* center the username within its parent */
    width: 100%; /* full width to help center the text */
    margin-top: 1rem; /* optional: adds some space between the profile and username */
  }

  .user-image {
    position: relative;
    display: flex;
    gap: 0 0.5rem;
    background: transparent;
    border: none;
  }

  .edit-button-wrapper {
    position: absolute;
    bottom: 0;
    margin-left: 4rem;
  }

  .edit-button {
    background: var(--grey-400);
    color: white;
    border: none;
    border-radius: var(--border-radius);
    padding: 0.5rem 1rem;
    cursor: pointer;
    font-size: 0.75rem;
    z-index: 10;

    &:hover {
      background: var(--grey-50);
    }
  }

  .generated-panel {
    margin-top: 16px;
    width: 100%;
    max-width: 100%;
    min-width: 0; /* critical for grid children so they can shrink */
    overflow: hidden; /* contain editor + markdown blocks */
    clear: both; /* ensures it never wraps around floated user-container */
  }

  .section {
    margin-top: 18px;
    width: 100%;
    max-width: 100%;
    min-width: 0;
  }
  .section-link{
    width: 100%;
    max-width: 100%;
    min-width: 0;
  }

  .section-header {
    display: flex;
    align-items: center;
    justify-content: flex-end; /* button stays right, no awkward empty space */
    gap: 12px;
    margin-top: 20px;
    //flex-wrap: wrap; /* prevents overflow on small screens */
  }

  .box-highlighted{
    margin: 0rem;
  }

  .section-title {
    margin: 0;
  }

  .approval-row {
    margin-top: 24px;
    width: 100%;
  }

  /* Prevent flex/grid children from forcing overflow */
  .submit-container > div { 
    min-width: 0; /* grid child overflow fix */
  }

  .form {
    background: var(--white);
    border: 1.5px solid var(--grey-50);
    margin: 0;
    max-width: 100%;
    width: 100%;
    min-width: 0;
  }

  .generated-panel * {
    max-width: 100%;
  }

  .generated-panel pre,
  .generated-panel code,
  .generated-panel .wmde-markdown,
  .generated-panel .wmde-markdown-var,
  .generated-panel .w-md-editor,
  .generated-panel .md-editor-preview {
    max-width: 100%;
  }

  .generated-panel pre {
    overflow-x: auto;//long code blocks scroll instead of blowing layout
  }

  .generated-panel p,
  .generated-panel li,
  .generated-panel a {
    overflow-wrap: anywhere;//long URLs/words stop nuking layout
    word-break: break-word;
  }
  .trend-header-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    padding: 12px 12px;
    border: 1.5px solid var(--grey-50);
    border-radius: var(--border-radius);
    background: var(--white);
    margin-top: 12px;
    margin-bottom: 18px;
  }

  .trend-header-left {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
    flex: 1;
  }

  .trend-tech-icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    object-fit: contain;
    flex: 0 0 auto;
  }

  .trend-tech-icon.placeholder {
    background: var(--grey-30);
  }

  .trend-header-title {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }


  /* ========================= */

  .official-link-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.45rem 0.75rem;
    border-radius: 999px;
    background: var(--grey-50);
    border: 1.5px solid var(--grey-50);
    color: var(--grey-100);
    text-decoration: none;
    max-width: 100%;
  }

  .official-link-icon {
    width: 18px;
    height: 18px;
  }

  .official-link-text {
    font-weight: 600;
    font-size: 0.9rem;
    white-space: nowrap;
  }

  .trend-tech-label {
    font-size: 0.78rem;
    font-weight: 700;
    color: var(--grey-600);
    letter-spacing: 0.4px;
    text-transform: uppercase;
  }

  .trend-name {
    font-size: 1.05rem;
    font-weight: 800;
    color: var(--primary-700);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
  }

  .trend-header-bookmark {
    flex: 0 0 auto;
  }

  .edit-closed-note {
    border: 1.5px dashed var(--grey-50);
    border-radius: var(--border-radius);
    padding: 14px;
    color: var(--grey-700);
    font-weight: 600;
  }

    .approval-row {
    margin-top: 24px;
    width: 100%;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .approval-left {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
  }

  .approval-btn {
    flex: 1;//button takes remaining space)
    width: auto;
  }

 .submit-row {
    grid-column: 1 / -1;//mobile/tablet: sits under selector/full row
    width: 100%;
    min-width: 0;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;//submit button + gear
    gap: 0;//glued together
    align-items: stretch;
  }

  .submit-row.no-settings {
    grid-template-columns: 1fr;//submit takes full space when gear is missing
  }

  .submit-action {
    width: 100%;
    min-width: 0;
  }

  .submit-action .form-btn {
    width: 100%;
    height: 50px;
    margin-top: 0;
    border-top-right-radius: var(--border-radius);//default full button
    border-bottom-right-radius: var(--border-radius);//default full button
  }

  .submit-row.has-settings .submit-action .form-btn {
    border-top-right-radius: 0; //glued to gear
    border-bottom-right-radius: 0;//glued to gear
  }

  .submit-gear {
    width: 50px;
    height: 50px;
    min-width: 50px;
    display: flex;
    align-items: stretch;
    justify-content: center;
  }

  .submit-gear {
    width: 50px;
    height: 50px;
    min-width: 50px;
    border-radius: 0 var(--border-radius) var(--border-radius) 0;//glued right side
    border: 1.5px solid var(--grey-50);
    border-left: 0;//removes double border between button + gear
    background: transparent;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .settings-icon {
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--text-primary-color);
    transition: color 0.3s ease;
  }

  .settings-icon:hover {
    color: var(--primary-500);
  }

  .settings-icon svg {
    width: 1.5rem;
    height: 1.5rem;
  }

  .dropdown {
    position: absolute;
    top: 0px;
    right: -40px;
    background: var(--dropdown-background);
    border: 1px solid var(--grey-50);
    border-radius: var(--border-radius);
    padding: 0.5rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 10;

    .dropdown-option {
      display: block;
      width: 100%;
      padding: 0.25rem 0.75rem;
      background: transparent;
      border: none;
      cursor: pointer;
      color: var(--text-color);
      text-align: left;
      border-radius: var(--border-radius);

      &:hover {
        background: var(--dropdown-background-hover);
      }

      &:active {
        background: var(--primary2-400);
      }
    }

    input {
      display: none;
    }

    button {
      color: var(--red-dark);

      &:hover {
        background: var(--primary2-400);
      }

      &:active {
        background: var(--grey-200);
      }
    }
  }

  .submit-container {
    clear: both;
    display: grid; // use grid to manage layout
    grid-template-columns: 1fr; // default to single column layout
    gap: 2rem; // gap between rows or columns

    @media (min-width: 1120px) {
      grid-template-columns: 2fr 1fr;
    }
  }

  .form-title {
    margin-bottom: 2rem;
  }

  .form-btn {
    height: 50px;
  }

  .form-input,
  .form-textarea,
  .form-select {
    font-size: 1rem;
    padding-top: 1.5rem;
    padding-bottom: 1.5rem;
    border: 1.5px solid var(--grey-70);
  }

  .form-center {
    display: grid;
    row-gap: 1rem;
    min-width: 0;

    @media (min-width: 992px) {
      grid-template-columns: 1fr 1fr;
      align-items: center;
      column-gap: 1rem;

      .submit-row {
      grid-column: auto; /* //makes submit sit to the right of tech selector */
    }
    }
    @media (min-width: 1120px) {
      grid-template-columns: 1fr 1fr;
    }
  }

  .form-btn {
    margin-top: 0rem;
    display: grid;
    align-items: center;
    place-items: center;
  }

  .delete-btn {
    height: 30px;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
  }

  .info-btn {
    border: 1.5px solid var(--grey-100);
    margin-right: 0.5rem;
  }

  .chart-container {
    border: 1.5px solid var(--grey-50);
    background: var(--white);
    border-radius: var(--border-radius);
    min-width: 0;
    overflow: hidden;
  }

  @media (max-width: 768px) {
    padding: 1rem 1rem 2rem;

    .form {
      padding: 1rem;
    }

    .submit-container {
      gap: 1rem;
    }
  }

  svg {
    width: 2rem;
    height: 2rem;
  }

  @media (max-width: 768px) {
    .trend-header-row {
      padding: 10px;
    }
    .trend-tech-icon {
      width: 40px;
      height: 40px;
    }
    .approval-row {
      gap: 10px;
    }
  }
`;

export default Container;