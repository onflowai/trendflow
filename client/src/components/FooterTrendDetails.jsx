import React from 'react';
import styled from 'styled-components';
import { UserImgSmall } from '../components';
import { githubFullUrl } from '../utils/urlHelper';
import day from 'dayjs';
/**
 * FooterTrendDetails displays blog trend creator author and the last time it was update
 * if blogEditedAt is newer than updatedAt's formatted month/year, show blogDate
 * have "MM YYYY" for lastUpDate so compare using blogEditedAt vs createdBy/updatedAt unknown actual date here
 * 
 * @param {*} param0 
 * @returns 
 */
function FooterTrendDetails({ lastUpDate, createdBy, blogLastEditedBy, blogEditedAt }) {
  const isDeleted = createdBy?.isDeleted;

  const githubUrl = createdBy?.githubUsername
    ? `${githubFullUrl()}${createdBy.githubUsername}`
    : null;

  const sameEditor =
    blogLastEditedBy?._id &&
    createdBy?._id &&
    String(blogLastEditedBy._id) === String(createdBy._id);
  console.log(createdBy);
  console.log(blogLastEditedBy);
  const hasBlogEditDate = !!blogEditedAt;
  const blogDate = hasBlogEditDate ? day(blogEditedAt).format('MM YYYY') : null;
  const displayedDate = blogDate || lastUpDate;
  const displayedLabel = blogDate ? 'Blog updated:' : 'Last updated:';

  return (
    <Container>
      <div className="left-section">
        <div className="label">Submitted by:</div>

        <div className="user-stack">
          <div className="user-row">
            <UserImgSmall
              isDeleted={isDeleted}
              className="img"
              user_img={createdBy?.profile_img}
              githubUrl={githubUrl}
            />
            <div className={`username ${isDeleted ? 'deleted-user' : ''}`}>
              {createdBy?.username}
            </div>
          </div>

          {!sameEditor && blogLastEditedBy && (
            <div className="user-row sub-user-row">
              <span className="tree">└─</span>
              <UserImgSmall
                isDeleted={blogLastEditedBy?.isDeleted}
                className="img small-img"
                user_img={blogLastEditedBy?.profile_img}
                githubUrl={
                  blogLastEditedBy?.githubUsername
                    ? `${githubFullUrl()}${blogLastEditedBy.githubUsername}`
                    : null
                }
              />
              <div className={`username ${blogLastEditedBy?.isDeleted ? 'deleted-user' : ''}`}>
                {blogLastEditedBy?.username}
              </div>
              <span className="sub-label">(edited blog)</span>
            </div>
          )}
        </div>
      </div>

      <div className="right-section">
        <div className="label">{displayedLabel}</div>
        <div className="date">{displayedDate}</div>
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
    align-items: flex-start;
    gap: 0.5rem;
  }

  .user-stack {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  .user-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .sub-user-row {
    margin-left: 0.25rem;
    opacity: 0.95;
  }

  .tree {
    color: var(--grey-70);
    font-family: monospace;
  }

  .sub-label {
    color: var(--grey-70);
    font-size: 0.85rem;
  }

  .right-section {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.5rem;

    .date {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.3rem 0.6rem;
      border-radius: var(--round-radius);
      background: var(--grey-300);
      color: var(--white);
    }
  }

  .label {
    color: #888;
  }

  .deleted-user {
    opacity: 0.6;
    filter: grayscale(80%);
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
      margin-bottom: 0.5rem;
    }

    .right-section {
      flex-direction: row;
      align-items: center;
    }

    .left-section .username {
      margin-left: 0.5rem;
    }
  }
`;

export default FooterTrendDetails;