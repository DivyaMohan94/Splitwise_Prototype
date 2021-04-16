/* eslint-disable camelcase */
const rpc = new (require('./kafkarpc'))();

// make request to kafka
function make_request(queue_name, msg_payload, callback) {
  console.log('in make request', queue_name);
  // console.log(msg_payload);
  rpc.makeRequest(queue_name, msg_payload, (err, response) => {
    if (err) { console.error('myerr', err); callback(err, null); } else {
      // console.log("response", response);
      callback(null, response);
    }
  });
}

exports.make_request = make_request;
