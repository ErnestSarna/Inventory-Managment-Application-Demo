import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Locations() {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showForm, setShowForm] = useState(false);
    const [editingLocation, setEditingLocation] = useState(null);

    useEffect(() => {
        const fetchLocations = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await api.get("/locations/");
                setLocations(response.data.results);
            } catch (err) {
                console.error("Error fetching locations:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchLocations();
    }, []);

    const handleDelete = async (locationId) => {
        if (!window.confirm("Are you sure you want to delete this location?")) {
            return;
        }

        try {
            await api.delete(`/locations/${locationId}/`);
            setLocations((prev) =>
                prev.filter((location) => location.id !== locationId)
            );
        } catch (err) {
            console.error("Error deleting location:", err);
            setError("Failed to delete location");
        }
    };

    const handleSave = (savedLocation) => {
        if (editingLocation) {
            // Update existing
            setLocations((prev) =>
                prev.map((loc) => (loc.id === savedLocation.id ? savedLocation : loc))
            );
        } else {
            // Add new
            setLocations((prev) => [savedLocation, ...prev]);
        }
    };

    if (loading) return <p>Loading locations...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div>
            <div className="header">
                <h2>Storage Locations</h2>
                <button onClick={() => {
                    setEditingLocation(null);
                    setShowForm(true);
                }}>+ New Storage Location</button>
            </div>
            <div>
                <ul>
                    {locations.map((location) => (
                        <li key={location.id}>
                            <button>
                                <div className="component-card">
                                    <div className="header">
                                        <strong>{location.name}</strong>
                                        <button onClick={() => {
                                            setEditingLocation(location);
                                            setShowForm(true);
                                        }}>Edit</button>
                                        <button onClick={() => handleDelete(location.id)}>Delete</button>
                                    </div>
                                    <hr/>
                                    <p>{location.address}</p>
                                </div>
                            </button>
                        </li>
                    ))}
                </ul>

                {showForm && (
                    <LocationForm
                        location={editingLocation}
                        onClose={() => setShowForm(false)}
                        onSave={handleSave}
                    />
                )}
            </div>
        </div>
    );
};

function LocationForm({ location, onClose, onSave }) {
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [error, setError] = useState(null);

    // Populate form when editing
    useEffect(() => {
        if (location) {
            setName(location.name || "");
            setAddress(location.address || "");
        }
    }, [location]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const payload = {
            name,
            address,
        };

        try {
            const response = location
                ? await api.put(`/locations/${location.id}/`, payload)
                : await api.post("/locations/", payload);

            onSave(response.data);
            onClose();
        } catch (err) {
            console.error(err);
            setError("Failed to save location");
        }
    };

    return (
        <div className="card">
            <h2>{location ? "Edit Location" : "New Storage Location"}</h2>

            <form onSubmit={handleSubmit}>
                <label>Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} required />

                <label>Address</label>
                <input value={address} onChange={(e) => setAddress(e.target.value)} />

                {error && <p style={{ color: "red" }}>{error}</p>}

                <button type="submit">{location ? "Update" : "Create"}</button>
                <button type="button" onClick={onClose} style={{ marginLeft: 8 }}>Cancel</button>
            </form>
        </div>
    );
}