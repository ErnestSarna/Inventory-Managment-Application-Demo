import { useEffect, useState } from "react";
import api from "../api/axios";

export default function PurchaseOrders() {
    const [purchase_orders, setPurchaseOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showForm, setShowForm] = useState(false);
    const [editingPO, setEditingPO] = useState(null);

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
            setPurchaseOrders((prev) =>
                prev.filter((purchase_order) => purchase_order.id !== poId)
            );
        } catch (err) {
            console.error("Error deleting purchase order:", err);
            setError("Failed to delete purchase order");
        }
    };

    const handleSave = (savedPO) => {
        if (editingPO) {
            // Update existing
            setPurchaseOrders((prev) =>
                prev.map((po) => (po.id === savedPO.id ? savedPO : po))
            );
        } else {
            // Add new
            setPurchaseOrders((prev) => [savedPO, ...prev]);
        }
    };

    if (loading) return <p>Loading purchase orders...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div>
            <div className="header">
                <h2>Purchase Orders</h2>
                <button onClick={() => {
                    setEditingPO(null);
                    setShowForm(true);
                }}>+ New PO</button>
            </div>
            <div>
                <ul>
                    {purchase_orders.map((purchase_order) => (
                        <li key={purchase_order.id}>
                            <button>
                                <div className="component-card">
                                    <div className="header">
                                        <strong>{purchase_order.order_number}</strong>
                                        <button onClick={() => {
                                            setEditingPO(purchase_order);
                                            setShowForm(true);
                                        }}>Edit</button>
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

                {showForm && (
                    <PurchaseOrderForm
                        po={editingPO}
                        onClose={() => setShowForm(false)}
                        onSave={handleSave}
                    />
                )}
            </div>
        </div>
    );
};

function PurchaseOrderForm({ po, onClose, onSave }) {
    const [orderNumber, setOrderNumber] = useState("");
    const [vendor, setVendor] = useState("");
    const [project, setProject] = useState("");
    const [orderDate, setOrderDate] = useState("");
    const [totalAmount, setTotalAmount] = useState("");
    const [status, setStatus] = useState("Pending");

    const [vendors, setVendors] = useState([]);
    const [projects, setProjects] = useState([]);
    const [error, setError] = useState(null);

    // Load vendors and projects for dropdowns
    useEffect(() => {
        api.get("/vendors/").then((res) => setVendors(res.data.results || res.data));
        api.get("/projects/").then((res) => setProjects(res.data.results || res.data));
    }, []);

    // Populate form if editing
    useEffect(() => {
        if (po) {
            setOrderNumber(po.order_number || "");
            setVendor(po.vendor?.id || "");
            setProject(po.project?.id || "");
            setOrderDate(po.order_date || "");
            setTotalAmount(po.total_amount || "");
            setStatus(po.status || "Pending");
        }
    }, [po]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const payload = {
            order_number: orderNumber,
            vendor,
            project,
            order_date: orderDate,
            total_amount: totalAmount,
            status,
        };

        try {
            const response = po
                ? await api.put(`/purchase_orders/${po.id}/`, payload)
                : await api.post("/purchase_orders/", payload);

            onSave(response.data);
            onClose();
        } catch (err) {
            console.error(err);
            setError("Failed to save purchase order");
        }
    };

    return (
        <div className="card">
            <h2>{po ? "Edit Purchase Order" : "New Purchase Order"}</h2>

            <form onSubmit={handleSubmit}>
                <label>Order Number</label>
                <input value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} required />

                <label>Vendor</label>
                <select value={vendor} onChange={(e) => setVendor(e.target.value)} required>
                    <option value="">Select Vendor</option>
                    {vendors.map((v) => (
                        <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                </select>

                <label>Project</label>
                <select value={project} onChange={(e) => setProject(e.target.value)} required>
                    <option value="">Select Project</option>
                    {projects.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                </select>

                <label>Order Date</label>
                <input type="date" value={orderDate} onChange={(e) => setOrderDate(e.target.value)} required />

                <label>Total Amount</label>
                <input type="number" value={totalAmount} onChange={(e) => setTotalAmount(e.target.value)} required />

                <label>Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                </select>

                {error && <p style={{ color: "red" }}>{error}</p>}

                <button type="submit">{po ? "Update" : "Create"}</button>
                <button type="button" onClick={onClose} style={{ marginLeft: 8 }}>Cancel</button>
            </form>
        </div>
    );
}