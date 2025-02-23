import React, { useState } from 'react';
import Card from './Card';
import { AddInfoHubModal } from '../components';
import styled from 'styled-components';
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

const Container = styled.div`
.cards {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    gap: 20px;
    padding: 20px 0;
  }

  .cards::-webkit-scrollbar {
    display: none;
  }

  .cards {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
   .card-all {
    padding: 20px;
    cursor: pointer;
    flex: 0 0 auto;
    width: 210px;
    background-color: var(--white);
    border-radius: var(--border-radius);
    border: 1.5px solid var(--grey-50);
    display: flex;
    justify-content: center; /* Center the plus icon horizontally */
    align-items: center; /* Center the plus icon vertically */
    transition: background-color 0.3s ease;
  }

  .card:hover {
  background-color: var(--grey-50);
  }

  .add-card {
    justify-content: center;
    align-items: center;
  }
  .plus-icon {
    display: flex;
    font-size: 2rem;
    color: var(--primary);
  }
  .add-card:hover {
    background-color: var(--grey-50); /* Change color on hover */
  }
  @media (max-width: 868px) {
    .card-all {
      width: 160px;
      padding: 10px;
    }
    .plus-icon {
      font-size: 1.5rem;
    }
  }
`;

export default CarouselCards;
