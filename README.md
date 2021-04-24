# Splitwise_lab2

<b>Steps to deploy the application:</b>

<b>Front End:</b>

Clone the repository's front end folder into any machine having node.js installed on it.\
Open the terminal in the folder "Frontend".\
Execute "npm install" to install all the dependencies.\
Update the Server.js file in Frontend/src folder with the backend server's IP address and port.\
Execute "npm start" to run the front end server.


<b>Backend:</b>

Before running the backend, install Zookeeper and Kafka.\
Start the zookeeper by executing bin/zookeeper-server-start.sh config/zookeeper.properties\
Start the kafka environment by executing bin/kafka-server-start.sh config/server.properties\
Create all the necessary topics for kafka.\
Open the Backend folder and run "npm install" to install all the dependencies.\
start the backend by running npx nodemon index.js\
Open the folder "Kafka_backend"in the terminal and start the server.js file.\
Now the Backend and Kafka_Backend will start running. 

<b>Launch the application:</b>

Open the browser and navigate to Front end server's IP address with Port number (Eg: 127.0.0.1:3000) to find the landing page.
