/* eslint-disable no-else-return */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable no-unused-vars */
import React, { Component } from "react";
// eslint-disable-next-line no-unused-vars
import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import cookie from "react-cookies";
import { Redirect } from "react-router";
import { connect } from "react-redux";
import axios from "axios";
import "./login.css";
import { Button, Container, Alert } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import URL_VAL from "../../backend";
import { userLogin } from "../../actions/loginaction";

// create the Navbar Component
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: -1,
      emailID: "",
      password: "",
      currency: "",
      userName: "",
      validationErr: false,
      isLoginClicked: false,
      isSignupClicked: false,
      isRedirectNeeded: false,
      token: "",
    };
    this.onEmailChange = this.onEmailChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.onSubmitLogin = this.onSubmitLogin.bind(this);
    this.validateLogin = this.validateLogin.bind(this);
    this.loginClicked = this.loginClicked.bind(this);
    this.signupClicked = this.signupClicked.bind(this);
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

  onSubmitLogin(e) {
    console.log("submit");
    const headers = new Headers();
    e.preventDefault();
    if (this.validateLogin() === true) {
      const data = {
        emailID: this.state.emailID,
        password: this.state.password,
      };
      console.log(data);
      // set the with credentials to true
      axios.defaults.withCredentials = true;
      // make a post request with the user data
      axios
        .post(`${URL_VAL}/login`, data)
        .then((response) => {
          console.log("Status Code : ", response.status);
          console.log("Status Code : ", response.data.fullToken);
          if (response.status === 200) {
            console.log("inside success");
            console.log(response.data);
            this.setState({
              validationErr: false,
              // userID: response.data.UserID,
              isRedirectNeeded: true,
              token: response.data.fullToken,
              userID: response.data.payload._id,
              emailID: response.data.payload.emailID,
              userName: response.data.payload.userName,
              currency: response.data.payload.currency,
            });
            // this.props.userLogin(response.data.payload);
            const { _id } = response.data.payload;
            const { emailID } = response.data.payload;
            const { userName } = response.data.payload;
            const { currency } = response.data.payload;
            const { phoneNum } = response.data.payload;
            const { createdAt } = response.data.payload;
            const { countryCode } = response.data.payload;
            const { timeZone } = response.data.payload;
            const { language } = response.data.payload;
            const { image } = response.data.payload;

            const payloadData = {
              _id,
              emailID,
              userName,
              currency,
              phoneNum,
              createdAt,
              countryCode,
              timeZone,
              language,
              image,
            };
            this.props.userLogin(payloadData);
          } else {
            console.log("inside fail - invalid credentials");
            this.setState({
              validationErr: true,
            });
          }
        })
        .catch((error) => {
          console.log("inside catch");
          console.log(error);
          this.setState({
            validationErr: true,
          });
        });
    }
  }

  validateLogin() {
    if (this.state.emailID === "" || this.state.password === "") {
      this.setState({
        validationErr: true,
      });
      return false;
    }
    return true;
  }

  loginClicked() {
    this.setState({
      isLoginClicked: true,
    });
  }

  signupClicked() {
    this.setState({
      isSignupClicked: true,
    });
  }

  render() {
    // redirect based on successful login
    console.log("render called");
    let redirectVar = null;
    let errMsg = "";
    // errorMsg = "";
    if (this.state.token.length > 0 && this.state.isRedirectNeeded === true) {
      localStorage.setItem("token", this.state.token);

      localStorage.setItem("userID", this.state.userID);
      localStorage.setItem("username", this.state.userName);
      localStorage.setItem("emailID", this.state.emailID);
      localStorage.setItem("currency", this.state.currency);
      if (localStorage.userID !== -1 || localStorage.userID !== "undefined") {
        console.log('testing local', localStorage);
        redirectVar = <Redirect to="/dashboard" />;
      }
    }

    if (this.state.isLoginClicked) {
      redirectVar = <Redirect to="/login" />;
    } else if (this.state.isSignupClicked) {
      redirectVar = <Redirect to="/signup" />;
    }

    if (this.state.validationErr === true) {
      errMsg = "Whoops! We couldn't find an account for that email address and password. Maybe you've forgotten your password?";
    }

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
              <Button variant="primary" onClick={this.signupClicked}>Sign Up</Button>
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
          <Row>
            <Col className="login-img">
              <img
                src="https://assets.splitwise.com/assets/core/logo-square-65a6124237868b1d2ce2f5db2ab0b7c777e2348b797626816400534116ae22d7.svg"
                alt="SplitWise"
                width="200"
                height="200"
              />

            </Col>
            <Col>
              <Form className="form">
                <Form.Label style={{ color: "#999999" }}>
                  WELCOME TO SPLITWISE
                </Form.Label>

                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    style={{ height: "35px" }}
                    onChange={this.onEmailChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    style={{ height: "35px" }}
                    onChange={this.onPasswordChange}
                    required
                  />
                </Form.Group>
                <Button
                  variant="info"
                  type="submit"
                  onClick={this.onSubmitLogin}
                >
                  Login
                </Button>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  console.log("state customer login reducer:", state);
  // console.log("ownprops:", ownProps);
  if (state.userReducer !== undefined) {
    return {
      userID: state.userReducer._id,
      emailID: state.userReducer.emailID,
      userName: state.userReducer.userName,
      currency: state.userReducer.currency,
    };
  } else {
    return {
      userID: -1,
      emailID: "",
      userName: "",
      currency: "",
    };
  }
};

function mapDispatchToProps(dispatch) {
  console.log("in dispatch");
  return {
    userLogin: (payload) => dispatch(userLogin(payload)),
  };
}
// export default connect(mapStateToProps, { userLogin })(Login);

export default connect(mapStateToProps, mapDispatchToProps)(Login);
