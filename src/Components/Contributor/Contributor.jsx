import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import {protectedEnpointPostRequest} from "../../services/functions"
import { BaseURLContext } from '../../services/baseURL-Context';
import useForm from '../UseForm/UseForm';
import { Spinner } from 'react-bootstrap';

function Contributor(){

const { values, errors, handleChange, handleSubmit } = useForm(addFact);
const { baseURL } = useContext(BaseURLContext);
const [isLoading, setIsLoading] = useState(false);
const [chosenFact, setChosenFact] = useState();
const [fact, setFact] = useState();
const [contribs, setContribs] = useState([]);
const [pageState,setPageState] = useState(1);
const token = localStorage.getItem('contribJWT');


useEffect(()=>{
    if(token === null){
        setPageState(4)
    }
},[])

//  AXIOS CALL FUNCTIONS
//
//
const getContributions= async () =>{ 
    const response = await axios.get("http://127.0.0.1:8000/api/facts/user/", {headers:{Authorization: "Bearer " + token}});
    if(response){
        setContribs(response.data);
        console.log(response.data);
       }
    }

    const getFact = async () =>{
        const response = await axios.get(`http://127.0.0.1:8000/api/facts/${chosenFact}/`);
        if(response){
            setFact(response.data);
            console.log("factdata", response.data);
        }
    }

    async function addFact(){
        const factData = {
            name: values.name,
            state: values.state,
            city: values.city,
            street: values.street,
            zip: values.zip,
            fact: values.fact
        }
        const response = await protectedEnpointPostRequest("http://127.0.0.1:8000/api/facts/user/", factData , token);
        if (response){
            console.log("factpost", response);
            getContributions();
        }
    }
   

    useEffect(()=>{
        getContributions()
    },[])

//
//                     RENDER HELPER FUNCTION
//


function renderer(){
    if (pageState === 1){
        
        return(renderMainPage());
    }
    else if(pageState ===2 ){
    
        return(renderMakeContribution());
        
    }
    
    else if(pageState === 4){
        return(renderLoginPlease())
    }

    else{
        return(renderFactDetail());

    }
}

//
//
//                            NOT LOGGED IN
//
//

  function renderLoginPlease(){
      return(
      <div><h1>You are not logged in. Please login or register to view this page.</h1></div>
      )
  }

//
//                             MAIN PAGE RENDERING
//

    function renderMainPage(){
    
    const handleOnClick = async (id) => {
        await setChosenFact(id);
        await getFact();
        await setPageState(3);
      
        
    }

    return (
        <div>
            <h1>Welcome, and thank you for contributing to the LHW library.</h1><br/>
            <h2> These are you current fact contributions</h2>
            {contribs.map((contrib)=>
                <div>{contrib.name}<button className="btn btn-secondary my-2 my-sm-0" onClick={()=>handleOnClick(contrib.id)}>Fact Details</button> </div>
            )}
            <div>
                <button className="btn btn-secondary my-2 my-sm-0" onClick={()=>{setPageState(2)}}>Add Fact</button>
            </div>
        </div>
    )
}

//
//
//                        FORM FOR CONTRIBUTIONS
//
//

function renderMakeContribution(){
    return(
        <div>
            <div className="account-form m-auto">
                <form onSubmit={handleSubmit}>
                    <fieldset>
                        <p>All fields must be completed</p>
                        <div className="ms-4 me-4">
                            <div className="form-group mt-4 mb-4">
                                <div className="form-floating mb-3">
                                <input
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    id="name"
                                    placeholder="ex:Saloon number 10"
                                    value={values.name || ""}
                                    onChange={handleChange}
                                />
                                <label htmlFor="name">Fact Name detail</label>
                                </div>
                                <div className="form-floating mb-3">
                                <input
                                    type="text"
                                    name="state"
                                    className="form-control"
                                    id="state"
                                    placeholder="ex:SD"
                                    value={values.state || ""}
                                    onChange={handleChange}
                                />
                                <label htmlFor="state">State</label>
                                </div>
                                <div className="form-floating mb-3">
                                <input
                                    type="text"
                                    name="city"
                                    className="form-control"
                                    id="city"
                                    placeholder="ex:Deadwood"
                                    value={values.city || ""}
                                    onChange={handleChange}
                                />
                                <label htmlFor="city">City</label>
                                </div>
                                <div className="form-floating mb-3">
                                <input
                                    type="text"
                                    name="street"
                                    className="form-control"
                                    id="street"
                                    placeholder="125 Main St."
                                    value={values.street || ""}
                                    onChange={handleChange}
                                />
                                <label htmlFor="street">Street</label>
                                </div>
                                <div className="form-floating mb-3">
                                <input
                                    type="text"
                                    name="zip"
                                    className="form-control"
                                    id="zip"
                                    placeholder="89065"
                                    value={values.zip || ""}
                                    onChange={handleChange}
                                />
                                <label htmlFor="zip">5 Digit Zip Code</label>
                                </div>
                                <div className="form-floating mb-3">
                                <input
                                    type="text"
                                    name="fact"
                                    className="form-control"
                                    id="fact"
                                    placeholder="ex:This is where Wild Bill Hickock was gunned down."
                                    value={values.fact || ""}
                                    onChange={handleChange}
                                />
                                <label htmlFor="fact">Historical Fact</label>
                                </div>
                            </div>
                            <button
                        disabled={
                            values.name == null ||
                            values.state == null ||
                            values.city == null ||
                            values.street == null ||
                            values.zip == null ||
                            values.fact == null
                        }
                        className="btn btn-primary mb-4"
                        type="submit"
                        hidden={isLoading ? true:false}
                    >
                        Submit Fact
                    </button>
                    <Spinner 
                                classname="m-auto"
                                animation="border"
                                role="status"
                                hidden={isLoading ? false : true}>
                                    <span className="visually-hidden">Loading...</span>
                                </Spinner>
                        </div>
                    </fieldset>
                </form>
            </div>
            <button className="btn btn-secondary my-2 my-sm-0" onClick={()=>{setPageState(1)}}>Back</button>
        </div>
    )
}




                //    FACT DETAILS PAGE FOR CONTRIBUTED FACTS



function renderFactDetail(){
    return(
        <div>
            <div>
                <h1>Fact Details Page</h1>
                <ul>
                   <li>{fact.name}</li>
                   <li>{fact.state}</li>
                   <li>{fact.city}</li>
                   <li>{fact.street}</li>
                   <li>{fact.zip}</li>
                   <li>{fact.fact}</li>
                </ul>
            </div>
            <div>
                <button className="btn btn-secondary my-2 my-sm-0" onClick={()=>{setPageState(1)}}>Back</button>
            </div>
        </div>

    )
}

//
//              MAIN RETURN FOR APP
//
//

    return(
        <div>
            {renderer()}
        </div>
    )
}

export default Contributor;