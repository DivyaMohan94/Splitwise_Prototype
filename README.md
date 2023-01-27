# Splitwise_Prototype

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

<b>Screenshots of the application:</b>
![image](https://user-images.githubusercontent.com/77031080/153686488-d7ac4c85-ea37-41e3-9f95-cd81d837e925.png)

![image](https://user-images.githubusercontent.com/77031080/153686523-18bb7c6f-2fcb-4704-815a-01376f115c6f.png)


![image](https://user-images.githubusercontent.com/77031080/153686552-f7b09c4c-ac4e-4657-ae0c-c853d1f9f48d.png)


![image](https://user-images.githubusercontent.com/77031080/153686578-97b29eb6-eaa2-41c6-9197-5962a88fa4c7.png)


![image](https://user-images.githubusercontent.com/77031080/153686608-78f3b8bf-8ebf-42f6-804a-d5071c9977b1.png)


![image](https://user-images.githubusercontent.com/77031080/153686646-27e123e8-cc48-41fe-be17-8bdd0fd279b9.png)


