import React from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API_URL from "../api.js"; // ✅ Correct import

const validate = (values) => {
  const errors = {};

  if (!values.name.trim()) {
    errors.name = "Full name is required";
  }

  if (!values.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Invalid email format";
  }

  if (!values.password.trim()) {
    errors.password = "Password is required";
  } else if (
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(values.password)
  ) {
    errors.password =
      "Password must include uppercase, lowercase, number, and special character";
  }

  if (!values.confirmPassword.trim()) {
    errors.confirmPassword = "Please confirm your password";
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  if (!values.role) {
    errors.role = "Please select a role";
  }

  return errors;
};

const Signup = () => {
  return (
    <div className="container mt-5" style={{ maxWidth: "450px" }}>
      <h3 className="text-center mb-4">Sign Up</h3>

      <ToastContainer position="top-center" autoClose={2500} />

      <Formik
        initialValues={{
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          role: "",
        }}
        validate={validate}
        onSubmit={async (values, { resetForm, setSubmitting }) => {
          try {
            console.log("Submitting signup:", values);
            console.log("API URL:", `${API_URL}/auth/signup`);
            
            const res = await axios.post(`${API_URL}/auth/signup`, values);

            console.log("Signup response:", res.data);

            toast.success(res.data.message || "Signup Successful!", {
              position: "top-center",
            });

            resetForm();
            setTimeout(() => (window.location.href = "/login"), 2000);
          } catch (error) {
            console.error("Signup Error:", error);
            console.error("Error details:", {
              message: error.message,
              response: error.response?.data,
              status: error.response?.status,
              url: error.config?.url
            });
            
            let errorMessage = "Signup Failed!";
            
            if (error.response) {
              // Server responded with error
              errorMessage = error.response.data?.error || 
                           error.response.data?.message || 
                           `Server error: ${error.response.status}`;
            } else if (error.request) {
              // Request was made but no response received
              errorMessage = "Cannot connect to server. Please check if the server is running.";
            } else {
              // Something else happened
              errorMessage = error.message || "An unexpected error occurred";
            }
            
            toast.error(errorMessage, {
              position: "top-center",
              autoClose: 5000
            });
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            {/* Name */}
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <Field
                name="name"
                type="text"
                className="form-control"
                placeholder="Enter your full name"
              />
              <ErrorMessage name="name" component="div" className="text-danger small" />
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="form-label">Email</label>
              <Field
                name="email"
                type="email"
                className="form-control"
                placeholder="Enter your email"
              />
              <ErrorMessage name="email" component="div" className="text-danger small" />
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="form-label">Password</label>
              <Field
                name="password"
                type="password"
                className="form-control"
                placeholder="Enter password"
              />
              <ErrorMessage name="password" component="div" className="text-danger small" />
            </div>

            {/* Confirm Password */}
            <div className="mb-3">
              <label className="form-label">Confirm Password</label>
              <Field
                name="confirmPassword"
                type="password"
                className="form-control"
                placeholder="Confirm password"
              />
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className="text-danger small"
              />
            </div>

            {/* Role */}
            <div className="mb-3">
              <label className="form-label">Role</label>
              <Field as="select" name="role" className="form-select">
                <option value="">Select Role</option>
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Developer">Developer</option>
                <option value="Tester">Tester</option>
              </Field>
              <ErrorMessage name="role" component="div" className="text-danger small" />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary w-100 fw-semibold py-2 shadow-sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Sign Up"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Signup;
