import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Projects() {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showForm, setShowForm] = useState(false);
    const [editingProject, setEditingProject] = useState(null);

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
            setProjects((prev) =>
                prev.filter((project) => project.id !== projectId)
            );
        } catch (err) {
            console.error("Error deleting project:", err);
            setError("Failed to delete project");
        }
    };

    const handleSave = (savedProject) => {
        if (editingProject) {
        // update in list
        setProjects((prev) =>
            prev.map((p) => (p.id === savedProject.id ? savedProject : p))
        );
        } else {
        // add to list
        setProjects((prev) => [savedProject, ...prev]);
        }
    };

    if (loading) return <p>Loading projects...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div>
            <div className="header">
                <h2>Projects</h2>
                <button onClick={() => {
                    setEditingProject(null);
                    setShowForm(true);
                }}>+ New Project</button>
            </div>
            <div>
                <ul>
                    {projects.map((project) => (
                        <li key={project.id}>
                            <button onClick={() => navigate(`/projects/${project.id}`)}>
                                <div className="component-card">
                                    <div className="header">
                                        <strong>{project.name}</strong>
                                        <button onClick={(e) => {
                                            setEditingProject(project);
                                            setShowForm(true);
                                        }}>Edit</button>
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

                {showForm && (
                    <ProjectForm
                        project={editingProject}
                        onClose={() => setShowForm(false)}
                        onSave={handleSave}
                    />
                )}
            </div>
        </div>
    );
};

function ProjectForm({ project, onClose, onSave }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [projEngineer, setProjEngineer] = useState("");
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

    // Load users
    useEffect(() => {
        api.get("/users/").then((res) => {
            setUsers(res.data.results || res.data);
        });
    }, []);

    // Populate form when editing
    useEffect(() => {
        if (project) {
            setName(project.name);
            setDescription(project.description || "");
            setStartDate(project.start_date || "");
            setEndDate(project.end_date || "");
            setProjEngineer(project.proj_engineer || "");
        }
    }, [project]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const payload = {
            name,
            description,
            start_date: startDate,
            end_date: endDate,
            proj_engineer: projEngineer || null,
        };

        try {
            const response = project
                ? await api.put(`/projects/${project.id}/`, payload)
                : await api.post("/projects/", payload);

            onSave(response.data);
            onClose();
        } catch (err) {
            console.error(err);
            setError("Failed to save project");
        }
    };

    return (
        <div className="card">
            <h2>{project ? "Edit Project" : "New Project"}</h2>

            <form onSubmit={handleSubmit}>
                <label>Project Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} required />

                <label>Description</label>
                <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                />

                <label>Project Engineer</label>
                <select
                value={projEngineer}
                onChange={(e) => setProjEngineer(e.target.value)}
                required
                >
                <option value="">Select engineer</option>
                {users.map((u) => (
                    <option key={u.id} value={u.id}>
                    {u.first_name} {u.last_name} ({u.username})
                    </option>
                ))}
                </select>

                <label>Start Date</label>
                <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                />

                <label>End Date</label>
                <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                />

                {error && <p style={{ color: "red" }}>{error}</p>}

                <button type="submit">
                {project ? "Update" : "Create"}
                </button>
                <button type="button" onClick={onClose} style={{ marginLeft: 8 }}>
                Cancel
                </button>
            </form>
        </div>
    );
}
