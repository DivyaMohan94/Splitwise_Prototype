/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable no-unused-vars */
import React, { Component } from "react";
// eslint-disable-next-line no-unused-vars
// import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { Redirect } from "react-router";
import "../../App.css";
import axios from 'axios';
import { Route } from 'react-router-dom';
import {
  Button, Container, DropdownButton, Dropdown, Alert,
} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { connect } from "react-redux";
import URL_VAL from '../../backend';
import avatar from "../Images/avatar.png";
// import { userLogin } from "../../actions/loginaction";

// create the Navbar Component
class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      emailID: '',
      password: '',
      phoneNum: '',
      countryCode: '',
      currency: '',
      timeZone: '',
      language: '',
      image: '',
      isPasswordChanged: false,
      validationErr: [],
      isDirectNeeded: false,
      isProfileRedirect: false,
      isLogout: false,
    };
    this.onNameChange = this.onNameChange.bind(this);
    this.onCurrencyChange = this.onCurrencyChange.bind(this);
    this.onEmailChange = this.onEmailChange.bind(this);
    this.onPhoneNumChange = this.onPhoneNumChange.bind(this);
    this.onCountryCodeChange = this.onCountryCodeChange.bind(this);
    this.onTimezoneChange = this.onTimezoneChange.bind(this);
    this.onLanguageChange = this.onLanguageChange.bind(this);
    this.onImageChange = this.onImageChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.validateSave = this.validateSave.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onHomeClicked = this.onHomeClicked.bind(this);
    this.onProfileMenu = this.onProfileMenu.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    console.log("inside did mount of profile page");
    const data = localStorage.getItem('userID');
    if (data === "" || data === undefined) {
      this.handleLogout();
    } else {
      axios.defaults.headers.common.authorization = localStorage.getItem('token');
      axios
        .get(`${URL_VAL}/profile`, {
          params: {
            userID: data,
          },
        })
        .then((response) => {
          console.log("Status Code : ", response.status);
          console.log("Status Code : ", response.data);
          if (response.status === 200) {
            console.log("inside success");
            this.setState({
              userName: response.data.userName,
              emailID: response.data.emailID,
              phoneNum: response.data.phoneNum,
              countryCode: response.data.countryCode,
              currency: response.data.currency,
              timeZone: response.data.timeZone,
              language: response.data.language,
              image: response.data.image,
              password: response.data.password,
              imagePreview: undefined,
            });
            // set image
            console.log('Profile Photo Name: ', response.data.Image);

            // Download image
            if (response.data.Image) {
              axios.defaults.headers.common.authorization = localStorage.getItem('token');
              axios.post(`${URL_VAL}/profile/getImage/${response.data.Image}`)
                .then((res) => {
                  const imagePreview = `data:image/jpg;base64, ${res.data}`;
                  this.setState({
                    imagePreview,
                  });
                });
            }
          }
        });
    }
  }

  handleChange(e) {
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
      axios.post(`${URL_VAL}/profile/upload-file`, data)
        .then((response) => {
          if (response.status === 200) {
            console.log('Profile Photo Name: ', profilePhoto.name);

            // Download image
            axios.defaults.headers.common.authorization = localStorage.getItem('token');
            axios.post(`${URL_VAL}/profile/getImage/${profilePhoto.name}`)
              .then((res) => {
                const imagePreview = `data:image/jpg;base64, ${res.data}`;
                console.log(imagePreview);
                this.setState({
                  image: profilePhoto.name,
                  imagePreview,
                });
              }).catch((err) => {
                error.push("Sorry! Profile picture cannot be set");
                this.setState({
                  validationErr: error,
                });
              });
          }
        });
    }
  }

  // handle logout to destroy the local storage
  handleLogout() {
    console.log("logout called");
    localStorage.clear();
    this.setState({
      isLogout: true,
    });
  }

  onNameChange(e) {
    this.setState({
      userName: e.target.value,
    });
  }

  onCurrencyChange(e) {
    this.setState({
      currency: e.target.value,
    });
    console.log(e.target.value);
  }

  onEmailChange(e) {
    this.setState({
      emailID: e.target.value,
    });
  }

  onPhoneNumChange(e) {
    this.setState({
      phoneNum: e.target.value,
    });
  }

  onCountryCodeChange(e) {
    this.setState({
      countryCode: e.target.value,
    });
  }

  onTimezoneChange(e) {
    this.setState({
      timeZone: e.target.value,
    });
  }

  onLanguageChange(e) {
    this.setState({
      language: e.target.value,
    });
  }

  onImageChange(e) {
    this.setState({
      image: e.target.value,
    });
  }

  onPasswordChange(e) {
    this.setState({
      password: e.target.value,
      isPasswordChanged: true,
    });
  }

  onProfileMenu(e) {
    this.setState({
      isProfileRedirect: true,
    });
  }

  onHomeClicked(e) {
    this.setState({
      isDirectNeeded: true,
    });
  }

  onSave(e) {
    console.log("save");
    const userID = localStorage.getItem('userID');
    const headers = new Headers();
    e.preventDefault();
    if (this.validateSave() === true) {
      const data = {
        userID,
        userName: this.state.userName,
        password: this.state.password,
        phoneNum: this.state.phoneNum,
        countryCode: this.state.countryCode,
        currency: this.state.currency,
        timeZone: this.state.timeZone,
        language: this.state.language,
        image: this.state.image,
        isPasswordChanged: this.state.isPasswordChanged,
      };
      // set the with credentials to true
      axios.defaults.headers.common.authorization = localStorage.getItem('token');
      // make a post request with the user data
      axios
        .put(`${URL_VAL}/profile`, data)
        .then((response) => {
          console.log("Status Code : ", response.status);
          console.log("Status Code : ", response.data[0]);
          if (response.status === 200) {
            console.log("inside success");
            this.setState({
              isDirectNeeded: true,
            });
            localStorage.setItem('username', this.state.userName);
            localStorage.setItem('currency', this.state.currency);
          } else if (response.status === 400) {
            console.log("cannot save profile details");
            this.setState({
              validationErr: `Some error occured!`,
            });
          } else {
            console.log("db error");
            this.setState({
              validationErr: "Save error",
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
      const { userName } = this.state;
      const { currency } = this.state;
      const { emailID } = this.state;
      // this.props.userLogin({
      //   userName, currency, emailID,
      // });
    }
  }

  validateSave() {
    const err = [];
    const nameRejex = /^[a-zA-Z ]*$/;
    const regexEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const phoneNumrejex = /^[+]?(\d{1,2})?[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
    let isValid = true;

    if (this.state.userName === "") {
      err.push("First name can't be blank");
      isValid = false;
    }
    if (this.state.userName !== "" && !this.state.userName.match(nameRejex)) {
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
    if (this.state.phoneNum !== "None") {
      if (!this.state.phoneNum.match(phoneNumrejex)) {
        err.push("Please enter a valid phone number");
        isValid = false;
      }
    }
    this.setState({
      validationErr: err,
    });
    return isValid;
  }

  render() {
    let redirectVar = null;
    console.log(this.state.isDirectNeeded);
    console.log(this.state.validationErr);
    let errMsg = "";

    if (localStorage.getItem('userID') && this.state.isDirectNeeded === true) {
      redirectVar = <Redirect to="/dashboard" />;
    } else if (localStorage.getItem('userID') && this.state.isProfileRedirect === true) {
      redirectVar = <Redirect to="/profile" />;
    } else if (this.state.isLogout) {
      redirectVar = <Redirect to="/" />;
    }

    if (this.state.validationErr.length > 0) {
      errMsg = this.state.validationErr.map((err) => <li>{err}</li>);
    }

    let profilePic = (
      <img
        src={avatar}
        alt="avatar"
        width="250"
        height="250"
      />
    );

    if (this.state.imagePreview) {
      profilePic = (
        <img
          src={this.state.imagePreview}
          alt="avatar"
          width="250"
          height="250"
        />
      );
    }

    console.log(this.state.imagePreview);
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
              <Button variant="primary" onClick={this.onHomeClicked}>Home</Button>
              <DropdownButton id="dropdown-item-button" title={this.state.userName}>
                <Dropdown.Item as="button" onClick={this.onProfileMenu}>Your Profile</Dropdown.Item>
                <Dropdown.Item as="button" onClick={this.handleLogout}>Logout</Dropdown.Item>
              </DropdownButton>
            </div>
          </div>
        </div>
        <Container className="profile">
          <Row>
            <Col>
              {errMsg && (
              <Alert transition={false} variant="danger">
                <Alert.Heading>The following error(s) occured:</Alert.Heading>
                {errMsg}
              </Alert>
              )}
            </Col>
          </Row>
          <Row>
            <Col md="1" />
            <h2>
              <b>Your account</b>
            </h2>
          </Row>
          <Row>
            <Col md="1" />
            <Col md="auto">
              <Row>
                {/* <img
                  src=""
                  alt="SplitWise"
                  width="200"
                  height="200"
                /> */}
                {profilePic}
              </Row>
              <Row style={{ marginTop: "10px" }}>
                <Col md="auto">
                  Change your avatar
                  <input
                    id="avatar"
                    name="ProfileImage"
                    type="file"
                    style={{ maxWidth: "230px", marginTop: "10px" }}
                    onChange={this.handleChange}
                  />
                </Col>
              </Row>
            </Col>
            <Col md="auto">
              <Form className="form">
                <Form.Row>
                  <Form.Group as={Col} md="6" controlId="validationCustom01">
                    <Form.Label>Your name</Form.Label>
                    <Form.Control required type="text" onChange={this.onNameChange} value={this.state.userName} />
                  </Form.Group>

                  <Form.Group as={Col} md="6" controlId="validationCustom03" className="profile-email">
                    <Form.Label>Your email address</Form.Label>
                    {/* <Form.Control required type="text" value={this.state.emailID} onChange={this.onEmailChange} />
                    <Button
                      variant="primary"
                      style={{ marginTop: "2px", background: "#1cc29f" }}
                      onClick={this.onAddEmail}
                    >
                      Add new email
                    </Button> */}
                    <Form.Label>{this.state.emailID}</Form.Label>
                  </Form.Group>
                </Form.Row>

                <Form.Row>
                  <Form.Group as={Col} controlId="validationCustom02">
                    <Form.Label>Your default currency</Form.Label>
                    <Form.Control as="select" onChange={this.onCurrencyChange} value={this.state.currency}>
                      <option>Choose...</option>
                      <option>USD</option>
                      <option>KWD</option>
                      <option>BHD</option>
                      <option>GBP</option>
                      <option>EUR</option>
                      <option>CAD</option>
                    </Form.Control>
                  </Form.Group>

                  <Form.Group as={Col} controlId="validationCustom04">
                    <Form.Label>Your time zone</Form.Label>
                    <Form.Control as="select" onChange={this.onTimezoneChange} value={this.state.timeZone}>
                      <option>Choose...</option>
                      <option>(GMT-08:00) Pacific Time</option>
                      <option>(GMT-01:00) Pacific Time</option>
                      <option>(GMT-06:00) Mexico city</option>
                      <option>(GMT-05:00) Santiago</option>
                      <option>(GMT-04:00) La paz</option>
                      <option>(GMT-03:00) Greenland</option>
                      <option>(GMT-02:00) Mid-Atlantic</option>
                      <option>(GMT-01:00) Azores</option>
                      <option>(GMT-00:00) UTC</option>
                      <option>(GMT+01:00) Paris</option>
                      <option>(GMT+02:00) Sofia</option>
                      <option>(GMT+03:00) Kuwait</option>
                      <option>(GMT+04:00) Muscat</option>
                      <option>(GMT+05:30) Delhi</option>
                    </Form.Control>
                  </Form.Group>
                </Form.Row>

                <Form.Row>
                  <Form.Group as={Col} md="6" controlId="validationCustom06">
                    <Form.Label>Your phone number</Form.Label>
                    <Form.Control as="select" onChange={this.onCountryCodeChange} value={this.state.countryCode}>
                      <option>Choose...</option>
                      <option>USA +1</option>
                      <option>India +91</option>
                      <option>Italy +39</option>
                      <option>Mexico +52</option>
                      <option>Libya +218</option>
                      <option>United Kingdom +44</option>
                      <option>Zambia +260</option>
                    </Form.Control>
                    <Form.Control required type="text" onChange={this.onPhoneNumChange} value={this.state.phoneNum} />
                  </Form.Group>

                  <Form.Group as={Col} controlId="validationCustom07">
                    <Form.Label>Language</Form.Label>
                    <Form.Control as="select" onChange={this.onLanguageChange} value={this.state.language}>
                      <option>Choose...</option>
                      <option>English</option>
                      <option>Deutsch</option>
                      <option>Espanol</option>
                      <option>Francais</option>
                      <option>Bahasa Indonesia</option>
                      <option>Italiano</option>
                      <option>Nederlands</option>
                    </Form.Control>
                  </Form.Group>
                </Form.Row>

                <Form.Row>
                  {/* <Form.Group as={Col} md="6" controlId="validationCustom08">
                    <Form.Label>Your password</Form.Label>
                    <Form.Control required type="password" onChange={this.onPasswordChange} value={this.state.password} />
                  </Form.Group> */}
                  <Button
                    variant="primary"
                    type="submit"
                    style={{
                      float: "right",
                      width: "80px",
                      height: "40px",
                      backgroundColor: "#FF652F",
                      marginLeft: "527px",
                      fontSize: "13px",
                    }}
                    onClick={this.onSave}
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
export default Profile;

// export default connect(null, { userLogin })(Profile);
