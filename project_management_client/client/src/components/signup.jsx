import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ✅ Validation logic
const validate = (values) => {
  const errors = {};

  if (!values.full_name.trim()) {
    errors.full_name = "Full name is required";
  }

  if (!values.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Invalid email format";
  }

  if (!values.password.trim()) {
    errors.password = "Password is required";
  } else if (
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      values.password
    )
  ) {
    errors.password =
      "Password must be at least 8 characters and include uppercase, lowercase, number, and special character";
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

      {/* Toast container must be rendered once */}
      <ToastContainer position="top-center" autoClose={2500} />

      <Formik
        initialValues={{
          full_name: "",
          email: "",
          password: "",
          confirmPassword: "",
          role: "",
        }}
        validate={validate}
        onSubmit={(values, { resetForm, setSubmitting }) => {
          try {
            // Simulating API success
            console.log("Form submitted:", values);
            toast.success("Signup Successful!", {
              position: "top-center",
            });
            resetForm();
          } catch(error) {
            // If something fails
            toast.error("Signup Failed! Please try again.");
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            {/* Full Name */}
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <Field
                name="full_name"
                type="text"
                className="form-control"
                placeholder="Enter your full name"
              />
              <ErrorMessage
                name="full_name"
                component="div"
                className="text-danger small"
              />
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
              <ErrorMessage
                name="email"
                component="div"
                className="text-danger small"
              />
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
              <ErrorMessage
                name="password"
                component="div"
                className="text-danger small"
              />
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
                <option value="Team Member">Team Member</option>
              </Field>
              <ErrorMessage
                name="role"
                component="div"
                className="text-danger small"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary w-100"
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
