import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Vendors() {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

            // Remove deleted vendor from state (no refetch needed)
            setVendors((prev) =>
                prev.filter((vendor) => vendor.id !== vendorId)
            );
        } catch (err) {
            console.error("Error deleting vendor:", err);
            setError("Failed to delete vendor");
        }
    };


    if (loading) return <p>Loading vendors...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div>    
            <div className="header">
                <h2>Vendors</h2>
                <button>+ New Vendor</button>
            </div>
            <div>
                <ul>
                    {vendors.map((vendor) => (
                        <li key={vendor.id}>
                            <button>
                                <div className="component-card">
                                    <div className="header">
                                        <strong>{vendor.name}</strong>
                                        <button>Edit</button>
                                        <button onClick={() => handleDelete(vendor.id)}>Delete</button>
                                    </div>
                                    <hr/>
                                    <p>{vendor.address}</p>
                                    <p>{vendor.phone_number}</p>
                                    <p>{vendor.contact_email}</p>
                                </div>   
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};