import React, { useMemo, useState } from 'react';

function IconCategory({
  src = '',
  alt = 'Category Icon',
  size = 17,
  isDarkTheme = false,
  style = {},
  className = '',
}) {
  const [failed, setFailed] = useState(false);
  const fallbackSrc = '/assets/cat/fallback-cat.svg';

  const finalSrc = useMemo(() => {
    if (!src) return fallbackSrc;
    return failed ? fallbackSrc : src;
  }, [src, failed]);

  return (
    <img
      src={finalSrc}
      alt={alt}
      draggable={false}
      className={className}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        marginRight: '5px',
        backgroundColor: isDarkTheme ? 'var(--off-white)' : 'transparent',
        borderRadius: '20%',
        padding: isDarkTheme ? '1px' : '0',
        ...style,
      }}
      onError={() => setFailed(true)}
    />
  );
}

export default IconCategory;