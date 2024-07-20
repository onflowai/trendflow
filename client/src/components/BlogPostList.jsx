import React, { useState } from 'react';
import BlogPost from './BlogPost';
import Container from '../assets/wrappers/BlogPostListContainer';
/**
 * BlogPostList displays all the blog posts items in BlogPost
 * @param {*} param0
 * @returns
 */
function BlogPostList({ posts }) {
  return (
    <Container>
      <div className="posts">
        {posts.map((post) => (
          <BlogPost key={post._id} {...post} />
        ))}
      </div>
    </Container>
  );
}

export default BlogPostList;
