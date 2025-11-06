import React from "react";
import { Container, Row, Col } from "react-bootstrap";

export default function Footer() {
  return (
    <footer className="bg-light text-dark py-4 mt-5" style={{backgroundColor:"rgba(199, 193, 193, 1)"}}>
      <Container>
        <Row className="text-center text-md-start">
          <Col md={4} className="mb-3">
            <h5>Project Management Tool</h5>
            <p className="small text-muted">
              Streamline your workflow, manage projects efficiently, and boost productivity.
            </p>
          </Col>

          <Col md={4} className="mb-3">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/" className="text-dark text-decoration-none">Home</a></li>
              <li><a href="/about" className="text-dark text-decoration-none">About</a></li>
              <li><a href="/contact" className="text-dark text-decoration-none">Contact</a></li>
              <li><a href="/signup" className="text-dark text-decoration-none">Signup</a></li>
            </ul>
          </Col>

          <Col md={4} className="mb-3">
            <h5>Contact</h5>
            <p className="small mb-1">📧 support@projecttool.com</p>
            <p className="small mb-1">📞 +91 98765 43210</p>
            <p className="small">📍 Delhi, India</p>
          </Col>
        </Row>

        <hr className="border-light" />

        <Row>
          <Col className="text-center">
            <p className="mb-0 small">
              © {new Date().getFullYear()} Project Management Tool. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
