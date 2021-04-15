const mongoose = require('mongoose');
const connection = require('./kafka/connection');
const { mongoURI } = require("./utils/config");
// topics files

const updateProfile = require('./services/updateProfileService');
const getProfile = require('./services/getProfileService');
const createGroup = require('./services/createGroupService');
const getFriends = require('./services/getFriendsService');

function handleTopicRequest(topic_name, fname) {
  // var topic_name = 'root_topic';
  const consumer = connection.getConsumer(topic_name);
  const producer = connection.getProducer();
  console.log('server is running ');
  consumer.on('message', (message) => {
    console.log(`\n\n message received for ${topic_name} `, fname);
    // console.log(JSON.stringify(message.value));
    console.log('message val', message.value);
    const data = JSON.parse(message.value);
    console.log('checking data', data);

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
// handleTopicRequest("place_cus_orders", placeCustomerOrders);
// handleTopicRequest("get_cus_orders", getCustomerOrders);
// handleTopicRequest("register_events", registerToEvents);
// handleTopicRequest("get_registered_events", getRegisteredEvents);
// handleTopicRequest("get_all_events", getAllEvents);
// handleTopicRequest("cus_post_review", postReviews);
// handleTopicRequest("cus_get_message", loadCusMessage);
// handleTopicRequest("cus_send_message", sendCusMessage);
// handleTopicRequest("get_yelp_users", getYelpUsers);
// handleTopicRequest("follow_yelp_users", followYelpUsers);
// handleTopicRequest("cus_profile_pic", customerProfilePic);

// handleTopicRequest("res_signup", resSignup);
// handleTopicRequest("res_signin", resSignin);
// handleTopicRequest("res_update_profile", updateResProfile);
// handleTopicRequest("res_get_orders", resGetOrders);
// handleTopicRequest("res_update_orders", resUpdateOrders);
// handleTopicRequest("res_get_events", resGetEvents);
// handleTopicRequest("res_add_events", resAddEvents);
// handleTopicRequest("update_menu", updateMenu);
// handleTopicRequest("add_menu", addMenu);
// handleTopicRequest("res_get_customer", resGetCustomer);
// handleTopicRequest("res_init_message", resInitMessage);
// handleTopicRequest("res_load_message", resLoadMessage);
// handleTopicRequest("res_send_message", resSendMessage);
// handleTopicRequest("res_profile_pic", resUpdateProfilePic);
// handleTopicRequest("res_dish_pic", updateDishPic);
