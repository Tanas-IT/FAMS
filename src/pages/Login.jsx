import React, { useContext, useState } from "react";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import "../styles/LoginForm.css";
import GoogleIcon from "@mui/icons-material/Google";
import { Link, useNavigate } from "react-router-dom";
import { Button, Container, Modal, Toast } from "react-bootstrap";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { login_default } from "../api/api";
import { AuthContext } from "./contexts/AuthenticationContext";

const headers = {
  "Content-Type": "application/json",
  // 'Access-Control-Allow-Origin': '*'
};
const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState();
  const [loading, setLoading] = useState();
  const authContext = useContext(AuthContext);

  const login_google = useGoogleLogin({
    onSuccess: (codeResponse) => console.log("Login success"),
    onError: (error) => console.log("Login Failed:", error),
  });

  async function Login_Default() {
    setLoading(true);
    var username_email = document.getElementById("UsernameInput").value;
    var password = document.getElementById("PasswordInput").value;

    if (await login_default(username_email, password)) {
      const credentials = jwtDecode(sessionStorage.getItem("token"));
      console.log("creadentials: ", credentials.role);
      if (!credentials) {
        alert("Your account has been banned");
        setLoading(false);
        return;
      } else {
        if (credentials.role === "Admin") {
          navigate("/Admin");
          setLoading(false);
        }
        if (credentials.role === "Student") {
          navigate("/Home");
          authContext.authenticate(credentials);
          setLoading(false);
        }
        console.log("Adw");
        return;
      }
    }
  }

  return (
    <div id="login-form">
      <h1>Login</h1>
      <form>
        <Container className="d-flex flex-column">
          <FloatingLabel label="Email/Username" className="mb-3">
            <Form.Control
              id="UsernameInput"
              type="email"
              placeholder="name@example.com"
            />
          </FloatingLabel>
          <FloatingLabel label="Password" className="mb-3">
            <Form.Control
              id="PasswordInput"
              type="password"
              placeholder="name@example.com"
            />
          </FloatingLabel>

          <div
            key="remember-me"
            className="d-flex justify-content-between mx-3 mb-4"
          >
            <Form.Check type="checkbox" id="remember-me" label="Remember Me" />

            <Link to="#">Forgot Password?</Link>
          </div>
          <Button className="" onClick={Login_Default}>
            Sign in
          </Button>
          <div className="separator">
            <div className="line"></div>
            <p>OR</p>
            <div className="line"></div>
          </div>
          <Button className="" onClick={login_google}>
            <GoogleIcon></GoogleIcon>
            <> </>
            Sign in with Google
          </Button>
        </Container>
      </form>
      {loading && (
        <div className="overlay">
          <div className="loading-animation">
            <div className="spinner"></div>
            <div className="loading-text">Logging in...</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
