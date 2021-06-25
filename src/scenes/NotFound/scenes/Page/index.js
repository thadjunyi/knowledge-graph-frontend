import React from 'react';
import PageNotFoundBox from './components/Box/index';


class PageNotFound extends React.Component {
  render() {
    return (
      <div className="content">
        <div className="container-fluid py-3">
          <PageNotFoundBox />
        </div>
      </div>
    );
  }
}

export default (PageNotFound);
