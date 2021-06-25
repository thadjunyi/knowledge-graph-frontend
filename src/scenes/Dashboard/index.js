import React from 'react';
import DashboardBox from './components/Box/index';

class Dashboard extends React.Component {
  render() {
    return (
        <div className="content">
          <div className="container-fluid">
              <DashboardBox />
          </div>
        </div>
    );
  }
}

export default Dashboard;
