import React, { useState, useEffect } from "react";
import { Container, Button, Row, Col, Card, Modal } from "react-bootstrap";
import axios from "axios";
import api from "../utils/api.js";
const fallbackImage = "https://images.unsplash.com/photo-1503264116251-35a269479413?q=80&w=1200&auto=format&fit=crop&sat=-20";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // const response = await axios.get("http://localhost:5000/api/admin/posts");
         const response = await api.get("/admin/posts");
        if (response.data.ok) setPosts(response.data.posts);
        else setError("Failed to load posts");
      } catch (err) {
        console.error(err);
        setError("Error fetching posts");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const openPost = (post) => {
    setSelectedPost(post);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPost(null);
  };

  // Filter posts based on search query
  const filteredPosts = posts.filter((post) => {
    const query = searchQuery.toLowerCase();
    const titleMatch = post.title.toLowerCase().includes(query);
    const contentMatch = post.content && post.content.toLowerCase().includes(query);
    return titleMatch || contentMatch;
  });

  return (
    <Container
      fluid
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#0f172a 0%, #0ea5a4 50%, #7c3aed 100%)",
        padding: "2rem 0",
        color: "#fff",
      }}
    >
      {/* Hero */}
      <Container style={{ textAlign: "center", padding: "4rem 1rem", color: "white" }}>
        <h1 style={{ fontSize: "3rem", fontWeight: 700, textShadow: "0 6px 18px rgba(0,0,0,0.4)" }}>
          Welcome to My Blog
        </h1>
        <p style={{ maxWidth: 900, margin: "1rem auto 1.5rem", color: "rgba(255,255,255,0.9)", fontSize: "1.1rem" }}>
          Discover articles, tutorials, and insights on technology, creativity, and personal growth.
        </p>
        <Button variant="light" size="lg" style={{ fontWeight: 600 }}>
          Explore Posts
        </Button>
      </Container>

      {/* Search Bar */}
      <Container style={{ marginTop: "2rem", marginBottom: "1.5rem", background: "transparent" }}>
        <div style={{ 
          maxWidth: "600px", 
          margin: "0 auto",
          display: "flex",
          gap: "0.75rem"
        }}>
          <input
            type="text"
            placeholder="Search posts by title, keywords, or alphabet..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              padding: "0.75rem 1rem",
              borderRadius: "8px",
              border: "2px solid rgba(255,255,255,0.3)",
              background: "rgba(255,255,255,0.1)",
              color: "#fff",
              fontSize: "1rem",
              transition: "all 0.3s ease",
              backdropFilter: "blur(10px)"
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "rgba(255,255,255,0.6)";
              e.target.style.background = "rgba(255,255,255,0.15)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "rgba(255,255,255,0.3)";
              e.target.style.background = "rgba(255,255,255,0.1)";
            }}
          />
          {searchQuery && (
            <Button 
              variant="light" 
              size="sm"
              onClick={() => setSearchQuery("")}
              style={{ padding: "0.75rem 1rem", fontWeight: 600 }}
            >
              Clear
            </Button>
          )}
        </div>
      </Container>

      {/* Posts */}
      <Container style={{ marginTop: "1rem", marginBottom: "3rem", background: "transparent" }}>
        <h2 style={{ marginBottom: "1.5rem", textAlign: "center", color: "#fff" }}>Latest Posts</h2>

        {loading && <p style={{ textAlign: "center", color: "#e6f7f7" }}>Loading posts...</p>}
        {error && <p style={{ textAlign: "center", color: "#ffdddd" }}>{error}</p>}

        {!loading && posts.length === 0 && (
          <p style={{ textAlign: "center", color: "#fff" }}>No posts yet. Check back soon!</p>
        )}

        {!loading && posts.length > 0 && (
          <>
            {/* Filter results message */}
            {searchQuery && (
              <p style={{ textAlign: "center", color: "#e2e8f0", marginBottom: "1rem" }}>
                Found {filteredPosts.length} result{filteredPosts.length !== 1 ? "s" : ""} for "{searchQuery}"
              </p>
            )}

            {filteredPosts.length === 0 && searchQuery && (
              <p style={{ textAlign: "center", color: "#fbbf24", fontSize: "1.1rem" }}>
                No posts match your search. Try different keywords.
              </p>
            )}

            {filteredPosts.length > 0 && (
              <Row className="g-4">
                {filteredPosts.map((post) => (
                  <Col md={4} key={post.id}>
                    <div
                      style={{
                        height: "100%",
                        borderRadius: "16px",
                        overflow: "hidden",
                        border: "1px solid rgba(255,255,255,0.1)",
                        background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
                        backdropFilter: "blur(12px)",
                        transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                        cursor: "pointer",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                        display: "flex",
                        flexDirection: "column",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
                        e.currentTarget.style.boxShadow = "0 20px 48px rgba(0,0,0,0.4)";
                        e.currentTarget.style.border = "1px solid rgba(255,255,255,0.2)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0) scale(1)";
                        e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.2)";
                        e.currentTarget.style.border = "1px solid rgba(255,255,255,0.1)";
                      }}
                    >
                      {/* Image Container */}
                      <div
                        style={{
                          position: "relative",
                          height: "280px",
                          width: "100%",
                          overflow: "hidden",
                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          flex: "0 0 auto",
                        }}
                      >
                        <img
                          src={post.image_url ? `https://blogapp-o0ah.onrender.com${post.image_url}` : fallbackImage}
                          alt={post.title}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                            transition: "transform 0.5s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "scale(1.08)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "scale(1)";
                          }}
                        />
                        {/* Overlay Gradient */}
                        <div
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 100%)",
                            zIndex: 2,
                          }}
                        />
                      </div>

                      {/* Content Container */}
                      <div
                        style={{
                          padding: "1.75rem",
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}
                      >
                        {/* Title */}
                        <div>
                          <h5
                            style={{
                              margin: "0 0 0.75rem 0",
                              color: "#fff",
                              fontSize: "1.35rem",
                              fontWeight: 700,
                              lineHeight: 1.3,
                              textShadow: "0 2px 8px rgba(0,0,0,0.2)",
                              transition: "color 0.3s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = "#a7f3d0";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = "#fff";
                            }}
                          >
                            {post.title}
                          </h5>
                        </div>

                        {/* Excerpt */}
                        <p
                          style={{
                            color: "#e2e8f0",
                            fontSize: "0.95rem",
                            lineHeight: 1.5,
                            margin: "0 0 1.25rem 0",
                            flex: 1,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {post.content ? (post.content.length > 100 ? post.content.slice(0, 100) + "..." : post.content) : "No preview available."}
                        </p>

                        {/* Footer */}
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            paddingTop: "1rem",
                            borderTop: "1px solid rgba(255,255,255,0.1)",
                          }}
                        >
                          <small
                            style={{
                              color: "#cbd5e1",
                              fontSize: "0.85rem",
                              fontWeight: 500,
                            }}
                          >
                            {new Date(post.created_at).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </small>

                          {/* Stylish Read More Button */}
                          <button
                            onClick={() => openPost(post)}
                            style={{
                              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                              color: "#fff",
                              border: "none",
                              padding: "0.6rem 1.2rem",
                              borderRadius: "8px",
                              fontSize: "0.9rem",
                              fontWeight: 600,
                              cursor: "pointer",
                              transition: "all 0.3s ease",
                              boxShadow: "0 4px 15px rgba(16, 185, 129, 0.3)",
                              letterSpacing: "0.5px",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = "linear-gradient(135deg, #059669 0%, #047857 100%)";
                              e.currentTarget.style.transform = "translateY(-2px)";
                              e.currentTarget.style.boxShadow = "0 8px 25px rgba(16, 185, 129, 0.5)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "linear-gradient(135deg, #10b981 0%, #059669 100%)";
                              e.currentTarget.style.transform = "translateY(0)";
                              e.currentTarget.style.boxShadow = "0 4px 15px rgba(16, 185, 129, 0.3)";
                            }}
                          >
                            Read More →
                          </button>
                        </div>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            )}
          </>
        )}
      </Container>

      {/* Modal for full post */}
      <Modal show={showModal} onHide={closeModal} size="lg" centered>
        <Modal.Header closeButton style={{ background: "linear-gradient(90deg,#0ea5a4,#7c3aed)", color: "#fff" }}>
          <Modal.Title>{selectedPost?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ background: "#fff", color: "#111" }}>
          {selectedPost && (
            <div>
              {selectedPost.image_url && (
                <img src={`http://localhost:5000${selectedPost.image_url}`} alt={selectedPost.title} style={{ width: "100%", maxHeight: 400, objectFit: "contain", marginBottom: 12 }} />
              )}
              <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{selectedPost.content}</div>
              <div style={{ marginTop: 12, color: "#666" }}>{new Date(selectedPost.created_at).toLocaleString()}</div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Home;
