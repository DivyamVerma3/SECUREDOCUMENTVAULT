import React, { useEffect, useState } from "react";
import API from "../../services/api";


function ManagerUsers() {


    const [users,setUsers] = useState([]);




    useEffect(()=>{

        loadUsers();

    },[]);






    const loadUsers = async()=>{

        try{

            const response =
                await API.get(
                "/api/manager/users"
                );


            setUsers(
                response.data
            );


        }catch(error){

            console.log(
                "User loading error",
                error
            );

        }

    };







    return (

        <div className="container-fluid mt-4">


            <h3>
                Department Users
            </h3>





            <table className="table table-bordered mt-3">


                <thead className="table-dark">

                    <tr>

                        <th>
                            Name
                        </th>

                        <th>
                            Email
                        </th>

                        <th>
                            Role
                        </th>

                        <th>
                            Department
                        </th>


                    </tr>

                </thead>





                <tbody>


                {
                    users.length === 0 ?

                    <tr>

                        <td 
                        colSpan="4"
                        className="text-center">

                            No Users Found

                        </td>

                    </tr>


                    :


                    users.map(user=>(


                        <tr key={user.userId}>


                            <td>
                                {user.username}
                            </td>



                            <td>
                                {user.email}
                            </td>



                            <td>
                                {user.role?.roleName}
                            </td>




                            <td>
                                {
                                user.department
                                ?.departmentName
                                }
                            </td>



                        </tr>


                    ))

                }


                </tbody>


            </table>



        </div>

    );

}


export default ManagerUsers;