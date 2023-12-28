/**
 * @openapi
 * tags:
 *   - name: Security
 *     description: Endpoints related to security
 *   - name: User
 *     description: Endpoints related to user
 *   - name: Visitor
 *     description: Endpoints related to visitor
 * /register/user:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user with the provided information.
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
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       '201':
 *         description: User registered successfully
 *       '400':
 *         description: Bad request, check the request payload
 *       '500':
 *         description: Internal Server Error
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

/**
 * @openapi
 * /view/visitor/security:
 *   get:
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

/**
 * @openapi
 * /view/visitor/user:
 *   get:
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
 *     summary: Update visitor information
 *     description: Update information of a visitor created by the authenticated user (requires authentication).
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
