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
import avatar from "../Images/avatar.png";
import URL_VAL from "../../backend";
import { logout } from "../../actions/loginaction";
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
      groupImage: this.props.groupImage,
      imagePreview: undefined,
      isImageUpdated: false,
      isGroupNameUpdated: false,
      showImageSuccess: false,
    };
    this.OnTransactionClick = this.OnTransactionClick.bind(this);
    // this.onAddExpenseClick = this.onAddExpenseClick.bind(this);
    this.modalOpen = this.modalOpen.bind(this);
    this.modalClose = this.modalClose.bind(this);
    this.onGroupUpdated = this.onGroupUpdated.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.OnChangeImageClick = this.OnChangeImageClick.bind(this);
    this.setShow = this.setShow.bind(this);
  }

  componentDidMount() {
    const userID = cookie.load("cookie");
    console.log(`inside component did mount of group ${this.props.groupID}`);
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
      });

    // Download image
    if (this.state.groupImage) {
      axios.post(`${URL_VAL}/profile/getImage/${this.state.groupImage}`)
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
      const userID = cookie.load("cookie");
      console.log(`inside component did update of group ${this.props.groupID}`);
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
      axios.defaults.withCredentials = true;
      axios.post(`${URL_VAL}/profile/upload-file`, data)
        .then((response) => {
          if (response.status === 200) {
            // Download image
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
      });
  }

  OnChangeImageClick(e) {
    console.log("inside change image");
    const data = {
      Image: this.state.groupImage,
      GroupID: this.props.groupID,
    };
    axios
      .put(`${URL_VAL}/group/changeImage`, data)
      .then((response) => {
        console.log("Status Code : ", response.status);
        console.log("Status Code : ", response.data);
        if (response.status === 200) {
          console.log(response.data);
          this.setState({
            isImageUpdated: true,
            showImageSuccess: true,
          });

          this.props.onGroupImageChanged(this.state.groupImage);
          this.onGroupUpdated();
        }
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

  setShow(e) {
    this.setState({
      showImageSuccess: false,
    });
  }

  render() {
    const noDataMsg = "You have not added any expense yet";
    const { groupDetails } = this.state;
    const { isDataPresent } = this.state;
    const { userID } = this.state;
    const { transactionData } = this.state;
    const currencyType = this.props.userDetails.currency;
    let date;
    let lentString = "";

    let groupPic = (
      <img
        src={avatar}
        alt="SplitWise"
        width="50"
        height="50"

      />
    );

    if (this.state.imagePreview) {
      groupPic = (
        <img
          src={this.state.imagePreview}
          alt="groupPic"
          width="50"
          height="50"
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
                  <span style={{ marginRight: "10px" }}>
                    {groupPic}
                  </span>
                  <h4 style={{ fontWeight: "600", fontSize: "24px" }}>{this.state.groupName}</h4>
                </div>
              </Col>
            </Row>

            {/* <Row>
              <Col>
                <input
                  id="avatar"
                  name="ProfileImage"
                  type="file"
                  style={{ maxWidth: "240px", marginTop: "15px" }}
                  onChange={this.handleChange}
                />
              </Col>
            </Row> */}
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
        </Row>
        {(this.state.isImageUpdated && this.state.showImageSuccess) && (
          <Alert variant="success" transition={false} onClose={() => this.setShow()} dismissible>
            Group picture has been successfully updated
          </Alert>
        )}
        <Row style={{ marginTop: "12px" }}>
          <Col md={12}>
            {!isDataPresent && <h5>{noDataMsg}</h5>}
            {isDataPresent
              && groupDetails.map((val, idx) => {
                if (groupDetails[idx].createdOn != undefined) {
                  date = groupDetails[idx].createdOn.slice(0, 10);
                }

                let ownerName = "";
                if (groupDetails[idx].createdBy == groupDetails[idx].user._id) {
                  ownerName = "you";
                } else {
                  ownerName = groupDetails[idx].user.userName;
                }
                const payedStr = `${ownerName} paid ${currencyType} ${numeral(groupDetails[idx].totalAmount).format('0, 0.00')}`;
                if (groupDetails[idx].lentAmount != undefined) {
                  lentString = `${ownerName} lent ${currencyType} ${numeral(groupDetails[idx].lentAmount).format('0, 0.00')}`;
                }

                return (
                  <Accordion>
                    <Card>
                      <Accordion.Toggle
                        as={Card.Header}
                        eventKey="0"
                        id={groupDetails[idx]._id}
                        onClick={() => this.OnTransactionClick(
                          groupDetails[idx]._id,
                        )}
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
                      <Accordion.Collapse eventKey="0">
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
                                    {' '}
                                    {numeral(groupDetails[idx].totalAmount).format('0,0.00')}
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

                          {
                          Object.values(transactionData).map((item) => {
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
                                  {' '}
                                  <b>
                                    {currencyType}
                                    {' '}
                                    {numeral(item.splitAmount).format('0,0.00')}
                                  </b>
                                </div>
                              );
                            }
                          })
}
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card>
                  </Accordion>
                );
              })}
          </Col>
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({ userDetails: state.login });

// export default GroupsContainer;

export default connect(mapStateToProps, null)(GroupsContainer);
