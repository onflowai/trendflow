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
    //margin-top: 16px;
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

  .skill-review-container{
    margin-top: 12px;
    margin-top: 12px;
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
    color: var(--icon-btn-color);
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

  .skill-icon-default {
    opacity: 1;
  }

  .skill-icon-hover,
  .skill-icon-active {
    opacity: 0;
  }

  .skill-field {
    width: 100%;
    min-width: 0;
  }

  .skill-type-field {
    min-width: 0;
  }

  /*
   * The technology selector and order display span the full form width.
   */
  .skill-tech-field {
    grid-column: 1 / -1;
  }

  .skill-options-loading {
    min-height: 47px;
    width: 100%;
    display: flex;
    align-items: center;
    padding: 0 1rem;
    border: 1.5px solid var(--grey-70);
    border-radius: var(--border-radius);
    background: var(--white);
    color: var(--grey-400);
    font-size: 0.85rem;
    font-weight: 600;
  }

  /* ==========================================
     ORDERED SKILL TECHNOLOGY DISPLAY
     ========================================== */

  .skill-tech-order {
    width: 100%;
    min-width: 0;
    min-height: 64px;
    padding: 0.75rem;
    border: 1.5px solid var(--grey-70);
    border-radius: var(--border-radius);
    background: var(--white);
    display: flex;
    align-items: center;
    gap: 0.45rem;
    overflow-x: auto;
  }

  .skill-tech-order-item {
    flex: 0 0 auto;
    min-width: 150px;
    display: grid;
    grid-template-columns: 28px minmax(0, 1fr);
    align-items: center;
    column-gap: 0.5rem;
    row-gap: 0.2rem;
    padding: 0.55rem 0.65rem;
    border: 1.5px solid var(--grey-50);
    border-radius: var(--border-radius);
    background: var(--white);
  }

  .skill-tech-order-item img {
    grid-row: 1 / span 2;
    width: 28px;
    height: 28px;
    object-fit: contain;
  }

  .skill-tech-order-item span {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--text-color);
    font-size: 0.85rem;
    font-weight: 700;
  }

  .skill-tech-order-item small {
    color: var(--grey-400);
    font-size: 0.67rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .skill-order-actions {
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.35rem;
    margin-top: 0.25rem;
  }

  .skill-order-actions button {
    height: 27px;
    border: 1px solid var(--grey-70);
    border-radius: calc(var(--border-radius) / 1.5);
    background: transparent;
    color: var(--text-color);
    cursor: pointer;
  }

  .skill-order-actions button:hover:not(:disabled) {
    border-color: var(--primary-300);
    background: var(--grey-30);
  }

  .skill-order-actions button:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  .skill-order-arrow {
    flex: 0 0 auto;
    color: var(--primary-400);
    font-size: 1.2rem;
    font-weight: 800;
  }

  @media (max-width: 768px) {
    .skill-tech-order {
      align-items: stretch;
    }

    .skill-tech-order-item {
      min-width: 135px;
    }
  }


  .skill-build-field {
    width: 100%;
    min-width: 0;
    margin-top: 0.85rem;
  }

  .skill-build-label {
    margin-bottom: 0.45rem;
    color: var(--grey-400);
    font-size: 0.8rem;
    font-weight: 400;
  }



  .skill-tech-pill {
    flex: 0 0 auto;
    min-height: 40px;
    max-width: 230px;
    padding: 0.35rem 0.45rem;
    border: 1.5px solid var(--grey-50);
    border-radius: 999px;
    background: var(--white);
    display: flex;
    align-items: center;
    gap: 0.45rem;
    cursor: grab;
    user-select: none;
    transition:
      opacity 0.15s ease,
      transform 0.15s ease,
      border-color 0.15s ease,
      box-shadow 0.15s ease;
  }

  .skill-tech-pill:hover {
    border-color: var(--primary-200);
    box-shadow:
      0 3px 9px
      rgba(0, 0, 0, 0.07);
  }

  .skill-tech-pill:active {
    cursor: grabbing;
  }

  .skill-tech-pill.is-primary {
    border-color: var(--primary-300);
  }

  .skill-tech-pill.is-dragging {
    opacity: 0.45;
    transform: scale(0.97);
    border-style: dashed;
  }

  .skill-tech-drag-handle {
    flex: 0 0 auto;
    color: var(--grey-300);
    font-size: 0.85rem;
    font-weight: 800;
    letter-spacing: -0.2rem;
    cursor: grab;
  }

  .skill-tech-pill img {
    flex: 0 0 auto;
    width: 25px;
    height: 25px;
    object-fit: contain;
  }

  .skill-tech-pill-name {
    min-width: 0;
    overflow: hidden;
    color: var(--text-color);
    font-size: 0.8rem;
    font-weight: 700;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .skill-pill-order-actions {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    gap: 0.15rem;
    margin-left: 0.1rem;
  }

  .skill-pill-order-actions button {
    width: 24px;
    height: 24px;
    padding: 0;
    border: none;
    border-radius: 50%;
    background: transparent;
    color: var(--grey-500);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 0.8rem;
  }

  .skill-pill-order-actions
    button:hover:not(:disabled) {
    background: var(--grey-50);
    color: var(--primary-500);
  }

  .skill-pill-order-actions button:disabled {
    opacity: 0.25;
    cursor: not-allowed;
  }

  .skill-order-arrow {
    flex: 0 0 auto;
    color: var(--primary-400);
    font-size: 1.1rem;
    font-weight: 800;
    pointer-events: none;
  }

  .skill-tech-field {
    grid-column: 1 / -1;
  }

  .submit-row.skill-submit-full-width {
    grid-column: 1 / -1;
  }

  .review-skill-row {
    width: 100%;
  }

  .review-skill-btn {
    min-height: 42px;
    width: 100%;
    padding: 0.45rem 0.85rem;
    border: 1.5px solid var(--grey-50);
    border-radius: var(--border-radius);
    background: var(--white);
    color: var(--text-color);
    display: inline-flex;
    align-items: center;
    justify-content: flex-start;
    gap: 0.45rem;
    font-size: 0.85rem;
    font-weight: 700;
    cursor: pointer;
  }

  .review-skill-btn:hover {
    border-color: var(--primary-200);
  }

  .review-skill-btn strong {
    min-width: 0;
    color: var(--primary-600);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .review-skill-icon-wrap {
    position: relative;
    width: 21px;
    height: 21px;
    display: inline-flex;
    flex: 0 0 auto;
  }

  .review-skill-icon {
    position: absolute;
    width: 21px;
    height: 21px;
    object-fit: contain;
  }

  .review-skill-icon-default {
    opacity: 1;
  }

  .review-skill-icon-hover {
    opacity: 0;
  }

  .review-skill-btn:hover .review-skill-icon-default {
    opacity: 0;
  }

  .review-skill-btn:hover .review-skill-icon-hover {
    opacity: 1;
  }

  @media (max-width: 768px) {
    .skill-tech-order {
      min-height: 58px;
      padding: 0.6rem;
    }

    .skill-tech-pill {
      max-width: 200px;
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