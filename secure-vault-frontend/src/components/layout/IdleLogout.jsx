import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";


function IdleLogout(){

    const navigate = useNavigate();

    const { logout } = useAuth();


    useEffect(()=>{


        let timer;


        const inactivityTime = 10 * 60 * 1000; 
        // 10 minutes



        const logoutUser = async()=>{


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






        const resetTimer = ()=>{


            clearTimeout(timer);


            timer = setTimeout(
                logoutUser,
                inactivityTime
            );


        };







        const events=[

            "mousemove",
            "mousedown",
            "keypress",
            "scroll",
            "touchstart"

        ];





        events.forEach(event=>{


            window.addEventListener(
                event,
                resetTimer
            );


        });





        resetTimer();





        return ()=>{


            clearTimeout(timer);



            events.forEach(event=>{


                window.removeEventListener(
                    event,
                    resetTimer
                );


            });


        };



    },[]);




    return null;

}


export default IdleLogout;