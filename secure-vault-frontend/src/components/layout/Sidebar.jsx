import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";


function Sidebar(){


    const navigate = useNavigate();

    const { logout } = useAuth();


    const [role,setRole] = useState("USER");

    const [collapsed,setCollapsed] = useState(true);





    useEffect(()=>{

        loadRole();

    },[]);






    const loadRole = async()=>{


        try{


            const response =
                await API.get("/api/profile");


            setRole(
                response.data.role?.roleName || "USER"
            );



        }catch(error){


            setRole("USER");


        }


    };









    const handleLogout = async()=>{


        try{


            await API.post("/api/auth/logout");


        }catch(error){


            console.log(error);


        }
        finally{


            logout();

            localStorage.removeItem("token");

            sessionStorage.clear();


            navigate("/login",{
                replace:true
            });


        }


    };








    const commonMenu=[


        {
            icon:"bi-speedometer2",
            name:"Dashboard",
            path:
            role==="ADMIN"
            ? "/admin/dashboard"
            :
            role==="HR"
            ? "/hr/dashboard"
            :
            role==="MANAGER"
            ? "/manager/dashboard"
            :
            "/user/dashboard"
        },


        {
            icon:"bi-upload",
            name:"Upload Document",
            path:"/upload"
        },


        {
            icon:"bi-folder2-open",
            name:"My Documents",
            path:"/my-documents"
        },


        {
            icon:"bi-share",
            name:"Shared Documents",
            path:"/shared"
        },


        {
            icon:"bi-person",
            name:"Profile",
            path:"/profile"
        }


    ];









    const managerMenu=[

        {
    icon: "bi-share",
    name: "Sharing",
    path: "/manager/sharing"
},

        {
            icon:"bi-people",
            name:"Team Members",
            path:"/manager/users"
        },


        {
            icon:"bi-folder",
            name:"Team Documents",
            path:"/manager/documents"
        }


    ];









    const hrMenu=[


        {
            icon:"bi-people",
            name:"Employees",
            path:"/hr/users"
        },


        {
            icon:"bi-folder",
            name:"Documents Management",
            path:"/hr/documents"
        },


        {
            icon:"bi-building",
            name:"Departments",
            path:"/hr/departments"
        },


        {
            icon:"bi-person-plus",
            name:"Create User",
            path:"/register"
        }


    ];









    const adminMenu = [

    {
        icon: "bi-people",
        name: "Employees",
        path: "/admin/users"
    },

    {
        icon: "bi-building",
        name: "Departments",
        path: "/admin/departments"
    },

    {
        icon: "bi-person-plus",
        name: "Create User",
        path: "/register"
    },

    {
        icon: "bi-folder",
        name: "All Documents",
        path: "/admin/documents"
    },

    {
        icon: "bi-upload",
        name: "Upload Document",
        path: "/upload"
    },

    {
        icon: "bi-share",
        name: "Shared Documents",
        path: "/admin/sharing"
    },

    {
        icon: "bi-clock-history",
        name: "Version History",
        path: "/admin/versions"
    },

    {
        icon: "bi-shield-lock",
        name: "Sharing Permissions",
        path: "/admin/access"
    },

    {
        icon: "bi-journal-text",
        name: "Audit Logs",
        path: "/audit"
    },

    

];









    let menu=[...commonMenu];



    if(role==="MANAGER"){


        menu=[
            ...menu,
            ...managerMenu
        ];


    }





    if(role==="HR"){


        menu=[
            ...menu,
            ...hrMenu
        ];


    }






  if(role==="ADMIN"){

    menu = [

        commonMenu[0], // Dashboard

        ...adminMenu,

        commonMenu[4] // Profile

    ];

}









    return(


<div

className="bg-dark text-white d-flex flex-column"

style={{

width:collapsed?"80px":"260px",

minHeight:"calc(100vh - 70px)",

transition:"width 0.3s ease"

}}

>



<div className="p-3 border-bottom border-secondary text-center">


<button

className="btn btn-outline-light btn-sm"

onClick={()=>setCollapsed(!collapsed)}

>


<i className={`bi ${collapsed?"bi-list":"bi-chevron-left"}`}></i>


</button>


</div>







<div className="p-3 flex-grow-1">


{menu.map(item=>(


<NavLink

key={item.path}

to={item.path}

title={collapsed?item.name:""}

className={({isActive})=>

`d-flex align-items-center mb-2 p-3 rounded text-decoration-none ${
isActive
?
"bg-primary text-white"
:
"text-light"
}
${collapsed?"justify-content-center":""}`

}


>


<i className={`bi ${item.icon} fs-5 ${collapsed?"":"me-3"}`}></i>


{!collapsed && (

<span>

{item.name}

</span>

)}


</NavLink>


))}


</div>







<div className="p-3 border-top border-secondary">


<button

className={`btn btn-outline-danger w-100 ${collapsed?"px-0":""}`}

onClick={handleLogout}

>


<i className={`bi bi-box-arrow-right ${collapsed?"":"me-2"}`}></i>


{!collapsed && "Logout"}


</button>


</div>





</div>


);


}


export default Sidebar;