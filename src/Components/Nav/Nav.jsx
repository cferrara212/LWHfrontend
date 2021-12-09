import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "./Nav.css"



function Nav(){
    const [pageNumber, setPageNumber] = useState(1);
    const token = localStorage.getItem('contribJWT')

    useEffect(() => {
      if(token){
        setPageNumber(2);
      }
      else{
        setPageNumber(1)
      }
   },[token]);



    function displayContributor(){
        return(
          <div class="container-fluid">
          <nav class="navbar navbar-expand-lg navbar-light bg-light">
          
            <a class="navbar-brand" href="#">LHW</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor03" aria-controls="navbarColor03" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
        
            <div class="collapse navbar-collapse" id="navbarColor03">
              <ul class="navbar-nav me-auto">
                <li class="nav-item">
                  <Link to="/"><a class="nav-link active">Home
                    <span class="visually-hidden">(current)</span>
                  </a>
                  </Link>
                </li>
                <li class="nav-item">
                  <Link to="/contributor">
                  <a class="nav-link">Contributions Page</a>
                  </Link>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#">Make Contribution</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#">About LHW</a>
                </li>
              </ul>
              <form class="d-flex">
                <Link to="/register"><button class="btn btn-secondary my-2 my-sm-0" type="submit">Register</button></Link>
                <Link to="/"><button class="btn btn-secondary my-2 my-sm-0" type="submit" onClick={()=>{localStorage.removeItem('contribJWT'); setPageNumber(1)}}>Logoff</button></Link>
              </form>
            </div>
          
        </nav>
        </div>
        )
    }

    function displayUser(){

        return(
          <div class="container-fluid">
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
            
              <a class="navbar-brand" href="#">LHW LOGO</a>
              <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor03" aria-controls="navbarColor03" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
              </button>
          
              <div class="collapse navbar-collapse" id="navbarColor03">
                <ul class="navbar-nav me-auto">
                  <li class="nav-item">
                    <a class="nav-link active" href="#">Home
                      <span class="visually-hidden">(current)</span>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="#">About</a>
                  </li>
                </ul>
                <form class="d-flex">
                  <Link to="/register"><button class="btn btn-secondary my-2 my-sm-0" type="submit">Register</button></Link>
                  <Link to="/login"><button class="btn btn-secondary my-2 my-sm-0" type="submit">Login</button></Link>
                </form>
              </div>
            
          </nav>
          </div>
        )
    }

    return(
        <React.Fragment>
            {pageNumber === 1 ? displayUser() : displayContributor()}
        </React.Fragment>
    )
}

export default Nav;