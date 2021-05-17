const config = {
  secret: 'cmpe273_Splitwise',
  api_local: 'http://localhost:3000',
  mongoURI: 'mongodb+srv://admin:12345@cluster0.3rxrp.mongodb.net/splitwise?retryWrites=true&w=majority',

  url: 'localhost',

  awsBucket: "cmpe273splitwise",
  // Keys can't be added here because AWS categorizes this as vulnerability.
  awsAccessKey: "",
  awsSecretAccessKey: "",
  awsPermission: "public-read",
};

module.exports = config;
