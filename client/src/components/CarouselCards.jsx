import React, { useState } from 'react';
import Card from './Card';
import { AddInfoHubModal } from '../components';
import Container from '../assets/wrappers/CarouselCardContainer';
import { GoPlus } from 'react-icons/go';

function CarouselCards({ infoHubItems, isAdmin, onAdd, onDelete }) {
  const [showModal, setShowModal] = useState(false);

  const handleAddClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleAddItem = (newItemData) => {
    onAdd(newItemData);
    setShowModal(false);
  };

  return (
    <Container>
      <div className="cards">
        {isAdmin && (
          <div className="card-all add-card" onClick={handleAddClick}>
            <GoPlus className="plus-icon" />
          </div>
        )}
        {infoHubItems.map((item) => (
          <Card
            key={item._id}
            {...item}
            onDelete={onDelete}
            isAdmin={isAdmin}
          />
        ))}
      </div>
      {showModal && (
        <AddInfoHubModal onClose={handleCloseModal} onAdd={handleAddItem} />
      )}
    </Container>
  );
}

export default CarouselCards;
