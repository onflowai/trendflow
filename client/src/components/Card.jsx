import React from 'react';
import { CardLarge } from '../components';
import Container from '../assets/wrappers/CardContainer'; // general layout, color and loading

/**
 * Card component used in CarouselCard and displays each card
 * @returns
 */
function Card({
  title,
  description,
  link,
  updatedAt,
  svg_img,
  onDelete,
  isAdmin,
}) {
  const largeProps = {
    svg_img,
    title,
    description,
    link,
    updatedAt,
    onDelete,
    isAdmin,
  };
  console.log('largeProps ', largeProps);
  return (
    <Container>
      <CardLarge {...largeProps} />
    </Container>
  );
}

export default Card;
