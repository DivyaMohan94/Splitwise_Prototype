/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable eqeqeq */
/* eslint-disable react/destructuring-assignment */
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
  Button, Container, Alert, Dropdown, DropdownButton, Card,
} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import { connect } from "react-redux";
import numeral from 'numeral';
import URL_VAL from "../../backend";
import { logout } from "../../actions/loginaction";
import SideNav from "./sideNav";

// create the Navbar Component
class RecentActivity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recentActivity: {},
      groupDropdown: {},
      isDataPresent: false,
      selectedGroup: "",
      selectedSort: "Most recent first",
      recentActivityDesc: {},
    };
    this.onGroupChange = this.onGroupChange.bind(this);
    this.onSortChange = this.onSortChange.bind(this);
  }

  componentDidMount() {
    console.log("inside component did mount of Recent Activity");
    const data = localStorage.getItem('userID');
    axios.defaults.headers.common.authorization = localStorage.getItem('token');
    axios
      .get(`${URL_VAL}/recent`, {
        params: {
          userID: data,
        },
      })
      .then((response) => {
        console.log("Status Code : ", response.status);
        console.log("Status Code : ", response.data);
        if (response.status === 200) {
          console.log("inside success");
          if (response.data.length > 0) {
            this.setState({
              recentActivity: response.data,
              recentActivityDesc: response.data,
              // sortedActivities: response.data.reverse(),
              isDataPresent: true,
            });
          } else {
            this.setState({
              isDataPresent: false,
            });
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });

    // get groups drop down values
    axios.defaults.headers.common.authorization = localStorage.getItem('token');
    axios
      .get(`${URL_VAL}/recent/groupsDropdown`, {
        params: {
          userID: data,
        },
      })
      .then((response) => {
        console.log("Status Code : ", response.status);
        console.log("Status Code : ", response.data);
        if (response.status === 200) {
          console.log("inside success");
          if (response.data.length > 0) {
            this.setState({
              groupDropdown: response.data,
            });
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  onGroupChange(e) {
    const index = e.target.selectedIndex;
    const optionElement = e.target.childNodes[index];
    const optionElementId = optionElement.getAttribute('id');
    console.log(index);
    this.setState({
      selectedGroupID: optionElementId,
      selectedGroup: optionElement.value,
    });
    const data = localStorage.getItem('userID');
    axios.defaults.headers.common.authorization = localStorage.getItem('token');
    axios
      .get(`${URL_VAL}/recent/filterGroup`, {
        params: {
          userID: data,
          groupID: optionElementId,
        },
      })
      .then((response) => {
        console.log("Status Code : ", response.status);
        console.log("Status Code : ", response.data);
        if (response.status === 200) {
          console.log("inside success");
          // if (response.data.length > 0) {
          this.setState({
            recentActivity: response.data,
            recentActivityDesc: response.data,
            // sortedActivities: response.data.reverse(),
          });
          // }
          if (response.data.length > 0) {
            this.setState({
              isDataPresent: true,
            });
          } else {
            this.setState({
              isDataPresent: false,
            });
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  onSortChange(e) {
    console.log(e.target.selectedIndex);
    console.log(`bug${JSON.stringify(this.state.recentActivityDesc)}`);
    if (e.target.selectedIndex === 1) {
      const sortedActivities = this.state.recentActivity.reverse();
      this.setState({
        selectedSort: "Most recent last",
        recentActivity: sortedActivities,
      });
    } else {
      this.setState({
        selectedSort: "Most recent first",
        recentActivity: this.state.recentActivityDesc,
      });
    }
  }

  render() {
    const noDataMsg = "You do not have any recent activities";
    const { isDataPresent, recentActivity } = this.state;
    const data = localStorage.getItem('userID');
    const currencyType = localStorage.getItem('currency');
    console.log(isDataPresent);
    return (
      <Container>
        <Row
          style={{
            backgroundColor: "#eee",
            height: "70px",
            justifyContent: "center",
            borderBottom: "1px",
            borderBottomColor: "#ddd",
            borderBottomStyle: "solid",
            padding: "20px",
          }}
        >
          <Col md={6}>
            <h4 style={{ fontWeight: "600", fontSize: "24px" }}>Recent Activity</h4>
          </Col>
          <Col md={2}>
            {/* {isDataPresent && ( */}
            <Form.Control as="select" onChange={this.onGroupChange} value={this.state.selectedGroup}>
              <option id="0">All groups</option>
              {
                Object.values(this.state.groupDropdown).map((item) => (
                  <option id={item._id}>{item.groupName}</option>
                ))
              }

            </Form.Control>
            {/* )} */}
          </Col>
          <Col md={3}>
            {/* {isDataPresent && ( */}
            <Form.Control as="select" onChange={this.onSortChange} value={this.state.selectedSort}>
              <option id="1">Most recent first</option>
              <option id="2">Most recent last</option>
            </Form.Control>
            {/* )} */}
          </Col>
        </Row>
        <Row>
          <Col md={1} />
          <Col md={8} style={{ marginTop: "10px" }}>
            {!isDataPresent && <h5>{noDataMsg}</h5>}
          </Col>
        </Row>
        <Row>
          <Col md={1} />
          <Col md={10}>
            {isDataPresent && recentActivity.map((item, index) => {
              let message = "";
              const date = item.createdOn.slice(0, 10);
              let status = "";
              let ownerName = "";
              let defaulterName = "";

              if (item.paymentStatus == "paid") {
                status = "paid";
              } else {
                status = "owes";
              }
              if (item.userID == data) {
                if (item.paymentStatus == "paid") {
                  status = "paid";
                } else {
                  status = "owe";
                }
              }

              if (item.oweToID == data) {
                ownerName = "you";
              } else {
                ownerName = item.owner[0].userName;
              }

              if (item.userID == data) {
                defaulterName = "you";
                // status = "owe";
              } else {
                defaulterName = item.defaulter[0].userName;
              }

              if (item.oweToID == item.userID) {
                message = (
                  <div style={{ display: "block" }}>
                    <p>
                      {ownerName}
                      {' '}
                      added the expense
                      <b>
                        "
                        {item.description}
                        "
                      </b>
                      {' '}
                      in the group
                      <b>
                        "
                        {item.groupName}
                        "
                      </b>
                      on
                      {' '}
                      <b>
                        {date}
                      </b>
                    </p>
                    <p>
                      {ownerName}
                      {' '}
                      paid a total amount of
                      {' '}
                      <b>
                        {currencyType}
                        {' '}
                        {numeral(item.totalAmount).format('0,0.00')}
                      </b>
                    </p>
                  </div>
                );
              } else {
                message = (
                  <div style={{ display: "block" }}>
                    <p>
                      {defaulterName}
                      {' '}
                      {status}
                      {' '}
                      <b>
                        {currencyType}
                        {' '}
                        {numeral(item.splitAmount).format('0,0.00')}
                      </b>
                      {' '}
                      to
                      {' '}
                      {ownerName}
                      {' '}
                      for the expense
                      {' '}
                      <b>
                        "
                        {item.description}
                        "
                      </b>
                      {' '}
                      added on
                      {' '}
                      <b>
                        {date}
                      </b>
                      {' '}
                      in
                      {' '}
                      <b>
                        {item.groupName}
                      </b>
                    </p>
                  </div>
                );
              }
              return (
                <Card>
                  <Row style={{ height: "90px", marginTop: "10px" }}>
                    <Col md="auto">
                      <img
                        src="https://s3.amazonaws.com/splitwise/uploads/category/icon/square_v2/uncategorized/general@2x.png"
                        alt="logo"
                        className="circle"
                        style={{ height: "60px", width: "60px" }}
                      />

                    </Col>

                    <Col>
                      {message}
                    </Col>
                  </Row>
                </Card>
              );
            })}
          </Col>
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({ userDetails: state.login });
// export default RecentActivity;
export default connect(mapStateToProps, null)(RecentActivity);
