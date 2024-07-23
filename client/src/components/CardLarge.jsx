import React from 'react';
import { FcAddressBook } from 'react-icons/fc';
import PropTypes from 'prop-types';
import styled from 'styled-components';

function CardLarge({ title, description, link, svg_img }) {
  return (
    <Container>
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
        <div className="card-overlay"></div> {/* Blur effect behind SVG */}
        <div className="card-text">
          <div className="card-title">{title}</div>
          <div className="card-description">{description.slice(0, 100)}</div>
        </div>
      </a>
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
  
`;

export default CardLarge;
