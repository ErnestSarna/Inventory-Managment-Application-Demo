import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Project() {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProjectInventory = async () => {
            try {
                const res = await api.get(`/inventory_items/?project=${projectId}`);
                setInventory(res.data.results); // if paginated
            } catch (err) {
                setError("Failed to load inventory.");
            } finally {
                setLoading(false);
            }
            };
            
        fetchProjectInventory();
    }, [projectId]);

    const handleDelete = async (itemId) => {
        if (!window.confirm("Are you sure you want to delete this item?")) {
            return;
        }

        try {
            await api.delete(`/inventory_items/${itemId}/`);
            setInventory((prev) =>
                prev.filter((item) => item.id !== itemId)
            );
        } catch (err) {
            console.error("Error deleting item:", err);
            setError("Failed to delete item");
        }
    };

    if (loading) return <p>Loading inventory...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div>
            <div className="header">
                <h1>Project {`${projectId}`}</h1>
                <button onClick={() => navigate('/dashboard')}>Return to Dashboard</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Item #</th>
                        <th>Item Name</th>
                        <th>Purchase Order</th>
                        <th>Quantity</th>
                        <th>Tag #</th>
                        <th>Description</th>
                        <th>Unit Price</th>
                        <th>Vendor</th>
                        <th>Location</th>
                        <th>Comments</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {inventory.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                            <td>{item.purchase_order.order_number}</td>
                            <td>{item.quantity}</td>
                            <td>{item.tag_number}</td>
                            <td>{item.description}</td>
                            <td>${item.price}</td>
                            <td>{item.vendor.name}</td>
                            <td>{item.location.name}</td>
                            <td>{item.comments}</td>
                            <td><button>Edit</button><button onClick={() => handleDelete(item.id)}>Delete</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};