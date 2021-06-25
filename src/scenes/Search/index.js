import React from 'react';
import SearchBox from './components/Box/index';

class Search extends React.Component {
  render() {
    return (
        <div className="content">
          <div className="container-fluid">
            <SearchBox />
          </div>
        </div>
    );
  }
}

export default Search;
