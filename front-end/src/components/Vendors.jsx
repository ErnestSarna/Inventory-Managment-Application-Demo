import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Vendors() {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showForm, setShowForm] = useState(false);
    const [editingVendor, setEditingVendor] = useState(null);

    useEffect(() => {
        if (showForm) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [showForm]);

    useEffect(() => {
        const fetchVendors = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await api.get("/vendors/");
                setVendors(response.data.results);
            } catch (err) {
                console.error("Error fetching vendors:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchVendors();
    }, []);

    const handleDelete = async (vendorId) => {
        if (!window.confirm("Are you sure you want to delete this vendor?")) {
            return;
        }

        try {
            await api.delete(`/vendors/${vendorId}/`);
            setVendors((prev) =>
                prev.filter((vendor) => vendor.id !== vendorId)
            );
        } catch (err) {
            console.error("Error deleting vendor:", err);
            setError("Failed to delete vendor");
        }
    };

    const handleSave = (savedVendor) => {
        if (editingVendor) {
            // Update existing
            setVendors((prev) =>
                prev.map((v) => (v.id === savedVendor.id ? savedVendor : v))
            );
        } else {
            // Add new
            setVendors((prev) => [savedVendor, ...prev]);
        }
    };

    return (
        <div>    
            <div className="header">
                <h2>Vendors</h2>
                <button onClick={() => {
                    setEditingVendor(null);
                    setShowForm(true);
                }}>+ New Vendor</button>
            </div>
            <div>
                <div className="flex-container">
                    {vendors.map((vendor) => (
                        <div key={vendor.id} className="component-card">
                            <div className="header">
                                <strong>{vendor.name}</strong>
                                <button onClick={() => {
                                    setEditingVendor(vendor);
                                    setShowForm(true);
                                }}>Edit</button>
                                <button onClick={() => handleDelete(vendor.id)}>Delete</button>
                            </div>
                            <hr/>
                            <p>{vendor.address}</p>
                            <p>{vendor.phone_number}</p>
                            <p>{vendor.contact_email}</p>
                        </div>   
                    ))}
                </div>

                {showForm && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <VendorForm
                                vendor={editingVendor}
                                onClose={() => setShowForm(false)}
                                onSave={handleSave}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

function VendorForm({ vendor, onClose, onSave }) {
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [contactEmail, setContactEmail] = useState("");
    const [error, setError] = useState(null);

    // Populate form when editing
    useEffect(() => {
        if (vendor) {
            setName(vendor.name || "");
            setAddress(vendor.address || "");
            setPhoneNumber(vendor.phone_number || "");
            setContactEmail(vendor.contact_email || "");
        }
    }, [vendor]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const payload = {
            name,
            address,
            phone_number: phoneNumber,
            contact_email: contactEmail,
        };

        try {
            const response = vendor
                ? await api.patch(`/vendors/${vendor.id}/`, payload)
                : await api.post("/vendors/", payload);

            onSave(response.data);
            onClose();
        } catch (err) {
            console.error(err);
            setError("Failed to save vendor");
        }
    };

    return (
        <div className="card">
            <h2>{vendor ? "Edit Vendor" : "New Vendor"}</h2>

            <form onSubmit={handleSubmit}>
                <label>Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} required />

                <label>Address</label>
                <input value={address} onChange={(e) => setAddress(e.target.value)} />

                <label>Phone Number</label>
                <input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />

                <label>Contact Email</label>
                <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />

                {error && <p style={{ color: "red" }}>{error}</p>}

                <button type="submit">{vendor ? "Update" : "Create"}</button>
                <button type="button" onClick={onClose} style={{ marginLeft: 8 }}>Cancel</button>
            </form>
        </div>
    );
}