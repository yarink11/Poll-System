const express = require('express')
const answers_dal = require('../dals/answers_dal')
const router = express.Router()
const logger = require('../logger/my_logger')

/**
* @swagger
 * components:
 *   schemas:
 *     answer:
 *       type: object
 *       required:
 *         - id
 *         - userid
 *         - questionid
 *         - answerdate
 *         - selectedanswer
 *       properties:
 *         id:
 *           type: number
 *           description: The auto-generated ID of the answer
 *         userid:
 *           type: number
 *           description: The auto-generated ID of the answer
 *         questionid:
 *           type: number
 *           description: The auto-generated ID of the question
 *         answerdate:
 *           type: date
 *           description: The user's date of answer
 *         selectedanswer:
 *           type: number
 *           description: The user's answer on question
 *       example:
 *         userid: 1
 *         questionid: 2
 *         answerdate: 1.1.2001
 *         selectedanswer: 2
 */

// '/api/answers'
// GET 
/**
*  @swagger
*   /api/answers/:
*     get:
*       summary: List all of the answers
*       responses:
*         "200":
*           description: The list of answers.
*           content:
*             application/json:
*               schema:
*                 $ref: '#/components/schemas/answer'
*/

// tell the data base to show us all the answers
router.get('', async (request, response) => {
    try {
        const result = await answers_dal.get_all_answers()
        // use if statement to see if the data base got our ask
        if (result) {
            response.status(200).json(result.data)
        } else { response.status(404).json({ status: "get-answers-failed" }) }
    }
    catch (e) {
        const error_number = Math.floor(Math.random() * 1000000) + 1000000
        console.log(`${error_number}: ${e.message}`)
    }
})

// POST
/**
 * @swagger
 * /api/answers:
 *   post:
 *     summary: Create a new answer
 *     description: Create a new answer record with the provided details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                  userid:
 *                      type: number
 *                      description: The auto-generated ID of the answer
 *                  questionid:
 *                      type: number
 *                      description: The auto-generated ID of the question
 *                  answerdate:
 *                      type: date
 *                      description: The user's date of answer
 *                  selectedanswer:
 *                      type: number
 *                      description: The user's answer on question
 *             example:
 *               userid: 1
 *               questionid: 2
 *               answerdate: 1.1.2001
 *               selectedanswer: 2
 *     responses:
 *       201:
 *         description: user created successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: Added to the data base . User ID = 1, Answer = 2
 *               new_answer:
 *                   id: 3
 *                   userid: 1
 *                   questionid: 2
 *                   answerdate: 25.6.2024, 1:22:53
 *                   selectedanswer: 2
 *               url: /api/answers/{id}
 *       404:
 *         description: Bad request. Ensure all required fields are provided.
 *         content:
 *           application/json:
 *             example:
 *               error: insert answer failed.
 *       409:
 *         description: the user has already answered this question.
 *         content:
 *           application/json:
 *             example:
 *               error: User has already answered this question.
 */

// tell the data base to insert the new user's answer 
router.post('', async (request, response) => {
    try {
        const new_answer = request.body
        // Checking if answer already exists for the user
        const existinganswer = await answers_dal.get_answer_by_user_and_question(new_answer.userid, new_answer.questionid)
        if (existinganswer) {
            // In this case answer already exists for the user
            response.status(409).json({ error: 'User has already answered this question.' })
        } else {
            // In this case we will insert the new answer for the user
            const result = await answers_dal.insert_answer(new_answer)
            response.status(201).json({
                status: `Added to the data base . User ID = ${new_answer.userid}, Answer = ${new_answer.selectedanswer}`, new_answer: result.data, url: `/api/answers/${result.data.id}`
            })
        }
    } catch (e) {
        const error_number = Math.floor(Math.random() * 1000000) + 1000000;
        console.log(`${error_number}: ${e.message}`)
        response.status(404).json({ status: "insert-new-answer-failed" })
    }
})

// DELETE
/**
 * @swagger
 * /api/answers/table/answers-delete-table:
 *   delete:
 *     summary: Delete answer's table
 *     description: Delete all the answers record.
 *     responses:
 *       200:
 *         description: answer's table has deleted from data base.
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

// tell the data base to delete the answers table
router.delete('/table/answers-delete-table', async (request, response) => {
    try {
        const result = await answers_dal.delete_table()
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
 * /api/answers/table/answers-create-table:
 *   post:
 *     summary: Create the answer's table
 *     description: Create the answer's table in data base.
 *     responses:
 *       201:
 *         description: table created successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: table created
 *       404:
 *         description: cannot create table. Ensure all required data.
 *         content:
 *           application/json:
 *             example:
 *               error: create table failed.
 */

// tell the data base to create the answers table
router.post('/table/answers-create-table', async (request, response) => {
    try {
        const result = await answers_dal.create_table()
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
 * /api/answers/table/answers-create5:
 *   post:
 *     summary: Create the 5 new answers
 *     description: Create 5 new answers in data base.
 *     responses:
 *       201:
 *         description: answers created successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: 5 new answers created
 *       404:
 *         description: cannot insert new answers.
 *         content:
 *           application/json:
 *             example:
 *               error: create 5 new answers failed.
 */

// tell the data base to insert 5 new answers to the table
router.post('/table/answers-create5', async (request, response) => {
    try {
        const result = await answers_dal.insert_answers5()
        response.status(201).json({ result: "5-new-answers-created" })
    }
    catch (e) {
        const error_number = Math.floor(Math.random() * 1000000) + 1000000
        console.log(`${error_number}: ${e.message}`)
        response.status(404).json({ status: "create-5-new-answers-failed" })
    }
})

module.exports = router