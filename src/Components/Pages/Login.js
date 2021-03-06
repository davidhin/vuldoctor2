// components/session/Login.jsx
import { Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import TextField from "@material-ui/core/TextField";
import { Alert } from "@material-ui/lab";
import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import fire from "../../fire.js";

const Login = (props) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    fire
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      {error !== null && (
        <Alert severity="error" style={{ marginBottom: "24px" }}>
          {error}
        </Alert>
      )}
      <Typography variant="h5" style={{ marginBottom: "24px" }}>
        Login
      </Typography>
      <TextField
        onChange={({ target }) => setEmail(target.value)}
        label="Email"
        fullWidth
        style={{ marginBottom: "32px" }}
      />
      <TextField
        type="password"
        onChange={({ target }) => setPassword(target.value)}
        label="Password"
        fullWidth
        style={{ marginBottom: "48px" }}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        style={{ float: "right" }}
      >
        Login
      </Button>
      <div style={{ float: "left" }}>
        <Link
          component="button"
          variant="body2"
          component={RouterLink}
          to="/signup"
        >
          Create Account
        </Link>
        <br />
        <Link
          component="button"
          variant="body2"
          component={RouterLink}
          to="/resetpassword"
        >
          Forgot Password
        </Link>
      </div>
    </form>
  );
};
export default Login;
