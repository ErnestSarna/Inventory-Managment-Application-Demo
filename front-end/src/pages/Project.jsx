import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

const Project = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProjectInventory = async () => {
            try {
                const res = await api.get(`/projects/${projectId}/inventory/`);
                setProject(res.data.project);
                setInventory(res.data.items);
            } catch (err) {
                setError("Failed to load inventory.");
            } finally {
                setLoading(false);
            }
            };
            
        fetchProjectInventory();
    }, [projectId]);

    //if (loading) return <p>Loading inventory...</p>;
    //if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div className="project-page">
            <button onClick={() => navigate('/dashboard')}>Return to Dashboard</button>
            <h1>Project {`${projectId}`}</h1>
            <table>
                <thead>
                    <tr>
                        <th>Item #</th>
                        <th>Item</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Vendor</th>
                        <th>Location</th>
                        <th>RBB Serial #</th>
                    </tr>
                </thead>
                <tbody>
                    {inventory.map((item) => (
                        <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{item.quantity}</td>
                            <td>${item.unit_price}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Project;