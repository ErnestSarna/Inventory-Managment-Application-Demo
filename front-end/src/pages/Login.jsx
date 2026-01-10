import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Login() {
    const navigate = useNavigate();

    //const [users, setUsers] = useState([]);
    //const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

   /* useEffect(() => {
        const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            console.log("123");
            const response = await api.get("/users/");
            console.log(response);
            setUsers(response.data);
        } catch (err) {
            console.error("Error fetching users:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
        };

        fetchUsers();
    }, []);*/

    const handleLogin = async (e) => {
        e.preventDefault();

        try{
            //await api.post("/auth/login", {
               // username: e.target.username.value,
              //  password: e.target.password.value
            //});
            navigate("/dashboard");
        }
        catch(err){
            console.error("Login failed:", err);
            setError("Login failed. Please check your credentials and try again.");
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" name="username" onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    )
}

export default Login;