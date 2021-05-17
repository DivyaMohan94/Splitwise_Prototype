/* eslint-disable react/no-access-state-in-setstate */
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
  Button, Container, Alert, Dropdown, DropdownButton, Table,
} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import { connect } from "react-redux";
import numeral from 'numeral';
import URL_VAL from "../../backend";
import { logout } from "../../actions/loginaction";
import SideNav from "./sideNav";
import SettleUp from './SettleUpModal';
import { getDashboardDetails, getYouOweDetails, getYouAreOweDetails } from "../../actions/dashboardAction";

// create the Navbar Component
class DashboardContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toGiveAmt: 0,
      toReceiveAmt: 0,
      totalBalance: 0,
      isPositive: false,
      settledUp: false,
      modal: false,
      youAreOwed: {},
      youOwe: {},

    };

    this.modalOpen = this.modalOpen.bind(this);
    this.modalClose = this.modalClose.bind(this);
    this.onSettleUpClicked = this.onSettleUpClicked.bind(this);
  }

  componentDidMount() {
    console.log("inside did mount of dashboard container page");
    const data = localStorage.getItem('userID');
    axios.defaults.headers.common.authorization = localStorage.getItem('token');
    axios
      .get(`${URL_VAL}/dashboard`, {
        params: {
          UserID: data,
        },
      })
      .then((response) => {
        console.log("Status Code : ", response.status);
        console.log("Status Code : ", response.data);
        if (response.status === 200) {
          console.log("inside success");
          console.log(response.data.toGiveVal);
          if (response.data.toGiveVal.length === 0) {
            this.setState({
              toGiveAmt: 0,
            });
          } else {
            this.setState({
              toGiveAmt: response.data.toGiveVal,
            });
          }

          if (response.data.toReceiveVal.length === 0) {
            this.setState({
              toReceiveAmt: 0,
            });
          } else {
            this.setState({
              toReceiveAmt: response.data.toReceiveVal,
            });
          }

          if (parseFloat(this.state.toReceiveAmt) > parseFloat(this.state.toGiveAmt)) {
            this.setState({
              totalBalance: this.state.toReceiveAmt - this.state.toGiveAmt,
              isPositive: true,
            });
          } else if (parseFloat(this.state.toGiveAmt) > parseFloat(this.state.toReceiveAmt)) {
            this.setState({
              totalBalance: this.state.toGiveAmt - this.state.toReceiveAmt,
              isPositive: false,
            });
          } else {
            this.setState({
              totalBalance: 0,
              isPositive: true,
            });
          }

          const payloadData = {
            youOwe: this.state.toGiveAmt,
            youAreOwed: this.state.toReceiveAmt,
            totalBalance: this.state.totalBalance,
          };

          this.props.getDashboardDetails(payloadData);

          // Fetch Owe details
          axios.defaults.headers.common.authorization = localStorage.getItem('token');
          axios
            .get(`${URL_VAL}/dashboard/AllYouOwe`, {
              params: {
                UserID: data,
              },
            })
            .then((youOwe) => {
              console.log("Status Code : ", youOwe.status);
              console.log("Status Code : ", youOwe.data);
              if (response.status === 200) {
                console.log("inside success");
                this.props.getYouOweDetails(youOwe.data);
                this.setState({
                  youOwe: youOwe.data,
                });
              }
            });

          // Fetch you are owed details
          axios.defaults.headers.common.authorization = localStorage.getItem('token');
          axios
            .get(`${URL_VAL}/dashboard/AllYouAreOwed`, {
              params: {
                UserID: data,
              },
            })
            .then((youAreOwed) => {
              console.log("Status Code : ", youAreOwed.status);
              console.log("Status Code : ", youAreOwed.data);
              if (response.status === 200) {
                console.log("inside success");
                this.props.getYouOweDetails(youAreOwed.data);
                this.setState({
                  youAreOwed: youAreOwed.data,
                });
              }
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  componentDidUpdate() {
    console.log("inside did update of dashboard container page");
    console.log(this.state.settledUp);
    if (this.state.settledUp === true) {
      console.log("inside did update of dashboard container page");
      const data = localStorage.getItem('userID');
      axios.defaults.headers.common.authorization = localStorage.getItem('token');
      axios
        .get(`${URL_VAL}/dashboard`, {
          params: {
            UserID: data,
          },
        })
        .then((response) => {
          console.log("Status Code : ", response.status);
          console.log("Status Code : ", response.data);
          if (response.status === 200) {
            console.log("inside success");
            console.log(response.data.toGiveVal);
            this.setState({
              settledUp: false,
            });
            if (response.data.toGiveVal.length === 0) {
              this.setState({
                toGiveAmt: 0,
              });
            } else {
              this.setState({
                toGiveAmt: response.data.toGiveVal,
              });
            }

            if (response.data.toReceiveVal.length === 0) {
              this.setState({
                toReceiveAmt: 0,
              });
            } else {
              this.setState({
                toReceiveAmt: response.data.toReceiveVal,
              });
            }

            if (parseFloat(this.state.toReceiveAmt) > parseFloat(this.state.toGiveAmt)) {
              this.setState({
                totalBalance: this.state.toReceiveAmt - this.state.toGiveAmt,
                isPositive: true,
              });
            } else if (parseFloat(this.state.toGiveAmt) > parseFloat(this.state.toReceiveAmt)) {
              this.setState({
                totalBalance: this.state.toGiveAmt - this.state.toReceiveAmt,
                isPositive: false,
              });
            } else {
              this.setState({
                totalBalance: 0,
                isPositive: true,
              });
            }

            // Fetch Owe details
            axios.defaults.headers.common.authorization = localStorage.getItem('token');
            axios
              .get(`${URL_VAL}/dashboard/AllYouOwe`, {
                params: {
                  UserID: data,
                },
              })
              .then((youOwe) => {
                console.log("Status Code : ", youOwe.status);
                console.log("Status Code : ", youOwe.data);
                if (response.status === 200) {
                  console.log("inside success");

                  this.setState({
                    youOwe: youOwe.data,
                  });
                }
              });

            // Fetch you are owed details
            axios.defaults.headers.common.authorization = localStorage.getItem('token');
            axios
              .get(`${URL_VAL}/dashboard/AllYouAreOwed`, {
                params: {
                  UserID: data,
                },
              })
              .then((youAreOwed) => {
                console.log("Status Code : ", youAreOwed.status);
                console.log("Status Code : ", youAreOwed.data);
                if (response.status === 200) {
                  console.log("inside success");

                  this.setState({
                    youAreOwed: youAreOwed.data,
                  });
                }
              });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  onSettleUpClicked() {
    console.log("inside settle up clicked");
    this.setState({
      settledUp: true,
    });
  }

  modalOpen() {
    this.setState({ modal: true });
  }

  modalClose() {
    this.setState({
      modal: false,
    });
  }

  render() {
    const youAreOwedString = "You are not owed anything";
    const youOweString = "You do not owe anything";
    const currencyType = localStorage.getItem('currency');
    console.log(`currency type is: ${currencyType}`);
    return (
      <Container>
        <Row style={{
          backgroundColor: "#eee",
          height: "70px",
          justifyContent: "center",
          borderBottom: "1px",
          borderBottomColor: "#ddd",
          borderBottomStyle: "solid",
          padding: "20px",
        }}
        >
          <Col md={8}>
            <h4 style={{ fontWeight: "600", fontSize: "24px" }}>Dashboard</h4>
          </Col>
          <Col>
            <Button variant="primary" onClick={this.modalOpen}>Settle Up</Button>
            <SettleUp
              show={this.state.modal}
              onHide={(e) => this.modalClose(e)}
              onSettleUpClicked={this.onSettleUpClicked}
            />
          </Col>
        </Row>
        <Row style={{
          backgroundColor: "#eee", height: "120px", textAlign: 'center', justifyContent: "center", borderBottom: "1px", borderBottomColor: "#ddd", padding: "20px", borderColor: "#ddd",
        }}
        >
          <Table bordered fluid="true">
            <thead>
              <tr>
                <th>
                  <h5>Total Balance</h5>
                  {this.state.isPositive && (
                  <span>
                    <h5 style={{ color: "green" }}>
                      {currencyType}
                      {' '}
                      {numeral(this.state.totalBalance).format('0,0.00')}
                    </h5>
                  </span>
                  )}
                  {!this.state.isPositive && (
                  <span>
                    <h5 style={{ color: "red" }}>
                      {currencyType}
                      {' '}
                      {numeral(this.state.totalBalance).format('0,0.00')}
                    </h5>
                  </span>
                  )}
                </th>
                <th>
                  <h5>You owe</h5>
                  <span>
                    <h5>
                      {currencyType}
                      {' '}
                      {numeral(this.state.toGiveAmt).format('0,0.00')}
                    </h5>
                  </span>
                </th>
                <th>
                  <h5>You are owed</h5>
                  <span>
                    <h5>
                      {currencyType}
                      {' '}
                      {numeral(this.state.toReceiveAmt).format('0,0.00')}
                    </h5>
                  </span>
                </th>
              </tr>
            </thead>
          </Table>
          {/* <Col style={{ borderColor: "#ddd" }}>
            <h5>Total Balance</h5>
            {this.state.isPositive && (
            <span>
              <h5 style={{ color: "green" }}>
                {currencyType}
                {' '}
                {numeral(this.state.totalBalance).format('0,0.00')}
              </h5>
            </span>
            )}
            {!this.state.isPositive && (
            <span>
              <h5 style={{ color: "red" }}>
                {currencyType}
                {' '}
                {numeral(this.state.totalBalance).format('0,0.00')}
              </h5>
            </span>
            )}
          </Col>
          <Col>
            <h5>You owe</h5>
            <span>
              <h5>
                {currencyType}
                {' '}
                {numeral(this.state.toGiveAmt).format('0,0.00')}
              </h5>
            </span>
          </Col>
          <Col>
            <h5>You are owed</h5>
            <span>
              <h5>
                {currencyType}
                {' '}
                {numeral(this.state.toReceiveAmt).format('0,0.00')}
              </h5>
            </span>
          </Col> */}
        </Row>
        <Row style={{ marginTop: "15px" }}>
          <Col md={1} />
          <Col>
            <h6>
              <b>
                You Owe
              </b>
            </h6>
            {(this.state.youOwe).length === 0 && (
              <span style={{ padding: "2px" }}>
                <h6>{youOweString}</h6>
              </span>
            )}
            {(this.state.youOwe).length !== 0 && (
            <span style={{ padding: "2px" }}>
              {/* <ul>
                {Object.values(this.state.youOwe).map((data) => (
                  <li key={data.OweID} id={data.OweID}>
                    you owe
                    {' '}
                    {data.UserName}
                    {' '}
                    {currencyType}
                    {' '}
                    {numeral(data.SplitAmount).format('0,0.00')}
                    {' '}
                    for
                    {' '}
                    {data.GroupName}
                  </li>
                ))}
              </ul> */}

                {Object.values(this.state.youOwe).map((data) => (
                  <div style={{ display: "flex" }}>
                    <img
                      src="https://s3.amazonaws.com/splitwise/uploads/user/default_avatars/avatar-teal44-100px.png"
                      alt="logo"
                      className="circle"
                      style={{ height: "30px", width: "30px" }}
                    />
                    <p style={{ marginTop: "3px", marginLeft: "4px" }}>
                      you owe
                      {' '}
                      {data.owner[0].userName}
                      {' '}
                      {currencyType}
                      {' '}
                      {numeral(data.splitAmount).format('0,0.00')}
                      {' '}
                      for
                      {' '}
                      {data.description}
                      {' '}
                      in
                      {' '}
                      {data.groupName}
                    </p>
                  </div>
                ))}

            </span>
            )}
          </Col>

          <Col>
            <h6>
              <b>
                You are owed
              </b>
            </h6>
            {(this.state.youAreOwed).length === 0 && (
              <span style={{ padding: "2px" }}>
                <h6>{youAreOwedString}</h6>
              </span>
            )}
            {(this.state.youAreOwed).length !== 0 && (
            <span style={{ padding: "2px" }}>
              {/* <ul>
                {Object.values(this.state.youAreOwed).map((data) => (
                  <li key={data.OweID} id={data.OweID}>
                    {data.UserName}
                    {' '}
                    owes you
                    {' '}
                    {currencyType}
                    {' '}
                    {numeral(data.SplitAmount).format('0.00')}
                    {' '}
                    for
                    {' '}
                    {data.GroupName}
                  </li>
                ))}
              </ul> */}

                {Object.values(this.state.youAreOwed).map((data) => (
                  <div style={{ display: "flex" }}>
                    <img
                      src="https://s3.amazonaws.com/splitwise/uploads/user/default_avatars/avatar-teal44-100px.png"
                      alt="logo"
                      className="circle"
                      style={{ height: "30px", width: "30px" }}
                    />
                    <p style={{ marginTop: "3px", marginLeft: "4px" }}>
                      {data.defaulter[0].userName}
                      {' '}
                      owes you
                      {' '}
                      {currencyType}
                      {' '}
                      {numeral(data.splitAmount).format('0.00')}
                      {' '}
                      for
                      {' '}
                      {data.description}
                      {' '}
                      in
                      {' '}
                      {data.groupName}
                    </p>
                  </div>
                ))}

            </span>
            )}
          </Col>
          <Col md={1} />
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({ userDetails: state.login });

function mapDispatchToProps(dispatch) {
  console.log("in dispatch");
  return {
    getDashboardDetails: (payload) => dispatch(getDashboardDetails(payload)),
    getYouOweDetails: (payload) => dispatch(getYouOweDetails(payload)),
    getYouAreOweDetails: (payload) => dispatch(getYouAreOweDetails(payload)),
  };
}

// export default DashboardContainer;

export default connect(mapStateToProps, mapDispatchToProps)(DashboardContainer);
