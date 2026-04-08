import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { BsFillBookmarkFill, BsBookmark } from 'react-icons/bs';

const TrendBookMark = ({
  trendId,
  isSaved = false,
  onToggle,//async (trendId, nextIsSaved) => void
  size = 21,
  disabled = false,
  title,
  className,
}) => {
  const [hovered, setHovered] = useState(false);
  const [busy, setBusy] = useState(false);

  const ariaLabel = useMemo(() => {
    if (disabled) return 'Bookmark disabled';
    return isSaved ? 'Remove bookmark' : 'Save bookmark';
  }, [isSaved, disabled]);

  const handleClick = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (disabled || busy) return;
    if (!trendId) return;
    if (typeof onToggle !== 'function') return;

    const next = !isSaved;
    try {
      setBusy(true);
      await onToggle(trendId, next);
    } finally {
      setBusy(false);
    }
  };

  const fillColor = isSaved || hovered ? 'var(--grey-900)' : 'var(--white)';

  return (
    <Btn
      type="button"
      className={className}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={ariaLabel}
      title={title || ariaLabel}
      disabled={disabled || busy}
    >
      <BsFillBookmarkFill
        size={`${Math.max(10, size - 1)}px`}
        style={{ color: fillColor, position: 'absolute' }}
      />
      <BsBookmark
        size={`${size}px`}
        style={{ color: 'var(--grey-900)', position: 'absolute' }}
      />
    </Btn>
  );
};

export default TrendBookMark;

const Btn = styled.button`
  width: 34px;
  height: 34px;
  border-radius: 999px;
  border: 1px solid var(--grey-40);
  background: var(--white);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  padding: 0;

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    box-shadow: var(--shadow-2);
  }
`;