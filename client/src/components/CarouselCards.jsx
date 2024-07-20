import React from 'react'; // Import necessary hooks
import Card from './Card';
import Container from '../assets/wrappers/CarouselCardContainer';
import PropTypes from 'prop-types';

function CarouselCards({ infoHubItems }) {
  return (
    <Container>
      <div className="cards">
        {infoHubItems.map((item) => (
          <Card key={item._id} {...item} />
        ))}
      </div>
    </Container>
  );
}

// CarouselCards.propTypes = {
//   infoHubItems: PropTypes.arrayOf(
//     PropTypes.shape({
//       _id: PropTypes.string.isRequired,
//       title: PropTypes.string.isRequired,
//       description: PropTypes.string.isRequired,
//       link: PropTypes.string.isRequired,
//       updatedAt: PropTypes.string.isRequired,
//     })
//   ).isRequired,
// };

export default CarouselCards;
