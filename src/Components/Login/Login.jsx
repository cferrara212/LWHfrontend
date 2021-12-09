import React, { useContext, useEffect, useState } from "react";
import useForm from "../UseForm/UseForm";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../Components/useAuth/useAuth";
import { BaseURLContext } from "../../services/baseURL-Context";
import { Spinner, ToastContainer } from "react-bootstrap";
import { Toast } from "react-bootstrap";
import { loginUser } from "../../services/functions";

const Login = () =>{
    const {values, handleChange, handleSubmit} = useForm(userLogin);
    const { baseUrl } = useContext(BaseURLContext);
    const [showToast, setShowToast] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const auth = useAuth();

    useEffect(()=>{
        if(auth.jwt){
            console.log(auth);
        }
        else{
            checkCache();
        }
    },[]);

    function checkCache(){
        const cache = localStorage.getItem("contribJWT")
        if(cache){
            auth.signin(cache, ()=>{
                // navigate("/contributor")
                window.location ="/contributor"
            });
            
        }
    }
   
    function userLogin(){
        setIsLoading(true);
        getJwt();
    }

    const getJwt = async () => {
        const credentials = {username: values.username, password: values.password};
        const response = await loginUser("http://127.0.0.1:8000/api/auth/login/", credentials);
        if (response){
            console.log(response.data)
            localStorage.setItem("contribJWT", response.data.access)
            // const {token} = response.data
            // auth.signin(token, () => {
               
            //     window.location = "/contributor"
            // });
            window.location = "/contributor"
        }
        else{
            setShowToast(true);
        }
        setIsLoading(false);
    };

    return(
        <React.Fragment>
            <ToastContainer className="p-3" position="top-center">
                <Toast
                    className="toast"
                    onClose={() => setShowToast(false)}
                    show={showToast}
                    delay={3000}
                    autohide
                >
                    <Toast.Header className="toast-header">
                        <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
                        <strong className="me-auto">Invalid Credentials</strong>
                        <small>Login error</small>
                    </Toast.Header>
                    <Toast.Body className="toast-body">Bad username and/or password</Toast.Body>
                </Toast>
            </ToastContainer>
            <div className="account-form m-auto">
                <div className="ms-2 me-2">
                    <form onSubmit={handleSubmit}>
                        <fieldset>
                            <div className="d-grid gap-4 ms-4 me-4">
                                <div className="form-group">
                                    <div className="form-floating mb-3">
                                        <input type="text"
                                               name="username"
                                               className="form-control"
                                               id="floatingUsername"
                                               placeholder="me123"
                                               value={values.username || ""}
                                               onChange = {handleChange}
                                               />
                                        <label htmlFor="floatingUsername">Username</label>
                                    </div>
                                    <div className="form-floating mb-3">
                                        <input type="password"
                                               name="password"
                                               className="form-control"
                                               id="floatingUsername"
                                               placeholder="Password"
                                               value={values.password || ""}
                                               onChange={handleChange}
                                               />
                                        <label htmlFor="floatingUsername">Password</label>
                                    </div>
                                </div>
                            </div>
                            <button className="btn btn-lg btn-primary"
                                    type="submit"
                                    hidden={isLoading ? true: false}
                                    >
                                        Login
                            </button>
                            <Spinner 
                                classname="m-auto"
                                animation="border"
                                role="status"
                                hidden={isLoading ? false : true}>
                                    <span className="visually-hidden">Loading...</span>
                                </Spinner>
                        </fieldset>
                    </form>
                    <small>Not Registered?</small>
                    <Link to="/register">Register</Link>
                </div>
            </div>
        </React.Fragment>
    )

}

export default Login;
