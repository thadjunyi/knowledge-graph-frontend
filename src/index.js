import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import reportWebVitals from './reportWebVitals';
import './styles/bootstrap.css';
import Navbar from './components/Navbar/index';
import Footer from './components/Footer/index';
import Dashboard from './scenes/Dashboard/index';
import Search from './scenes/Search/index';
import PageNotFound from './scenes/NotFound/scenes/Page/index';

ReactDOM.render((
  <Router>
      <div className="wrapper">
          <div className="main-panel" data="blue">
              <Navbar />
              <Switch>
                  <Route path="/dashboard" component={Dashboard} />
                  <Route path="/search" component={Search} />
                  <Route path="/notfound" component={PageNotFound} />
                  <Route exact path="/">
                    <Redirect to="/dashboard"/>
                  </Route>
                  <Redirect to="/notfound" />
              </Switch>
              <Footer />
          </div>
      </div>
  </Router>
), document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
