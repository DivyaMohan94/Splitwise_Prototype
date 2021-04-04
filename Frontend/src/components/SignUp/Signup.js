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
    };
    this.onNameChange = this.onNameChange.bind(this);
    this.onEmailChange = this.onEmailChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.onSignup = this.onSignup.bind(this);
    this.validateLogin = this.validateLogin.bind(this);
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
          console.log("Status Code : ", response.data.payload);
          if (response.status === 200) {
            console.log("inside success");
            this.setState({
              isDirectNeeded: true,
              token: response.data.token,
            });
            // eslint-disable-next-line react/destructuring-assignment
            this.props.signup(response.data.payload);
          } else {
            console.log("db error");
            this.setState({
              validationErr: "Signup error",
            });
          }
        })
        .catch((error) => {
          const emailErr = [];
          emailErr.push(`${this.state.emailID} already belongs to another account. If ${this.state.emailID} is your email address you can reset your password from our password reset page.`);
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

  render() {
    console.log("render called");
    console.log(this.state.validationErr);
    let redirectVar = null;
    let errMsg = "";

    if (this.state.token.length > 0 && this.state.isDirectNeeded === true) {
      localStorage.setItem("token", this.state.token);

      localStorage.setItem("userID", this.props.userID);
      localStorage.setItem("username", this.props.userName);
      localStorage.setItem("emailID", this.props.emailID);
      localStorage.setItem("currency", this.props.currency);

      redirectVar = <Redirect to="/dashboard" />;
    }

    if (this.state.validationErr.length > 0) {
      errMsg = this.state.validationErr.map((err) => <li>{err}</li>);
    }

    return (
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
    );
  }
}
const mapStateToProps = (state) => {
  console.log("state customer signup reducer:", state);
  return {
    userID: state.signup._id,
    emailID: state.signup.emailID,
    userName: state.signup.userName,
    currency: state.signup.currency,
  };
};

// function mapDispatchToProps(dispatch) {
//   console.log("in dispatch");
//   return {
//     signup: (user) => dispatch(userLogin(user)),
//   };
// }
export default connect(mapStateToProps, { signup })(SignUp);
