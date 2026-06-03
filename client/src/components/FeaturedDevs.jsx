import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { FaGithub } from 'react-icons/fa';
import LoadingBar from './LoadingBar';

const isSafeGithubPart = (value = '') => {
  return /^[a-zA-Z0-9_.-]+$/.test(value);
};

const normalizeBlockedUsers = (notOnTheList) => {
  if (!notOnTheList) return new Set();

  const list = Array.isArray(notOnTheList)
    ? notOnTheList
    : String(notOnTheList).split(',');

  return new Set(
    list
      .map((name) => String(name).trim().replace(/^@/, '').toLowerCase())
      .filter(Boolean)
  );
};

const normalizeCssSize = (value, fallback = '54px') => {
  if (!value) return fallback;
  if (typeof value === 'number') return `${value}px`;
  return String(value);
};

const FeaturedDevs = ({
  owner = 'facebook',
  repo = 'react',
  limit = 10,
  title = 'devs:',
  commits = true,
  notOnTheList = '',
  maxWidth = '100%',
  imageMaxWidth = 54,
}) => {
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const blockedUsers = useMemo(
    () => normalizeBlockedUsers(notOnTheList),
    [notOnTheList]
  );

  const imageSize = useMemo(
    () => normalizeCssSize(imageMaxWidth, '54px'),
    [imageMaxWidth]
  );

  const githubUrl = useMemo(() => {
    if (!isSafeGithubPart(owner) || !isSafeGithubPart(repo)) return null;

    const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 30);
    return `https://api.github.com/repos/${owner}/${repo}/contributors?per_page=${safeLimit}&anon=false`;
  }, [owner, repo, limit]);

  useEffect(() => {
    if (!githubUrl) {
      setErrorMsg('Invalid GitHub owner or repo.');
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchContributors = async () => {
      try {
        setLoading(true);
        setErrorMsg('');

        const response = await fetch(githubUrl, {
          signal: controller.signal,
          headers: {
            Accept: 'application/vnd.github+json',
          },
        });

        if (!response.ok) {
          throw new Error(`GitHub request failed: ${response.status}`);
        }

        const data = await response.json();

        const cleanContributors = data
          .filter((dev) => dev?.login && dev?.avatar_url)
          .filter((dev) => !blockedUsers.has(dev.login.toLowerCase()))
          .map((dev) => ({
            id: dev.id,
            username: dev.login,
            avatar: dev.avatar_url,
            profileUrl: dev.html_url,
            contributions: dev.contributions,
          }));

        setContributors(cleanContributors);
      } catch (error) {
        if (error.name !== 'AbortError') {
          setErrorMsg('Could not load GitHub contributors.');
          console.error(error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchContributors();

    return () => controller.abort();
  }, [githubUrl, blockedUsers]);

  if (loading) {
  return (
    <Container $maxWidth={maxWidth} $imageSize={imageSize}>
      <h3>{title}</h3>
      <div className="loading-wrap">
        <LoadingBar />
      </div>
    </Container>
  );
}

  if (errorMsg) {
    return (
      <Container $maxWidth={maxWidth} $imageSize={imageSize}>
        <p className="status-text error">{errorMsg}</p>
      </Container>
    );
  }

  if (!contributors.length) return null;

  return (
    <Container $maxWidth={maxWidth} $imageSize={imageSize}>
      <h3>{title}</h3>

      <div className="dev-scroll">
        {contributors.map((dev) => (
          <a
            className="dev-button"
            key={dev.id}
            href={dev.profileUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open ${dev.username} on GitHub`}
          >
            <div className="avatar-wrap">
              <img src={dev.avatar} alt={`${dev.username} GitHub avatar`} />

              <span className="github-badge">
                <FaGithub />
              </span>
            </div>

            <div className="dev-info">
              <span className="username">@{dev.username}</span>

              {commits && (
                <span className="commits">{dev.contributions} commits</span>
              )}
            </div>
          </a>
        ))}
      </div>
    </Container>
  );
};

const Container = styled.section`
  --dev-img-size: ${({ $imageSize }) => $imageSize};
  --dev-button-height: calc(var(--dev-img-size) + 0.7rem);

.loading-wrap {
  flex: 1;
  min-width: 90px;
  max-width: 100%;
  display: flex;
  align-items: center;
}

.loading-wrap > * {
  width: 100%; //forces LoadingBar to scale inside the right side
}

  width: 100%;
  max-width: ${({ $maxWidth }) => $maxWidth || '100%'};
  display: flex;
  align-items: center;
  gap: 0.85rem;
  overflow: hidden;

  h3 {
    flex: 0 0 auto;
    margin: 0;
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--text-color);
    white-space: nowrap;
  }

  .dev-scroll {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 0.65rem;
    overflow-x: auto;
    overflow-y: hidden;
    padding: 0.25rem 0.25rem 0.45rem;
    scroll-snap-type: x proximity;
    -webkit-overflow-scrolling: touch;
  }

  .dev-scroll::-webkit-scrollbar {
    height: 5px;
  }

  .dev-scroll::-webkit-scrollbar-thumb {
    border-radius: 999px;
    background: var(--border-color);
  }

  .dev-button {
    flex: 0 0 auto;
    min-width: calc(var(--dev-img-size) + 6.75rem); //responsive to image size
    max-width: calc(var(--dev-img-size) + 10rem); //responsive to image size
    min-height: var(--dev-button-height);
    display: flex;
    align-items: center;
    gap: 0.65rem;
    padding: 0.35rem 0.8rem 0.35rem 0.35rem;
    text-decoration: none;
    color: var(--text-color);
    border: 1.5px solid transparent;
    border-radius: var(--input-radius-round);
    transition:
      transform 0.2s ease,
      border-color 0.2s ease,
      box-shadow 0.2s ease;
    scroll-snap-align: start;
  }

  .dev-button:hover {
    border-color: var(--button-action-hover, var(--primary-200));
    box-shadow: 0 0 0 5px
      color-mix(in srgb, var(--button-action-hover, #7c3aed) 5%, transparent);
  }

  .avatar-wrap {
    position: relative;
    flex: 0 0 var(--dev-img-size);
    width: var(--dev-img-size);
    height: var(--dev-img-size);
    border-radius: 999px;
  }

  img {
    width: var(--dev-img-size);
    height: var(--dev-img-size);
    display: block;
    border-radius: 999px;
    object-fit: cover;
  }

  .github-badge {
    position: absolute;
    right: -4px;
    bottom: -3px;
    width: calc(var(--dev-img-size) * 0.38); //badge scales with image
    height: calc(var(--dev-img-size) * 0.38);
    min-width: 18px;
    min-height: 18px;
    max-width: 24px;
    max-height: 24px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    color: var(--text-color);
    background: var(--background-color);
    border: 1px solid var(--border-color);
    font-size: calc(var(--dev-img-size) * 0.22);
  }

  .dev-info {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.12rem;
  }

  .username {
    max-width: 8rem;
    font-size: 0.78rem;
    font-weight: 700;
    line-height: 1.1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .commits {
    max-width: 8rem;
    font-size: 0.68rem;
    color: var(--text-secondary-color, var(--grey-500));
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .status-text {
    margin: 0;
    font-size: 0.85rem;
    color: var(--text-secondary-color, var(--grey-500));
  }

  .error {
    color: var(--red-dark, #dc2626);
  }

  @media (max-width: 520px) {
    gap: 0.6rem;

    .dev-scroll {
      gap: 0.55rem;
      padding-bottom: 0.6rem;
    }

    .dev-button {
      min-width: calc(var(--dev-img-size) + 5.75rem);
      max-width: calc(var(--dev-img-size) + 8rem);
      padding-right: 0.65rem;
    }

    .username,
    .commits {
      max-width: 6.5rem;
    }
  }
`;

export default FeaturedDevs;