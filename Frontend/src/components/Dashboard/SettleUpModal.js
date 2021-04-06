/* eslint-disable react/prefer-stateless-function */
/* eslint-disable no-unused-vars */
import React, { Component } from "react";
// eslint-disable-next-line no-unused-vars
import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import cookie from "react-cookies";
import axios from "axios";
import propTypes from "prop-types";
import {
  Button,
  Dropdown,
  Modal,
  Alert,
} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import URL_VAL from "../../backend";

class SettleUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userList: {},
      payerID: "",
      recipientID: "",
      amount: "",
      payerName: "",
      recipientName: "",
      validationErr: [],
    };
    this.onSaveClicked = this.onSaveClicked.bind(this);
    this.onCancelClicked = this.onCancelClicked.bind(this);
    this.onPayerSelected = this.onPayerSelected.bind(this);
    this.onRecipientSelected = this.onRecipientSelected.bind(this);
    this.onAmountEntered = this.onAmountEntered.bind(this);
  }

  componentDidMount() {
    console.log("inside component did mount of settle up");
    const data = localStorage.getItem('userID');
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
        if (response.status === 200) {
          console.log("inside success");
          this.setState({
            userList: response.data,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  onSaveClicked(e) {
    console.log("settle up");
    const headers = new Headers();
    e.preventDefault();
    if (this.validateSave() === true) {
      const data = {
        payerID: this.state.payerID,
        recipientID: this.state.recipientID,
      };
      console.log(data);
      // set the with credentials to true
      axios.defaults.headers.common.authorization = localStorage.getItem('token');
      // make a post request with the user data
      axios
        .put(`${URL_VAL}/dashboard/settleup`, data)
        .then((response) => {
          console.log("Status Code : ", response.status);
          console.log("Status Code : ", response.data);
          if (response.status === 200) {
            console.log("inside success");
            this.props.onHide();
            this.props.onSettleUpClicked();
          }
        })
        .catch((error) => {
          console.log("Error in settle up");
        });
    }
  }

  onPayerSelected(e) {
    const index = e.target.selectedIndex;
    const optionElement = e.target.childNodes[index];
    const optionElementId = optionElement.getAttribute('id');
    console.log(optionElementId);
    this.setState({
      payerID: optionElementId,
      payerName: e.target.value,
    });
  }

  onRecipientSelected(e) {
    const index = e.target.selectedIndex;
    const optionElement = e.target.childNodes[index];
    const optionElementId = optionElement.getAttribute('id');
    console.log(optionElementId);
    this.setState({
      recipientID: optionElementId,
      recipientName: e.target.value,
    });
  }

  onAmountEntered(e) {
    this.setState({
      amount: e.target.value,
    });
  }

  onCancelClicked(e) {
    console.log("cancel clicked");
    this.props.onHide();
  }

  validateSave() {
    const err = [];
    const amountRejex = /^[0-9]+(\.[0-9][0-9]?)?$/;
    let isValid = true;

    if (this.state.amount === "") {
      err.push("Amount can't be blank");
      isValid = false;
    }
    if (this.state.amount !== "" && !this.state.amount.match(amountRejex)) {
      err.push("Please enter a valid amount");
      isValid = false;
    }

    this.setState({
      validationErr: err,
    });
    return isValid;
  }

  render() {
    let errMsg = "";
    const { validationErr } = this.state;
    if (validationErr.length > 0) {
      errMsg = validationErr.map((err) => <li>{err}</li>);
    }
    return (
      <Modal
        show={this.props.show}
        onHide={this.props.onHide}
        backdrop="static"
        keyboard={false}
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Settle up</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <h5>
              Record a cash payment
            </h5>
            <Form style={{ marginTop: "30px" }}>
              {errMsg && (
              <Row>
                <Col>
                  <Alert transition={false} variant="danger">
                    <Alert.Heading>The following error(s) occured:</Alert.Heading>
                    {errMsg}
                  </Alert>
                </Col>
              </Row>
              )}
              <Form.Row>
                <Col md="auto">

                  <img
                    src="https://s3.amazonaws.com/splitwise/uploads/notifications/v2/0-p.png"
                    alt="receipt"
                    style={{ height: "80px", width: "80px" }}
                  />
                </Col>
                <Col>
                  <Form.Row>
                    <Col md={5}>
                      <Form.Group as={Col} controlId="payer">
                        <Form.Control as="select" value={this.state.payerName} onChange={this.onPayerSelected}>
                          <option>payer..</option>
                          {
                            Object.values(this.state.userList).map((user) => (
                              Object.values(user).map((data) => (
                                <option
                                  id={data._id}
                                >
                                  {data.userName}
                                </option>
                              ))
                            ))
                           }
                        </Form.Control>
                      </Form.Group>
                    </Col>
                    <Col md={1}>
                      <p style={{ marginTop: "5px" }}>paid</p>
                    </Col>
                    <Col md={5}>
                      <Form.Group as={Col} controlId="recipient">
                        <Form.Control as="select" onChange={this.onRecipientSelected} value={this.state.recipientName}>
                          <option>Recipient..</option>
                          {
                            Object.values(this.state.userList).map((user) => (
                              Object.values(user).map((data) => (
                                <option id={data._id}>{data.userName}</option>))))
                           }
                        </Form.Control>
                      </Form.Group>
                    </Col>
                  </Form.Row>
                  <Form.Row style={{ marginTop: "20px" }}>
                    {/* <Col md={1} /> */}
                    <Col>
                      <Form.Group as={Col} controlId="amount">
                        <Row>
                          <Col md="auto">
                            <Form.Label column>{localStorage.getItem('currency')}</Form.Label>
                          </Col>
                          <Col md="auto" style={{ paddingRight: "0px" }}>
                            <Form.Control
                              required
                              type="text"
                              placeholder="Amount"
                              onChange={this.onAmountEntered}
                            />
                          </Col>
                        </Row>
                      </Form.Group>
                    </Col>
                  </Form.Row>
                </Col>
              </Form.Row>
            </Form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.onCancelClicked}>
            Cancel
          </Button>
          <Button variant="primary" onClick={this.onSaveClicked}>Save</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default SettleUp;
