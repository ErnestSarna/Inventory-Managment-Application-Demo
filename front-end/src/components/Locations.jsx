import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Locations() {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

            // Remove deleted location from state (no refetch needed)
            setLocations((prev) =>
                prev.filter((location) => location.id !== locationId)
            );
        } catch (err) {
            console.error("Error deleting location:", err);
            setError("Failed to delete location");
        }
    };


    if (loading) return <p>Loading locations...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div>
            <div className="header">
                <h2>Storage Locations</h2>
                <button>+ New Storage Location</button>
            </div>
            <div>
                <ul>
                    {locations.map((location) => (
                        <li key={location.id}>
                            <button>
                                <div className="component-card">
                                    <div className="header">
                                        <strong>{location.name}</strong>
                                        <button>Edit</button>
                                        <button onClick={() => handleDelete(location.id)}>Delete</button>
                                    </div>
                                    <hr/>
                                    <p>{location.address}</p>
                                </div>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};