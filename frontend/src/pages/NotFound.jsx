// src/pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="text-center mt-5">
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/register" className="btn btn-primary">
        Go to Register
      </Link>
    </div>
  );
};

export default NotFound;
