/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable no-unused-vars */
import React, { Component } from "react";
// eslint-disable-next-line no-unused-vars
import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import cookie from "react-cookies";
import { Redirect } from "react-router";
import { connect } from "react-redux";
import "../../App.css";
import axios from 'axios';
import { Button, Container, Alert } from "react-bootstrap";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import { signup } from "../../actions/signupAction";
import URL_VAL from '../../backend';

// create the Navbar Component
class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      emailID: "",
      password: "",
      // authflag: false,
      validationErr: [],
      userID: -1,
      isDirectNeeded: false,
      token: "",
      currency: "",
      isLoginClicked: false,
    };
    this.onNameChange = this.onNameChange.bind(this);
    this.onEmailChange = this.onEmailChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.onSignup = this.onSignup.bind(this);
    this.validateLogin = this.validateLogin.bind(this);
    this.onLoginClicked = this.onLoginClicked.bind(this);
  }

  onNameChange(e) {
    this.setState({
      name: e.target.value,
    });
  }

  onEmailChange(e) {
    this.setState({
      emailID: e.target.value,
    });
  }

  onPasswordChange(e) {
    this.setState({
      password: e.target.value,
    });
  }

  onSignup(e) {
    console.log("submit");
    const headers = new Headers();
    e.preventDefault();
    if (this.validateLogin() === true) {
      const data = {
        name: this.state.name,
        emailID: this.state.emailID,
        password: this.state.password,
      };
      // set the with credentials to true
      axios.defaults.withCredentials = true;
      // make a post request with the user data
      axios
        .post(`${URL_VAL}/signup`, data)
        .then((response) => {
          console.log("Status Code : ", response.status);
          console.log("Status Code : ", response.data);
          if (response.status === 200) {
            console.log("inside success");
            this.setState({
              isDirectNeeded: true,
              token: response.data.fullToken,
              emailID: response.data.payload.emailID,
              name: response.data.payload.userName,
              currency: response.data.payload.currency,
              userID: response.data.payload._id,
            });
            const { _id } = response.data.payload;
            const { emailID } = response.data.payload;
            const { userName } = response.data.payload;
            const { currency } = response.data.payload;
            const { phoneNum } = response.data.payload;
            const { timeZone } = response.data.payload;
            const { createdAt } = response.data.payload;
            const { countryCode } = response.data.payload;
            const { language } = response.data.payload;
            const { image } = response.data.payload;
            const payloadData = {
              _id,
              emailID,
              userName,
              currency,
              phoneNum,
              timeZone,
              createdAt,
              countryCode,
              language,
              image,
            };
            this.props.signup(payloadData);
          } else {
            console.log("db error");
            this.setState({
              validationErr: "Signup error",
            });
          }
        })
        .catch((error) => {
          const emailErr = [];
          emailErr.push(`${this.state.emailID} belongs to another account. Retry signing up with another Email ID`);
          this.setState({
            validationErr: emailErr,
          });
          console.log(error);
        });
    }
  }

  validateLogin() {
    const err = [];
    const nameRejex = /^[a-zA-Z ]*$/;
    const regexEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    let isValid = true;

    if (this.state.name === "") {
      err.push("First name can't be blank");
      isValid = false;
    }
    if (this.state.name !== "" && !this.state.name.match(nameRejex)) {
      err.push("First name can't have invalid characters");
      isValid = false;
    }
    if (this.state.emailID === "") {
      err.push("Email address can't be blank");
      isValid = false;
    }
    if (this.state.emailID !== "" && !this.state.emailID.match(regexEmail)) {
      err.push("Please enter a valid email address");
      isValid = false;
    }
    if (this.state.password === "" || this.state.password.length < 8) {
      err.push("Password is too short (minimum is 8 characters)");
      isValid = false;
    }
    this.setState({
      validationErr: err,
    });
    return isValid;
  }

  onLoginClicked() {
    console.log('inside login clicked');
    this.setState({
      isLoginClicked: true,
    });
  }

  render() {
    console.log("render called");
    let redirectVar = null;
    let errMsg = "";

    if (this.state.isLoginClicked === true) {
      redirectVar = <Redirect to="/login" />;
    }

    if (this.state.token.length > 0 && this.state.isDirectNeeded === true) {
      localStorage.setItem("token", this.state.token);

      localStorage.setItem("userID", this.state.userID);
      localStorage.setItem("username", this.state.name);
      localStorage.setItem("emailID", this.state.emailID);
      localStorage.setItem("currency", this.state.currency);

      redirectVar = <Redirect to="/dashboard" />;
    }

    if (this.state.validationErr.length > 0) {
      errMsg = this.state.validationErr.map((err) => <li>{err}</li>);
    }

    return (
      <div>
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
              <Button variant="primary" onClick={this.onLoginClicked}>Login</Button>
            </div>
          </div>
        </div>
        <Container className="signupContainer">
          {redirectVar}
          <Row>
            <Col className="col-md-12">
              {errMsg && (
              <Alert transition={false} variant="danger">
                <Alert.Heading>The following error(s) occured:</Alert.Heading>
                {errMsg}
              </Alert>
              )}
            </Col>
          </Row>
          <Row>
            <Col xs lg="3">
              <img
                src="https://assets.splitwise.com/assets/core/logo-square-65a6124237868b1d2ce2f5db2ab0b7c777e2348b797626816400534116ae22d7.svg"
                alt="SplitWise"
                width="200 "
                height="200"
              />
            </Col>
            <Col>
              <Form className="form">
                <Form.Label style={{ color: "#999999" }}>INTRODUCE YOURSELF</Form.Label>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Hi there! My name is</Form.Label>
                  <Form.Control type="text" className="form-control" onChange={this.onNameChange} required />
                </Form.Group>

                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Here's my email address</Form.Label>
                  <Form.Control type="email" className="form-control" onChange={this.onEmailChange} required />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                  <Form.Label>And here's my password</Form.Label>
                  <Form.Control type="password" onChange={this.onPasswordChange} required />
                </Form.Group>
                <Button variant="info" type="submit" style={{ backgroundColor: "#FF652F" }} onClick={this.onSignup}>
                  Sign me up!
                </Button>
                <Form.Group controlId="formBasicPassword">
                  <Form.Label style={{ marginTop: "40px", color: "#0088cc" }}>By signing up, you accept the Splitwise Terms of Service.</Form.Label>
                </Form.Group>
              </Form>

            </Col>
          </Row>

        </Container>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  console.log("state customer signup reducer:", state);
  return {
    userID: state.userReducer._id,
    emailID: state.userReducer.emailID,
    userName: state.userReducer.userName,
    currency: state.userReducer.currency,
  };
};

// function mapDispatchToProps(dispatch) {
//   console.log("in dispatch");
//   return {
//     signup: (user) => dispatch(userLogin(user)),
//   };
// }
export default connect(mapStateToProps, { signup })(SignUp);
