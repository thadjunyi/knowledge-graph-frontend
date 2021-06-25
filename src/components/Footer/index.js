import React from "react";

class Footer extends React.Component{

    render(){
        return(
            <React.Fragment>
                <footer className="footer">
                    <div className="container-fluid">
                        <div className="copyright">© {new Date().getFullYear()} Knowledge Graph Team</div>
                    </div>
                </footer>
            </React.Fragment >
        );
    }
}

export default Footer