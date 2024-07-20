import React from 'react';
import PropTypes from 'prop-types';

function CardLarge({ title, description, link, updatedAt }) {
  return (
    <div>
      <h2>{title}</h2>
      {console.log('title ', title)}
      <p>{description.slice(0, 100)}</p>
      <a href={link}>Learn More</a>
      <p>{new Date(updatedAt).toLocaleDateString()}</p>
    </div>
  );
}

// CardLarge.propTypes = {
//   title: PropTypes.string.isRequired,
//   description: PropTypes.string.isRequired,
//   link: PropTypes.string.isRequired,
//   updatedAt: PropTypes.string.isRequired,
// };

export default CardLarge;
