import React from 'react';
import styled from 'styled-components';
import { UserImgSmall } from '../components';
import { githubFullUrl } from '../utils/urlHelper';

function FooterTrendDetails({ lastUpDate, createdBy }) {
  const githubUrl = createdBy.githubUsername
    ? `${githubFullUrl()}${createdBy.githubUsername}`
    : null; //creating the github url of user who created trend
  return (
    <Container>
      <div className="left-section">
        <div className="label">Submitted by:</div>
        <UserImgSmall
          className="img"
          user_img={createdBy.profile_img}
          githubUrl={githubUrl}
        />
        <div className="username">{createdBy.username}</div>
      </div>
      <div className="right-section">
        <div className="label">Last updated:</div>
        <div className="date">{lastUpDate}</div>
      </div>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;

  .left-section {
    display: flex;
    align-items: center;
    gap: 0.5rem; // Closer spacing between label and image
  }

  .right-section {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.5rem;

    .date {
    display: flex;
    align-items: center;
    gap: 0.6rem; // space between icon and text
    padding: 0.6rem 1rem; // internal padding
    border-radius: var(--round-radius); // rounded corners
    background: var(--grey-50); // gray box background
    color: var(--grey-900); // text color
    }
  }

  .label {
    color: #888; // Lighter gray color for labels
  }

  @media (max-width: 991px) {
    flex-direction: column;
    align-items: flex-start;

    .left-section,
    .right-section {
      width: 100%;
      justify-content: flex-start;
      align-items: center;
      gap: 0.5rem;
    }

    .right-section {
      flex-direction: row;
    }

    .left-section .username {
      margin-left: 0.5rem; // Adjust margin for small screens if needed
    }
  }
`;

export default FooterTrendDetails;
