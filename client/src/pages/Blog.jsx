import React, { useState } from 'react';
import { useLoaderData, useOutletContext, Link } from 'react-router-dom';
import {
  Tooltip,
  BlogPostList,
  SEOProtected,
  ProfileHeader,
  CarouselCards,
} from '../components';
import customFetch from '../utils/customFetch';
import Container from '../assets/wrappers/BlogContainer';
import { toast } from 'react-toastify';
import { CiCirclePlus } from 'react-icons/ci';

/**
 * Blog.jsx displays the infoHub cards (lets user create and delete them) and displays the blog posts
 * @returns
 */
export const loader = async () => {
  try {
    const [postsResponse, infoHubResponse] = await Promise.all([
      customFetch.get('/blogs'),
      customFetch.get('/infohub'),
    ]); // Fetch blog posts and infoHub cards concurrently

    const posts = postsResponse.data;
    const infoHubItems = infoHubResponse.data;

    return { posts, infoHubItems };
  } catch (error) {
    toast.error('Failed to load blog posts or infoHub items');
    return { error: error.message };
  }
};

const Blog = () => {
  const { user } = useOutletContext();
  const isAdmin = user?.role === 'admin'; // is the user is an admin
  const currentDate = new Date().toLocaleDateString(); //date formatting
  const { posts, infoHubItems: initialInfoHubItems, error } = useLoaderData();
  const [infoHubItems, setInfoHubItems] = useState(initialInfoHubItems);

  const authors = posts
    .map((post) => post.author)
    .filter(
      (author, index, self) =>
        self.findIndex((a) => a._id === author._id) === index
    )
    .slice(0, 16); // getting unique authors from the posts limit to 16 authors

  //deleting info hub
  const handleDeleteHubItem = async (id) => {
    try {
      await customFetch.delete(`/infohub/delete/${id}`);
      setInfoHubItems((prevItems) =>
        prevItems.filter((item) => item._id !== id)
      );
      toast.success('Item deleted successfully');
    } catch (error) {
      console.error('Failed to delete item:', error);
      toast.error('Failed to delete item');
    }
  };

  if (error) {
    return <div>Error loading blogs: {error}</div>;
  }

  return (
    <Container>
      <SEOProtected />
      <div className="carousel-section">
        <div className="profile-header">
          <ProfileHeader user={user} message="Explore useful news and blogs" />
        </div>
        <div className="carousel-container">
          <CarouselCards
            infoHubItems={infoHubItems}
            isAdmin={isAdmin}
            onDelete={handleDeleteHubItem}
          />
        </div>
      </div>
      <div className="blog-container">
        <div className="admin-section">
          {isAdmin ? (
            <>
              <Tooltip description="Create Blog" xOffset={-15} yOffset={-80}>
                <Link to="/dashboard/create-blog" className="add-blog">
                  <CiCirclePlus className="add-icon" />
                </Link>
              </Tooltip>
              <img src={user.profile_img} alt="Admin" className="admin-img" />
              <div className="line"></div>
              <div className="current-date">{currentDate}</div>
            </>
          ) : (
            <>
              <div className="contributors">Contributors:</div>
              <div className="author-list">
                {authors.map((author) => (
                  <img
                    key={author._id}
                    src={author.profile_img}
                    alt={author.username}
                    className="author-img"
                  />
                ))}
              </div>
              <div className="line"></div>
              <div className="current-date">{currentDate}</div>
            </>
          )}
        </div>
        <div className="blog-content">
          <BlogPostList posts={posts} user={user} />
        </div>
      </div>
    </Container>
  );
};

export default Blog;
