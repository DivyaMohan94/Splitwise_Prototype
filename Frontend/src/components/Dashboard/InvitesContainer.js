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
import propTypes from "prop-types";
import {
  Button,
  Container,
  Alert,
  Dropdown,
  DropdownButton,
  Table,
  Jumbotron,
} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import { connect } from "react-redux";
import URL_VAL from "../../backend";
import { logout } from "../../actions/loginaction";
import SideNav from "./sideNav";
import { inviteAccepted } from '../../actions/myGroupsAction';

// create the Navbar Component
class InvitesContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupName: this.props.groupName,
      groupDetails: {},
      isRedirect: false,
    };
    this.OnAcceptClick = this.OnAcceptClick.bind(this);
  }

  componentDidMount() {
    console.log(`inside component did mount of group ${this.props.groupID}`);
    axios.defaults.headers.common.authorization = localStorage.getItem('token');
    axios
      .get(`${URL_VAL}/group/getGroupDetails`, {
        params: {
          GroupID: this.props.groupID,
        },
      })
      .then((response) => {
        console.log("Status Code : ", response.status);
        console.log("Status Code : ", response.data);
        if (response.status === 200) {
          console.log(response.data);
          if (response.data.length > 0) {
            this.setState({
              groupDetails: response.data[0],
            });
          }
        }
      });
  }

  OnAcceptClick(e) {
    const headers = new Headers();
    e.preventDefault();
    const userID = localStorage.getItem('userID');
    const data = {
      groupID: this.props.groupID,
      userID,
    };
    axios.defaults.headers.common.authorization = localStorage.getItem('token');

    axios
      .put(`${URL_VAL}/group/acceptInvites`, data)
      .then((response) => {
        console.log("Status Code : ", response.status);
        console.log("Status Code : ", response.data);
        if (response.status === 200) {
          console.log(response.data);
          this.props.onInviteStatusChange(true, this.props.groupID, this.props.groupName);
        }
      });
  }

  render() {
    const noDataMsg = "You have not added any expense yet";
    const { groupDetails } = this.state;
    const { userID } = this.state;
    const { createdOn } = groupDetails;
    const { isRedirect } = this.state;
    const redirectVar = "";
    let res = "";
    let createdBy = '';
    if (createdOn !== undefined) {
      res = createdOn.slice(0, 10);
    }

    if (groupDetails.user !== undefined) {
      createdBy = groupDetails.user.userName;
      console.log('mytest', groupDetails.user.userName);
    }

    // const res = CreatedOn.slice(0, 9);
    // if (isRedirect) {
    //   redirectVar = (
    //     <GroupsContainer
    //       key={this.props.groupID}
    //       groupID={this.props.groupID}
    //       groupName={this.props.groupName}
    //     />
    //   );
    // }
    return (
      <Container>
        {/* {redirectVar} */}
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
          <Col>
            <h5>
              <b>
                Group Invite
              </b>
            </h5>
          </Col>
        </Row>

        <Row style={{ marginTop: "15px" }}>
          <Col>
            <Jumbotron style={{ width: "1200" }}>
              <Row style={{ height: "50px" }}>
                <h5>
                  <b>{createdBy}</b>
                  {' '}
                  created the group
                  {" "}
                  <b>
                    "
                    {this.state.groupName}
                    "
                  </b>
                  {" "}
                  on
                  {" "}
                  <b>
                    {res}
                  </b>
                </h5>
              </Row>
              <Row>
                <h6>
                  Wanna be a part of the group? Click on accept button and join
                  the group
                </h6>
              </Row>
              <Row style={{ marginTop: "10px" }}>
                <Button
                  variant="info"
                  type="submit"
                  onClick={this.OnAcceptClick}
                >
                  Accept
                </Button>
              </Row>
            </Jumbotron>
          </Col>
        </Row>
      </Container>
    );
  }
}

function mapDispatchToProps(dispatch) {
  console.log("in dispatch");
  return {
    inviteAccepted: (payload) => dispatch(inviteAccepted(payload)),
  };
}

// export default InvitesContainer;

export default connect(null, mapDispatchToProps)(InvitesContainer);
