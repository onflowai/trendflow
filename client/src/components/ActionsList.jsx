import React, { useMemo, useState } from 'react';
import styled from 'styled-components';

/**
 * ActionsList reusable action/tab selector
 * items shape:
 * {
 *   id: 'terms',
 *   title: 'Terms of Use',
 *   icon: FaBalanceScale
 * }
 *
 * Parent controls what content gets displayed.
 */
const ActionsList = ({
  items = [],
  defaultActiveId,
  activeId,
  onChange,
  className = '',
  ariaLabel = 'Actions list',
}) => {
  const firstItemId = items?.[0]?.id || '';
  const [internalActiveId, setInternalActiveId] = useState(
    defaultActiveId || firstItemId
  );

  const selectedId = activeId || internalActiveId;

  const selectedItem = useMemo(() => {
    return items.find((item) => item.id === selectedId) || items[0];
  }, [items, selectedId]);

  const handleSelect = (item) => {
    if (!activeId) {
      setInternalActiveId(item.id); //allows uncontrolled usage
    }

    onChange?.(item); //parent decides what content to show
  };

  if (!items.length) return null;

  return (
    <Container className={className}>
      <div className="actions-list-shell">
        <div className="actions-list" role="tablist" aria-label={ariaLabel}>
          {items.map((item) => {
            const Icon = item.icon;
            const hasTitle = !!item.title;
            const isSelected = selectedItem?.id === item.id;

            return (
              <button
                key={item.id}
                type="button"
                className={`action-choice ${isSelected ? 'selected' : ''} ${
                  Icon && hasTitle ? 'icon-title-choice' : ''
                } ${Icon && !hasTitle ? 'icon-only-choice' : ''} ${
                  !Icon && hasTitle ? 'title-only-choice' : ''
                }`}
                onClick={() => handleSelect(item)}
                role="tab"
                aria-selected={isSelected}
                aria-label={item.title || item.label || item.id}
              >
                {Icon && <Icon className="action-icon" aria-hidden="true" />}
                {hasTitle && <span className="action-title">{item.title}</span>}
              </button>
            );
          })}
        </div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;

  .actions-list-shell {
    width: 100%;
    padding: 10px 10px 6px;
    border: 1.5px solid var(--grey-50);
    border-radius: 8px;
    overflow-x: auto; //always keeps actions on one line with scrolling
    overflow-y: hidden;
    scrollbar-width: thin;
    scrollbar-color: var(--grey-70) transparent;
  }

  .actions-list-shell::-webkit-scrollbar {
    height: 8px; //visible horizontal scrollbar
  }

  .actions-list-shell::-webkit-scrollbar-track {
    background: transparent;
  }

  .actions-list-shell::-webkit-scrollbar-thumb {
    background: var(--grey-70);
    border-radius: 999px;
  }

  .actions-list-shell::-webkit-scrollbar-thumb:hover {
    background: var(--grey-100);
  }

  .actions-list {
    display: flex;
    flex-wrap: nowrap; //no wrapping on desktop or mobile
    align-items: center;
    justify-content: space-evenly; //one item centers, more items spread evenly
    gap: 10px;
    width: max-content;
    min-width: 100%; //keeps small item groups centered/spread
    white-space: nowrap;
  }

  .action-choice {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 40px;
    color: var(--text-color);
    background: transparent;
    border: 1.5px solid transparent;
    border-radius: 8px;
    font-family: inherit;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: border-color 0.2s ease, background 0.2s ease,
      color 0.2s ease;
  }

  .icon-title-choice,
  .title-only-choice {
    padding: 8px 12px;
    border-color: var(--grey-50);
  }

  .icon-title-choice:hover,
  .title-only-choice:hover {
    border-color: var(--grey-70);
    background: var(--grey-50);
  }

  .icon-title-choice:hover .action-icon {
    color: var(--button-icon-hover); //button icon lights up on hover
  }

  .icon-only-choice {
    width: 40px;
    height: 40px;
    padding: 0;
    border-color: transparent; //icon-only does not become button-style
    background: transparent;
  }

  .icon-only-choice:hover {
    color: var(--button-icon-hover); //icon-only hover indicator
  }

  .action-choice.selected {
    border-color: var(--primary-100);
    background: transparent;
  }

  .icon-title-choice.selected .action-icon {
    color: var(--button-icon); //active button icon only uses button icon var
  }

  .icon-only-choice.selected {
    border-color: transparent;
    background: transparent;
    color: var(--button-icon); //active icon-only uses button icon var
  }

  .action-icon {
    flex-shrink: 0;
    font-size: 1rem;
    transition: color 0.2s ease;
  }

  .action-title {
    white-space: nowrap;
  }

  @media (max-width: 768px) {
    .actions-list-shell {
      padding: 8px 8px 6px;
      -webkit-overflow-scrolling: touch;
    }

    .actions-list {
      justify-content: flex-start; //mobile behaves more like carousel scrolling
      min-width: max-content;
    }

    .action-choice {
      flex: 0 0 auto;
    }

    .action-title {
      max-width: 185px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  @media (max-width: 420px) {
    .action-title {
      max-width: 145px;
    }
  }
`;

export default ActionsList;