const express = require('express')
const users_dal = require('../dals/users_dal')
const logger = require('../logger/my_logger')
const router = express.Router()

/**
* @swagger
 * components:
 *   schemas:
 *     user:
 *       type: object
 *       required:
 *         - id
 *         - firstname
 *         - lastname
 *         - email
 *         - date_of_birth
 *         - address
 *         - password
 *       properties:
 *         id:
 *           type: number
 *           description: The auto-generated ID of the user
 *         firstname:
 *           type: string
 *           description: The user's first name
 *         lastname:
 *           type: string
 *           description: The user's last name
 *         email:
 *           type: string
 *           description: The user's email address
 *         date_of_birth:
 *           type: date
 *           description: The user's date of birth
 *         password:
 *           type: string
 *           description: The user's encrypted password
 *       example:
 *         firstname: John
 *         lastname: Doe
 *         email: john.doe@example.com
 *         date_of_birth: 1.1.2001
 *         address: maccabim 20
 *         password: kfjashjdhfsd
 */

// '/api/users'
// GET 
/**
*  @swagger
*   /api/users/:
*     get:
*       summary: List all of the users
*       responses:
*         200:
*           description: The list of users.
*           content:
*             application/json:
*               schema:
*                 $ref: '#/components/schemas/user'
*         404:
*           description: users not found.
*           content:
*             application/json:
*               example:
*                 error: get users failed
*/

// show all the users in data base
router.get('', async (request, response) => {
    const result = await users_dal.get_all_users()
    try {
        // use if statement to see if the data base got our ask
        if (result) {
            response.status(200).json(result.data)
        } else { response.status(404).json({ status: "get-users-failed" }) }
    }
    catch (e) {
        const error_number = Math.floor(Math.random() * 1000000) + 1000000
        console.log(`${error_number}: ${e.message}`)
    }
})

// GET by ID
/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get an user by ID
 *     description: Retrieve user details based on the provided ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful response with the user details.
 *         content:
 *           application/json:
 *             example:
 *               firstname: John
 *               lastname: Doe
 *               email: john.doe@example.com
 *               date_of_birth: 1.1.2001
 *               address: maccabim 20
 *               password: kfjashjdhfsd
 *       404:
 *         description: user not found with the specified ID.
 *         content:
 *           application/json:
 *             example:
 *               error: user {id} not found
 */

// show user with id
router.get('/:id', async (request, response) => {
    try {
        const id = request.params.id
        const result = await users_dal.get_user_by_id(id)
        // use if statement to see if the data base got our ask
        if (result) {
            response.status(200).json(result.data)
        } else {
            response.status(404).json({ error: `user-${id}-not-found` })
        }
    }
    catch (e) {
        const error_number = Math.floor(Math.random() * 1000000) + 1000000
        console.log(`${error_number}: ${e.message}`)
    }
})

// POST
/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     description: Create a new user record with the provided details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *                 description: The first name of the user.
 *               lastname:
 *                 type: string
 *                 description: The last name of the user.
 *               email:
 *                 type: string
 *                 description: The email of the user.
 *               date_of_birth:
 *                 type: date
 *                 description: The date of birth of the user.
 *               address:
 *                 type: string
 *                 description: The address of the user.
 *               password:
 *                 type: string
 *                 description: The password of the user.
 *             example:
 *               firstname: John
 *               lastname: Doe
 *               email: john.doe@example.com
 *               date_of_birth: 1.1.2001
 *               address: maccabim 20
 *               password: kfjashjdhfsd
 *     responses:
 *       201:
 *         description: user created successfully.
 *         content:
 *           application/json:
 *             example:
 *               new_user:
 *                   id: 3
 *                   firstname: John
 *                   lastname: Doe
 *                   email: john.doe@example.com
 *                   date_of_birth: 1.1.2001
 *                   address: maccabim 20
 *                   password: kfjashjdhfsd
 *               url: /api/users/3
 *       404:
 *         description: Bad request. Ensure all required fields are provided.
 *         content:
 *           application/json:
 *             example:
 *               error: insert user failed.
 */

// tell the data base to insert the new user
router.post('', async (request, response) => {
    const new_user = request.body
    const result = await users_dal.insert_user(new_user)
    try {
        // use if statement to see if the data base got our ask
        if (result) {
            response.status(201).json({ new_user: result.data, url: `/api/users/${result.data.id}` })
        } else { response.status(404).json({ status: "insert-user-failed" }) }
    }
    catch (e) {
        const error_number = Math.floor(Math.random() * 1000000) + 1000000
        console.log(`${error_number}: ${e.message}`)
    }
})

// DELETE
/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user by ID
 *     description: Delete the user record with the specified ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: user deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               error: user deleted
 *       404:
 *         description: user not found with the specified ID.
 *         content:
 *           application/json:
 *             example:
 *               error: delete user failed
 */

