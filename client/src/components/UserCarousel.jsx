import React, { useMemo } from 'react';
import styled from 'styled-components';
import { githubFullUrl } from '../utils/urlHelper';

const UserCarousel = ({ posts = [] }) => {
  const authorsOrdered = useMemo(() => {
    const sortedPosts = [...posts].sort((a, b) => {
        const da = new Date(a?.createdAt || 0).getTime();
        const db = new Date(b?.createdAt || 0).getTime();
        return da - db;
    });// sort posts by createdAt ASC earliest first

    const seen = new Set();
    const ordered = [];

    for (const post of sortedPosts) {
        const author = post?.author;
        const id = author?._id;
        if (!id) continue;
        if (!seen.has(id)) {
        seen.add(id);
        ordered.push(author);
        }
    }// unique authors in the order they first appear in sorted posts

    return ordered;
  }, [posts]);

  return (
    <Wrap>
      {authorsOrdered.map((author) => {
        const githubUsername = author?.githubUsername || '';
        const privacy = Boolean(author?.privacy);

        const githubUrl =
          githubUsername && !privacy ? `${githubFullUrl()}${githubUsername}` : null;

        const img = (
          <img
            src={author?.profile_img}
            alt={author?.username || 'User'}
            className="avatar"
            loading="lazy"
            draggable={false}
          />
        );

        return (
          <div key={author._id} className="avatar-item">
            {githubUrl ? (
              <a
                href={githubUrl}
                target="_blank"
                rel="noreferrer"
                className="avatar-link"
                aria-label={`${author?.username || 'User'} GitHub`}
                onClick={(e) => e.stopPropagation()}
              >
                {img}
              </a>
            ) : (
              img
            )}
          </div>
        );
      })}
    </Wrap>
  );
};

export default UserCarousel;

const Wrap = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  overflow-x: auto; /* scroll on overflow */
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none; /* Firefox */
  padding: 2px 0;

  &::-webkit-scrollbar {
    display: none; /* Chrome/Safari */
  }

  gap: 12px;
  justify-content: space-between;

  .avatar-item {
    position: relative;
    flex: 0 0 auto;
    transition: transform 0.15s ease, margin 0.15s ease;
  }

  .avatar-link {
    display: inline-flex;
  }

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 999px;
    object-fit: cover;
    display: block;
  }

  @media (max-width: 520px) {
    justify-content: flex-start; /* better for scroll */
    gap: 0;

    .avatar-item:not(:first-child) {
      margin-left: -20px; /* 50% overlap for 40px avatar */
    }

    .avatar-item:hover {
      z-index: 10; /* bring to front */
      transform: translateY(-1px) scale(1.06); /* “reveal” */
    }

    .avatar-item:hover:not(:first-child) {
      margin-left: 0px; /* removes overlap while hovered */
    }
  }
`;