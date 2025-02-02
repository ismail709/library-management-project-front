import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Navigate, Outlet } from "react-router";



export default function ProtectedRoute(){
    const {user} = useContext(UserContext);

    return user ? <Outlet /> : <Navigate to="/login" replace={true} /> ;
}