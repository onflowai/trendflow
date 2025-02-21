import React from 'react';
import { CardLarge, CardSmall } from '../components';
import Container from '../assets/wrappers/CardContainer'; // general layout, color and loading
import useWindowSize from '../hooks/useWindowSize';

/**
 * Card component used in CarouselCard and displays each card
 * @returns
 */
function Card({
  _id,
  title,
  description,
  link,
  updatedAt,
  svg_img,
  onDelete,
  isAdmin,
}) {
  // 768px is a common breakpoint for tablets/mobile
  const isMobile = useWindowSize();

  const sharedProps = {
    _id,
    svg_img,
    title,
    description,
    link,
    updatedAt,
    onDelete,
    isAdmin,
  };

  return (
    <Container>
      {isMobile ? (
        <CardSmall {...sharedProps} />
      ) : (
        <CardLarge {...sharedProps} />
      )}
    </Container>
  );
}

export default Card;
