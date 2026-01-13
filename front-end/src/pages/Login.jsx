import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import '../App.css'

export default function Login() {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [showRegister, setShowRegister] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        if (!username || !password) {
            setError("Username and password are required");
            return;
        }

        try{
            let response = await api.post("/auth/login/", {
                username,
                password
            }, {withCredentials: true});
            console.log(response);
            setError(null);
            navigate("/dashboard");
        }
        catch(err){
            console.error("Login failed:", err);
            setError("Login failed. Please check your credentials and try again.");
        }
    };

    return (
        <div>
            <h1>Inventory Managment System</h1>
            <hr />
            <div className='card-container'>
              {!showRegister ? (
              <div className='card'>
                  <h1>Login</h1>
                  <div>
                      <div>
                          <label htmlFor="username">Username:</label>
                          <input type="text" id="username" name="username" onChange={(e) => setUsername(e.target.value)} required />
                      </div>
                      <div>
                          <label htmlFor="password">Password:</label>
                          <input type="password" id="password" name="password" onChange={(e) => setPassword(e.target.value)} required />
                      </div>
                      {error && <p style={{ color: "red" }}>{error}</p>}
                      <button type="button" onClick={handleLogin}>Login</button>
                      <button type="button" onClick={() => setShowRegister(true)}>Register</button>
                  </div>
              </div>
              ) : (
                  <Register onClose={() => setShowRegister(false)} />
              )}
            </div>
        </div>
    )
}

function Register({ onClose }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [error, setError] = useState("");

    const handleRegister = async (e) => {
      e.preventDefault();
      if (!username || !password || !email || !firstName || !lastName) {
        setError("All fields are required");
        return;
      }

      try {
        const response = await api.post("/register/", {
          username,
          email,
          first_name: firstName, // must match serializer
          last_name: lastName,   // must match serializer
          password,
        });

        console.log("Registration success:", response.data);
        alert(`User ${response.data.username} created successfully!`);
        onClose();
      } catch (err) {
        console.error(err);
        if (err.response) {
          const errors = err.response.data;
          setError(
            errors.username?.[0] ||
            errors.email?.[0] ||
            errors.password?.[0] ||
            errors.first_name?.[0] ||
            errors.last_name?.[0] ||
            "Registration failed"
          );
        } else {
          setError("Network error");
        }
      }
    };

    return (
      <div className="card">
          <h1>Register</h1>
          <form onSubmit={handleRegister}>
              <div>
                <label htmlFor="reg-username">Username:</label>
                <input
                  type="text"
                  id="reg-username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="reg-email">Email:</label>
                <input
                  type="email"
                  id="reg-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="reg-password">Password:</label>
                <input
                  type="password"
                  id="reg-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="reg-firstName">First Name:</label>
                <input
                  type="text"
                  id="reg-firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="reg-lastName">Last Name:</label>
                <input
                  type="text"
                  id="reg-lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
              {error && <p style={{ color: "red" }}>{error}</p>}
              <button type="submit">Register</button>
              <button type="button" onClick={onClose} style={{ marginLeft: "8px" }}>
                Cancel
              </button>
          </form>
      </div>
    );
}