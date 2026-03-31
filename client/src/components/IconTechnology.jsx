import React, { useMemo, useState } from 'react';
/**
 * Used for fallback icons and current icons
 * @param {*} param0 
 * @returns 
 */
function IconTechnology({
  src = '',//expecting full path /assets/x.svg
  fallbackSrc = '', //full path /assets/fallback-tech.svg
  alt = 'Icon',
  size = 20,
  style = {},
  className = '',
}) {
  const [failed, setFailed] = useState(false);

  const finalSrc = useMemo(() => {
    if (!src) return fallbackSrc;
    return failed ? fallbackSrc : src;
  }, [src, fallbackSrc, failed]);

  if (!finalSrc) return null;

  return (
    <img
      src={finalSrc}
      alt={alt}
      draggable={false}
      className={className}
      style={{ width: `${size}px`, ...style }}
      onError={() => setFailed(true)}
    />
  );
}

export default IconTechnology;