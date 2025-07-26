import React from "react";

const UnauthorizedPage = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.statusCode}>403</h1>
      <h2 style={styles.message}>Unauthorized Access</h2>
      <p style={styles.description}>Only administrators are allowed to access this page.</p>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f8f9fa",
    color: "#343a40",
    textAlign: "center",
  },
  statusCode: {
    fontSize: "6rem",
    margin: "0",
  },
  message: {
    fontSize: "2rem",
    margin: "0.5rem 0",
  },
  description: {
    fontSize: "1.25rem",
  },
};

export default UnauthorizedPage;
