const mongoose = require('mongoose');
const connection = require('./kafka/connection');
const { mongoURI } = require("./utils/config");
// topics files

const updateProfile = require('./services/updateProfileService');
const getProfile = require('./services/getProfileService');
const createGroup = require('./services/createGroupService');
const getFriends = require('./services/getFriendsServiceService');
const getRecentActivities = require('./services/getRecentActivitiesService');
const getGroupsDropdown = require('./services/getGroupsDropdownService');
const getFilteredGroup = require('./services/getFilteredGroupService');
const getDashboardDetails = require('./services/getDashboardDetailsService');
const getAllYouOwe = require('./services/getAllyouOweService');
const getAllYouAreOwed = require('./services/getAllYouAreOwedService');
const settleUp = require('./services/settleUpService');
const getActiveGroups = require('./services/getActiveGroupsService');
const getInvites = require('./services/getInvitesService');
const acceptInvites = require('./services/acceptInvitesService');
const getAllTransactions = require('./services/getAllTransactionsService');
const getTransaction = require('./services/getTransactionService');
const getGroupDetails = require('./services/getGroupDetailsService');
const getDues = require('./services/getDuesService');
const leaveGroup = require('./services/leaveGroupService');
const addNotes = require('./services/addNotesService');
const deleteNotes = require('./services/deleteNotesService');
const addExpense = require('./services/addExpenseService');
const login = require('./services/loginService');
const signUp = require('./services/signUpService');
const changeGroupName = require('./services/changeGroupName');
const changeGroupImage = require('./services/changeGroupImage');

function handleTopicRequest(topic_name, fname) {
  // var topic_name = 'root_topic';
  const consumer = connection.getConsumer(topic_name);
  const producer = connection.getProducer();
  console.log('server is running ');
  consumer.on('message', (message) => {
    console.log(`\n\n message received for ${topic_name} `, fname);
    // console.log(JSON.stringify(message.value));
    // console.log('message val', message.value);
    const data = JSON.parse(message.value);
    // console.log('checking data', data);

    fname.handle_request(data.data, (err, res) => {
      console.log(`after handle${res}`);
      const payloads = [
        {
          topic: data.replyTo,
          messages: JSON.stringify({
            correlationId: data.correlationId,
            data: res,
          }),
          partition: 0,
        },
      ];
      producer.send(payloads, (err, data) => {
        console.log(data);
      });
    });
  });
}

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  poolSize: 500,
  bufferMaxEntries: 0,
};

mongoose.connect(mongoURI, options, (err, res) => {
  if (err) {
    console.log(err);
    console.log('Error connecting to DB: ', err);
  } else {
    console.log('Connected to MongoDB');
  }
});

// first argument is topic name
// second argument is a function that will handle this topic request
handleTopicRequest("updateProfile", updateProfile);
handleTopicRequest("getProfile", getProfile);
handleTopicRequest("createGroup", createGroup);
handleTopicRequest("getFriends", getFriends);
handleTopicRequest("getRecentActivities", getRecentActivities);
handleTopicRequest("getGroupsDropdown", getGroupsDropdown);
handleTopicRequest("getFilteredGroup", getFilteredGroup);
handleTopicRequest("getDashboardDetails", getDashboardDetails);
handleTopicRequest("getAllYouOwe", getAllYouOwe);
handleTopicRequest("getAllYouAreOwed", getAllYouAreOwed);
handleTopicRequest("settleUp", settleUp);
handleTopicRequest("getActiveGroups", getActiveGroups);
handleTopicRequest("getInvites", getInvites);
handleTopicRequest("acceptInvites", acceptInvites);
handleTopicRequest("getAllTransactions", getAllTransactions);
handleTopicRequest("getTransaction", getTransaction);
handleTopicRequest("getGroupDetails", getGroupDetails);
handleTopicRequest("getDues", getDues);
handleTopicRequest("leaveGroup", leaveGroup);
handleTopicRequest("addNotes", addNotes);
handleTopicRequest("deleteNotes", deleteNotes);
handleTopicRequest("addExpense", addExpense);
handleTopicRequest("login", login);
handleTopicRequest("signUp", signUp);
handleTopicRequest("changeGroupName", changeGroupName);
handleTopicRequest("changeGroupImage", changeGroupImage);
