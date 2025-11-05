import React from "react";
import { Button, Container, Row, Col,Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Navbar from "./navbar";
import Footer from "./footer";

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
    

      <div style={{backgroundColor: "#f4f7fc"}}></div>
      <div className="bg-light min-vh-100 d-flex align-items-center">
        <Container className="mt-5 pt-5">
          <Row className="align-items-center">
            {/* Left Text */}
            <Col md={6} className="text-md-start text-center">
              <h1 className="fw-bold display-5 mb-3 text-primary">
                Welcome to{" "}
                <span className="text-dark">Project Management Tool</span>
              </h1>
              <p className="lead text-secondary mb-4">
                Manage your projects, track progress, and collaborate with your
                team — all in one place.
              </p>
              <div className="d-flex justify-content-md-start justify-content-center gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate("/signup")}
                >
                  Get Started
                </Button>
                <Button
                  variant="outline-primary"
                  size="lg"
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
              </div>
            </Col>

            {/* Right Image */}
            <Col md={6} className="text-center mt-5 mt-md-0">
              <img
                src="https://plus.unsplash.com/premium_vector-1683141147347-c6aa70127df2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvamVjdHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=900"
                alt="Project Management Illustration"
                className="img-fluid"
                style={{ maxWidth: "600px", height: "500px", borderRadius: "10px" }}
              />
            </Col>
          </Row>
        </Container>

      </div>
      
    </>
  );
}
