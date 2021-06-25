import React from 'react';
import { Link } from 'react-router-dom';

export default class PageNotFound_Box extends React.Component {
  render() {
    return (
      <div className="row align-items-center h-100">
        <div className="col-lg-12 mx-auto">
          <div className="jumbotron text-center">
            <h1 className="display-4">Page Under Construction</h1>
            <p><Link to="/contact" className="btn btn-primary btn-info mx-2 my-2">Contact Us!</Link></p>
          </div>
        </div>
      </div>
    );
  }
}
