
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,QueryCommand
} = require("@aws-sdk/lib-dynamodb");
const express = require("express");
const cors = require('cors');
const config=require('./config/index')
const cookieParser = require('cookie-parser');
const serverless = require("serverless-http");
const validation=require('./validation')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const loggerMiddleware = require('./middleware/loggerMiddleware');
const { v4: uuidv4 } = require('uuid');
const authMiddleware = require("./middleware/authMiddleware");

const app = express();
app.use(loggerMiddleware);
const USERS_TABLE = process.env.USERS_TABLE;
const client = new DynamoDBClient();
const dynamoDbClient = DynamoDBDocumentClient.from(client);

app.use(cors());
app.use(express.json());
app.use(cookieParser());




app.get("/users/:userId",authMiddleware, async function (req, res) {
  const params = {
    TableName: USERS_TABLE,
    Key: {
      userId: req.params.userId,
    },
  };

  try {
    const { Item } = await dynamoDbClient.send(new GetCommand(params));
    if (Item) {
      res.json(Item);
    } else {
      res
        .status(404)
        .json({ error: 'Could not find user with provided "userId"' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not retreive user" });
  }
});




app.post("/users", async function (req, res) {
  let { userName, email, firstName, lastName, phoneNumber, mobileNumber, country, state,password,dob } = req.body;
 
  console.log('body of request ',JSON.stringify(req.body))
  const userId = uuidv4();
  const error=validation.validate(req.body)
  // Hash the password using bcryptjs
  const hashedPassword = await bcrypt.hash(password, 10);
  if (Object.keys(error).length>0) {
    return res.status(400).json({ error: error });
  } 

  const params = {
    TableName: USERS_TABLE,
    Item: {
      userId: userId,
      userName: userName,
      email: email,
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber,
      mobileNumber: mobileNumber,
      country: country,
      state: state,
      dob:dob,
      password:hashedPassword
    }
  };
  const userNameparams = {
    TableName: USERS_TABLE,
    IndexName: 'UserNameIndex',
    KeyConditionExpression: 'userName = :userName',
    ExpressionAttributeValues: {
      ':userName': userName,
    },
  };

const queryCommand = new QueryCommand(userNameparams);
const resultofsameUserName = await dynamoDbClient.send(queryCommand);
  if (resultofsameUserName?.Items && resultofsameUserName?.Items.length > 0) {
    return res.status(400).json({ error: {userName:'userName already exist'} });
  }
  const emailparams = {
    TableName: USERS_TABLE,
    IndexName: 'EmailIndex',
    KeyConditionExpression: 'email = :email',
    ExpressionAttributeValues: {
      ':email': email,
    },
  };

const queryemailCommand = new QueryCommand(emailparams);
  const resultofsameEmail = await dynamoDbClient.send(queryemailCommand);
  if (resultofsameEmail?.Items && resultofsameEmail?.Items.length > 0) {
    return res.status(400).json({ error: {email:'email already exist'} });
  }
  try {
    const result=await dynamoDbClient.send(new PutCommand(params));
    res.json({ userId, userName});
  } catch (error) {
    console.log(error);
     res.status(500).json({ error: "Could not create user" });
  }
});




app.post('/login', async (req, res) => {
  const { userName, password } = req.body;
  const userNameparams = {
    TableName: USERS_TABLE,
    IndexName: 'UserNameIndex',
    KeyConditionExpression: 'userName = :userName',
    ExpressionAttributeValues: {
      ':userName': userName,
    },
  };

  try {
const queryCommand = new QueryCommand(userNameparams);
const resultofsameUserName = await dynamoDbClient.send(queryCommand);
if(username=resultofsameUserName?.Items?.length>0){
  const user=resultofsameUserName?.Items[0]
const username=resultofsameUserName?.Items[0].userName
  const hashedPassword=resultofsameUserName?.Items[0].password
  const passwordMatch = await bcrypt.compare(password, hashedPassword);
  if (userName === username && passwordMatch) {
    const token = jwt.sign({ userName }, config.jwt_secret, { expiresIn: '15m' });
    res.cookie('token', token, { httpOnly: true });
    res.json({ message:'login successfully',user});
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
}

else{
  res.status(400).json({ message: 'userName not exist' });
}

  } catch (error) {
    console.log(error)
  }

});




app.post('/logout', async (req, res) => {
  try {
    res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.log(error)
  }
  
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});


const handler = serverless(app);

module.exports = { app, handler };