import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import IdleLogout from "./IdleLogout";


function Layout({ children }) {


    return (

        <>

            {/* Auto logout after 10 minutes inactivity */}
            <IdleLogout />


            <Navbar />


            <div className="d-flex">


                <Sidebar />



                <div
                    className="flex-grow-1 p-4"
                    style={{
                        background: "#f4f7fc",
                        minHeight: "calc(100vh - 70px)"
                    }}
                >


                    {children}


                </div>


            </div>


        </>

    );

}


export default Layout;  