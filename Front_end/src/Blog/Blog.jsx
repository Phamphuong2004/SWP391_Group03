import React from "react";
import BlogPosts from "../Blog";
import "./Blog.css";
import { Link } from "react-router-dom";

export default function Blog() {
  return (
    <>
      <div className="blog-container">
        <h1 className="blog-title">Danh sách bài viết Blog</h1>
        <div className="blog-list">
          {BlogPosts.map((post) => (
            <div className="blog-item" key={post.id}>
              <img className="blog-image" src={post.image} alt={post.title} />
              <div className="blog-content">
                <Link to={`/blog/${post.id}`} className="blog-title-link">
                  <h2 className="blog-post-title">{post.title}</h2>
                </Link>
                <div className="blog-meta">
                  {post.author} - {post.date}
                </div>
                <div className="blog-summary">{post.summary}</div>
                <div className="blog-tags">
                  {post.tags.map((tag) => (
                    <span className="blog-tag" key={tag}>
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
