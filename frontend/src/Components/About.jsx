import React from "react";
import { Container, Card } from "react-bootstrap";

const About = () => {
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
          maxWidth: "700px",
          width: "100%",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <Card.Body>
          <Card.Title
            style={{
              fontSize: "2rem",
              marginBottom: "15px",
              textAlign: "center",
            }}
          >
            About This Blog
          </Card.Title>

          <Card.Text
            style={{
              fontSize: "1.05rem",
              color: "#6c757d",
              lineHeight: "1.7",
              textAlign: "center",
            }}
          >
            This blog platform was created to share meaningful stories,
            technical tutorials, and helpful resources for learners and
            developers. Our goal is to inspire growth, curiosity, and
            creativity through well-written content.
          </Card.Text>

          <Card.Text
            style={{
              fontSize: "1.05rem",
              color: "#6c757d",
              lineHeight: "1.7",
              textAlign: "center",
              marginTop: "10px",
            }}
          >
            Built with React and modern web technologies, this project is part
            of a learning journey into full-stack web development.
          </Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default About;
