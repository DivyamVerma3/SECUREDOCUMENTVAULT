import { useEffect, useState } from "react";
import API from "../../services/api";


function HRUsers() {


    const [users, setUsers] = useState([]);

    const [departments, setDepartments] = useState([]);

    const [keyword, setKeyword] = useState("");

    const [loading, setLoading] = useState(false);





    useEffect(() => {

        loadUsers();
        loadDepartments();

    }, []);





    // ===========================
    // Load Users
    // ===========================

    const loadUsers = async () => {

        try {

            setLoading(true);

            const response =
                await API.get("/api/hr/users");


            setUsers(response.data);


        } catch(error) {

            console.log(error);

        }
        finally {

            setLoading(false);

        }

    };





    // ===========================
    // Load Departments
    // ===========================

    const loadDepartments = async () => {

        try {


            const response =
                await API.get("/api/hr/departments");


            setDepartments(response.data);



        } catch(error) {


            console.log(
                "Department load error",
                error
            );


        }

    };






    // ===========================
    // Search
    // ===========================

    const searchUsers = async () => {


        try {


            if(keyword.trim()===""){

                loadUsers();

                return;

            }



            const response =
                await API.get(
                `/api/hr/users/search?keyword=${keyword}`
                );


            setUsers(response.data);



        }catch(error){

            console.log(error);

        }


    };








    // ===========================
    // Delete User
    // ===========================

    const deleteUser = async(id)=>{


        if(!window.confirm(
            "Delete this user?"
        )){

            return;

        }



        try{


            await API.delete(
                `/api/hr/users/${id}`
            );


            alert(
                "User deleted"
            );


            loadUsers();



        }catch(error){


            alert(
                error.response?.data ||
                "Delete failed"
            );


        }


    };







    // ===========================
    // Assign Role
    // ===========================

    const assignRole = async(
        id,
        roleName)=>{


        if(!roleName){

            return;

        }



        try{


            await API.put(
            `/api/hr/users/${id}/role?roleName=${roleName}`
            );


            loadUsers();



        }catch(error){


            alert(
            error.response?.data ||
            "Role update failed"
            );


        }


    };








    // ===========================
    // Assign Department
    // ===========================

    const assignDepartment = async(
        id,
        departmentId)=>{


        if(!departmentId){

            return;

        }




        try{


            await API.put(
            `/api/hr/users/${id}/department?departmentId=${departmentId}`
            );



            loadUsers();



        }catch(error){


            alert(
            error.response?.data ||
            "Department update failed"
            );


        }


    };








    return (

        <div className="container-fluid mt-4">


            <h3>
                HR User Management
            </h3>





            <div className="row mb-3">


                <div className="col-md-6">


                    <input

                    className="form-control"

                    placeholder="Search user"

                    value={keyword}

                    onChange={(e)=>
                        setKeyword(e.target.value)
                    }

                    />


                </div>



                <div className="col-md-2">


                    <button

                    className="btn btn-primary"

                    onClick={searchUsers}

                    >

                        Search

                    </button>


                </div>


            </div>









            {
                loading ?

                <div className="text-center">

                    Loading...

                </div>


                :



                <table className="table table-bordered">


                    <thead className="table-dark">


                    <tr>

                        <th>Name</th>

                        <th>Email</th>

                        <th>Role</th>

                        <th>Department</th>

                        <th>Assign Role</th>

                        <th>Assign Department</th>

                        <th>Action</th>

                    </tr>


                    </thead>





                    <tbody>


                    {
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
                            {user.department?.departmentName}
                        </td>





                        <td>


                        <select

                        className="form-select"

                        defaultValue=""

                        onChange={(e)=>
                            assignRole(
                            user.userId,
                            e.target.value)
                        }

                        >

                            <option value="">
                                Select
                            </option>


                            <option value="USER">
                                USER
                            </option>


                            <option value="HR">
                                HR
                            </option>


                            <option value="MANAGER">
                                MANAGER
                            </option>


                        </select>


                        </td>







                        <td>


                        <select

                        className="form-select"

                        defaultValue=""

                        onChange={(e)=>
                            assignDepartment(
                            user.userId,
                            e.target.value)
                        }

                        >


                            <option value="">
                                Select
                            </option>



                            {
                            departments.map(
                            dept=>(

                                <option

                                key={
                                dept.departmentId
                                }

                                value={
                                dept.departmentId
                                }

                                >

                                {
                                dept.departmentName
                                }

                                </option>

                            ))
                            }


                        </select>


                        </td>







                        <td>


                        <button

                        className="btn btn-danger btn-sm"

                        onClick={()=>
                            deleteUser(
                            user.userId)
                        }

                        >

                            Delete

                        </button>


                        </td>



                    </tr>


                    ))
                    }


                    </tbody>


                </table>


            }



        </div>

    );


}


export default HRUsers;