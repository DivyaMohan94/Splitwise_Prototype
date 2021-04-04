/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable no-unused-vars */
import React, { Component } from "react";
// eslint-disable-next-line no-unused-vars
import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { Redirect } from "react-router";
import axios from "axios";
import propTypes from "prop-types";
import {
  Button,
  Container,
  Alert,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import { connect } from "react-redux";
import URL_VAL from "../../backend";
import { logout } from "../../actions/loginaction";
import SideNav from "./sideNav";
import DashboardContainer from "./dashboardContainer";
import RecentActivity from "./RecentActivity";
import GroupsContainer from "./GroupsContainer";
import InvitesContainer from "./InvitesContainer";
import MyGroups from './MyGroups';

// create the Navbar Component
class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogout: false,
      isProfile: false,
      isCreateNewGroup: false,
      redirectTo: "",
      groups: {},
      invites: {},
      selectedGroupID: 0,
      selectedGroupName: "",
      isUpdate: false,
    };

    this.handleLogout = this.handleLogout.bind(this);
    this.handleProfile = this.handleProfile.bind(this);
    this.loadDashboardContainer = this.loadDashboardContainer.bind(this);
    this.loadRecentActivity = this.loadRecentActivity.bind(this);
    this.CreateNewGroup = this.CreateNewGroup.bind(this);
    this.onGroupLinkClicked = this.onGroupLinkClicked.bind(this);
    this.onInvitesLinkClicked = this.onInvitesLinkClicked.bind(this);
    this.onInviteStatusChange = this.onInviteStatusChange.bind(this);
    this.myGroupsLinkClicked = this.myGroupsLinkClicked.bind(this);
    this.update = this.update.bind(this);
    this.updateOnLeaveGroup = this.updateOnLeaveGroup.bind(this);
  }

  componentDidMount() {
    console.log("inside did mount of dashboard page");
    const data = localStorage.getItem('userID');
    if (data === -1 || data === undefined) {
      this.setState({
        isLogout: true,
      });
    } else {
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
            this.setState({
              groups: response.data,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });

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
            this.setState({
              invites: response.data,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  componentDidUpdate(prevState, prevProps) {
    console.log("inside did update");
    console.log(prevProps);
    console.log(prevState);
    const data = localStorage.getItem('userID');
    console.log(`checking status for update ${this.state.isUpdate}`);
    if (this.state.isUpdate === true) {
      const headers = new Headers();
      axios.defaults.withCredentials = true;
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
            this.setState({
              groups: response.data,
              status: "",
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });

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
            this.setState({
              invites: response.data,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });

      this.update();
    }
  }

  // handle logout to destroy the cookie
  handleLogout() {
    console.log("logout called");
    this.setState({
      isLogout: true,
    });
    console.log(this.props);
    this.props.logout();
  }

  handleProfile(e) {
    this.setState({
      isProfile: true,
    });
  }

  onGroupLinkClicked(e) {
    this.setState({
      selectedGroupID: e.target.id,
      selectedGroupName: e.target.text,
      redirectTo: "groupDetails",
    });
  }

  onInvitesLinkClicked(e) {
    this.setState({
      selectedGroupID: e.target.id,
      selectedGroupName: e.target.text,
      status: "pending",
      redirectTo: "invites",
    });
  }

  onInviteStatusChange(isUpdate, groupID, groupName) {
    console.log(`invites status change triggered ${isUpdate}`);
    this.setState({
      isUpdate: true,
      selectedGroupID: groupID,
      selectedGroupName: groupName,
      redirectTo: "groupDetails",
    });
  }

  CreateNewGroup(e) {
    console.log("Create New group called");
    this.setState({
      isCreateNewGroup: true,
    });
  }

  myGroupsLinkClicked(e) {
    console.log("My Groups links clicked");
    this.setState({
      redirectTo: "myGroups",
    });
  }

  loadDashboardContainer(e) {
    console.log("dashboard called");
    this.setState({
      redirectTo: "dashboardContainer",
    });
  }

  loadRecentActivity(e) {
    console.log("recent act called");
    this.setState({
      redirectTo: "recentActivity",
    });
  }

  update() {
    this.setState({
      isUpdate: false,
    });
  }

  updateOnLeaveGroup() {
    this.setState({
      isUpdate: true,
    });
  }

  render() {
    let redirectVar = null;
    const { redirectTo } = this.state;
    const { isLogout } = this.state;
    const { isProfile } = this.state;
    const { isCreateNewGroup } = this.state;
    let sideNavSelect = "";
    console.log(`test${this.state.status}`);

    if (isLogout) {
      redirectVar = <Redirect to="/" />;
    } else if (isProfile) {
      redirectVar = <Redirect to="/profile" />;
    } else if (isCreateNewGroup) {
      redirectVar = <Redirect to="/createGroup" />;
    }

    const { selectedGroupID } = this.state;
    const { selectedGroupName } = this.state;
    const { status } = this.state;

    switch (redirectTo) {
      case "dashboardContainer":
        sideNavSelect = <DashboardContainer />;
        break;
      case "recentActivity":
        sideNavSelect = <RecentActivity />;
        break;
      case "groupDetails":
        sideNavSelect = (
          <GroupsContainer
            key={selectedGroupID}
            groupID={selectedGroupID}
            groupName={selectedGroupName}
          />
        );
        break;
      case "invites":
        sideNavSelect = (
          <InvitesContainer
            key={selectedGroupID}
            groupID={selectedGroupID}
            groupName={selectedGroupName}
            onInviteStatusChange={this.onInviteStatusChange}
          />
        );
        break;
      case "myGroups":
        sideNavSelect = (
          <MyGroups
            groupsCallBack={this.onGroupLinkClicked}
            invitesCallback={this.onInvitesLinkClicked}
            updateOnLeaveGroup={this.updateOnLeaveGroup}
          />
        );
        break;
      default:
        sideNavSelect = <DashboardContainer />;
    }

    return (
      <Container fluid>
        <Row>{redirectVar}</Row>
        <Row style={{ backgroundColor: "#1cc29f", justifyContent: "center" }}>
          <Col md={2} />
          <Col md={1} style={{ display: "flex" }}>
            <span style={{ marginTop: "7px" }}>
              <img
                src="https://assets.splitwise.com/assets/core/logo-square-65a6124237868b1d2ce2f5db2ab0b7c777e2348b797626816400534116ae22d7.svg"
                alt="SplitWise"
                className="loginImage"
              />
            </span>
            <div className="loginfont landingHeaderDiv">Splitwise</div>
          </Col>
          {}
          ,
          <Col md={5} />
          <Col>
            <div className="signupbutton">
              <DropdownButton
                id="dropdown-item-button"
                title={this.props.userDetails.userName}
              >
                <Dropdown.Item as="button" onClick={this.handleProfile}>
                  Profile
                </Dropdown.Item>
                <Dropdown.Item as="button" onClick={this.handleLogout}>
                  Logout
                </Dropdown.Item>
              </DropdownButton>
            </div>
          </Col>
        </Row>
        <Row />
        <Row>
          <Container fluid>
            <Row className="justify-content-center">
              <Col md={2} className="dashboard-section-nav">
                <div style={{ display: "block" }}>
                  <div>
                    <a
                      href="#"
                      id="dashboardlink"
                      onClick={this.loadDashboardContainer}
                    >
                      Dashboard
                    </a>
                  </div>
                  <div>
                    <a href="#" id="recentLink" onClick={this.loadRecentActivity}>
                      Recent activity
                    </a>
                  </div>
                  <div>
                    <a href="#" id="groupsLink" onClick={this.CreateNewGroup}>
                      Groups +
                    </a>
                    {/* {Object.keys(this.state.groups).map((v) => <a href="#">{v}</a>)} */}
                    {this.state.groups.length === 0 && (
                    <ul>
                      <div style={{ display: "flex" }}>
                        <span
                          className="glyphicon glyphicon-tags"
                          aria-hidden="true"
                        />
                        <p style={{ marginLeft: "10px" }}>No Groups</p>
                      </div>
                    </ul>
                    )}
                    <ul>
                      {Object.values(this.state.groups).map((group) => (
                        <div style={{ display: "flex" }} className="dashboard-nav-section">
                          <span
                            className="glyphicon glyphicon-tags"
                            aria-hidden="true"
                            style={{ lineHeight: "3" }}
                          />
                          <a
                            href="#"
                            id={group._id}
                            onClick={this.onGroupLinkClicked}
                            style={{ marginLeft: "10px" }}
                            className="dashboard-nav-link"
                          >
                            {group.groupName}
                          </a>
                        </div>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <a href="#" id="invites">
                      Invites
                    </a>
                    {this.state.invites.length === 0 && (
                    <ul>
                      <div style={{ display: "flex" }}>
                        <span
                          className="glyphicon glyphicon-tags"
                          aria-hidden="true"
                          style={{ lineHeight: "1" }}
                        />
                        <p style={{ marginLeft: "10px" }}>No Invites</p>
                      </div>
                    </ul>
                    )}
                    <ul>
                      {this.state.invites.length !== 0
                  && Object.values(this.state.invites).map((invite) => (
                    <div style={{ display: "flex" }}>
                      <span
                        className="glyphicon glyphicon-tags"
                        aria-hidden="true"
                        style={{ lineHeight: "3" }}
                      />
                      <a
                        href="#"
                        id={invite._id}
                        onClick={this.onInvitesLinkClicked}
                        style={{ marginLeft: "10px" }}
                      >
                        {invite.groupName}
                      </a>
                    </div>
                  ))}
                    </ul>
                  </div>
                  <div>
                    <a href="#" id="myGroupsLink" onClick={this.myGroupsLinkClicked}>
                      My Groups
                    </a>
                  </div>
                </div>
              </Col>

              <Col md={6}><div className="dashboard-section">{sideNavSelect}</div></Col>
              {/* <Col md={4}><h4>Dashboard</h4></Col>
          <Col md={2}>
            <div>
              <Button variant="primary">Add Expense</Button>
              <Button variant="primary">Settle Up</Button>
            </div>
          </Col>
          <Col /> */}
              {/* <Col md={1} /> */}
            </Row>
          </Container>

        </Row>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({ userDetails: state.login });

function mapDispatchToProps(dispatch) {
  console.log("in dispatch");
  return {
    logout: () => dispatch(logout()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
