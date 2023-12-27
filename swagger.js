/**
 * @openapi
 * /register/user:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user with the provided information.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       '200':
 *         description: User registered successfully
 *       '400':
 *         description: Bad request, check the request payload
 *       '500':
 *         description: Internal Server Error
 */
app.post('/register/user', verifyToken, async (req, res) => {
    let result = register(
      req.body.username,
      req.body.password,
      req.body.name,
      req.body.email,
    );
  
    res.send(result);
  });
  /**
 * @swagger
 * /protected/endpoint:
 *   get:
 *     security:
 *       - BearerAuth: []
 *     summary: Example of a protected endpoint.
 *     description: This endpoint requires a Bearer token.
 *     responses:
 *       '200':
 *         description: A successful response.
 */
  
  /**
   * @openapi
   * /login/security:
   *   post:
   *     summary: Login to security account
   *     description: Log in to the security account and receive a token for further operations.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               username:
   *                 type: string
   *               password:
   *                 type: string
   *     responses:
   *       '200':
   *         description: Successful login, returns a token
   *       '401':
   *         description: Unauthorized, invalid credentials
   *       '500':
   *         description: Internal Server Error
   */
  app.post('/login/security', (req, res) => {
    console.log(req.body);
    login(req.body.username, req.body.password)
      .then(result => {
        if (result.message === 'Correct password') {
          const token = generateToken({ username: req.body.username });
          res.send({ message: 'Successful login', token });
        } else {
          res.send('Login unsuccessful');
        }
      })
      .catch(error => {
        console.error(error);
        res.status(500).send("Internal Server Error");
      });
  });
  
  /**
   * @openapi
   * /view/visitor/security:
   *   get:
   *     summary: View all visitors (Security)
   *     description: View all visitors (requires authentication).
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       '200':
   *         description: List of all visitors
   *       '401':
   *         description: Unauthorized, token missing or invalid
   *       '500':
   *         description: Internal Server Error
   */
  app.get('/view/visitor/security', verifyToken, async (req, res) => {
    try {
      const result = await client
        .db('benr2423')
        .collection('visitor')
        .find()
        .toArray();
  
      res.send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });
  
/**
 * @openapi
 * /delete/user/{username}:
 *   delete:
 *     summary: Delete a user account
 *     description: Delete a user account along with associated data (requires authentication).
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: User and associated data deleted successfully
 *       '401':
 *         description: Unauthorized, token missing or invalid
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal Server Error
 */
app.delete('/delete/user/:username', verifyToken, async (req, res) => {
    const username = req.params.username;
  
    try {
      // ... (existing code)
      
      res.send('User and associated data deleted successfully');
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  /**
   * @openapi
   * /login/user:
   *   post:
   *     summary: Login to user account
   *     description: Log in to the user account and receive a token for further operations.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               username:
   *                 type: string
   *               password:
   *                 type: string
   *     responses:
   *       '200':
   *         description: Successful login, returns a token
   *       '401':
   *         description: Unauthorized, invalid credentials
   *       '500':
   *         description: Internal Server Error
   */
  app.post('/login/user', (req, res) => {
    console.log(req.body);
    loginuser(req.body.username, req.body.password)
      .then(result => {
        if (result.message === 'Correct password') {
          const token = generateToken({ username: req.body.username });
          res.send({ message: 'Successful login', token });
        } else {
          res.send('Login unsuccessful');
        }
      })
      .catch(error => {
        console.error(error);
        res.status(500).send("Internal Server Error");
      });
  });
  
  // ... (continue with similar annotations for other routes)
  
  /**
   * @openapi
   * /view/visitor/{visitorName}:
   *   get:
   *     summary: View visitor by name
   *     description: View details of a visitor by their name.
   *     parameters:
   *       - in: path
   *         name: visitorName
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       '200':
   *         description: Details of the visitor
   *       '404':
   *         description: Visitor not found
   *       '500':
   *         description: Internal Server Error
   */
  app.get('/view/visitor/:visitorName', async (req, res) => {
    const visitorName = req.params.visitorName;
  
    try {
      // ... (existing code)
  
      res.send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  // ... (continue with similar annotations for other routes)
/**
 * @openapi
 * /create/visitor/user:
 *   post:
 *     summary: Create a visitor by a user
 *     description: Create a visitor record by a user (requires authentication).
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               visitorname:
 *                 type: string
 *               checkintime:
 *                 type: string
 *               checkouttime:
 *                 type: string
 *               temperature:
 *                 type: number
 *               gender:
 *                 type: string
 *               ethnicity:
 *                 type: string
 *               age:
 *                 type: number
 *               phonenumber:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Visitor created successfully
 *       '401':
 *         description: Unauthorized, token missing or invalid
 *       '500':
 *         description: Internal Server Error
 */
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
    res.send(result);
  });
  
  /**
   * @openapi
   * /view/visitor/user:
   *   get:
   *     summary: View visitors created by a user
   *     description: View all visitors created by the authenticated user (requires authentication).
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       '200':
   *         description: List of visitors
   *       '401':
   *         description: Unauthorized, token missing or invalid
   *       '500':
   *         description: Internal Server Error
   */
  app.get('/view/visitor/user', verifyToken, async (req, res) => {
    try {
      const username = req.user.username; // Get the username from the decoded token
      const result = await client
        .db('benr2423')
        .collection('visitor')
        .find({ createdBy: username }) // Retrieve visitors created by the authenticated user
        .toArray();
  
      res.send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });
  
  // ... (continue with similar annotations for other routes)
  
  /**
   * @openapi
   * /update/visitor/{visitorname}:
   *   put:
   *     summary: Update visitor information
   *     description: Update information of a visitor created by the authenticated user (requires authentication).
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: visitorname
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               checkintime:
   *                 type: string
   *               checkouttime:
   *                 type: string
   *               temperature:
   *                 type: number
   *               gender:
   *                 type: string
   *               ethnicity:
   *                 type: string
   *               age:
   *                 type: number
   *               phonenumber:
   *                 type: string
   *     responses:
   *       '200':
   *         description: Visitor updated successfully
   *       '401':
   *         description: Unauthorized, token missing or invalid
   *       '404':
   *         description: Visitor not found or unauthorized
   *       '500':
   *         description: Internal Server Error
   */
  app.put('/update/visitor/:visitorname', verifyToken, async (req, res) => {
    const visitorname = req.params.visitorname;
    const username = req.user.username;
    const { checkintime, checkouttime, temperature, gender, ethnicity, age, phonenumber } = req.body;
  
    try {
      const updateVisitorResult = await client
        .db('benr2423')
        .collection('visitor')
        .updateOne(
          { visitorname, createdBy: username },
          { $set: { checkintime, checkouttime, temperature, gender, ethnicity, age, phonenumber } }
        );
  
      if (updateVisitorResult.modifiedCount === 0) {
        return res.status(404).send('Visitor not found or unauthorized');
      }
  
      res.send('Visitor updated successfully');
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  
/**
 * @openapi
 * /view/visitor/{visitorName}:
 *   get:
 *     summary: View visitor details
 *     description: View details of a specific visitor by name.
 *     parameters:
 *       - in: path
 *         name: visitorName
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Visitor details
 *       '404':
 *         description: Visitor not found
 *       '500':
 *         description: Internal Server Error
 */
app.get('/view/visitor/:visitorName', async (req, res) => {
    const visitorName = req.params.visitorName;
  
    try {
      const result = await client
        .db('benr2423')
        .collection('visitor')
        .findOne({ visitorname: visitorName });
  
      if (result) {
        res.send(result);
      } else {
        res.status(404).send('Visitor not found');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  // Start the Express.js server
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
  
  // ... (continue with other route annotations if needed)
  
    
  