import { useNavigate } from "react-router-dom";
import Locations from "../components/Locations";
import Projects from "../components/Projects";
import PurchaseOrders from "../components/PurchaseOrders";
import Vendors from "../components/Vendors";

export default function Dashboard() {
    const navigate = useNavigate();

    return (
        <div>
            <div className="header">
                <h1>Dashboard</h1>
                <button onClick={() => navigate('/')}>Log Out</button>
            </div>
            <hr />
            <Projects />
            <hr />
            <PurchaseOrders />
            <hr />
            <Vendors />
            <hr />
            <Locations />
        </div>
    );
};