/* eslint-disable react/sort-comp */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
// eslint-disable-next-line no-unused-vars
import React, { Component } from "react";
import { Link } from "react-router-dom";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import { connect } from "react-redux";
import axios from "axios";
import Autosuggest from 'react-autosuggest';
import { Button, Container, Alert } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import URL_VAL from "../../backend";
import { logout } from "../../actions/loginaction";
import { getFriends, createGroup } from "../../actions/createGroupsAction";
import "../../App.css";

// create the Navbar Component
class CreateGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogout: false,
      groupName: "",
      image: "",
      friendsList: [],
      friendsEmailList: [],
      suggestions: [],
      friendsDetails: [
        {
          name: '',
          emailID: '',
        },
      ],
      isInvalid: false,
      isDirectNeeded: false,
      imagePreview: undefined,
      validationErr: [],
      message: "",
    };
    this.handleLogout = this.handleLogout.bind(this);
    this.addNewPerson = this.addNewPerson.bind(this);
    // this.handleChange = this.handleChange.bind(this);
    this.suggestFriends = this.suggestFriends.bind(this);
    this.onNameChange = this.onNameChange.bind(this);
    this.onEmailChange = this.onEmailChange.bind(this);

    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
    this.getSuggestionValue = this.getSuggestionValue.bind(this);
    this.renderSuggestion = this.renderSuggestion.bind(this);
    this.getSuggestions = this.getSuggestions.bind(this);
    this.onGroupNameChange = this.onGroupNameChange.bind(this);
    this.saveGroupDetails = this.saveGroupDetails.bind(this);
    this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
    this.onDashboardClicked = this.onDashboardClicked.bind(this);
  }

  componentDidMount() {
    this.suggestFriends();
  }

  // handle logout to destroy the cookie
  handleLogout() {
    console.log("logout called");
    cookie.remove("cookie", { path: "/" });
    console.log(`after logout${cookie.load("cookie")}`);
    this.setState({
      isLogout: true,
    });
    this.props.logout();
  }

  //   handleChange(e, i) {
  //     if (["name", "emailID"].includes(e.target.name)) {
  //       const friendsDetails = [...this.state.friendsDetails];
  //       console.log("i am here");
  //       friendsDetails[e.target.id][e.target.name] = e.target.value;
  //       this.setState({
  //         friendsDetails,
  //       });
  //     } else {
  //       this.setState({ [e.target.name]: e.target.value });
  //     }
  //     console.log(`statedata${JSON.stringify(this.state.friendsDetails)}`);
  //   }

  onNameChange(idx, e) {
    const friendsDetails = [...this.state.friendsDetails];
    // friendsDetails[idx].name = e.target.value;
    if (e.target.value !== undefined) {
      friendsDetails[idx].name = e.target.value;
    }
    this.setState({
      friendsDetails,
    });
  }

  onEmailChange(idx, e) {
    const friendsDetails = [...this.state.friendsDetails];
    friendsDetails[idx].emailID = e.target.value;
    this.setState({
      friendsDetails,
    });
  }

  onSuggestionsFetchRequested({ value }) {
    console.log(`sugg fetch req ${value}`);
    console.log(`checkig  ${JSON.stringify(this.getSuggestions(value))}`);
    this.setState({
      suggestions: this.getSuggestions(value),
    });
    console.log(`suggessions : ${this.getSuggestions(value)}`);
  }

  onSuggestionsClearRequested() {
    console.log(`sugg clear req`);
    this.setState({
      suggestions: [],
    });
  }

  getSuggestions(value) {
    console.log(`sugg get sugg req`);
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    // eslint-disable-next-line max-len
    return inputLength === 0 ? [] : this.state.friendsList.filter((friend) => friend.toLowerCase().includes(inputValue));
  }

  getSuggestionValue(suggestion) {
    console.log("inside get sugg val");
    return this.state.suggestions.name;
  }

  suggestFriends() {
    const data = this.props.userID;
    axios.defaults.headers.common.authorization = localStorage.getItem('token');
    axios
      .get(`${URL_VAL}/creategroup/getFriends`, {
        params: {
          UserID: data,
        },
      })
      .then((response) => {
        console.log("Status Code : ", response.status);
        console.log("Status Code : ", response.data);
        const listings = [];
        if (response.status === 200) {
          console.log("inside success");

          response.data.data.map((item) => listings.push(item.userName));
        }
        console.log(`listings ${listings}`);
        this.setState({
          friendsList: listings,
          friendsEmailList: response.data.data,
        });
        this.props.getFriends(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  addNewPerson(e) {
    this.setState((prevState) => ({
      friendsDetails: [...prevState.friendsDetails, { name: "", emailID: "" }],
    }));
  }

  onGroupNameChange(e) {
    this.setState({
      groupName: e.target.value,
    });
  }

  saveGroupDetails(e) {
    console.log("save group details");
    const emailList = [];
    this.state.friendsDetails.map((friend) => emailList.push(friend.emailID));
    const headers = new Headers();
    e.preventDefault();
    if (this.validateGroup() === true) {
      const data = {
        groupName: this.state.groupName,
        createdBy: localStorage.getItem('userID'),
        userEmailList: emailList,
        image: this.state.image,
      };
      console.log(data);
      // set the with credentials to true
      axios.defaults.headers.common.authorization = localStorage.getItem('token');
      // make a post request with the user data
      axios
        .post(`${URL_VAL}/creategroup`, data)
        .then((response) => {
          console.log("Status Code : ", response.status);
          console.log("Status Code : ", response.data);
          if (response.status === 200) {
            console.log("inside success");
            this.setState({
              isDirectNeeded: true,
              isInvalid: false,
              message: "Group successfully created",
            });
            this.props.createGroup(this.state.message);
          } else if (response.status === 400) {
            console.log("inside group already exists error");
            this.setState({
              isDirectNeeded: false,
              isInvalid: true,
            });
          }
        })
        .catch((error) => {
          console.log("inside group already exists error");
          this.setState({
            isInvalid: true,
            message: "Whoops! This group name already exists. Try entering another name",
          });
          this.props.createGroup(this.state.message);
        });
    }
  }

  renderSuggestion(suggestion) {
    console.log(`inside sugg render ${this.state.suggestions}`);
    return (
      <span>{suggestion}</span>
    );
  }

  onSuggestionSelected(
    idx,
    suggestionValue,
  ) {
    const friendsDetails = [...this.state.friendsDetails];
    // friendsDetails[idx].name = suggestionValue;
    if (suggestionValue !== undefined) {
      friendsDetails[idx].name = suggestionValue;
      this.state.friendsEmailList.map((val, index) => {
        if (val.userName == suggestionValue) {
          friendsDetails[idx].emailID = val.emailID;
        }
      });
    }
    this.setState({
      friendsDetails,
    });
  }

  handleImageChange(e) {
    const { target } = e;
    const { name } = target;
    const { value } = target;
    const error = [];

    if (name === "ProfileImage") {
      console.log(target.files);
      const profilePhoto = target.files[0];
      const data = new FormData();
      data.append('photos', profilePhoto);
      axios.defaults.headers.common.authorization = localStorage.getItem('token');
      axios.post(`${URL_VAL}/creategroup/upload-file`, data)
        .then((response) => {
          if (response.status === 200) {
            // Download image
            axios.defaults.headers.common.authorization = localStorage.getItem('token');
            axios.post(`${URL_VAL}/creategroup/getImage/${profilePhoto.name}`)
              .then((res) => {
                const imagePreview = `data:image/jpg;base64, ${res.data}`;
                this.setState({
                  image: profilePhoto.name,
                  imagePreview,
                });
              }).catch((err) => {
                error.push("Sorry! Profile picture cannot be set");
              });
          }
        });
    }
  }

  validateGroup() {
    const err = [];
    const nameRejex = /^[a-zA-Z0-9 ]*$/;
    const regexEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    let isValid = true;

    if (this.state.groupName === "") {
      err.push("Group name can't be blank");
      isValid = false;
    }
    if (this.state.groupName !== "" && !this.state.groupName.match(nameRejex)) {
      err.push("Group name can't have invalid characters");
      isValid = false;
    }

    if (this.state.friendsDetails[0].emailID === "" || this.state.friendsDetails[0].name === "") {
      err.push("Enter atleast one group member detail");
      isValid = false;
    }

    this.state.friendsDetails.map((val, idx) => {
      const { name } = this.state.friendsDetails[idx].name;
      const { emailID } = this.state.friendsDetails[idx].emailID;
      if (this.state.friendsDetails[idx].name !== "") {
        if (!this.state.friendsDetails[idx].name.match(nameRejex)) {
          err.push(`${this.state.friendsDetails[idx].name} is not a valid user name`);
          isValid = false;
        }
      }

      if (this.state.friendsDetails[idx].emailID !== "") {
        if (!this.state.friendsDetails[idx].emailID.match(regexEmail)) {
          err.push(`${this.state.friendsDetails[idx].emailID} is not a valid email id`);
          isValid = false;
        }
      }

      if (this.state.friendsDetails[idx].name !== "" && this.state.friendsDetails[idx].emailID === "") {
        err.push(`Email ID is missing`);
        isValid = false;
      }
      return isValid;
    });

    this.setState({
      validationErr: err,
    });
    return isValid;
  }

  onDashboardClicked() {
    this.setState({
      isDirectNeeded: true,
    });
  }

  render() {
    // redirect to group page
    console.log("Create group render called");
    console.log(`map to props ${this.props.userName}`);
    let redirectVar = null;
    let errMsg = "";
    let validationErr = "";
    const { userID } = this.state;
    const { isLogout } = this.state;
    console.log(`islogout ${isLogout}`);

    if (isLogout) {
      redirectVar = <Redirect to="/" />;
    } else if (this.state.isDirectNeeded === true) {
      redirectVar = <Redirect to="/dashboard" />;
    }

    if (this.state.isInvalid === true) {
      errMsg = "Whoops! This group name already exists. Try entering another name";
    }

    if (this.state.validationErr.length > 0) {
      validationErr = this.state.validationErr.map((err) => <li>{err}</li>);
    }

    let groupPic = (
      <img
        src="https://assets.splitwise.com/assets/core/logo-square-65a6124237868b1d2ce2f5db2ab0b7c777e2348b797626816400534116ae22d7.svg"
        alt="SplitWise"
        width="200"
        height="200"

      />
    );

    if (this.state.imagePreview) {
      groupPic = (
        <img
          src={this.state.imagePreview}
          alt="groupPic"
          width="200"
          height="200"
        />
      );
    }

    const { friendsDetails } = this.state;

    return (
      <div>
        {redirectVar}
        <div className="loginmain">
          <div className="logincontainer">
            <span>
              <img
                src="https://assets.splitwise.com/assets/core/logo-square-65a6124237868b1d2ce2f5db2ab0b7c777e2348b797626816400534116ae22d7.svg"
                alt="SplitWise"
                className="loginImage"
              />
            </span>
            <div className="loginfont landingHeaderDiv">Splitwise</div>
            <div className="signupbutton">
              <Button variant="primary" onClick={this.onDashboardClicked}>Dashboard</Button>
              <Button variant="primary" onClick={this.handleLogout}>Logout</Button>
            </div>
          </div>
        </div>

        <Container className="signupContainer">
          <Row>
            <Col>
              {errMsg && (
                <Alert transition={false} variant="danger">
                  {errMsg}
                </Alert>
              )}
            </Col>
          </Row>
          {validationErr && (
          <Row>
            <Col>
              <Alert transition={false} variant="danger">
                {validationErr}
              </Alert>
            </Col>
          </Row>
          )}
          <Row>
            <Col className="create-group-image">
              <div>
                {/* <img
                  src="https://assets.splitwise.com/assets/core/logo-square-65a6124237868b1d2ce2f5db2ab0b7c777e2348b797626816400534116ae22d7.svg"
                  alt="SplitWise"
                  width="200"
                  height="200"
                /> */}
                {groupPic}
                <input
                  id="avatar"
                  name="ProfileImage"
                  type="file"
                  style={{ maxWidth: "240px", marginTop: "15px" }}
                  onChange={this.handleImageChange}
                />
              </div>
            </Col>
            <Col>
              <Form className="form" onChange={this.handleChange}>
                <Form.Label style={{ color: "#999999" }}>
                  START A NEW GROUP
                </Form.Label>

                <Form.Group controlId="groupName">
                  <Form.Label>My group shall be called</Form.Label>
                  <Form.Control
                    type="text"
                    style={{ height: "35px" }}
                    onChange={this.onGroupNameChange}
                    pattern="^[A-Za-z0-9 ]+$"
                    required
                  />
                </Form.Group>
                <Form.Label style={{ color: "#999999" }}>
                  GROUP MEMBERS
                </Form.Label>
                <Form.Group>
                  <Form.Label>
                    {this.props.userName}
                    {'  '}
                  </Form.Label>
                  <Form.Label>
                    (
                    {this.props.emailID}
                    )
                  </Form.Label>
                </Form.Group>
                {/* <Form.Row>
                  <Col md="auto">
                    <Form.Control placeholder="Name" controlId="name1" />
                  </Col>
                  <Col>
                    <Form.Control placeholder="Email address" controlId="email1" />
                  </Col>
                </Form.Row>
                <Form.Row> */}

                {
                        friendsDetails.map((val, idx) => {
                          const nameID = `${idx}`;
                          const emailID = `${idx}`;
                          const value = this.state.friendsDetails[idx].name;
                          return (
                            <Form.Row key={val.index} className="react-autosuggest__container">
                              <Col md="auto">
                                {/* <Form.Control placeholder="Name" id={nameID} name="name"
                                onChange={(e) => this.onNameChange(idx, e)} /> */}
                                <Autosuggest
                                  className="react-autosuggest__input"
                                  // suggestions={this.state.friendsList}
                                  suggestions={this.state.suggestions}
                                  onSuggestionSelected={
                                    (_, suggestion) => this.onSuggestionSelected(idx, suggestion.suggestion)
}
                                  onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                                  onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                                  getSuggestionValue={this.getSuggestionValue}
                                  renderSuggestion={this.renderSuggestion}
                                  inputProps={{
                                    placeholder: 'Name',
                                    value,
                                    onChange: (e) => this.onNameChange(idx, e),
                                  }}
                                />
                              </Col>
                              <Col md="auto">
                                <Form.Control
                                  className="email-input"
                                  placeholder="Email address"
                                  id={emailID}
                                  name="emailID"
                                  onChange={(e) => this.onEmailChange(idx, e)}
                                  value={this.state.friendsDetails[idx].emailID}
                                />
                              </Col>
                            </Form.Row>
                          );
                        })
                    }
                <Form.Row>
                  <a href="#" onClick={this.addNewPerson}>+ Add a person</a>
                </Form.Row>
                <Form.Row>
                  <Button
                    variant="info"
                    type="submit"
                    onClick={this.saveGroupDetails}
                  >
                    Save
                  </Button>
                </Form.Row>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
// const mapStateToProps = (state) => ({ userDetails: state.userReducer });

const mapStateToProps = (state) => {
  console.log("checking:", state);
  if (state.userReducer !== undefined) {
    return {
      userID: state.userReducer._id,
      emailID: state.userReducer.emailID,
      userName: state.userReducer.userName,
      currency: state.userReducer.currency,
    };
  }

  return {
    userID: "",
    emailID: "",
    userName: "",
    currency: "",
  };
};

function mapDispatchToProps(dispatch) {
  console.log("in dispatch");
  return {
    logout: () => dispatch(logout()),
    createGroup: (payload) => dispatch(createGroup(payload)),
    getFriends: ((payload) => dispatch(getFriends(payload))),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateGroup);
