import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  max-width: 980px; //better reading width for settings/docs
  min-width: 0; //allows dashboard/sidebar squeeze
  margin: 0 auto;
  padding: 0 clamp(0.65rem, 2vw, 1.25rem) 2rem;
  box-sizing: border-box;

  /* Do NOT use overflow-x: hidden here. It kills child horizontal scrolling. */

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  .settings-section {
    width: 100%;
    max-width: 100%;
    min-width: 0;
    margin-bottom: 1.25rem;
  }

  .settings-section > * {
    max-width: 100%;
    min-width: 0;
  }

  .settings-docs-hub {
    width: 100%;
    max-width: 100%;
    min-width: 0; //critical with sidebar
    display: grid;
    gap: 14px;
    padding: 14px;
    border: 1.5px solid var(--grey-50);
    border-radius: 8px;
    overflow: visible; //allows inner scrollbars to show
  }

  .settings-docs-hub > * {
    max-width: 100%;
    min-width: 0; //prevents child from pushing page wider
  }

  .settings-docs-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    min-width: 0;
  }

  .settings-docs-header .eyebrow {
    margin: 0 0 6px;
    color: var(--primary-500);
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .settings-docs-header h2 {
    margin: 0;
    color: var(--text-color);
    font-size: clamp(1.15rem, 2vw, 1.45rem);
    line-height: 1.2;
  }

  /* HERE: force ActionsList to scroll inside this dashboard page */
  .actions-list-shell {
    width: 100%;
    max-width: 100%;
    min-width: 0;
    overflow-x: auto;
    overflow-y: hidden;
  }

  .actions-list {
    flex-wrap: nowrap;
    width: max-content;
    min-width: 100%;
  }

  .action-choice {
    flex: 0 0 auto;
  }

  .settings-docs-card {
    width: 100%;
    max-width: 100%;
    min-width: 0;
    padding: clamp(1rem, 2vw, 1.35rem);
    border: 1.5px solid var(--grey-50);
    border-radius: 8px;
    overflow-x: auto; //markdown/table/code scrolls here
    overflow-y: visible;
  }

  .settings-docs-card > * {
    max-width: 100%;
    min-width: 0;
  }

  .settings-docs-card pre {
    display: block;
    max-width: 100%;
    overflow-x: auto; //code blocks scroll
  }

  .settings-docs-card code {
    word-break: normal;
  }

  .settings-docs-card table {
    display: block;
    width: 100%;
    max-width: 100%;
    overflow-x: auto; //tables scroll
    white-space: nowrap;
  }

  .settings-docs-card img {
    max-width: 100%;
    height: auto;
  }

  @media (max-width: 768px) {
    max-width: 100%;
    padding: 0 0.7rem 1.5rem;

    .settings-docs-hub {
      gap: 12px;
      padding: 10px;
    }

    .settings-docs-card {
      padding: 0.95rem;
    }

    .settings-docs-header {
      align-items: flex-start;
    }
  }

  @media (max-width: 420px) {
    padding-inline: 0.5rem;

    .settings-docs-hub {
      padding: 8px;
    }

    .settings-docs-card {
      padding: 0.8rem;
    }
  }
`;

export default Container;