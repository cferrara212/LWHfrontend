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
          <div className="container-fluid">
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
          
            <a className="navbar-brand" href="#">LHW</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor03" aria-controls="navbarColor03" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
        
            <div className="collapse navbar-collapse" id="navbarColor03">
              <ul className="navbar-nav me-auto">
                <li className="nav-item">
                  <Link to="/"><a className="nav-link active">Home
                    <span className="visually-hidden">(current)</span>
                  </a>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/contributor">
                  <a className="nav-link">Contributions Page</a>
                  </Link>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">About LHW</a>
                </li>
              </ul>
              <form className="d-flex">
                <Link to="/register"><button className="btn btn-secondary my-2 my-sm-0" type="submit">Register</button></Link>
                <Link to="/"><button className="btn btn-secondary my-2 my-sm-0" type="submit" onClick={()=>{localStorage.removeItem('contribJWT'); setPageNumber(1)}}>Logoff</button></Link>
              </form>
            </div>
          
        </nav>
        </div>
        )
    }

    function displayUser(){

        return(
          <div className="container-fluid">
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
            
              <a className="navbar-brand" href="#">LHW LOGO</a>
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor03" aria-controls="navbarColor03" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
          
              <div className="collapse navbar-collapse" id="navbarColor03">
                <ul className="navbar-nav me-auto">
                  <li className="nav-item">
                    <a className="nav-link active" href="#">Home
                      <span className="visually-hidden">(current)</span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#">About</a>
                  </li>
                </ul>
                <form className="d-flex">
                  <Link to="/register"><button className="btn btn-secondary my-2 my-sm-0" type="submit">Register</button></Link>
                  <Link to="/login"><button className="btn btn-secondary my-2 my-sm-0" type="submit">Login</button></Link>
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