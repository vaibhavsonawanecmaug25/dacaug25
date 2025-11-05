import React from "react";
import { Container, Row, Col, Card, Badge } from "react-bootstrap";

export default function About() {
  return (
    <div className="bg-light min-vh-100 py-5">
      <Container className="pt-5 mt-4">
        {/* Header Section */}
        <div className="text-center mb-5">
          <h2 className="fw-bold text-primary">About Us</h2>
          <p className="text-secondary fs-5">
            Learn more about our project, our goals, and the technologies that make it possible.
          </p>
        </div>

        {/* Mission & Vision Section */}
        <Row className="g-4">
          <Col md={6}>
            <Card className="h-100 shadow-sm border-0">
              <Card.Body>
                <Card.Title className="fw-bold text-dark mb-3">
                  Our Mission
                </Card.Title>
                <Card.Text className="text-secondary">
                  Our mission is to simplify project management by providing an
                  intuitive and efficient tool that enables teams to plan, track,
                  and deliver projects successfully. We aim to bring productivity
                  and collaboration together in one seamless platform.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="h-100 shadow-sm border-0">
              <Card.Body>
                <Card.Title className="fw-bold text-dark mb-3">
                  Our Vision
                </Card.Title>
                <Card.Text className="text-secondary">
                  We envision a digital workspace where project management is
                  effortless — empowering teams to stay focused, organized, and
                  connected while achieving their goals efficiently.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* How It Works Section */}
        <div className="text-center mt-5">
          <h3 className="fw-bold text-primary mb-4">How It Works</h3>
          <Row className="g-4 justify-content-center">
            <Col md={4}>
              <Card className="h-100 shadow-sm border-0">
                <Card.Body>
                  <Card.Title className="fw-semibold text-dark">1. Plan Your Project</Card.Title>
                  <Card.Text className="text-secondary">
                    Define project goals, timelines, and assign roles. Create structured workflows that fit your team’s process.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 shadow-sm border-0">
                <Card.Body>
                  <Card.Title className="fw-semibold text-dark">2. Track Progress</Card.Title>
                  <Card.Text className="text-secondary">
                    Monitor milestones, update status, and get real-time reports to stay on top of every project phase.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 shadow-sm border-0">
                <Card.Body>
                  <Card.Title className="fw-semibold text-dark">3. Collaborate & Deliver</Card.Title>
                  <Card.Text className="text-secondary">
                    Communicate, share files, and resolve blockers together — ensuring smooth, timely delivery.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>

        {/* Core Features Section */}
        <div className="text-center mt-5">
          <h3 className="fw-bold text-primary mb-4">Core Features</h3>
          <Row className="g-4 justify-content-center">
            <Col md={3} sm={6}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body>
                  <Card.Title className="fw-semibold text-dark">Task Management</Card.Title>
                  <Card.Text className="text-secondary">
                    Organize and prioritize your daily tasks with clarity and ease.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body>
                  <Card.Title className="fw-semibold text-dark">Team Collaboration</Card.Title>
                  <Card.Text className="text-secondary">
                    Enable team members to communicate and work together effectively.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body>
                  <Card.Title className="fw-semibold text-dark">Progress Tracking</Card.Title>
                  <Card.Text className="text-secondary">
                    Visualize your progress with live tracking and analytics dashboards.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body>
                  <Card.Title className="fw-semibold text-dark">Deadline Reminders</Card.Title>
                  <Card.Text className="text-secondary">
                    Stay informed with automatic notifications for important milestones.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>

        {/* Team Section */}
        <div className="text-center mt-5">
          <h3 className="fw-bold text-primary mb-4">Meet Our Team</h3>
          <Row className="justify-content-center g-4">
            {/* Vaibhav */}
            <Col md={3} sm={6}>
              <Card className="h-100 text-center border-0 shadow-sm">
                <Card.Img
                  variant="top"
                  src="https://cdn-icons-png.flaticon.com/512/7077/7077313.png"
                  className="rounded-circle mx-auto mt-3"
                  style={{ width: "120px", height: "120px", objectFit: "cover" }}
                />
                <Card.Body>
                  <Card.Title className="fw-semibold">Vaibhav Sonawane</Card.Title>
                  <Card.Text className="text-secondary small">
                    Backend Developer
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            {/* Ravina */}
            <Col md={3} sm={6}>
              <Card className="h-100 text-center border-0 shadow-sm">
                <Card.Img
                  variant="top"
                  src="https://cdn-icons-png.flaticon.com/512/10438/10438143.png"
                  className="rounded-circle mx-auto mt-3"
                  style={{ width: "120px", height: "120px", objectFit: "cover" }}
                />
                <Card.Body>
                  <Card.Title className="fw-semibold">Ravina Gadekar</Card.Title>
                  <Card.Text className="text-secondary small">
                    Frontend Developer
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            {/* Asmit */}
            <Col md={3} sm={6}>
              <Card className="h-100 text-center border-0 shadow-sm">
                <Card.Img
                  variant="top"
                  src="https://cdn-icons-png.flaticon.com/512/7077/7077313.png"
                  className="rounded-circle mx-auto mt-3"
                  style={{ width: "120px", height: "120px", objectFit: "cover" }}
                />
                <Card.Body>
                  <Card.Title className="fw-semibold">Asmit Upangalwar</Card.Title>
                  <Card.Text className="text-secondary small">
                    Database & API Developer
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>

        {/* Technologies Used */}
        <div className="text-center mt-5">
          <h3 className="fw-bold text-primary mb-4">Technologies Used</h3>
          <div className="d-flex flex-wrap justify-content-center gap-3">
            <Badge bg="primary" className="fs-6 px-3 py-2">React.js</Badge>
            <Badge bg="info" text="dark" className="fs-6 px-3 py-2">Node.js</Badge>
            <Badge bg="success" className="fs-6 px-3 py-2">Express.js</Badge>
            <Badge bg="warning" text="dark" className="fs-6 px-3 py-2">MySQL</Badge>
            <Badge bg="secondary" className="fs-6 px-3 py-2">Bootstrap</Badge>
            <Badge bg="dark" className="fs-6 px-3 py-2">JavaScript (ES6+)</Badge>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-muted mt-5 pt-4 border-top">
          <p className="mb-1">
            &copy; {new Date().getFullYear()} Project Management Tool — All rights reserved.
          </p>
          <p className="small">
            Built with  by Vaibhav Sonawane, Ravina Gadekar & Asmit Upangalwar
          </p>
        </footer>
      </Container>
    </div>
  );
}
