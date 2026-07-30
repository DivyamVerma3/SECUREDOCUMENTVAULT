import { useEffect, useState } from "react";
import API from "../../services/api";


function ManagerDashboard(){


    const [stats,setStats] = useState({

        totalDocuments:0,

        teamMembers:0,

        departmentName:""

    });





    useEffect(()=>{

        loadStats();

    },[]);






    const loadStats = async()=>{


        try{


            const response =
                await API.get("/api/dashboard/manager");


            setStats(response.data);



        }catch(error){


            console.log(
                "Manager dashboard error",
                error
            );


        }


    };







    return (

        <div className="container-fluid mt-4">


            <h2>
                Manager Dashboard
            </h2>




            <h6 className="text-muted">

                Department :
                {" "}
                {stats.departmentName || "-"}

            </h6>





            <div className="row mt-4">







                <div className="col-md-4">


                    <div className="card shadow">


                        <div className="card-body">


                            <h5>
                                Team Members
                            </h5>


                            <h2>
                                {stats.teamMembers}
                            </h2>


                        </div>


                    </div>


                </div>









                <div className="col-md-4">


                    <div className="card shadow">


                        <div className="card-body">


                            <h5>
                                Team Documents
                            </h5>


                            <h2>
                                {stats.totalDocuments}
                            </h2>


                        </div>


                    </div>


                </div>









                <div className="col-md-4">


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


export default ManagerDashboard;