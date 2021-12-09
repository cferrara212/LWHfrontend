import React, {useContext, useState,} from 'react';
import { BaseURLContext } from "../../services/baseURL-Context";
import { useNavigate } from "react-router";
import { defaultPostRequest } from "../../services/functions";
import { Spinner } from "react-bootstrap";
import useForm from '../UseForm/UseForm';
import "./Register.css"
const Register = () => {
    const { values, errors, handleChange, handleSubmit } = useForm(registerUser);
    const { baseUrl } = useContext(BaseURLContext);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    async function registerUser() { 

        const registrationData = {
            username: values.username,
            password: values.password,
            email: values.email,
            first_name: values.firstName,
            last_name: values.lastName,
            middle_name:values.middleName,
        };

        setIsLoading(true);
        const response = await defaultPostRequest(`${baseUrl}auth/register/`, registrationData);
        if (response) {
            navigate("/login");
        }
    }

    function renderUserForm() {
        return (
            <fieldset>
                <p>All fields must be completed</p>
                <div className="ms-4 me-4">
                    <div className="form-group mt-4 mb-4">
                        <div className="form-floating mb-3">
                            <input
                                type="text"
                                name="username"
                                className="form-control"
                                id="username"
                                placeholder="username"
                                value={values.username || ""}
                                onChange={handleChange}
                            />
                            <label htmlFor="username">Username</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                id="email"
                                placeholder="Email"
                                value={values.email || ""}
                                onChange={handleChange}
                            />
                            <label htmlFor="email">Email Address</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input
                                type="text"
                                name="firstName"
                                className="form-control"
                                id="firstName"
                                placeholder="First Name"
                                value={values.firstName || ""}
                                onChange={handleChange}
                            />
                            <label htmlFor="firstName">First Name</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input
                                type="text"
                                name="middleName"
                                className="form-control"
                                id="middleName"
                                placeholder="Middle Name (optional)"
                                value={values.middleName || ""}
                                onChange={handleChange}
                            />
                            <label htmlFor="phoneNumber">Middle Name</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input
                                type="text"
                                name="lastName"
                                className="form-control"
                                id="lastName"
                                placeholder="Last Name"
                                value={values.lastName || ""}
                                onChange={handleChange}
                            />
                            <label htmlFor="lastName">Last Name</label>
                        </div>
                     
                        <div className="form-floating mb-3">
                            <input
                                type="password"
                                name="password"
                                className="form-control"
                                id="password"
                                placeholder="password"
                                value={values.password || ""}
                                onChange={handleChange}
                            />
                            <label htmlFor="password">Password</label>
                            <p className="errors">
                                {errors.password ? `${errors.password}` : null}
                            </p>
                        </div>
                        <div className="form-floating mb-3">
                            <input
                                type="password"
                                name="verifyPassword"
                                className="form-control"
                                id="verifyPassword"
                                placeholder="verifyPassword"
                                value={values.verifyPassword || ""}
                                onChange={handleChange}
                            />
                            <label htmlFor="verifyPassword">Confirm password</label>
                            <p className="errors">
                                {errors.verifyPassword ? `${errors.verifyPassword}` : null}
                            </p>
                        </div>
                    </div>
                    <button
                        disabled={
                            errors.password ||
                            errors.verifyPassword ||
                            values.password == null ||
                            values.verifyPassword == null ||
                            values.username == null ||
                            values.email == null ||
                            values.firstName == null ||
                            values.lastName == null
                        }
                        className="btn btn-primary mb-4"
                        type="submit"
                        hidden={isLoading ? false:true}
                    >
                        Register
                    </button>
                    <Spinner 
                                classname="m-auto"
                                animation="border"
                                role="status"
                                hidden={isLoading ? true : false}>
                                    <span className="visually-hidden">Loading...</span>
                                </Spinner>
                </div>
            </fieldset>
        );
    }

    return (
        <React.Fragment>
            <h1>Account Registration</h1>
            <div className="account-form m-auto">
                <form onSubmit={handleSubmit}>
                    {renderUserForm()}
                </form>
            </div>
        </React.Fragment>
    );
}

export default Register;
