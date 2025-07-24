import React from "react";
import { useParams, Link } from "react-router-dom";
import BlogPosts from "../Blog";
import "./Blog.css";

export default function BlogDetail() {
  const { id } = useParams();
  const post = BlogPosts.find((p) => p.id === id);

  if (!post) return <div>Bài viết không tồn tại.</div>;

  return (
    <div className="blog-detail-container">
      <div
        className="alert alert-info"
        style={{ marginBottom: 20, borderRadius: 12, fontWeight: 500 }}
      >
        Bạn đang xem chi tiết bài viết. Nhấn "<b>← Quay lại danh sách</b>" để
        trở về trang blog.
      </div>
      <Link to="/blog" className="blog-back-link">
        ← Quay lại danh sách
      </Link>
      <h1 className="blog-post-title">{post.title}</h1>
      <div className="blog-meta">
        {post.author} - {post.date}
      </div>
      <img className="blog-image" src={post.image} alt={post.title} />
      <div className="blog-summary">{post.summary}</div>
      <div className="blog-content-detail">{post.content}</div>

      {/* Điểm nổi bật */}
      {post.keyPoints && post.keyPoints.length > 0 && (
        <div className="blog-section">
          <h3>Điểm nổi bật</h3>
          <ul>
            {post.keyPoints.map((point, idx) => (
              <li key={idx}>{point}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Chi tiết chuyên sâu */}
      {post.details && post.details.length > 0 && (
        <div className="blog-section">
          <h3>Chi tiết chuyên sâu</h3>
          <ul>
            {post.details.map((detail, idx) => (
              <li key={idx}>{detail}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Dịch vụ liên quan */}
      {post.relatedServices && post.relatedServices.length > 0 && (
        <div className="blog-section">
          <h3>Dịch vụ liên quan</h3>
          <ul>
            {post.relatedServices.map((service) => (
              <li key={service.id}>{service.name}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Đọc thêm */}
      {post.furtherReading && post.furtherReading.length > 0 && (
        <div className="blog-section">
          <h3>Đọc thêm</h3>
          <ul>
            {post.furtherReading.map((item) => (
              <li key={item.id}>
                <Link to={`/blog/${item.id}`}>{item.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Hỏi đáp */}
      {post.faq && post.faq.length > 0 && (
        <div className="blog-section">
          <h3>Hỏi đáp</h3>
          <ul>
            {post.faq.map((item, idx) => (
              <li key={idx}>
                <strong>Q:</strong> {item.question}
                <br />
                <strong>A:</strong> {item.answer}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tài liệu tham khảo */}
      {post.references && post.references.length > 0 && (
        <div className="blog-section">
          <h3>Tài liệu tham khảo</h3>
          <ul>
            {post.references.map((ref, idx) => (
              <li key={idx}>
                <a href={ref} target="_blank" rel="noopener noreferrer">
                  {ref}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Thông tin tác giả */}
      {(post.authorBio || post.contactInfo) && (
        <div className="blog-section">
          <h3>Thông tin tác giả</h3>
          {post.authorBio && <div>{post.authorBio}</div>}
          {post.contactInfo && <div>{post.contactInfo}</div>}
        </div>
      )}

      {/* Tag */}
      {post.tags && post.tags.length > 0 && (
        <div className="blog-tags">
          {post.tags.map((tag) => (
            <span className="blog-tag" key={tag}>
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
