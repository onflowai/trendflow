import styled from 'styled-components';

const Container = styled.section`
  width: 100%;
  height: calc(100vh - 90px);
  padding: 1rem;
  box-sizing: border-box;

  .view-flow-header {
    margin-bottom: 0.75rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }

  .graph-loading-center {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--background-color);
    z-index: 5;
  }

  .graph-loading-center .loading-overlay {
    position: static;
    width: auto;
    height: auto;
    background: transparent;
  }

  .view-flow-title {
    margin: 0;
  }

  .view-flow-subtitle {
    margin: 0.25rem 0 0;
    color: #6b7280;
  }

  .view-flow-meta {
    font-size: 0.85rem;
    color: var(--grey-900);
    background: var(--background-second-color);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    padding: 0.45rem 0.8rem;
    white-space: nowrap;
  }

  .selected-flow-panel {
    margin-bottom: 0.75rem;
    border: 1px solid var(--border-color, #e5e7eb);
    border-radius: var(--border-radius);
    background: var(--background-second-color);
    //box-shadow: var(--shadow-2, 0 10px 26px rgba(0, 0, 0, 0.08));
    padding: 0.65rem;
    display: flex;
    align-items: center;
    gap: 0.55rem;
    flex-wrap: wrap;
  }

  .selected-flow-description {
    flex: 1 1 420px;
    min-width: 260px;
    color: var(--grey-900);
    font-size: 0.92rem;
    line-height: 1.45;
    background: var(--background-secondary-color);
    border: 1px solid var(--border-color, #e5e7eb);
    border-radius: var(--border-radius);
    padding: 0.65rem 0.85rem;
  }

  .selected-flow-loading {
    color: #6b7280;
    font-size: 0.85rem;
  }

  .selected-flow-main {
    display: flex;
    align-items: center;
    flex: 0 0 auto;
    min-width: 0; //removes forced spacing
  }

  .selected-flow-trend-button {
    border: 1px solid var(--background-color);
    border-radius: 999px;
    background: var(--primary-400);
    color: #fff;
    font-weight: 800;
    padding: 0.4rem 0.8rem 0.4rem 0.4rem;
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
    cursor: pointer;
    transition:
      transform 0.16s ease,
      box-shadow 0.16s ease,
      background 0.16s ease;
  }

  .selected-flow-trend-button:hover {
    background: var(--content-row-component-highlighted);
    //transform: translateY(-1px);
  }

  .selected-flow-trend-button.secondary {
    background: var(--primary-100);
    color: var(--background-color);
    border-color: var(--background-color);
  }

  .selected-flow-trend-button.secondary:hover {
    background: var(--content-row-component-highlighted);
    color: var(--background-color);
    border-color: var(--background-color);
  }

  .selected-flow-icon,
  .selected-flow-icon.secondary {
    width: 20px; //no giant spacing
    height: 20px; //no giant spacing
    border-radius: 0;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: visible;
    flex: 0 0 auto;
  }

  .selected-flow-icon img,
  .selected-flow-icon.secondary img {
    width: 20px;
    height: 20px;
    object-fit: contain;
  }

  .selected-flow-label {
    max-width: 180px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .content{
    padding-bottom: 0rem;
  }

  .selected-flow-row {
    flex: 1 1 420px;
    min-width: 260px;
    display: flex;
    align-items: center;
    }

  .selected-flow-loading {
    font-size: 0.85rem;
    color: #6b7280;
  }

  .selected-flow-main {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .selected-flow-icon {
    width: 30px;
    height: 30px;
    border-radius: 999px;
    background: var(--content-row-component);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    flex: 0 0 auto;
  }

  .selected-flow-icon img {
    width: 62%;
    height: 62%;
    object-fit: contain;
  }

  .selected-flow-label {
    max-width: 220px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 700;
    color: var(--grey-900);
    line-height: 1;
  }

  .selected-flow-type {
    margin-top: 0.2rem;
    font-size: 0.78rem;
    color: #6b7280;
  }

  .selected-flow-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-left: auto;
  }

  .selected-flow-button {
    border: none;
    border-radius: 999px;
    background: #111827;
    color: #fff;
    font-weight: 700;
    padding: 0.55rem 0.9rem;
    cursor: pointer;
  }

  .selected-flow-button.secondary {
    background: #f3f4f6;
    color: #111827;
    border: 1px solid #d1d5db;
  }

  .graph-shell {
    width: 100%;
    height: calc(100% - 72px);
    border-radius: 18px;
    overflow: hidden;
    border: 1px solid var(--border-color, #e5e7eb);
    background: var(--background-second-color); // MAIN VIEW
  }

  .graph-shell.has-selected {
      height: calc(100% - 145px);
    }

  .visual-node {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    pointer-events: auto;
    position: relative;
  }

  .visual-node-icon {
    border-radius: 999px;
    box-shadow: 0 10px 26px rgba(0, 0, 0, 0.16);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

   .visual-node-icon.trend {
    border: 2px solid var(--primary-100);
  }

  .visual-node-icon.tech{
    border: 1px solid var(--primary-50, #d1d5db);
  }

  .visual-node-icon.category {
    border: 1px solid var(--grey-300, #d1d5db);
  }

  .visual-node-icon img {
    object-fit: contain;
  }

  .visual-node-label {
    text-align: center;
    color: var(--grey-400);
    line-height: 1.15;
    background: var(--background-secondary-color);
    border-radius: var(--border-radius);
    padding: 4px 8px;
    box-shadow: var(--shadow-1, 0 4px 12px rgba(0, 0, 0, 0.08));
    white-space: normal;
  }

    .react-flow__controls {
    box-shadow: var(--shadow-2, 0 8px 18px rgba(0, 0, 0, 0.12));
    border-radius: var(--border-radius);
    overflow: hidden;
    border: 1px solid var(--border-color, #e5e7eb);
    background: var(--background-secondary-color);
  }

  .react-flow__controls-button {
    width: 36px;
    height: 36px;
    border: none;
    border-bottom: 1px solid var(--border-color, #e5e7eb);
    background: var(--background-secondary-color);
    color: var(--grey-900);
    transition:
      background 0.16s ease,
      color 0.16s ease,
      transform 0.16s ease;
  }

  .react-flow__controls-button:last-child {
    border-bottom: none;
  }

  .react-flow__controls-button:hover {
    background: var(--content-row-component-highlighted);
    color: var(--primary-600);
  }

  .react-flow__controls-button svg {
    width: 14px;
    height: 14px;
    fill: currentColor;
  }

  .react-flow__controls-button:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
  .selected-flow-panel {
      align-items: flex-start;
    }

    .selected-flow-row {
      flex-basis: 100%;
    }

    .graph-shell.has-selected {
      height: calc(100% - 230px);
    }
  }

  @media (max-width: 991px) {
    .gradient-overlay {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      width: 50px;
      background: linear-gradient(to left, var(--background-second-color), rgba(255, 255, 255, 0));
      pointer-events: none;
    }

    .content {
      padding-right: 50px;
    }
  }

  @media (max-width: 768px) {
    height: calc(100vh - 72px);
    padding: 0.75rem;

    .view-flow-header {
      align-items: flex-start;
      flex-direction: column;
    }

    .selected-flow-actions {
      margin-left: 0;
    }

    .graph-shell.has-selected {
      height: calc(100% - 230px);
    }
  }
`;

export default Container;