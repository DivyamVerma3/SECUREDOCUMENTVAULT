import { useEffect, useState } from "react";
import API from "../../services/api";


function AdminDashboard(){


    const [stats,setStats] = useState({

        totalUsers:0,

        totalDocuments:0,

        teamMembers:0,

        expiredDocuments:0

    });





    useEffect(()=>{

        loadStats();

    },[]);






    const loadStats = async()=>{


        try{


            const response =
                await API.get("/api/dashboard/admin");


            setStats(response.data);



        }catch(error){


            console.log(
                "Admin dashboard error",
                error
            );


        }


    };







    return (

        <div className="container-fluid mt-4">


            <h2>
                Admin Dashboard
            </h2>





            <div className="row mt-4">







                <div className="col-md-3">


                    <div className="card shadow">


                        <div className="card-body">


                            <h5>
                                Total Users
                            </h5>


                            <h2>
                                {stats.totalUsers}
                            </h2>


                        </div>


                    </div>


                </div>









                <div className="col-md-3">


                    <div className="card shadow">


                        <div className="card-body">


                            <h5>
                                Total Documents
                            </h5>


                            <h2>
                                {stats.totalDocuments}
                            </h2>


                        </div>


                    </div>


                </div>









                <div className="col-md-3">


                    <div className="card shadow">


                        <div className="card-body">


                            <h5>
                                Departments
                            </h5>


                            <h2>
                                {stats.teamMembers}
                            </h2>


                        </div>


                    </div>


                </div>









                <div className="col-md-3">


                    <div className="card shadow">


                        <div className="card-body">


                            <h5>
                                Expired Documents
                            </h5>


                            <h2>
                                {stats.expiredDocuments}
                            </h2>


                        </div>


                    </div>


                </div>







            </div>





        </div>

    );


}


export default AdminDashboard;