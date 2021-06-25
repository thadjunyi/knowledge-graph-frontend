import React from "react";
import { withRouter } from 'react-router-dom'
import { NavLink } from "react-router-dom";

class Navbar extends React.Component {

    render() {
        return (
            <React.Fragment>
                <nav className="navbar navbar-expand-lg">
                    <div className="container-fluid">
                        <div className="navbar-wrapper">
                            <a href="/#" className="simple-text logo-mini">
                                <div className="logo-img">
                                    <img src="./logo192.png" width="50px" alt="logo-img"></img>
                                </div>
                            </a>
                            <a style={{ fontSize: "24px", color: 'white' }} href="/#" className="simple-text logo-normal">
                                Knowledge Graph
                            </a>
                        </div>

                        <button aria-expanded="false" aria-label="Toggle navigation" className="navbar-toggler" data-target="#navigation" data-toggle="collapse" id="navigation" type="button">
                            <span className="navbar-toggler-bar navbar-kebab"></span>
                            <span className="navbar-toggler-bar navbar-kebab"></span>
                            <span className="navbar-toggler-bar navbar-kebab"></span>
                        </button>

                        <div className="collapse navbar-collapse">
                            <ul className="ml-auto navbar-nav">
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/dashboard">
                                        <p style={{ fontSize: "18px", color: 'white' }}>Dashboard</p>
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/search">
                                        <p style={{ fontSize: "18px", color: 'white' }}>Search</p>
                                    </NavLink>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </React.Fragment >
        )
    }
}

export default withRouter(Navbar);