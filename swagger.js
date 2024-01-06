/**
 * @openapi
 * /register/user:
 *   post:
 *     tags:
 *       - Security
 *     security:
 *       - BearerAuth: []
 *     summary: Register a user account
 *     description: Endpoint for registering a user account (Security-related)
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
 *       201:
 *         description: User registered successfully
 *       '401':
 *         description: Unauthorized, invalid credentials
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @openapi
 * /register/test/user:
 *   post:
 *     tags:
 *       - Security
 *     summary: Register a user account
 *     description: Endpoint for registering a user account (without security)
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
 *       201:
 *         description: User registered successfully
 *       '401':
 *         description: Unauthorized, invalid credentials
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @openapi
 * /login/security:
 *   post:
 *     tags:
 *       - Security
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

/**
 * @openapi
 * /view/visitor/security:
 *   get:
 *     tags:
 *       - Security
 *     summary: View all visitors (Security)
 *     description: View all visitors (requires authentication).
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: List of all visitors
 *       '401':
 *         description: Unauthorized, token missing or invalid
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @openapi
 * /delete/user/{username}:
 *   delete:
 *     tags:
 *       - Security
 *     summary: Delete a user account
 *     description: Delete a user account along with associated data (requires authentication).
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []
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

/**
 * @openapi
 * /login/user:
 *   post:
 *     tags:
 *       - User
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

/**
 * @openapi
 * /create/visitor/user:
 *   post:
 *     tags:
 *       - User
 *     summary: Create a visitor by a user
 *     description: Create a visitor record by a user (requires authentication).
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               visitorname:
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

/**
 * @openapi
 * /view/visitor/user:
 *   get:
 *     tags:
 *       - User
 *     summary: View visitors created by a user
 *     description: View all visitors created by the authenticated user (requires authentication).
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: List of visitors
 *       '401':
 *         description: Unauthorized, token missing or invalid
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @openapi
 * /delete/visitor/{visitorname}:
 *   delete:
 *     tags:
 *       - User
 *     summary: Delete a visitor created by a user
 *     description: Delete a visitor record created by the authenticated user (requires authentication).
 *     parameters:
 *       - in: path
 *         name: visitorname
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: Visitor deleted successfully
 *       '401':
 *         description: Unauthorized, token missing or invalid
 *       '404':
 *         description: Visitor not found or unauthorized
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @openapi
 * /update/visitor/{visitorname}:
 *   put:
 *     tags:
 *       - User
 *     summary: Update visitor information
 *     description: Update information of a visitor created by the authenticated user (requires authentication).
 *     security:
 *       - BearerAuth: []
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

/**
 * @openapi
 * /view/visitor/{visitorName}:
 *   get:
 *     tags:
 *       - Visitor
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
 */

/**
 * @openapi
 * /retrieve/visitorPass:
 *   post:
 *     summary: Retrieve visitor passes using username and phone number
 *     tags:
 *       - Visitor
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               phonenumber:
 *                 type: string
 *             required:
 *               - username
 *               - phonenumber
 *     responses:
 *       200:
 *         description: Successful retrieval of visitor passes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   visitorname:
 *                     type: string
 *                   checkintime:
 *                     type: string
 *                   checkouttime:
 *                     type: string
 *                   temperature:
 *                     type: number
 *                   gender:
 *                     type: string
 *                   ethnicity:
 *                     type: string
 *                   age:
 *                     type: number
 *                   phonenumber:
 *                     type: string
 *                   createdBy:
 *                     type: string
 *                   token:
 *                     type: string
 *       403:
 *         description: Forbidden, user does not have permission
 *       500:
 *         description: Internal Server Error
 */