import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import API from "../../services/api";


function RoleRedirect() {


    const [role, setRole] = useState(null);

    const [loading, setLoading] = useState(true);




    useEffect(() => {

        fetchRole();

    }, []);





    const fetchRole = async () => {

        try {


            const response =
                await API.get("/api/profile");


            const userRole =
                response.data?.role?.roleName;


            setRole(userRole);



            // store role for sidebar usage
            localStorage.setItem(
                "role",
                userRole
            );



        } catch(error) {


            console.log(
                "Role fetch error",
                error
            );


            localStorage.removeItem("role");

            setRole(null);


        }


        setLoading(false);

    };







    if(loading){


        return (

            <div className="text-center mt-5">

                Loading Dashboard...

            </div>

        );

    }








    if(!role){


        return (

            <Navigate

                to="/login"

                replace

            />

        );

    }









    const dashboards = {


        ADMIN:
            "/admin/dashboard",


        HR:
            "/hr/dashboard",


        MANAGER:
            "/manager/dashboard",


        USER:
            "/user/dashboard"


    };









    return (

        <Navigate

            to={
                dashboards[role]
                ||
                "/user/dashboard"
            }

            replace

        />

    );


}


export default RoleRedirect;