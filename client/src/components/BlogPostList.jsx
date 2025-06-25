import React, { useState } from 'react';
import BlogPost from './BlogPost';
import Container from '../assets/wrappers/BlogPostListContainer';
/**
 * BlogPostList displays all the blog posts items in BlogPost
 * @param {*} param0
 * @returns
 */
function BlogPostList({ posts, user, isPublic, guestUser }) {
  const blogPosts = Array.isArray(posts) ? posts : []; // if posts not an array define fallback
  return (
    <Container>
      <div className="posts">
        {blogPosts.map((post) => (
          <BlogPost
            key={post._id}
            {...post}
            user={user}
            isPublic={isPublic}
            guestUser={guestUser}
          />
        ))}
      </div>
    </Container>
  );
}

export default BlogPostList;
