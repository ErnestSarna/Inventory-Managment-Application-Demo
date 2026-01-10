import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const Dashboard = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([{id: 1, name: "Project Alpha"}, {id: 2, name: "Project Beta"}]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /*useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await api.get("/projects/");
                setProjects(response.data);
            } catch (err) {
                console.error("Error fetching projects:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);*/

    //if (loading) return <p>Loading projects...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return ( //TODO: add log out button
        <div>
            <h1>Dashboard</h1>
            <ul>
                {projects.map((project) => (
                    <li key={project.id} onClick={() => navigate(`/projects/${project.id}`)}>
                        <button onClick={() => navigate(`/projects/${project.id}`)}>
                            {project.name}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;