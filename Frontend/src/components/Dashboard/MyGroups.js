/* eslint-disable react/prop-types */
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
import {
  Button,
  Container,
  Card,
  ListGroup,
  Alert,
} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import { connect } from "react-redux";
import URL_VAL from "../../backend";
import { groupLeft } from '../../actions/myGroupsAction';

// create the Navbar Component
class MyGroups extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: {},
      invites: {},
      isValid: true,
      isInvitePresent: false,
      isGroupPresent: false,
      isUpdate: false,
      filteredGroups: {},
      showSuccess: false,
    };
    this.onLeave = this.onLeave.bind(this);
    this.update = this.update.bind(this);
    this.queryChange = this.queryChange.bind(this);
  }

  componentDidMount() {
    const data = localStorage.getItem('userID');
    axios.defaults.headers.common.authorization = localStorage.getItem('token');
    axios
      .get(`${URL_VAL}/group/getActiveGroups`, {
        params: {
          UserID: data,
        },
      })
      .then((response) => {
        console.log("Status Code : ", response.status);
        console.log("Status Code : ", response.data);
        if (response.status === 200) {
          console.log("inside success");
          if (response.data.length > 0) {
            this.setState({
              groups: response.data,
              isGroupPresent: true,
              filteredGroups: response.data,
            });
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });

    axios.defaults.headers.common.authorization = localStorage.getItem('token');
    axios
      .get(`${URL_VAL}/group/invites`, {
        params: {
          UserID: data,
        },
      })
      .then((response) => {
        console.log("Status Code : ", response.status);
        console.log("Status of invites : ", response.data);
        if (response.status === 200) {
          console.log("inside success");
          if (response.data.length > 0) {
            this.setState({
              invites: response.data,
              isInvitePresent: true,
            });
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  componentDidUpdate() {
    if (this.state.isUpdate) {
      const data = localStorage.getItem('userID');
      axios.defaults.headers.common.authorization = localStorage.getItem('token');
      axios
        .get(`${URL_VAL}/group/getActiveGroups`, {
          params: {
            UserID: data,
          },
        })
        .then((response) => {
          console.log("Status Code : ", response.status);
          console.log("Status Code : ", response.data);
          if (response.status === 200) {
            console.log("inside success");
            // if (response.data.length > 0) {
            this.setState({
              groups: response.data,
              isGroupPresent: true,
              filteredGroups: response.data,
            });
            if (response.data.length > 0) {
              this.setState({
                isGroupPresent: true,
              });
            } else {
              this.setState({
                isGroupPresent: false,
              });
            }
            // }
          }
        })
        .catch((error) => {
          console.log(error);
        });

      axios.defaults.headers.common.authorization = localStorage.getItem('token');
      axios
        .get(`${URL_VAL}/group/invites`, {
          params: {
            UserID: data,
          },
        })
        .then((response) => {
          console.log("Status Code : ", response.status);
          console.log("Status of invites : ", response.data);
          if (response.status === 200) {
            console.log("inside success");
            // if (response.data.length > 0) {
            this.setState({
              invites: response.data,
              isInvitePresent: true,
            });
            // }
          }
        })
        .catch((error) => {
          console.log(error);
        });

      this.update();
    }
  }

  onLeave(e) {
    e.preventDefault();
    const userID = localStorage.getItem('userID');
    const groupID = e.target.id;
    axios.defaults.headers.common.authorization = localStorage.getItem('token');
    axios
      .get(`${URL_VAL}/group/getDues`, {
        params: {
          userID,
          groupID,
        },
      })
      .then((response) => {
        console.log("Status Code : ", response.status);
        console.log("Status of invites : ", response.data);
        if (response.data.length > 0) {
          this.setState({
            isValid: false,
            showSuccess: false,
          });
        } else {
          this.setState({
            isValid: true,
            showSuccess: true,
          });
          // Leave the group
          const data = {
            userID,
            groupID,
          };

          axios.defaults.headers.common.authorization = localStorage.getItem('token');
          axios
            .put(`${URL_VAL}/group/leaveGroup`, data)
            .then((res) => {
              console.log("Status Code : ", res.status);
              console.log("leave group data : ", res.data);
              if (response.status === 200) {
                console.log("inside successfully left group");
                this.setState({
                  isUpdate: true,
                });
                this.props.updateOnLeaveGroup();
                this.props.groupLeft("Left group successfully");
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  queryChange(event) {
    const query = event.target.value;
    const filteredGroups = Object.values(this.state.groups).filter(
      (group) => group.groupName.includes(query),
    );
    this.setState({ filteredGroups });
  }

  update() {
    this.setState({
      isUpdate: false,
    });
  }

  render() {
    const sideNavSelect = "";

    const noGroupMsg = "No active groups!";
    const noInvitesMsg = "No pending invites!";
    const leaveGroupErr = "You have dues that are not cleared. Kindly clear all the dues to leave the group";
    const leaveGroupErrSuccess = "You have successfully left the group";
    console.log(`is invite present ${this.state.isInvitePresent}`);
    console.log(this.state.filteredGroups);
    return (
      <Container>
        <Row style={{
          backgroundColor: "#eee",
          height: "70px",
          borderBottom: "1px",
          borderBottomColor: "#ddd",
          borderBottomStyle: "solid",
          padding: "20px",
        }}
        >
          <h5><b>My Groups</b></h5>
        </Row>
        <Row style={{ marginTop: "10px" }}>
          <Col>
            {!this.state.isValid && (
            <Alert transition={false} variant="danger">
              {leaveGroupErr}
            </Alert>
            )}
          </Col>
        </Row>
        {this.state.showSuccess && (
        <Row style={{ marginTop: "10px" }}>
          <Col>

            <Alert transition={false} variant="success">
              {leaveGroupErrSuccess}
            </Alert>

          </Col>
        </Row>
        )}
        {!this.state.isGroupPresent && (
        <Row style={{ marginTop: "10px" }}>
          <Col><h5>{noGroupMsg}</h5></Col>
        </Row>
        )}
        {this.state.isGroupPresent && (
        <Row>
          <Col>
            <div style={{ display: "flex", margin: "30px" }}>
              <Form.Control required type="text" placeholder="Search" onChange={this.queryChange} style={{ width: "700px" }} />
              <Button style={{ marginLeft: "20px" }}>
                Search
              </Button>
            </div>
          </Col>
        </Row>
        )}
        {this.state.isGroupPresent && (
        <Row>
          <Col>
            <ul>
              {Object.values(this.state.filteredGroups).map((group) => (
                // <Card style={{ height: "70px", marginTop: "5px" }}>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col md={3}>
                        <span>
                          <img
                            src="https://s3.amazonaws.com/splitwise/uploads/notifications/v2/4.png"
                            alt="Splitwise"
                            style={{ height: "40px", width: "40px" }}
                            className="circle"
                          />

                        </span>
                        <a
                          href="#"
                          id={group._id}
                          onClick={(e) => this.props.groupsCallBack(e)}
                          style={{ marginLeft: "15px" }}
                        >
                          {group.groupName}
                        </a>
                      </Col>
                      <Col md="auto">
                        <div
                          role="button"
                          id={group._id}
                          className="glyphicon glyphicon-circle-arrow-right"
                          aria-hidden="true"
                          onClick={this.onLeave}
                          style={{ lineHeight: "4", top: "-5px" }}
                        />
                      </Col>
                    </Row>
                  </ListGroup.Item>
                </ListGroup>
                // </Card>
              ))}
            </ul>
          </Col>
        </Row>
        )}
        <Row style={{ marginTop: "40px" }}>
          <Col>
            You have been invited to the below groups.
            Click on the link below to view invite details.
          </Col>
        </Row>

        <Row style={{ marginTop: "10px" }}>
          {!this.state.isInvitePresent && <Col><h5>{ noInvitesMsg }</h5></Col>}

          {this.state.isInvitePresent && (
          <Col>
            <ul>
              {Object.values(this.state.invites).map((invite) => (
                // <Card style={{ height: "70px", marginTop: "5px" }}>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col md={3}>
                        <span>
                          <img
                            src="https://s3.amazonaws.com/splitwise/uploads/notifications/v2/4.png"
                            alt="Splitwise"
                            style={{ height: "40px", width: "40px" }}
                            className="circle"
                          />

                        </span>
                        <a
                          href="#"
                          id={invite._id}
                          onClick={(e) => this.props.invitesCallback(e)}
                          style={{ marginLeft: "15px" }}
                        >
                          {invite.groupName}
                        </a>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                </ListGroup>
                // </Card>
              ))}
            </ul>
          </Col>
          )}

        </Row>
      </Container>
    );
  }
}

function mapDispatchToProps(dispatch) {
  console.log("in dispatch");
  return {
    groupLeft: (payload) => dispatch(groupLeft(payload)),
  };
}

// export default MyGroups;

export default connect(null, mapDispatchToProps)(MyGroups);
