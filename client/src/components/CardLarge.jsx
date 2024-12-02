import React from 'react';
import { FcAddressBook } from 'react-icons/fc';
import { FaTrash } from 'react-icons/fa';
import day from 'dayjs';
import PropTypes from 'prop-types';
import Container from '../assets/wrappers/CardLargeContainer';
import { FaExternalLinkSquareAlt } from 'react-icons/fa';
import { IoTime } from 'react-icons/io5';
import { MdVerified } from 'react-icons/md';

function CardLarge({
  _id,
  title,
  description,
  link,
  svg_img,
  updatedAt,
  onDelete,
  isAdmin,
}) {
  const upDate = day(updatedAt).format('MM YYYY');
  const handleDelete = () => {
    if (onDelete) {
      onDelete(_id);
    }
  };
  return (
    <Container>
      <div className="card">
        {isAdmin && (
          <button className="delete-button" onClick={handleDelete}>
            <FaTrash />
          </button>
        )}
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="card-content"
        >
          <div className="card-overlay"></div>
          <div
            className="card-background"
            style={{ backgroundImage: `url(${svg_img || FcAddressBook})` }}
          ></div>
          <div className="card-underlay"></div>
          <div className="card-text">
            <div className="card-title">{title}</div>
            <div className="card-description">{description.slice(0, 100)}</div>
          </div>
          <div className="card-info">
            <div className="card-date">
              <IoTime className="icon" />
              {upDate}
            </div>
            <div className="card-verified">
              <MdVerified className="icon" />
              Verified Link
            </div>
          </div>
          <FaExternalLinkSquareAlt className="external-link-icon" />
        </a>
      </div>
    </Container>
  );
}

// CardLarge.propTypes = {
//   title: PropTypes.string.isRequired,
//   description: PropTypes.string.isRequired,
//   link: PropTypes.string.isRequired,
//   updatedAt: PropTypes.string.isRequired,
// };
export default CardLarge;
