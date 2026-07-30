import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import API from "../../services/api";


function ProtectedRoute({ children, allowedRoles }) {


    const token =
        localStorage.getItem("token");


    const [loading, setLoading] =
        useState(true);


    const [role, setRole] =
        useState(null);



    useEffect(() => {

        loadUser();

    }, []);



    const loadUser = async () => {


        try {


            const response =
                await API.get("/api/profile");


            setRole(
                response.data.role?.roleName
            );


        } catch(error) {


            localStorage.removeItem("token");

            setRole(null);

        }


        setLoading(false);

    };





    // No token

    if(!token){

        return (
            <Navigate
                to="/login"
                replace
            />
        );

    }





    // Wait for profile

    if(loading){

        return (
            <div className="text-center mt-5">
                Loading...
            </div>
        );

    }





    // Invalid user

    if(!role){

        return (
            <Navigate
                to="/login"
                replace
            />
        );

    }






    // Role restriction

    if(
        allowedRoles &&
        !allowedRoles.includes(role)
    ){

        return (
            <Navigate
                to="/dashboard"
                replace
            />
        );

    }





    return children;

}


export default ProtectedRoute;