import React, { useEffect, useState } from "react";
import API from "../../services/api";


function HRDocuments() {


    const [documents, setDocuments] = useState([]);

    const [keyword, setKeyword] = useState("");

    const [loading, setLoading] = useState(false);





    useEffect(() => {

        loadDocuments();

    }, []);







    // ===========================
    // Load Documents
    // ===========================

    const loadDocuments = async () => {


        try {


            setLoading(true);


            const response =
                await API.get(
                    "/api/hr/documents"
                );


            setDocuments(
                response.data
            );



        } catch(error){


            console.log(error);


        }
        finally{


            setLoading(false);


        }

    };









    // ===========================
    // Search Documents
    // ===========================

    const searchDocuments = async()=>{


        try{


            if(keyword.trim()===""){


                loadDocuments();

                return;

            }



            const response =
                await API.get(
                `/api/hr/documents/search?keyword=${keyword}`
                );


            setDocuments(
                response.data
            );



        }catch(error){


            alert(
                "Search failed"
            );


        }


    };









    // ===========================
    // Delete Document
    // ===========================

    const deleteDocument = async(id)=>{


        if(!window.confirm(
            "Delete this document?"
        )){

            return;

        }



        try{


            await API.delete(
                `/api/hr/documents/${id}`
            );



            alert(
                "Document Deleted"
            );


            loadDocuments();



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
                HR Document Management
            </h3>





            <div className="row mt-3 mb-3">


                <div className="col-md-6">


                    <input

                    className="form-control"

                    placeholder="Search document"

                    value={keyword}

                    onChange={(e)=>
                        setKeyword(
                            e.target.value
                        )
                    }

                    />


                </div>




                <div className="col-md-2">


                    <button

                    className="btn btn-primary"

                    onClick={searchDocuments}

                    >

                        Search

                    </button>


                </div>



            </div>









            {
            loading ?


            <div className="text-center">

                Loading Documents...

            </div>



            :



            <table className="table table-bordered">


                <thead className="table-dark">


                <tr>


                    <th>
                        File Name
                    </th>


                    <th>
                        Uploaded By
                    </th>


                    <th>
                        Department
                    </th>


                    <th>
                        Upload Date
                    </th>


                    <th>
                        Status
                    </th>


                    <th>
                        Action
                    </th>


                </tr>


                </thead>







                <tbody>


                {


                documents.length === 0 ?


                <tr>

                    <td
                    colSpan="6"
                    className="text-center"
                    >

                        No Documents Found

                    </td>


                </tr>



                :



                documents.map(doc=>(


                    <tr key={doc.documentId}>


                        <td>

                            {doc.fileName}

                        </td>




                        <td>

                            {
                            doc.user?.username ||
                            "-"
                            }

                        </td>





                        <td>

                            {
                            doc.user?.department
                            ?.departmentName ||
                            "-"
                            }

                        </td>






                        <td>


                            {

                            doc.uploadDate

                            ?

                            new Date(
                                doc.uploadDate
                            )
                            .toLocaleString()

                            :

                            "-"

                            }


                        </td>








                        <td>


                        {

                        doc.expired


                        ?

                        <span className="badge bg-danger">

                            Expired

                        </span>



                        :


                        <span className="badge bg-success">

                            Active

                        </span>


                        }


                        </td>









                        <td>


                        <button

                        className="btn btn-danger btn-sm"

                        onClick={()=>
                            deleteDocument(
                                doc.documentId
                            )
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


export default HRDocuments;