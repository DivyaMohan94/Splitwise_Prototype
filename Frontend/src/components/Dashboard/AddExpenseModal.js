/* eslint-disable react/no-unused-state */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
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
  Container,
  Modal,
  ModalDialog,
  ModalTitle,
  ModalBody,
  ModalFooter,
  Alert,
} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import { connect } from "react-redux";
import URL_VAL from "../../backend";
import {
  createExpense,
} from '../../actions/groupsAction';

class AddExpense extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupName: this.props.groupName,
      groupID: this.props.groupID,
      description: '',
      amount: '',
      validationErr: [],
    };
    this.onSaveClicked = this.onSaveClicked.bind(this);
    this.onCloseClicked = this.onCloseClicked.bind(this);
    this.onDescriptionChange = this.onDescriptionChange.bind(this);
    this.onAmountChange = this.onAmountChange.bind(this);
  }

  onSaveClicked(e) {
    console.log("save expenses");
    const paidByID = localStorage.getItem("userID");
    console.log('local stroga', localStorage.getItem("userID"));
    const headers = new Headers();
    e.preventDefault();
    if (this.validateSave() === true) {
      const data = {
        description: this.state.description,
        totalAmount: this.state.amount,
        paidByID,
        groupID: this.props.groupID,
        currency: "USD",
        groupName: this.state.groupName,
      };
      console.log(data);
      // set the with credentials to true
      axios.defaults.headers.common.authorization = localStorage.getItem('token');
      // make a post request with the user data
      axios
        .post(`${URL_VAL}/group/addexpense`, data)
        .then((response) => {
          console.log("Status Code : ", response.status);
          console.log("Status Code : ", response.data);
          if (response.status === 200) {
            console.log("inside success");
            this.props.onHide();
            // this.props.onGroupUpdated(true);
            this.props.isGroupUpdated();
          }
          this.props.createExpense("Expense created successfully");
        })
        .catch((error) => {
          console.log("Error in adding expense");
          this.setState({
            isInvalid: true,
          });
          this.props.createExpense("Cannot create expense");
        });
    }
  }

  onDescriptionChange(e) {
    this.setState({
      description: e.target.value,
    });
  }

  onAmountChange(e) {
    this.setState({
      amount: e.target.value,
    });
  }

  onCloseClicked(e) {
    console.log("close clicked");
    this.props.onHide();
  }

  validateSave() {
    const err = [];
    const descRejex = /^[A-Za-z0-9 ]*$/;
    const amountRejex = /^[0-9]+(\.[0-9][0-9]?)?$/;
    let isValid = true;

    if (this.state.description === "") {
      err.push("Description can't be blank");
      isValid = false;
    }
    if (this.state.description !== "" && !this.state.description.match(descRejex)) {
      err.push("Description can't have invalid characters");
      isValid = false;
    }
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
    if (this.state.validationErr.length > 0) {
      errMsg = this.state.validationErr.map((err) => <li>{err}</li>);
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
          <Modal.Title>Add an expense</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ display: "block" }}>
            <h5>
              With you and :
              {'  '}
              <b>
                {this.state.groupName}
              </b>
            </h5>
            <Form>
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
                    src="https://s3.amazonaws.com/splitwise/uploads/category/icon/square_v2/uncategorized/general@2x.png"
                    alt="receipt"
                    style={{ height: "110px", width: "110px" }}
                  />
                </Col>
                <Col>

                  <Form.Row>
                    <Col md={8}>
                      <Form.Control
                        placeholder="Description"
                        pattern="^[A-Za-z0-9 ]+$"
                        required
                        onChange={this.onDescriptionChange}
                      />
                    </Col>
                  </Form.Row>
                  <Form.Row style={{ marginTop: "10px" }}>
                    <Col md={2}>
                      <Form.Label>{this.props.userDetails.currency}</Form.Label>
                    </Col>
                    <Col md={6}>
                      <Form.Control placeholder="Amount" onChange={this.onAmountChange} required />
                    </Col>
                  </Form.Row>
                </Col>
              </Form.Row>
            </Form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.onCloseClicked}>
            Close
          </Button>
          <Button variant="primary" onClick={this.onSaveClicked}>Save</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => ({ userDetails: state.userReducer });

function mapDispatchToProps(dispatch) {
  console.log("in dispatch");
  return {
    createExpense: (payload) => dispatch(createExpense(payload)),
  };
}

// export default AddExpense;

export default connect(mapStateToProps, mapDispatchToProps)(AddExpense);
