import React from 'react';
import { FcAddressBook } from 'react-icons/fc';
import day from 'dayjs';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FaExternalLinkSquareAlt } from 'react-icons/fa';
import { IoTime } from 'react-icons/io5';
import { MdVerified } from 'react-icons/md';

function CardLarge({ title, description, link, svg_img, updatedAt }) {
  const upDate = day(updatedAt).format('MM YYYY');
  return (
    <Container>
      <div className="card">
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

const Container = styled.div`
  flex: 0 0 auto;
  width: 210px;
  height: 280px;
  background-color: var(--white);
  border-radius: var(--border-radius);
  border: 1.5px solid var(--grey-50);
  overflow: hidden;
  position: relative;
  transition: transform 0.3s ease, filter 0.3s ease;

  .card {
    display: block;
    width: 100%;
    height: 100%;
    position: relative;
    text-decoration: none;
    color: inherit;
  }

  .card-background {
    width: 140%;
    height: 140%;
    background-size: cover;
    background-position: center;
    position: absolute;
    top: 0;
    left: 0;
    transition: filter 0.3s ease;
    z-index: 1; // Behind overlay and text
  }

  .card-underlay {
    background: linear-gradient(135deg, #ffffff, #ffade7, #acaafe);
    opacity: 0.7;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
  }

  .card-overlay {
    background: linear-gradient(60deg, #66688a, #fffcfe, #606082);
    opacity: 0.2;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
  }

  .card-text {
    position: absolute;
    bottom: 40px; 
    left: 10px;
    z-index: 3;
    background: var(--white);
    padding: 5px 10px;
    border-radius: 4px;
    transition: all 0.3s ease;
    max-width: 90%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    .card-title {
      font-weight: bold;
      color: black;
    }

    .card-description {
      display: none;
      color: black;
    }
  }

  .card-info {
  position: absolute;
  bottom: 10px;
  left: 5px;
  display: flex;
  gap: 10px;
  z-index: 3;
  color: white;
  font-size: 0.8rem;

  .card-date,
  .card-verified {
    display: flex;
    align-items: center;
  }

  .icon {
    margin-right: 2px;
  }
}

  .external-link-icon {
    position: absolute;
    top: 10px;
    right: 10px;
    color: white;
    font-size: 1.5rem;
    z-index: 3;
  }

  &:hover {
    .card-background {
      filter: blur(5px); // Apply blur on hover
    }

    .card-text {
      white-space: normal;
      padding: 10px;
      .card-description {
        display: block;
      }
    }
  }
`;

export default CardLarge;
