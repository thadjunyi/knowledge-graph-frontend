import React from "react";
import { withRouter } from 'react-router-dom'
import { NavLink } from "react-router-dom";

class Drawer extends React.Component {

    render() {
        return (
            <React.Fragment>
                <div className="sidebar" data="blue">
                    <div className="sidebar-wrapper">
                        <div className="logo">
                            <a href="/#" className="simple-text logo-mini" target="_blank">
                                <div className="logo-img">
                                    <img src="./logo192.png" width="50px" alt="logo-img"></img>
                                </div>
                            </a>
                            <a style={{ fontSize: "12px" }} href="/#" className="simple-text logo-normal" target="_blank">
                                Knowledge Graph</a>

                        </div>

                        <ul className="nav">
                            <li className="nav-item">
                                <NavLink
                                    to="/dashboard"
                                    className="nav-link"
                                    activeClassName="active"
                                    onClick={this.props.toggleSidebar}
                                >
                                    <i className="fa fa-tachometer"></i>
                                    <p>Dashboard</p>
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </React.Fragment >
        )
    }
}

export default withRouter(Drawer);

