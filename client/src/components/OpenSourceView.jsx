import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import Tooltip from './Tooltip';

import openSourceLogo from '../assets/images/open-source-fill.svg';
import partialLogo from '../assets/images/open-source.svg';
import closedLogo from '../assets/images/open-source-fill-grey.svg';
import unknownLogo from '../assets/images/open-source-grey.svg';

const OPTIONS = [
  { label: 'Open', value: 'open', localIcon: openSourceLogo, cdnFile: 'open-source-fill.svg' },
  { label: 'Partial', value: 'partial', localIcon: partialLogo, cdnFile: 'open-source.svg' },
  { label: 'Closed', value: 'closed', localIcon: closedLogo, cdnFile: 'open-source-fill-grey.svg' },
  { label: 'Unknown', value: 'unknown', localIcon: unknownLogo, cdnFile: 'open-source-grey.svg' },
];

const CDN_BASE = 'https://cdn.trendflowai.com/content/icons/';

function OpenSourceView({
  value = 'unknown',
  size = 44,
  className = '',
  tooltipXOffset = -35,
  tooltipYOffset = -90,
}) {
  const [hasError, setHasError] = useState(false);

  const safeValue = useMemo(() => {
    const v = String(value || '').toLowerCase().trim();
    const allowed = new Set(OPTIONS.map((o) => o.value));
    return allowed.has(v) ? v : 'unknown';
  }, [value]);

  const currentOption = useMemo(() => {
    return OPTIONS.find((o) => o.value === safeValue) || OPTIONS[3];
  }, [safeValue]);

  const cdnIcon = `${CDN_BASE}${currentOption.cdnFile}`;
  const imageSrc = hasError ? currentOption.localIcon : cdnIcon;

  return (
    <Wrap className={className}>
      <Tooltip
        description={currentOption.label}
        xOffset={tooltipXOffset}
        yOffset={tooltipYOffset}
      >
        <img
          src={imageSrc}
          alt={`${currentOption.label} icon`}
          className="open-source-icon"
          draggable={false}
          onError={() => setHasError(true)}
          style={{ width: size, height: size }}
        />
      </Tooltip>
    </Wrap>
  );
}

export default OpenSourceView;

const Wrap = styled.div`
  align-self: flex-start;
  padding: 0;

  .open-source-icon {
    padding: 0;
    display: block;
    pointer-events: auto;
  }
`;