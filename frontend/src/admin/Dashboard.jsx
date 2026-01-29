import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Modal } from "react-bootstrap";
import { loginAdmin } from "../controllers/LoginController.jsx";
import "./dashboard.css";
import api from "../utils/api.js";

const Dashboard = () => {
  // Create/Edit Post State
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  // Posts State
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [postsError, setPostsError] = useState(null);

  // Modal State
  const [showPostModal, setShowPostModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [activeNav, setActiveNav] = useState("posts");

  // Edit State
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editFile, setEditFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);

  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

  // File handling
  const handleFileChange = (e) => {
    const selected = (e.target.files && e.target.files[0]) || null;
    setFile(selected);
    if (selected) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(selected);
    }
  };

  const handleEditFileChange = (e) => {
    const selected = (e.target.files && e.target.files[0]) || null;
    setEditFile(selected);
    if (selected) {
      const reader = new FileReader();
      reader.onloadend = () => setEditImagePreview(reader.result);
      reader.readAsDataURL(selected);
    }
  };

  // Publish handler
  const handlePublish = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      if (file) formData.append("image", file);

      // const res = await axios.post("http://localhost:5000/api/admin/create", formData, {
      //   withCredentials: true,
      //   headers: { "Content-Type": "multipart/form-data" },
      // });
      const res = await api.post("/admin/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }); 
      
      console.log(res);
      setContent("");
      setTitle("");
      setFile(null);
      setImagePreview(null);
      alert("✓ Post published successfully!");
      fetchPosts();
    } catch (err) {
      console.error(err);
      alert("Failed to publish post");
    }
  };

  // Fetch posts
  const fetchPosts = async () => {
    try {
      setLoadingPosts(true);
      // const res = await axios.get("http://localhost:5000/api/admin/posts");
       const res = await api.get("/admin/posts");
      if (res.data?.ok) setPosts(res.data.posts);
      else setPostsError("Failed to load posts");
    } catch (err) {
      console.error(err);
      setPostsError("Error fetching posts");
    } finally {
      setLoadingPosts(false);
    }
  };

  // Update post handler
  const handleUpdatePost = async (e) => {
    e.preventDefault();
    if (!selectedPost?.id) return;
    try {
      const formData = new FormData();
      formData.append("title", editTitle);
      formData.append("content", editContent);
      if (editFile) formData.append("image", editFile);

      const response = await api.put(`/admin/posts/${selectedPost.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      console.log(response);
      alert("✓ Post updated successfully!");
      closeEditModal();
      fetchPosts();
    } catch (err) {
      console.error(err);
      alert("Failed to update post");
    }
  };

  // Delete post handler
  const handleDeletePost = async () => {
    if (!selectedPost?.id) return;
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try { 
      const response = await api.delete(`/admin/posts/${selectedPost.id}`);
      
      console.log(response);
      alert("✓ Post deleted successfully!");
      closePostModal();
      fetchPosts();
    } catch (err) {
      console.error(err);
      alert("Failed to delete post");
    }
  };

  // Open modals
  const openPost = (post) => {
    setSelectedPost(post);
    setShowPostModal(true);
  };

  const openEditModal = (post) => {
    setSelectedPost(post);
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditFile(null);
    setEditImagePreview(null);
    setShowEditModal(true);
  };

  // Close modals
  const closePostModal = () => {
    setShowPostModal(false);
    setSelectedPost(null);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedPost(null);
    setEditTitle("");
    setEditContent("");
    setEditFile(null);
    setEditImagePreview(null);
  };

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginForm;
    try {
      const res = await loginAdmin(email, password);
      if (res.ok) setIsLoggedIn(true);
      else alert(res.data?.message || "Login failed");
    } catch (err) {
      console.error(err);
      alert("Login error");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <h1>📝 Blog Admin</h1>
        </div>
        <nav className="sidebar-nav">
          <div
            className={`nav-item ${activeNav === "posts" ? "active" : ""}`}
            onClick={() => setActiveNav("posts")}
          >
            📚 All Posts
          </div>
          <div
            className={`nav-item ${activeNav === "create" ? "active" : ""}`}
            onClick={() => setActiveNav("create")}
          >
            ✍️ Create Post
          </div>
          <div
            className={`nav-item ${activeNav === "settings" ? "active" : ""}`}
            onClick={() => setActiveNav("settings")}
          >
            ⚙️ Settings
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        {/* Header */}
        <div className="dashboard-header">
          <h2>Blog Dashboard</h2>
          <p>Manage your posts with ease and elegance</p>
        </div>

        {/* Posts View */}
        {activeNav === "posts" && (
          <div className="dashboard-grid">
            <div className="panel">
              <div className="panel-header">
                <div className="panel-icon">📚</div>
                <h3 className="panel-title">Recent Posts</h3>
              </div>
              
              {loadingPosts && <p style={{ color: "#cbd5e1" }}>Loading posts...</p>}
              {postsError && <p style={{ color: "#ef4444" }}>{postsError}</p>}
              
              {!loadingPosts && posts.length === 0 && (
                <p style={{ color: "#cbd5e1", textAlign: "center" }}>No posts yet. Create your first post! 🚀</p>
              )}

              {!loadingPosts && posts.length > 0 && (
                <div className="posts-list">
                  {posts.map((p) => (
                    <div key={p.id} className="post-item">
                      <div className="post-item-header">
                        <h4 className="post-item-title">{p.title}</h4>
                        <span className="post-item-badge">#{p.id}</span>
                      </div>
                      <p className="post-item-excerpt">
                        {p.content ? p.content.slice(0, 140) + (p.content.length > 140 ? "..." : "") : "No preview"}
                      </p>
                      <p className="post-item-date">
                        {new Date(p.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      <div className="post-item-actions">
                        <Button
                          size="sm"
                          className="btn-secondary"
                          onClick={() => openPost(p)}
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          className="btn-warning"
                          onClick={() => openEditModal(p)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          className="btn-danger"
                          onClick={() => { setSelectedPost(p); handleDeletePost(); }}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Create Post View */}
        {activeNav === "create" && (
          <div className="dashboard-grid">
            <div className="panel">
              <div className="panel-header">
                <div className="panel-icon">✍️</div>
                <h3 className="panel-title">Create New Post</h3>
              </div>

              <Form onSubmit={handlePublish}>
                <div className="form-group">
                  <label className="form-label">Post Title</label>
                  <input
                    type="text"
                    className="form-input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter an engaging title..."
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Featured Image (Optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="form-input"
                    onChange={handleFileChange}
                  />
                  {imagePreview && (
                    <div className="image-preview-frame">
                      <img src={imagePreview} alt="Preview" className="image-preview-img" />
                    </div>
                  )}
                  {file && <small style={{ color: "#cbd5e1" }}>Selected: {file.name}</small>}
                </div>

                <div className="form-group">
                  <label className="form-label">Post Content</label>
                  <textarea
                    className="form-textarea"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your amazing content here..."
                    rows={10}
                    required
                  />
                </div>

                <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                  <Button type="button" className="btn-secondary" onClick={() => { setTitle(""); setContent(""); setFile(null); setImagePreview(null); }}>
                    Clear
                  </Button>
                  <Button type="submit" className="btn-primary">
                    Publish Post
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        )}

        {/* Settings View */}
        {activeNav === "settings" && (
          <div className="dashboard-grid">
            <div className="panel">
              <div className="panel-header">
                <div className="panel-icon">⚙️</div>
                <h3 className="panel-title">Account Settings</h3>
              </div>

              {!isLoggedIn ? (
                <Form onSubmit={handleLogin}>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-input"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      placeholder="your@email.com"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-input"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      placeholder="Enter your password"
                      required
                    />
                  </div>

                  <Button type="submit" className="btn-primary" style={{ width: "100%" }}>
                    Login to Dashboard
                  </Button>
                </Form>
              ) : (
                <div>
                  <div className="settings-info">
                    <span className="settings-info-text">✓ You are logged in</span>
                    <span className="settings-info-badge">ADMIN</span>
                  </div>
                  <Button
                    className="btn-danger"
                    onClick={() => setIsLoggedIn(false)}
                    style={{ width: "100%" }}
                  >
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* View Post Modal */}
      <Modal show={showPostModal} onHide={closePostModal} size="lg" centered>
        <Modal.Header closeButton className="modal-header">
          <Modal.Title>{selectedPost?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPost && (
            <div>
              {selectedPost.image_url && (
                <img
                  src={`http://localhost:5000${selectedPost.image_url}`}
                  alt={selectedPost.title}
                  className="modal-post-image"
                  style={{
                    width: "100%",
                    maxHeight: "500px",
                    maxWidth: "100%",
                    height: "auto",
                    objectFit: "contain",
                    display: "block",
                    margin: "0 auto 1.5rem",
                    borderRadius: "12px"
                  }}
                />
              )}
              <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.6, color: "#0f172a" }}>
                {selectedPost.content}
              </div>
              <div style={{ marginTop: "1.5rem", fontSize: "0.85rem", color: "#64748b" }}>
                {new Date(selectedPost.created_at).toLocaleString()}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn-secondary" onClick={closePostModal}>Close</Button>
          <Button className="btn-warning" onClick={() => { closePostModal(); openEditModal(selectedPost); }}>Edit</Button>
          <Button className="btn-danger" onClick={handleDeletePost}>Delete</Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Post Modal */}
      <Modal show={showEditModal} onHide={closeEditModal} size="lg" centered>
        <Modal.Header closeButton className="modal-header">
          <Modal.Title>Edit Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPost && (
            <Form onSubmit={handleUpdatePost}>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Content</label>
                <textarea
                  className="form-textarea"
                  rows={6}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Update Image (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-input"
                  onChange={handleEditFileChange}
                />
                {editImagePreview && (
                  <div className="image-preview-frame">
                    <img src={editImagePreview} alt="Preview" className="image-preview-img" />
                  </div>
                )}
                {selectedPost.image_url && !editImagePreview && (
                  <div className="image-preview-frame">
                    <img
                      src={`http://localhost:5000${selectedPost.image_url}`}
                      alt="Current"
                      className="image-preview-img"
                    />
                  </div>
                )}
              </div>
              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                <Button type="button" className="btn-secondary" onClick={closeEditModal}>Cancel</Button>
                <Button type="submit" className="btn-primary">Save Changes</Button>
              </div>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Dashboard;
  
