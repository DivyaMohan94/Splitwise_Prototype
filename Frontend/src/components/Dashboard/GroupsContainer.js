/* eslint-disable no-else-return */
/* eslint-disable react/sort-comp */
/* eslint-disable eqeqeq */
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
  Alert,
  Dropdown,
  DropdownButton,
  Accordion,
  Card,
  Modal,
} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import { connect } from "react-redux";
import numeral from 'numeral';
import swal from 'sweetalert';
import Swal from 'sweetalert2';
import avatar from "../Images/avatar.png";
import URL_VAL from "../../backend";
import {
  addNotes, getSplitData, getTransactionData, deleteNotes,
} from '../../actions/groupsAction';
import SideNav from "./sideNav";
import AddExpense from './AddExpenseModal';

// create the Navbar Component
class GroupsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupName: this.props.groupName,
      isDataPresent: false,
      groupDetails: {},
      userID: "",
      transactionData: {},
      modal: false,
      isGroupUpdated: false,
      groupImage: "",
      imagePreview: undefined,
      isImageUpdated: false,
      isGroupNamevalid: false,
      showImageSuccess: false,
      showNameChangeAlert: false,
      note: "",
    };
    this.OnTransactionClick = this.OnTransactionClick.bind(this);
    // this.onAddExpenseClick = this.onAddExpenseClick.bind(this);
    this.modalOpen = this.modalOpen.bind(this);
    this.modalClose = this.modalClose.bind(this);
    this.onGroupUpdated = this.onGroupUpdated.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.OnChangeImageClick = this.OnChangeImageClick.bind(this);
    this.setShow = this.setShow.bind(this);
    this.onPostClicked = this.onPostClicked.bind(this);
    this.onNotesChange = this.onNotesChange.bind(this);
    this.onDeleteClicked = this.onDeleteClicked.bind(this);
    this.OnChangeGroupName = this.OnChangeGroupName.bind(this);
  }

  componentDidMount() {
    const userID = localStorage.getItem('userID');
    console.log(`inside component did mount of group ${this.props.groupID}`);
    axios.defaults.headers.common.authorization = localStorage.getItem('token');
    axios
      .get(`${URL_VAL}/group/AllTransaction`, {
        params: {
          groupID: this.props.groupID,
        },
      })
      .then((response) => {
        console.log("Status Code : ", response.status);
        console.log("Status Code : ", response.data);
        if (response.status === 200) {
          console.log(response.data);
          if (response.data.length) {
            this.setState({
              isDataPresent: true,
              groupDetails: response.data,
              userID,
            });
          }
        }
        this.props.getTransactionData(response.data);
      });
    let groupImageName = "";
    this.props.groupDetails.map((val) => {
      if (val._id == this.props.groupID) {
        console.log('inside map comparison', val.image);
        groupImageName = val.image;
        this.setState({
          groupImage: val.image,
        });
      }
    });
    // Download image
    console.log('group image name', this.state.groupImage);
    if (groupImageName) {
      axios.defaults.headers.common.authorization = localStorage.getItem('token');
      axios.post(`${URL_VAL}/profile/getImage/${groupImageName}`)
        .then((res) => {
          const imagePreview = `data:image/jpg;base64, ${res.data}`;
          this.setState({
            imagePreview,
          });
        });
    }
  }

  componentDidUpdate() {
    if (this.state.isGroupUpdated === true) {
      const { userID } = this.state;
      console.log(`inside component did update of group ${this.props.groupID}`);
      axios.defaults.headers.common.authorization = localStorage.getItem('token');
      axios
        .get(`${URL_VAL}/group/AllTransaction`, {
          params: {
            groupID: this.props.groupID,
          },
        })
        .then((response) => {
          console.log("Status Code : ", response.status);
          console.log("Status Code : ", response.data);
          if (response.status === 200) {
            console.log(response.data);
            if (response.data.length) {
              this.setState({
                isDataPresent: true,
                groupDetails: response.data,
                userID,
                isGroupUpdated: false,
              });
            }
          }
          this.props.getTransactionData(response.data);
        });

      if (this.state.groupImage) {
        axios.defaults.headers.common.authorization = localStorage.getItem('token');
        axios.post(`${URL_VAL}/profile/getImage/${this.state.groupImage}`)
          .then((res) => {
            const imagePreview = `data:image/jpg;base64, ${res.data}`;
            this.setState({
              imagePreview,
            });
          });
      }
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
      data.append('image', profilePhoto);
      axios.defaults.headers.common.authorization = localStorage.getItem('token');
      axios.post(`${URL_VAL}/profile/upload-file`, data)
        .then((response) => {
          if (response.status === 200) {
            // Download image
            axios.defaults.headers.common.authorization = localStorage.getItem('token');
            axios.post(`${URL_VAL}/profile/getImage/${profilePhoto.name}`)
              .then((res) => {
                const imagePreview = `data:image/jpg;base64, ${res.data}`;
                console.log(imagePreview);
                this.setState({
                  groupImage: profilePhoto.name,
                  imagePreview,
                });
              }).catch((err) => {
                error.push("Sorry! Profile picture cannot be set");
              });
          }
        });
    }
  }

  onGroupUpdated() {
    this.setState({
      isGroupUpdated: true,
    });
  }

  OnTransactionClick(transactionID) {
    const { userID } = this.state;
    axios.defaults.headers.common.authorization = localStorage.getItem('token');
    axios
      .get(`${URL_VAL}/group/AllTransaction`, {
        params: {
          groupID: this.props.groupID,
        },
      })
      .then((response) => {
        console.log("Status Code : ", response.status);
        console.log("Status Code : ", response.data);
        if (response.status === 200) {
          console.log(response.data);
          if (response.data.length) {
            this.setState({
              isDataPresent: true,
              groupDetails: response.data,
              userID,
              isGroupUpdated: false,
            });
          }
        }
        this.props.getTransactionData(response.data);
      });

    axios.defaults.headers.common.authorization = localStorage.getItem('token');
    axios
      .get(`${URL_VAL}/group/Transaction`, {
        params: {
          TransactionID: transactionID,
        },
      })
      .then((response) => {
        console.log("Status Code : ", response.status);
        console.log("Status Code : ", response.data);
        if (response.status === 200) {
          console.log(response.data);
          this.setState({
            transactionData: response.data,
          });
        }
        this.props.getSplitData(response.data);
      });
  }

  OnChangeImageClick(e) {
    console.log("inside change image");
    const data = {
      image: this.state.groupImage,
      groupID: this.props.groupID,
    };
    axios.defaults.headers.common.authorization = localStorage.getItem('token');
    axios
      .put(`${URL_VAL}/group/changeGroupImage`, data)
      .then((response) => {
        console.log("Status Code : ", response.status);
        console.log("Status Code : ", response.data);
        if (response.status === 200) {
          console.log(response.data);
          this.setState({
            isImageUpdated: true,
            showImageSuccess: true,
          });

          // this.props.onGroupImageChanged(this.state.groupImage);
          this.onGroupUpdated();
          this.props.onGroupNameChange();
        }
      })
      .catch((error) => {
        console.log("cannot update image", error);
      });
  }

  OnChangeGroupName(newGroupName) {
    console.log("inside change group name", newGroupName);
    const data = {
      groupName: newGroupName,
      createdBy: localStorage.getItem('userID'),
      groupID: this.props.groupID,
    };
    axios.defaults.headers.common.authorization = localStorage.getItem('token');
    // make a post request with the user data
    axios
      .post(`${URL_VAL}/group/changeGroupName`, data)
      .then((response) => {
        console.log("Status Code : ", response.status);
        console.log("Status Code : ", response.data);
        if (response.status === 200) {
          console.log("inside group name update success");
          this.setState({
            groupName: newGroupName,
            isGroupNamevalid: true,
            isGroupUpdated: true,
            showNameChangeAlert: true,
          });
          this.props.onGroupNameChange();
        } else if (response.status === 400) {
          console.log("inside group already exists error");
          this.setState({
            isGroupNamevalid: false,
            isGroupUpdated: false,
            showNameChangeAlert: true,
          });
        }
      })
      .catch((error) => {
        console.log("inside group already exists error");
        this.setState({
          isGroupNamevalid: false,
          isGroupUpdated: false,
          showNameChangeAlert: true,
        });
      });
  }

  modalOpen() {
    this.setState({ modal: true });
  }

  modalClose() {
    this.setState({
      modal: false,
    });
  }

  onNotesChange(e) {
    this.setState({
      note: e.target.value,
    });
  }

  setShow(e) {
    this.setState({
      showImageSuccess: false,
      showNameChangeAlert: false,
    });
  }

  onPostClicked(transactionID) {
    console.log('post button clicked', transactionID);
    if (this.state.note != "") {
      const data = {
        note: this.state.note,
        userID: localStorage.getItem('userID'),
        transactionID,
        addedUser: localStorage.getItem('username'),
      };
      console.log(data);
      // set the with credentials to true
      axios.defaults.headers.common.authorization = localStorage.getItem('token');
      axios
        .post(`${URL_VAL}/group/addNotes`, data)
        .then((response) => {
          console.log("Status Code : ", response.status);
          console.log("Status Code : ", response.data.payload);
          if (response.status === 200) {
            console.log("inside success");
            this.setState({
              isGroupUpdated: true,
              note: "",
            });
          }
          this.props.addNotes("Notes added successfully");
        })
        .catch((error) => {
          console.log(error);
        });
      this.props.addNotes("Cannot add notes");
    }
  }

  onDeleteClicked(note, transactionID) {
    console.log('Delete button clicked', note);
    console.log('transid', transactionID);
    const data = {
      noteID: note,
      transactionID,
    };
    // set the with credentials to true
    axios.defaults.headers.common.authorization = localStorage.getItem('token');
    axios
      .post(`${URL_VAL}/group/deleteNotes`, data)
      .then((response) => {
        console.log("Status Code : ", response.status);
        console.log("Status Code : ", response.data.payload);
        if (response.status === 200) {
          console.log("inside success");
          this.setState({
            isGroupUpdated: true,
          });
        }
        this.props.deleteNotes("Notes deleted successfully");
      })
      .catch((error) => {
        console.log(error);
      });
    this.props.deleteNotes("Cannot delete notes");
  }

  render() {
    console.log('imagepriv', this.state.imagePreview);
    const noDataMsg = "You have not added any expense yet";
    const groupInvalidMsg = "Whoops! This group name already exists. Try entering another name";
    const { groupDetails } = this.state;
    const { isDataPresent } = this.state;
    const { userID } = this.state;
    const { transactionData, isGroupNamevalid } = this.state;
    const currencyType = this.props.userDetails.currency;
    let date;
    let lentString = "";

    let groupPic = (
      <img
        src={avatar}
        alt="SplitWise"
        width="50"
        height="50"
        className="circle"
      />
    );

    if (this.state.imagePreview) {
      groupPic = (
        <img
          src={this.state.imagePreview}
          alt="groupPic"
          width="50"
          height="50"
          className="circle"
        />
      );
    }

    return (
      <Container>
        <Row
          style={{
            backgroundColor: "#eee",
            justifyContent: "center",
            borderBottom: "1px",
            borderBottomColor: "#ddd",
            borderBottomStyle: "solid",
            padding: "20px",
          }}
        >
          <Col>
            <Row>
              <Col md="auto">
                <div style={{ display: "flex" }}>
                  <span style={{ marginRight: "10px" }}>{groupPic}</span>
                  <h4 style={{ fontWeight: "600", fontSize: "24px", marginTop: "10px" }}>
                    {this.state.groupName}
                  </h4>
                </div>
              </Col>
            </Row>

            <Row>
              <Col>
                <input
                  id="avatar"
                  name="ProfileImage"
                  type="file"
                  style={{ maxWidth: "240px", marginTop: "15px" }}
                  onChange={this.handleChange}
                />
              </Col>
            </Row>
          </Col>

          {/* <Col md="auto">
            <Row>
              {groupPic}
            </Row>

            <Row>
              <input
                id="avatar"
                name="ProfileImage"
                type="file"
                style={{ maxWidth: "110px", marginTop: "10px" }}
                onChange={this.handleChange}
              />
            </Row>
          </Col> */}

          <Col md="auto">
            <Button onClick={this.modalOpen}>Add an expense</Button>
            <AddExpense
              show={this.state.modal}
              onHide={(e) => this.modalClose(e)}
              groupID={this.props.groupID}
              groupName={this.props.groupName}
              isGroupUpdated={this.onGroupUpdated}
            />
          </Col>
          <Col md="auto">
            <Button onClick={this.OnChangeImageClick}>Change image</Button>
          </Col>
          <Col md="auto">
            <Button
              onClick={(e) => (async () => {
                const { value: text } = await Swal.fire({
                  title: 'Enter new group name',
                  input: 'text',
                  inputLabel: 'Group Name',
                  showCancelButton: true,
                  inputValidator: (value) => {
                    if (!value) {
                      return 'Please enter a valid group name!';
                    // eslint-disable-next-line no-else-return
                    } else {
                      this.OnChangeGroupName(value);
                    }
                  },
                });
              })()}
            >
              Change group name
            </Button>
          </Col>
        </Row>
        <Row style={{ marginTop: "5px" }}>
          <Col>
            {this.state.isImageUpdated && this.state.showImageSuccess && (
            <Alert
              variant="success"
              transition={false}
              onClose={() => this.setShow()}
              dismissible
            >
              Group picture has been successfully updated
            </Alert>
            )}
            {isGroupNamevalid && this.state.showNameChangeAlert && (
            <Alert
              variant="success"
              transition={false}
              onClose={() => this.setShow()}
              dismissible
            >
              Group name has been successfully updated
            </Alert>
            )}
            {!isGroupNamevalid && this.state.showNameChangeAlert && (
            <Alert
              variant="danger"
              transition={false}
              onClose={() => this.setShow()}
              dismissible
            >
              Whoops! This group name already exists. Try entering another name
            </Alert>
            )}
          </Col>
        </Row>
        <Row style={{ marginTop: "12px" }}>
          <Col md={12}>
            {!isDataPresent && <h5>{noDataMsg}</h5>}
            {isDataPresent && (
              <Accordion>
                {groupDetails.map((val, idx) => {
                  const eventKey = idx.toString();
                  if (groupDetails[idx].createdOn != undefined) {
                    date = groupDetails[idx].createdOn.slice(0, 10);
                  }

                  let ownerName = "";
                  if (
                    groupDetails[idx].createdBy == localStorage.getItem('userID')
                  ) {
                    ownerName = "you";
                  } else {
                    ownerName = groupDetails[idx].user.userName;
                  }
                  const payedStr = `${ownerName} paid ${currencyType} ${numeral(
                    groupDetails[idx].totalAmount,
                  ).format("0, 0.00")}`;
                  if (groupDetails[idx].lentAmount != undefined) {
                    lentString = `${ownerName} lent ${currencyType} ${numeral(
                      groupDetails[idx].lentAmount,
                    ).format("0, 0.00")}`;
                  }

                  return (
                    // <Accordion>
                    <Card>
                      <Accordion.Toggle
                        as={Card.Header}
                        eventKey={eventKey}
                        // id={groupDetails[idx]._id}
                        onClick={() => this.OnTransactionClick(groupDetails[idx]._id)}
                      >
                        <Row>
                          <Col md="auto">{date}</Col>
                          <Col md="auto">
                            <img
                              src="https://s3.amazonaws.com/splitwise/uploads/category/icon/square_v2/uncategorized/general@2x.png"
                              alt="receipt"
                              style={{ height: "45px", width: "45px" }}
                            />
                          </Col>
                          <Col>
                            <h6>
                              <b>{groupDetails[idx].description}</b>
                            </h6>
                          </Col>
                          <Col md={3} />
                          <Col>{payedStr}</Col>
                          <Col>{lentString}</Col>
                        </Row>
                      </Accordion.Toggle>
                      <Accordion.Collapse eventKey={eventKey}>
                        <Card.Body>
                          {/* {this.state.TransactionStr} */}

                          {/* <div>{payedStr}</div> */}
                          <Row>
                            <Col md={2}>
                              <img
                                src="https://s3.amazonaws.com/splitwise/uploads/category/icon/square_v2/uncategorized/general@2x.png"
                                alt="receipt"
                                style={{ height: "100px", width: "100px" }}
                              />
                            </Col>
                            <Col md={5}>
                              <Row>
                                <p>{groupDetails[idx].description}</p>
                              </Row>
                              <Row>
                                <h5>
                                  <b>
                                    {currencyType}
                                    {" "}
                                    {numeral(
                                      groupDetails[idx].totalAmount,
                                    ).format("0,0.00")}
                                  </b>
                                </h5>
                              </Row>
                              <Row>
                                <p>
                                  Added by
                                  {' '}
                                  {ownerName}
                                  {' '}
                                  on
                                  {' '}
                                  {date}
                                </p>
                              </Row>
                            </Col>
                          </Row>

                          {Object.values(transactionData).map((item) => {
                            if (item.defaulter._id != item.owner._id) {
                              let status = "";

                              if (item.paymentStatus === "unpaid") {
                                status = "owes";
                              } else {
                                status = "paid";
                              }
                              return (
                                <div>
                                  <b>{item.defaulter.userName}</b>
                                  {' '}
                                  {status}
                                  {" "}
                                  <b>
                                    {currencyType}
                                    {" "}
                                    {numeral(item.splitAmount).format("0,0.00")}
                                  </b>
                                </div>
                              );
                            }
                          })}
                          <Row style={{ marginTop: "30px" }}>
                            {/* <Col md={8} /> */}
                            <Col md="auto">
                              <span className="glyphicon glyphicon-th-list" />
                              <b> Notes and comments</b>
                            </Col>
                          </Row>
                          {Object.values(groupDetails[idx].notes).map(
                            (note) => {
                              const notesDate = note.addedOn.slice(0, 10);
                              const notesStr = `${note.addedUser} ${notesDate} \n${note.note}`;
                              let transactionID = 0;
                              return (
                                <Form.Row style={{ marginTop: "5px" }}>
                                  {/* <Col md={} /> */}
                                  <Col md="auto">
                                    <Form.Group
                                      as={Col}
                                      md="auto"
                                      style={{ display: "flex" }}
                                      id={note._id}
                                    >
                                      <Form.Control
                                        as="textarea"
                                        id={note._id}
                                        required
                                        type="text"
                                        value={notesStr}
                                        style={{ width: "400px" }}
                                        readOnly
                                      />
                                      <span
                                        style={{
                                          top: "10px",
                                          marginLeft: "10px",
                                        }}
                                        // role="button"
                                        id={note._id}
                                        className="glyphicon glyphicon-remove-circle"
                                        onClick={
                                          // (e) => this.onDeleteClicked(noteID = noteID, transactionID = groupDetails[idx]._id)
                                          (e) => {
                                            swal({
                                              title: "Are you sure?",
                                              text:
                                                "Once deleted, you will not be able to recover this note !",
                                              icon: "warning",
                                              buttons: true,
                                              dangerMode: true,
                                            }).then((willDelete) => {
                                              if (willDelete) {
                                                this.onDeleteClicked(
                                                  note._id,
                                                  (transactionID = groupDetails[idx]._id),
                                                );
                                                swal(
                                                  "Your notes has been deleted!",
                                                  {
                                                    icon: "success",
                                                  },
                                                );
                                              }
                                            });
                                          }
                                        }
                                      />
                                    </Form.Group>
                                  </Col>
                                </Form.Row>
                              );
                            },
                          )}
                          <Form>
                            <Form.Row>
                              {/* <Col md={8} /> */}
                              <Col md="auto">
                                <Form.Group
                                  as={Col}
                                  md="auto"
                                  controlId="validationCustom01"
                                >
                                  <Form.Control
                                    as="textarea"
                                    required
                                    type="text"
                                    onChange={this.onNotesChange}
                                    value={this.state.note}
                                    style={{ width: "400px" }}
                                  />
                                  <Button
                                    style={{
                                      marginTop: "10px",
                                    }}
                                    onClick={(e) => this.onPostClicked(
                                      transactionData[0].transactionID,
                                    )}
                                  >
                                    Post
                                  </Button>
                                </Form.Group>
                              </Col>
                            </Form.Row>
                          </Form>
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card>
                    // </Accordion>
                  );
                })}
              </Accordion>
            )}
          </Col>
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  if (state.userReducer != undefined && state.groupsReducer.expenseDetails != undefined) {
    return {
      userDetails: state.userReducer,
      groupDetails: state.groupsReducer.activeGroupDetails,
      groupNotes: state.groupsReducer.expenseDetails,
    };
  } else {
    return {
      userDetails: "",
      groupDetails: "",
      groupNotes: [],
    };
  }
};

function mapDispatchToProps(dispatch) {
  console.log("in dispatch");
  return {
    addNotes: (payload) => dispatch(addNotes(payload)),
    getSplitData: (payload) => dispatch(getSplitData(payload)),
    getTransactionData: (payload) => dispatch(getTransactionData(payload)),
    deleteNotes: (payload) => dispatch(deleteNotes(payload)),
  };
}

// export default GroupsContainer;

export default connect(mapStateToProps, mapDispatchToProps)(GroupsContainer);
