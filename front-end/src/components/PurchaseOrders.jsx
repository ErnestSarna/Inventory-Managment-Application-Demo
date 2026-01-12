import { useEffect, useState } from "react";
import api from "../api/axios";

export default function PurchaseOrders() {
    const [purchase_orders, setPurchaseOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPurchaseOrders = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await api.get("/purchase_orders/");
                setPurchaseOrders(response.data.results);
            } catch (err) {
                console.error("Error fetching purchase orders:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPurchaseOrders();
    }, []);

    const handleDelete = async (poId) => {
        if (!window.confirm("Are you sure you want to delete this purchase order?")) {
            return;
        }

        try {
            await api.delete(`/purchase_orders/${poId}/`);

            // Remove deleted purchase order from state (no refetch needed)
            setPurchaseOrders((prev) =>
                prev.filter((purchase_order) => purchase_order.id !== poId)
            );
        } catch (err) {
            console.error("Error deleting purchase order:", err);
            setError("Failed to delete purchase order");
        }
    };

    if (loading) return <p>Loading purchase orders...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div>
            <div className="header">
                <h2>Purchase Orders</h2>
                <button>+ New PO</button>
            </div>
            <div>
                <ul>
                    {purchase_orders.map((purchase_order) => (
                        <li key={purchase_order.id}>
                            <button>
                                <div className="component-card">
                                    <div className="header">
                                        <strong>{purchase_order.order_number}</strong>
                                        <button>Edit</button>
                                        <button onClick={() => handleDelete(purchase_order.id)}>Delete</button>
                                    </div>
                                    <hr/>
                                    <p><strong>Vendor:</strong> {purchase_order.vendor.name}</p>
                                    <p><strong>Project:</strong> {purchase_order.project.name}</p>
                                    <p><strong>Order Date:</strong> {purchase_order.order_date}</p>
                                    <p><strong>Total Amount:</strong> ${purchase_order.total_amount}</p>
                                    <p><strong>Status:</strong> {purchase_order.status}</p>
                                </div>  
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};