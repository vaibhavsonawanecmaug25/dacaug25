import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Spinner, Row, Col, Table } from "react-bootstrap";

export default function Dashboard() {
  const [summary, setSummary] = useState({ projects: 0, users: 0, tasks: 0 });
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch dashboard data
  useEffect(() => {
    async function fetchData() {
      try {
        const [projRes, userRes, taskRes] = await Promise.all([
          axios.get(`http://localhost:4400/projects`),
          axios.get(`http://localhost:4400/users`),
          axios.get(`http://localhost:4400/tasks`),
        ]);

        setSummary({
          projects: projRes.data?.length || 0,
          users: userRes.data?.length || 0,
          tasks: taskRes.data?.length || 0,
        });

        // Show 5 most recent projects
        setRecentProjects((projRes.data || []).slice(-5).reverse());
      } catch (error) {
        console.error("Error loading dashboard:", error);
        // Set defaults on error
        setSummary({ projects: 0, users: 0, tasks: 0 });
        setRecentProjects([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="container mt-5 mb-5" style={{ minHeight: "80vh" }}>
      <h2 className="text-center mb-4">📊 Dashboard</h2>

      <Row className="mb-4">
        <Col md={4} className="mb-3">
          <Card className="text-center shadow-sm">
            <Card.Body>
              <h5>Total Projects</h5>
              <h2 className="text-primary">{summary.projects}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card className="text-center shadow-sm">
            <Card.Body>
              <h5>Total Users</h5>
              <h2 className="text-success">{summary.users}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card className="text-center shadow-sm">
            <Card.Body>
              <h5>Total Tasks</h5>
              <h2 className="text-warning">{summary.tasks}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={8}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">🧩 Recent Projects</h5>
                <Button variant="outline-primary" size="sm" href="/create-project">
                  ➕ New Project
                </Button>
              </div>
              {recentProjects.length > 0 ? (
                <Table striped bordered hover responsive>
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Project Name</th>
                      <th>Description</th>
                      <th>Status</th>
                    </tr>
                  </thead>
              <tbody>
                {recentProjects.map((p, index) => (
                  <tr key={p.project_id || index}>
                    <td>{index + 1}</td>
                    <td>
                      <Button 
                        variant="link" 
                        href={`/tasks?project=${p.project_id}`}
                        className="text-decoration-none"
                      >
                        {p.project_name}
                      </Button>
                    </td>
                    <td>{p.description}</td>
                    <td>
                      <span className={`badge ${
                        p.status === 'Completed' ? 'bg-success' :
                        p.status === 'In Progress' ? 'bg-warning text-dark' :
                        'bg-secondary'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>No recent projects found.</p>
          )}
        </Card.Body>
      </Card>

      </Col>
      </Row>

      <div className="text-center mt-4">
        <Button variant="primary" href="/create-project">
          ➕ Create New Project
        </Button>
      </div>
    </div>
  );
}
