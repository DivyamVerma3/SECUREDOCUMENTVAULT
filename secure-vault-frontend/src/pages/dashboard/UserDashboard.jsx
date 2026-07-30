import { useEffect, useState } from "react";
import API from "../../services/api";


function UserDashboard(){


    const [stats,setStats] = useState({

        myDocuments:0

    });





    useEffect(()=>{

        loadStats();

    },[]);






    const loadStats = async()=>{


        try{


            const response =
                await API.get("/api/dashboard/user");


            setStats(response.data);



        }catch(error){


            console.log(
                "User dashboard error",
                error
            );


        }


    };







    return (

        <div className="container-fluid mt-4">


            <h2>
                User Dashboard
            </h2>





            <div className="row mt-4">



                <div className="col-md-4">


                    <div className="card shadow">


                        <div className="card-body">


                            <h5>
                                My Documents
                            </h5>


                            <h2>
                                {stats.myDocuments}
                            </h2>


                        </div>


                    </div>


                </div>




            </div>




        </div>

    );


}


export default UserDashboard;