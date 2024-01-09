const express = require('express');
const swaggerUi = require('swagger-ui-express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 3004;
const moment = require('moment-timezone');

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
app.post('/register/user', verifySecurityToken, async (req, res) => {
  try {
    const userData = {
      username: req.body.username,
      password: req.body.password,
      name: req.body.name,
      email: req.body.email,
    };

    // Check if the password is strong
    if (!isStrongPassword(userData.password)) {
      return res.status(400).json({ success: false, message: "Password is not strong enough." });
    }

    const result = await register(userData);

    if (result.success) {
      res.status(201).json(result); // Return JSON response
    } else {
      res.status(401).json(result); // Return JSON response
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" }); // Return JSON response
  }
});

// Testing without Security to register the user account
app.post('/register/test/user', async (req, res) => {
  try {
    const userData = {
      username: req.body.username,
      password: req.body.password,
      name: req.body.name,
      email: req.body.email,
    };

    // Check if the password is strong
    if (!isStrongPassword(userData.password)) {
      return res.status(400).json({ success: false, message: "Password is not strong enough." });
    }

    const result = await register(userData);

    if (result.success) {
      res.status(201).json(result); // Return JSON response
    } else {
      res.status(401).json(result); // Return JSON response
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
        const token = generateSecurityToken({ username: req.body.username });
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
app.get('/view/visitor/security', verifySecurityToken, async (req, res) => {
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

app.get('/view/user/security', verifySecurityToken, async (req, res) => {
  try {
    const result = await client
      .db('benr2423')
      .collection('users')
      .find()
      .toArray();

    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

/// security have kuasa to delete the user account after delete the user account all the visitor created by particular user also will delete
app.delete('/delete/user/:username', verifySecurityToken, async (req, res) => {
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
        const token = generateUserToken({ username: req.body.username });
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
app.post('/create/visitor/user', verifyUserToken, async (req, res) => {
  const createdBy = req.user.username;

  // Use the Date object to get the current time in UTC
  const nowUtc = new Date();

  // Calculate the offset for GMT+8 (480 minutes ahead of UTC)
  const offsetMinutes = 8 * 60;
  const gmtPlus8Time = new Date(nowUtc.getTime() + offsetMinutes * 60 * 1000);

  const checkinTime = gmtPlus8Time.toISOString();
  
  // Example: Check out 12 hours later
  const checkoutTime = new Date(gmtPlus8Time.getTime() + 12 * 60 * 60 * 1000).toISOString();

  try {
    // Call the createvisitor function asynchronously and await its result
    const result = await createvisitor(
      req.body.visitorname,
      checkinTime,
      checkoutTime,
      req.body.temperature,
      req.body.gender,
      req.body.ethnicity,
      req.body.age,
      req.body.phonenumber,
      createdBy
    );

    // Send the response after getting the result
    res.json(result);
  } catch (error) {
    // Handle errors and send an error response
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
});

///view visitor that has been create by particular user 
app.get('/view/visitor/user', verifyUserToken, async (req, res) => {
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
app.delete('/delete/visitor/:visitorname', verifyUserToken, async (req, res) => {
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
app.put('/update/visitor/:visitorname', verifyUserToken, async (req, res) => {
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

// visitor pass
app.get('/get/user/visitorPass', verifySecurityToken, async (req, res) => {
  try {
    // The verifyToken middleware will authenticate the user first.
    // Once authenticated, we expect the visitorToken to be part of the query parameters.

    const visitorToken = req.query.visitorToken; // Retrieve the visitorToken from query parameters

    if (!visitorToken) {
      // If visitorToken is not provided, send a request for it.
      return res.status(400).json({ success: false, message: 'Visitor token is required.' });
    }

    // Find the user associated with the visitor token
    const user = await client.db('benr2423').collection('users').findOne({
      "visitors.visitorToken": visitorToken
    });

    if (user) {
      // Respond with the user's phone number
      res.json({ success: true, visitor_of: user.username });

      // Update the checkout time for the visitor in the 'visitor' collection
      const nowUtc = new Date();
      const offsetMinutes = 8 * 60; // GMT+8
      const gmtPlus8Time = new Date(nowUtc.getTime() + offsetMinutes * 60 * 1000);
      const checkoutTime = gmtPlus8Time.toISOString();

      await client.db('benr2423').collection('visitor').updateOne(
        { "visitorToken": visitorToken },
        { $set: { "checkouttime": checkoutTime } }
      );

      // Remove the visitor data from the user's document
      await client.db('benr2423').collection('users').updateOne(
        { _id: user._id },
        { $pull: { visitors: { visitorToken: visitorToken } } }
      );

    } else {
      res.status(404).json({ success: false, message: 'User not found for the provided token.' });
    }
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      // Handle invalid token
      console.error('Token verification error:', error.message);
      res.status(401).json({ success: false, message: 'Invalid token.' });
    } else {
      // Handle other errors
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
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

//retrieve token
app.post('/retrieve/visitorPass', async (req, res) => {
  const { visitorname, phonenumber } = req.body;

  try {
    // Use aggregation pipeline to match the user document and filter the visitors array
    const pipeline = [
      {
        $match: {
          "visitors.visitorname": visitorname,
          "visitors.phonenumber": phonenumber
        }
      },
      {
        $project: {
          visitors: {
            $filter: {
              input: "$visitors",
              as: "visitor",
              cond: {
                $and: [
                  { $eq: ["$$visitor.visitorname", visitorname] },
                  { $eq: ["$$visitor.phonenumber", phonenumber] }
                ]
              }
            }
          },
          _id: 0
        }
      }
    ];

    const [result] = await client.db('benr2423').collection('users').aggregate(pipeline).toArray();

    if (result && result.visitors.length > 0) {
      // Assuming there is only one match, take the first element of the array
      const visitor = result.visitors[0];
      res.json({ success: true, visitorToken: visitor.visitorToken });
    } else {
      res.status(404).json({ success: false, message: 'Visitor not found or no token exists.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
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

// Update the register function to accept a single userData object
async function register(userData) {
  try {
    // Basic input validation
    if (!userData.username || !userData.password || !userData.name || !userData.email) {
      throw new Error('Incomplete user data. Please provide all required fields.');
    }

     // Check if the password is strong
     if (!isStrongPassword(userData.password)) {
      throw new Error('Password is not strong enough. It must have at least one capital letter, one non-capital letter, one symbol, and one number.');
    }

    // Check if the username is already taken
    const existingUser = await client.db('benr2423').collection('users').findOne({ username: userData.username });
    if (existingUser) {
      throw new Error('Username is already taken. Please choose a different username.');
    }

    // Insert the user data into the database
    const result = await client.db('benr2423').collection('users').insertOne(userData);

    // Check if the insertion was successful
    if (!result.acknowledged) {
      throw new Error('Failed to create the user account.');
    }

    // Return success message
    return { success: true, message: "Account created" };
  } catch (error) {
    // Return detailed error message in case of any issues
    return { success: false, message: error.message };
  }
}
///create visitor 
// Update the createvisitor function to generate a visitor token
async function createvisitor(reqVisitorname, reqCheckintime, reqCheckouttime, reqTemperature, reqGender, reqEthnicity, reqAge, ReqPhonenumber, createdBy) {
  try {
    // Generate a token for the visitor pass
    const visitorPassToken = generateVisitorToken({
      "visitorname": reqVisitorname,
      "checkintime": reqCheckintime,
      "checkouttime": reqCheckouttime,
      "temperature": reqTemperature,
      "gender": reqGender,
      "ethnicity": reqEthnicity,
      "age": reqAge,
      "phonenumber": ReqPhonenumber,
      "createdBy": createdBy // Add the createdBy field with the username
    });

    // Create the visitor object with the token included
    const visitor = {
      "visitorname": reqVisitorname,
      "checkintime": reqCheckintime,
      "checkouttime": reqCheckouttime,
      "temperature": reqTemperature,
      "gender": reqGender,
      "ethnicity": reqEthnicity,
      "age": reqAge,
      "phonenumber": ReqPhonenumber,
      "createdBy": createdBy,
      "visitorToken": visitorPassToken // Save the token here
    };

    // Retrieve the user's visitors using aggregation pipeline
    const userPipeline = [
      // Match the user by username
      {
        $match: {
          "username": createdBy
        }
      },
      // Project to get only the visitors array and exclude other fields
      {
        $project: {
          visitors: 1,
          _id: 0
        }
      }
    ];

    const [userResult] = await client.db('benr2423').collection('users').aggregate(userPipeline).toArray();

    if (!userResult) {
      return {
        success: false,
        statusCode: 404,
        message: "User not found",
        error: "User not found in the database"
      };
    }

    // Add the new visitor to the user's visitors array
    userResult.visitors.push(visitor);

    // Save the updated visitors array back to the 'users' collection
    await client.db('benr2423').collection('users').updateOne(
      { "username": createdBy },
      { $set: { "visitors": userResult.visitors } }
    );

    // Save the visitor data to the 'visitor' collection
    const insertResult = await client.db('benr2423').collection('visitor').insertOne(visitor);

    if (insertResult.insertedCount === 0) {
      return {
        success: false,
        statusCode: 500,
        message: "Failed to insert visitor data",
        error: "Failed to insert visitor data to the database"
      };
    }

    // Return success message along with the visitor pass token
    return {
      success: true,
      statusCode: 200,
      message: "Visitor created successfully",
      visitorPassToken: visitorPassToken
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      statusCode: 500,
      message: "Failed to create visitor",
      error: error.message
    };
  }
}

//password requirement
function isStrongPassword(password) {
  // Regular expressions for different password criteria
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>-_]/.test(password);

  // Check if all criteria are met
  return hasUpperCase && hasLowerCase && hasNumber && hasSymbol;
}


// Function to generate a security token
function generateSecurityToken(userData) {
  const token = jwt.sign(
    userData,
    'securitySecretKey',
    { expiresIn: 600 }
  );

  console.log(token);
  return token;
}

// Function to generate a user token
function generateUserToken(userData) {
  const token = jwt.sign(
    userData,
    'userSecretKey',
    { expiresIn: 600 }
  );

  console.log(token);
  return token;
}

// Function to generate a visitor token
function generateVisitorToken(visitorData) {
  const token = jwt.sign(
    visitorData,
    'visitorSecretKey'
  );

  console.log(token);
  return token;
}


// Middleware to verify security token
function verifySecurityToken(req, res, next) {
  const header = req.headers.authorization;
  if (!header) {
    res.status(401).json('Unauthorized');
    return;
  }

  const token = header.split(' ')[1];

  jwt.verify(token, 'securitySecretKey', function (err, decoded) {
    if (err) {
      res.status(401).json('Unauthorized');
      return;
    }
    req.user = decoded;
    next();
  });
}

// Middleware to verify user token
function verifyUserToken(req, res, next) {
  const header = req.headers.authorization;
  if (!header) {
    res.status(401).json('Unauthorized');
    return;
  }

  const token = header.split(' ')[1];

  jwt.verify(token, 'userSecretKey', function (err, decoded) {
    if (err) {
      res.status(401).json('Unauthorized');
      return;
    }
    req.user = decoded;
    next();
  });
}

// Middleware to verify visitor token
function verifyVisitorToken(req, res, next) {
  const header = req.headers.authorization;
  if (!header) {
    res.status(401).json('Unauthorized');
    return;
  }

  const token = header.split(' ')[1];

  jwt.verify(token, 'visitorSecretKey', function (err, decoded) {
    if (err) {
      res.status(401).json('Unauthorized');
      return;
    }
    req.visitor = decoded; // Attach decoded visitor data to req
    next();
  });
}
