const express = require('express');
const swaggerUi = require('swagger-ui-express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 3004;

const MongoURI = process.env.MONGODB_URI;

const swaggerJSDoc = require('swagger-jsdoc');

const app = express();

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Visitor Hotel Management',
      version: '1.0.0',
      description: 'API Documentation for Your Express.js Application',
    },
    servers: [
      {
        url: 'https://testimoni.azurewebsites.net',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    tags: [
      { name: 'Security', description: 'Endpoints related to security' },
      { name: 'User', description: 'Endpoints related to user' },
      { name: 'Visitor', description: 'Endpoints related to visitor' },
    ],
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
  apis: ['swagger.js'], // Replace with the path to your Express.js app file
};

const swaggerSpec = swaggerJSDoc(options);

const uri = "mongodb+srv://afifimercurial:123456789Abc@cluster0.t5fchjy.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

client.connect().then(() => {
  console.log('Connected to MongoDB');
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.json());

// Security register the user account
app.post('/register/user', verifyToken, async (req, res) => {
  try {
    console.log(req.user);
    const result = await register(
      req.body.username,
      req.body.password,
      req.body.name,
      req.body.email,
    );

    if (result.success) {
      res.status(201).json(result); // Return JSON response
    } else {
      res.status(400).json(result); // Return JSON response
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" }); // Return JSON response
  }
});


//security login to the security account, if successfully login it will get a token for do other operation the security can do
app.post('/login/security', (req, res) => {
  console.log(req.body);
  login(req.body.username, req.body.password)
    .then(result => {
      if (result.message === 'Correct password') {
        const token = generateToken({ username: req.body.username });
        res.json({ message: 'Successful login', token });
      } else {
        res.json('Login unsuccessful');
      }
    })
    .catch(error => {
      console.error(error);
      res.status(500).json("Internal Server Error");
    });
});

//the security view all the visitor (the token is true)
app.get('/view/visitor/security', verifyToken, async (req, res) => {
  try {
    const result = await client
      .db('benr2423')
      .collection('visitor')
      .find()
      .toArray();

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server Error");
  }
});

/// security have kuasa to delete the user account after delete the user account all the visitor created by particular user also will delete
app.delete('/delete/user/:username', verifyToken, async (req, res) => {
  const username = req.params.username;

  try {
    // Delete the user
    const deleteUserResult = await client
      .db('benr2423')
      .collection('users')
      .deleteOne({ username });

    if (deleteUserResult.deletedCount === 0) {
      return res.status(404).json('User not found');
    }

    // Delete the user's documents
    const deleteDocumentsResult = await client
      .db('benr2423')
      .collection('documents')
      .deleteMany({ username });

    // Delete the visitors created by the user
    const deleteVisitorsResult = await client
      .db('benr2423')
      .collection('visitor')
      .deleteMany({ createdBy: username });

    res.json('User and associated data deleted successfully');
  } catch (error) {
    console.error(error);
    res.status(500).json('Internal Server Error');
  }
});

//user login account 
app.post('/login/user', (req, res) => {
  console.log(req.body);
  loginuser(req.body.username, req.body.password)
    .then(result => {
      if (result.message === 'Correct password') {
        const token = generateToken({ username: req.body.username });
        res.json({ message: 'Successful login', token });
      } else {
        res.json('Login unsuccessful');
      }
    })
    .catch(error => {
      console.error(error);
      res.status(500).json("Internal Server Error");
    });
});

///user create visitor 
app.post('/create/visitor/user', verifyToken, async (req, res) => {
  const createdBy = req.user.username; // Get the username from the decoded token
  let result = createvisitor(
    req.body.visitorname,
    req.body.checkintime,
    req.body.checkouttime,
    req.body.temperature,
    req.body.gender,
    req.body.ethnicity,
    req.body.age,
    req.body.phonenumber,
    createdBy
  );   
  res.json(result);
});

///view visitor that has been create by particular user 
app.get('/view/visitor/user', verifyToken, async (req, res) => {
  try {
    const username = req.user.username; // Get the username from the decoded token
    const result = await client
      .db('benr2423')
      .collection('visitor')
      .find({ createdBy: username }) // Retrieve visitors created by the authenticated user
      .toArray();

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server Error");
  }
});

/// user delete its visitor
app.delete('/delete/visitor/:visitorname', verifyToken, async (req, res) => {
  const visitorname = req.params.visitorname;
  const username = req.user.username; // Assuming the username is available in the req.user object

  try {
    // Find the visitor by visitorname and createdBy field to ensure the visitor belongs to the user
    const deleteVisitorResult = await client
      .db('benr2423')
      .collection('visitor')
      .deleteOne({ visitorname: visitorname, createdBy: username });

    if (deleteVisitorResult.deletedCount === 0) {
      return res.status(404).json('Visitor not found or unauthorized');
    }

    res.json('Visitor deleted successfully');
  } catch (error) {
    console.error(error);
    res.status(500).json('Internal Server Error');
  }
});
/// user update its visitor info
app.put('/update/visitor/:visitorname', verifyToken, async (req, res) => {
  const visitorname = req.params.visitorname;
  const username = req.user.username;
  const { checkintime, checkouttime,temperature,gender,ethnicity,age,phonenumber } = req.body;

  try {
    const updateVisitorResult = await client
      .db('benr2423')
      .collection('visitor')
      .updateOne(
        { visitorname, createdBy: username },
        { $set: { checkintime, checkouttime,temperature,gender,ethnicity,age,phonenumber } }
      );

    if (updateVisitorResult.modifiedCount === 0) {
      return res.status(404).json('Visitor not found or unauthorized');
    }

    res.json('Visitor updated successfully');
  } catch (error) {
    console.error(error);
    res.status(500).json('Internal Server Error');
  }
});

/// visitor can view their data by insert their name
app.get('/view/visitor/:visitorName', async (req, res) => {
  const visitorName = req.params.visitorName;

  try {
    const result = await client
      .db('benr2423')
      .collection('visitor')
      .findOne({ visitorname: visitorName });

    if (result) {
      res.json(result);
    } else {
      res.status(404).json('Visitor not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).json('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

async function login(reqUsername, reqPassword) {
  const matchUser = await client.db('benr2423').collection('security').findOne({ username: { $eq: reqUsername } });

  if (!matchUser)
    return { message: "User not found!" };

  console.log('Provided Password:', reqPassword);
  console.log('Stored Password:', matchUser.password);

  if (matchUser.password === reqPassword)
    return { message: "Correct password", user: matchUser };
  else
    return { message: "Invalid password" };
}

async function loginuser(reqUsername, reqPassword) {
  let matchUser = await client.db('benr2423').collection('users').findOne({ username: { $eq: reqUsername } });

  if (!matchUser)
    return { message: "User not found!" };

  console.log('Provided Password:', reqPassword);
  console.log('Stored Password:', matchUser.password);

  if (matchUser.password === reqPassword)
    return { message: "Correct password", user: matchUser };
  else
    return { message: "Invalid password" };
}

function register(reqUsername, reqPassword, reqName, reqEmail) {
  client.db('benr2423').collection('users').insertOne({
    "username": reqUsername,
    "password": reqPassword,
    "name": reqName,
    "email": reqEmail,
  });

  return { success: true, message: "Account created" };
}
///create visitor 
function createvisitor(reqVisitorname, reqCheckintime, reqCheckouttime,reqTemperature,reqGender,reqEthnicity,reqAge,ReqPhonenumber, createdBy) {
  client.db('benr2423').collection('visitor').insertOne({
    "visitorname": reqVisitorname,
    "checkintime": reqCheckintime,
    "checkouttime": reqCheckouttime,
    "temperature":reqTemperature,
    "gender":reqGender,
    "ethnicity":reqEthnicity,
    "age":reqAge,
    "phonenumber":ReqPhonenumber,
    "createdBy": createdBy // Add the createdBy field with the username
  });
  return "visitor created";
}


function generateToken(userData) {
  const token = jwt.sign(
    userData,
    'mypassword',
    { expiresIn: 60 }
  );

  console.log(token);
  return token;
}

function verifyToken(req, res, next) {
  const header = req.headers.authorization;
  if (!header) {
    res.status(401).json('Unauthorized');
    return;
  }

  const token = header.split(' ')[1];

  jwt.verify(token, 'mypassword', function (err, decoded) {
    if (err) {
      res.status(401).json('Unauthorized');
      return;
    }
    req.user = decoded;
    next();
  });
}