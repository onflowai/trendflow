import React from 'react';
import { FcAddressBook } from 'react-icons/fc';
import PropTypes from 'prop-types';

function CardLarge({ title, description, link, updatedAt, svg_img }) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="card-content"
    >
      <div
        className="card-background"
        style={{ backgroundImage: `url(${svg_img || FcAddressBook})` }}
      ></div>
      <div className="card-date">
        {new Date(updatedAt).toLocaleDateString()}
      </div>
      <div className="card-title">{title}</div>
      <div className="card-description">{description.slice(0, 100)}</div>
    </a>
  );
}

// CardLarge.propTypes = {
//   title: PropTypes.string.isRequired,
//   description: PropTypes.string.isRequired,
//   link: PropTypes.string.isRequired,
//   updatedAt: PropTypes.string.isRequired,
// };

export default CardLarge;
