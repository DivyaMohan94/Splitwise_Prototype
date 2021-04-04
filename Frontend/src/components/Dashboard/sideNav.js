/* eslint-disable react/prefer-stateless-function */
/* eslint-disable no-unused-vars */
import React, { Component } from "react";
// eslint-disable-next-line no-unused-vars
import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import cookie from "react-cookies";
import { Redirect } from "react-router";
import axios from "axios";
import propTypes from 'prop-types';
import {
  Button, Container, Alert, Dropdown, DropdownButton,
} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import { connect } from "react-redux";
import URL_VAL from "../../backend";

// create the Navbar Component
class SideNav extends Component {
  constructor(props) {
    super(props);
    // this.handleDashboard = this.handleDashboard.bind(this);
  }

  render() {
    return (
      <div style={{ display: "block" }}>
        <a href="#" id="dashboardlink">
          <span />
          Dashboard
        </a>
        <a href="#" id="recentLink">
          Recent activity
        </a>
        <a href="#" id="groupsLink">
          Groups +
        </a>
      </div>
    );
  }
}

export default SideNav;