// tell the data base to delete a user
router.delete('/:id', async (request, response) => {
    const id = request.params.id
    const result = await users_dal.delete_user(id)
    try {
        // use if statement to see if the data base got our ask
        if (result) {
            response.status(200).json({ result: "user-deleted" })
        } else { response.status(404).json({ status: "delete-user-failed" }) }
    }
    catch (e) {
        const error_number = Math.floor(Math.random() * 1000000) + 1000000
        console.log(`${error_number}: ${e.message}`)
    }
})

// DELETE
/**
 * @swagger
 * /api/users/table/users-delete-table:
 *   delete:
 *     summary: Delete user's table
 *     description: Delete all the users record.
 *     responses:
 *       200:
 *         description: user's table has deleted from data base.
 *         content:
 *           application/json:
 *             example:
 *               error: table deleted
 *       404:
 *         description: delete table from data base failed,
 *         content:
 *           application/json:
 *             example:
 *               error: delete table failed
 */

// tell the data base to delete the users table
router.delete('/table/users-delete-table', async (request, response) => {
    const result = await users_dal.delete_table()
    try {
        // use if statement to see if the data base got our ask
        if (result) {
            response.status(200).json({ status: "table-deleted" })
        } else { response.status(404).json({ status: "delete-table-failed" }) }
    }
    catch (e) {
        const error_number = Math.floor(Math.random() * 1000000) + 1000000
        console.log(`${error_number}: ${e.message}`)
    }
})

// POST
/**
 * @swagger
 * /api/users/table/users-create-table:
 *   post:
 *     summary: Create the user's table
 *     description: Create the user's table in data base.
 *     responses:
 *       201:
 *         description: table created successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: table created
 *       404:
 *         description: cannot create table.
 *         content:
 *           application/json:
 *             example:
 *               error: create table failed.
 */

// tell the data base to create the users table
router.post('/table/users-create-table', async (request, response) => {
    try {
        // use if statement to see if the data base got our ask
        const result = await users_dal.create_table()
        response.status(201).json({ status: "table-created" })
    }
    catch (e) {
        const error_number = Math.floor(Math.random() * 1000000) + 1000000
        console.log(`${error_number}: ${e.message}`)
        response.status(404).json({ status: "create-table-failed" })
    }
})

// POST
/**
 * @swagger
 * /api/users/table/users-create5:
 *   post:
 *     summary: Create the 5 new users
 *     description: Create 5 new users in data base.
 *     responses:
 *       201:
 *         description: users created successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: 5 new users created
 *       404:
 *         description: cannot insert new users.
 *         content:
 *           application/json:
 *             example:
 *               error: create 5 new users failed.
 */

// tell the data base to insert the new 5 users
router.post('/table/users-create5', async (request, response) => {
    try {
        const result = await users_dal.insert_users5()
        // use if statement to see if the data base got our ask
        if (result) {
            response.status(201).json({ result: "5-new-users-created" })
        } else {
            response.status(404).json({ status: "create-5-new-users-failed" })
        }
    }
    catch (e) {
        const error_number = Math.floor(Math.random() * 1000000) + 1000000
        console.log(`${error_number}: ${e.message}`)

    }
})

// PUT
/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: update a user
 *     description: update a user with the provided details.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to update.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *                 description: The first name of the user.
 *               lastname:
 *                 type: string
 *                 description: The last name of the user.
 *               email:
 *                 type: string
 *                 description: The email of the user.
 *               date_of_birth:
 *                 type: date
 *                 description: The date of birth of the user.
 *               address:
 *                 type: string
 *                 description: The address of the user.
 *               password:
 *                 type: string
 *                 description: The password of the user.
 *             example:
 *               firstname: John
 *               lastname: Doe
 *               email: john.doe@example.com
 *               date_of_birth: 1.1.2001
 *               address: maccabim 20
 *               password: kfjashjdhfsd
 *     responses:
 *       200:
 *         description: user updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: user updated successfully
 *       404:
 *         description: Bad request. Ensure all required fields are provided.
 *         content:
 *           application/json:
 *             example:
 *               error: user not found.
 */

// tell the data base to update the user
router.put('/:id', async (request, response) => {
    const userid = request.params.id;
    const userdata = request.body;
    try {
        const result = await users_dal.update_user(userid, userdata)
        // use if statement to see if the data base got our ask
        if (result) {
            response.status(200).json({ status: "user-updated-successfully", data: result.data })
        } else {
            response.status(404).json({ error: "user-not-found" })
        }
    } catch (e) {
        const error_number = Math.floor(Math.random() * 1000000) + 1000000
        console.log(`${error_number}: ${e.message}`)
    }
})

module.exports = router