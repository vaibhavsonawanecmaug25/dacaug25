import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/home";
import Signup from "./components/signup";
import About from "./components/about";

import Navbar from "./components/navbar";
import Footer from "./components/footer";
import CreateProject from "./components/createproject";
import Tasks from "./components/task";
import Dashboard from "./components/Dashboard";
import Login from "./components/login";

function App() {
  return (
    <>
      <Navbar />
      <div style={{ marginTop: "80px", minHeight: "80vh" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create-project" element={<CreateProject />} />
          <Route path="/about" element={<About />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<Dashboard />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}


export default App;
