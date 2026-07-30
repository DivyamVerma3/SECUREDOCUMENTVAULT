import React, { useEffect, useState } from "react";
import API from "../../services/api";


function HRDepartments() {


    const [departments, setDepartments] = useState([]);

    const [departmentName, setDepartmentName] = useState("");

    const [editId, setEditId] = useState(null);

    const [loading, setLoading] = useState(false);





    useEffect(() => {

        loadDepartments();

    }, []);





    // ===========================
    // Load Departments
    // ===========================

    const loadDepartments = async () => {

        try {

            setLoading(true);

            const response =
                await API.get(
                    "/api/hr/departments"
                );


            setDepartments(
                response.data
            );


        } catch(error) {

            console.log(error);

        }
        finally {

            setLoading(false);

        }

    };







    // ===========================
    // Add / Update
    // ===========================

    const saveDepartment = async () => {


        if(departmentName.trim()===""){

            alert(
                "Enter department name"
            );

            return;

        }



        try {


            if(editId === null){


                await API.post(
                `/api/hr/departments?departmentName=${departmentName}`
                );


                alert(
                    "Department Added"
                );


            }
            else{


                await API.put(
                `/api/hr/departments/${editId}?departmentName=${departmentName}`
                );


                alert(
                    "Department Updated"
                );


            }



            setDepartmentName("");

            setEditId(null);


            loadDepartments();



        }catch(error){


            alert(
                error.response?.data ||
                "Operation failed"
            );


        }

    };







    // ===========================
    // Edit
    // ===========================

    const editDepartment=(department)=>{


        setEditId(
            department.departmentId
        );


        setDepartmentName(
            department.departmentName
        );


    };








    // ===========================
    // Delete
    // ===========================

    const deleteDepartment=async(id)=>{


        if(!window.confirm(
            "Delete this department?"
        )){

            return;

        }



        try{


            await API.delete(
            `/api/hr/departments/${id}`
            );


            alert(
                "Department Deleted"
            );


            loadDepartments();



        }catch(error){


            alert(
            error.response?.data ||
            "Delete failed"
            );


        }


    };







    return (

        <div className="container-fluid mt-4">


            <h3>
                HR Department Management
            </h3>





            <div className="row mt-4 mb-3">


                <div className="col-md-6">


                    <input

                    className="form-control"

                    placeholder="Department Name"

                    value={departmentName}

                    onChange={(e)=>
                        setDepartmentName(
                            e.target.value
                        )
                    }

                    />


                </div>





                <div className="col-md-3">


                    <button

                    className="btn btn-primary"

                    onClick={saveDepartment}

                    >

                    {
                        editId === null
                        ?
                        "Add Department"
                        :
                        "Update Department"
                    }


                    </button>


                </div>




            </div>









            {
            loading ?

            <p>
                Loading...
            </p>

            :


            <table className="table table-bordered">


                <thead className="table-dark">


                    <tr>

                        <th>
                            ID
                        </th>


                        <th>
                            Department
                        </th>


                        <th>
                            Action
                        </th>


                    </tr>


                </thead>





                <tbody>


                {

                departments.map(dep=>(


                    <tr key={dep.departmentId}>


                        <td>
                            {dep.departmentId}
                        </td>



                        <td>
                            {dep.departmentName}
                        </td>





                        <td>


                        <button

                        className="btn btn-warning btn-sm me-2"

                        onClick={()=>
                            editDepartment(dep)
                        }

                        >

                            Edit

                        </button>





                        <button

                        className="btn btn-danger btn-sm"

                        onClick={()=>
                            deleteDepartment(
                            dep.departmentId)
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


export default HRDepartments;