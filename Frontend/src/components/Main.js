/* eslint-disable react/prefer-stateless-function */
/* eslint-disable react/jsx-filename-extension */

import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Login from './Login/Login';
import SignUp from './SignUp/Signup';
import Profile from './Profile/profile';
import Dashboard from './Dashboard/dashboard';
import LandingPage from './LandingPage/LandingPage';
import CreateGroup from './CreateGroup/CreateGroup';
// Create a Main Component
class Main extends Component {
  render() {
    return (
      <div>
        {/* Render Different Component based on Route */}
        <Route path="/" component={LandingPage} exact />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={SignUp} />
        <Route path="/profile" component={Profile} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/createGroup" component={CreateGroup} />
      </div>
    );
  }
}
// Export The Main Component
export default Main;
