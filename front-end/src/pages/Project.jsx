import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Project() {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [draft, setDraft] = useState({});
    const [vendors, setVendors] = useState([]);
    const [locations, setLocations] = useState([]);
    const [purchaseOrders, setPurchaseOrders] = useState([]);

    useEffect(() => {
        const fetchProjectInventory = async () => {
            try {
                let res = await api.get(`/inventory_items/?project=${projectId}`);
                setInventory(res.data.results);
                res = await api.get("/vendors/");
                setVendors(res.data.results);
                res = await api.get("/locations/");
                setLocations(res.data.results);
                res = await api.get("/purchase_orders/");
                setPurchaseOrders(res.data.results);
            } catch (err) {
                console.error("Error fetching item information:", err);
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

    const startEdit = (item) => {
        setEditingId(item.id);
        setDraft({
            name: item.name || "",
            purchase_order_id: item.purchase_order?.id || "",
            vendor_id: item.vendor?.id || "",
            location_id: item.location?.id || "",
            quantity: item.quantity || "",
            tag_number: item.tag_number || "",
            description: item.description || "",
            price: item.price || "",
            comments: item.comments || "",
        });
    };

    const startAdd = () => {
        setEditingId("new");
        setDraft({
            name: "",
            purchase_order_id: "",
            vendor_id: "",
            location_id: "",
            quantity: "",
            tag_number: "",
            description: "",
            price: "",
            comments: "",
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setDraft({});
    };

    const handleSave = async () => {
        try {
            const payload = {
                ...draft,
                project: projectId,
            };

            const res =
                editingId === "new"
                    ? await api.post("/inventory_items/", payload)
                    : await api.patch(`/inventory_items/${editingId}/`, payload);

            setInventory((prev) =>
                editingId === "new"
                    ? [res.data, ...prev]
                    : prev.map((i) =>
                          i.id === editingId ? res.data : i
                      )
            );

            cancelEdit();
        } catch (err) {
            console.error(err);
            setError("Failed to save item.");
        }
    };

    return (
        <div>
            <div className="header">
                <h1>Project {`${projectId}`}</h1>
                <button onClick={() => navigate('/dashboard')}>Return to Dashboard</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Item Name</th>
                        <th>Purchase Order</th>
                        <th>Quantity</th>
                        <th>Tag #</th>
                        <th>Description</th>
                        <th>Unit Price</th>
                        <th>Vendor</th>
                        <th>Location</th>
                        <th>Comments</th>
                        <th><button onClick={startAdd}>+ Add Item</button></th>
                    </tr>
                </thead>
                <tbody>
                    {editingId === "new" && (
                        <EditableRow
                            draft={draft}
                            setDraft={setDraft}
                            vendors={vendors}
                            locations={locations}
                            purchaseOrders={purchaseOrders}
                            onSave={handleSave}
                            onCancel={cancelEdit}
                        />
                    )}

                    {inventory.map((item) => (
                        editingId === item.id ? (
                            <EditableRow
                                key={item.id}
                                draft={draft}
                                setDraft={setDraft}
                                vendors={vendors}
                                locations={locations}
                                purchaseOrders={purchaseOrders}
                                onSave={handleSave}
                                onCancel={cancelEdit}
                            />
                        ) : (
                            <tr key={item.id}>
                                <td>{item.name}</td>
                                <td>{item.purchase_order.order_number}</td>
                                <td>{item.quantity}</td>
                                <td>{item.tag_number}</td>
                                <td>{item.description}</td>
                                <td>${item.price}</td>
                                <td>{item.vendor.name}</td>
                                <td>{item.location.name}</td>
                                <td>{item.comments}</td>
                                <td><button onClick={() => startEdit(item)}>Edit</button> <button onClick={() => handleDelete(item.id)}>Delete</button></td>
                            </tr>
                        )
                    ))}
                </tbody>
            </table>
        </div>
    );
};

function EditableRow({draft, setDraft, vendors, locations, purchaseOrders, onSave, onCancel}) {
    return (
        <tr>
            <td><input type="text" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })}/></td>
            <td><select value={draft.purchase_order_id} onChange={(e) => setDraft({ ...draft, purchase_order_id: e.target.value })}>
                <option value="">---</option>
                {purchaseOrders.map((po) => (
                    <option key={po.id} value={po.id}>{po.order_number}</option>
                ))}
            </select></td>
            <td><input type="number" value={draft.quantity} onChange={(e) => setDraft({ ...draft, quantity: e.target.value })}/></td>
            <td><input type="text" value={draft.tag_number} onChange={(e) => setDraft({ ...draft, tag_number: e.target.value })}/></td>
            <td><input type="text" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })}/></td>
            <td><input type="number" value={draft.price} onChange={(e) => setDraft({ ...draft, price: e.target.value })}/></td>
            <td><select value={draft.vendor_id} onChange={(e) => setDraft({ ...draft, vendor_id: e.target.value })}>
                <option value="">---</option>
                {vendors.map((ven) => (
                    <option key={ven.id} value={ven.id}>{ven.name}</option>
                ))}
            </select></td>
            <td><select value={draft.location_id} onChange={(e) => setDraft({ ...draft, location_id: e.target.value })}>
                <option value="">---</option>
                {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>{loc.name}</option>
                ))}
            </select></td>
            <td><input type="text" value={draft.comments} onChange={(e) => setDraft({ ...draft, comments: e.target.value })}/></td>
            <td><button onClick={onSave}>Save</button> <button onClick={onCancel}>Cancel</button></td>
        </tr>
    );
}