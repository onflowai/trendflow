import React, { useMemo, useState, useEffect } from 'react';
import styled from 'styled-components';
import Tooltip from './Tooltip';

import openSourceLogo from '../assets/images/open-source-fill.svg';
import partialLogo from '../assets/images/open-source.svg';
import closedLogo from '../assets/images/open-source-fill-grey.svg';
import unknownLogo from '../assets/images/open-source-grey.svg';

const ASSET_CDN_BASE = import.meta.env.VITE_ASSET_CDN_BASE || '';
const OPEN_SOURCE_STATUS_PATH = '/open-source-status/'; //your real CDN folder

const OPTIONS = [
  { label: 'Open', value: 'open', localIcon: openSourceLogo, cdnFile: 'open-source-fill.svg' },
  { label: 'Partial', value: 'partial', localIcon: partialLogo, cdnFile: 'open-source.svg' },
  { label: 'Closed', value: 'closed', localIcon: closedLogo, cdnFile: 'open-source-fill-grey.svg' },
  { label: 'Unknown', value: 'unknown', localIcon: unknownLogo, cdnFile: 'open-source-grey.svg' },
];

const getCdnIcon = (fileName) => {
  if (!ASSET_CDN_BASE) return '';

  return `${ASSET_CDN_BASE.replace(/\/+$/, '')}${OPEN_SOURCE_STATUS_PATH}${fileName}`; //prevents double slash issue
};

function OpenSourceView({
  value = 'unknown',
  size = 44,
  className = '',
  iconClassName = '',
  tooltipXOffset = -35,
  tooltipYOffset = -90,
  showTooltip = true, //allows plain inline usage
  showOnly = null, //example: ['open', 'partial']
}) {
  const [useLocalIcon, setUseLocalIcon] = useState(false);

  const safeValue = useMemo(() => {
    const v = String(value || '').toLowerCase().trim();
    const allowed = new Set(OPTIONS.map((o) => o.value));

    return allowed.has(v) ? v : 'unknown';
  }, [value]);

  const currentOption = useMemo(() => {
    return OPTIONS.find((o) => o.value === safeValue) || OPTIONS[3];
  }, [safeValue]);

  useEffect(() => {
    setUseLocalIcon(false); //retrying CDN when status changes
  }, [safeValue]);

  if (Array.isArray(showOnly) && !showOnly.includes(safeValue)) {
    return null; //keeps TrendMini behavior: no closed/unknown icon
  }

  const cdnIcon = getCdnIcon(currentOption.cdnFile);
  const imageSrc = cdnIcon && !useLocalIcon ? cdnIcon : currentOption.localIcon;

  const icon = (
    <img
      src={imageSrc}
      alt={`${currentOption.label} icon`}
      className={`open-source-icon ${iconClassName}`.trim()}
      draggable={false}
      onError={() => {
        if (cdnIcon && !useLocalIcon) {
          setUseLocalIcon(true); //if CDN failed use imported local Vite asset
        }
      }}
      style={{ width: size, height: size }}
    />
  );

  return (
    <Wrap className={className}>
      {showTooltip ? (
        <Tooltip
          description={currentOption.label}
          xOffset={tooltipXOffset}
          yOffset={tooltipYOffset}
        >
          {icon}
        </Tooltip>
      ) : (
        icon
      )}
    </Wrap>
  );
}

export default OpenSourceView;

const Wrap = styled.div`
  //display: inline-flex; //works inside h4
  align-self: flex-start;
  align-items: center;
  padding: 0;
  //line-height: 0;

  .open-source-icon {
    padding: 0;
    display: block;
    pointer-events: auto;
  }
`;