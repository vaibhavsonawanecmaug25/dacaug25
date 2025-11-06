import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/home.jsx";
import Signup from "./components/signup.jsx";
import About from "./components/about.jsx";
import Navbar from "./components/navbar.jsx";
import Footer from "./components/footer.jsx";
import CreateProject from "./components/createproject.jsx";
import Tasks from "./components/task.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Login from "./components/login.jsx";
import ProtectedRoute from "./components/protectedroutes.jsx"; 
import Contact from "./components/contact.jsx";

function App() {
  return (
    <>
      <Navbar />
      <div style={{ marginTop: "80px", minHeight: "80vh" }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/contact" element={<Contact />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-project"
            element={
              <ProtectedRoute>
                <CreateProject />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <Tasks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
