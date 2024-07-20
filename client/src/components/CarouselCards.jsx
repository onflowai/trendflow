import React, { useState } from 'react'; // Import necessary hooks
import Card from './Card';
import { AddInfoHubModal } from '../components';
import Container from '../assets/wrappers/CarouselCardContainer';
import PropTypes from 'prop-types';
import { GoPlus } from 'react-icons/go';

function CarouselCards({ infoHubItems, isAdmin }) {
  const [showModal, setShowModal] = useState(false);
  const [items, setItems] = useState(infoHubItems);

  const handleAddClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleAddItem = (newItem) => {
    setItems([...items, newItem]);
  };

  return (
    <Container>
      <div className="cards">
        {isAdmin && (
          <div className="card add-card" onClick={handleAddClick}>
            <GoPlus className="plus-icon" />
          </div>
        )}
        {items.map((item) => (
          <Card key={item._id} {...item} />
        ))}
      </div>
      {showModal && (
        <AddInfoHubModal onClose={handleCloseModal} onAdd={handleAddItem} />
      )}
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
