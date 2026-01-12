import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Projects() {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await api.get("/projects/");
                setProjects(response.data.results);
            } catch (err) {
                console.error("Error fetching projects:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const handleDelete = async (projectId) => {
        if (!window.confirm("Are you sure you want to delete this project?")) {
            return;
        }

        try {
            await api.delete(`/projects/${projectId}/`);

            // Remove deleted project from state (no refetch needed)
            setProjects((prev) =>
                prev.filter((project) => project.id !== projectId)
            );
        } catch (err) {
            console.error("Error deleting project:", err);
            setError("Failed to delete project");
        }
    };

    if (loading) return <p>Loading projects...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div>
            <div className="header">
                <h2>Projects</h2>
                <button>+ New Project</button>
            </div>
            <div>
                <ul>
                    {projects.map((project) => (
                        <li key={project.id}>
                            <button onClick={() => navigate(`/projects/${project.id}`)}>
                                <div className="component-card">
                                    <div className="header">
                                        <strong>{project.name}</strong>
                                        <button>Edit</button>
                                        <button onClick={() => handleDelete(project.id)}>Delete</button>
                                    </div>
                                    <hr/>
                                    <p>{project.description}</p>
                                    <br />
                                    <p><strong>Project Engineer:</strong> {project.proj_engineer.first_name} {project.proj_engineer.last_name}</p>
                                    <p><strong>Start Date:</strong> {project.start_date}</p>
                                    <p><strong>End Date:</strong> {project.end_date}</p>
                                </div>   
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};