import React, { useState } from "react";
import { Container, Form, Button, Card } from "react-bootstrap";
import { loginAdmin } from "../controllers/LoginController";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate(); // ✅ FIXED
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const data = await loginAdmin(email, password);

      // optional: store user/token
      login(data);

      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Invalid login credentials");
    }
  };

  return (
    <Container
      fluid
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8f9fa",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "25px",
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <Card.Body>
          <h3 className="text-center mb-4">Login</h3>

          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 mt-2">
              Login
            </Button>
          </Form>

          <p className="text-center text-muted mt-3" style={{ fontSize: "0.9rem" }}>
            Don’t have an account? Sign up
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;
