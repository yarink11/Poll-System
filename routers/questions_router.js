const express = require('express')
const questions_dal = require('../dals/questions_dal')
const logger = require('../logger/my_logger')
const router = express.Router()

/**
* @swagger
 * components:
 *   schemas:
 *     question:
 *       type: object
 *       required:
 *         - id
 *         - question
 *         - firstanswer
 *         - secondanswer
 *         - thirdanswer
 *         - fourthanswer
 *       properties:
 *         id:
 *           type: number
 *           description: The auto-generated ID of the question
 *         question:
 *           type: string
 *           description: The question's title
 *         firstanswer:
 *           type: string
 *           description: The question's first answer
 *         secondanswer:
 *           type: string
 *           description: The question's second answer
 *         thirdanswer:
 *           type: string
 *           description: The question's third answer
 *         fourthanswer:
 *           type: string
 *           description: The question's fourth answer
 *       example:
 *         question: what sport you like the most
 *         firstanswer: soccer
 *         secondanswer: basketball
 *         thirdanswer: golf
 *         fourthanswer: boxing
 */

// '/api/questions'
// GET 
/**
*  @swagger
*   /api/questions/:
*     get:
*       summary: List all of the questions
*       responses:
*         "200":
*           description: The list of questions.
*           content:
*             application/json:
*               schema:
*                 $ref: '#/components/schemas/question'
*/

// tell the data base to show us all the questions
router.get('', async (request, response) => {
    try {
        const result = await questions_dal.get_all_questions()
        // use if statement to see if the data base got our ask
        if (result) {
            response.status(200).json(result.data)
        } else { response.status(404).json({ status: "get-questions-failed" }) }
    }
    catch (e) {
        const error_number = Math.floor(Math.random() * 1000000) + 1000000
        console.log(`${error_number}: ${e.message}`)
    }
})

// GET by ID
/**
 * @swagger
 * /api/questions/{id}:
 *   get:
 *     summary: Get a question by ID
 *     description: Retrieve question details based on the provided ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the question to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful response with the question details.
 *         content:
 *           application/json:
 *           example:
 *             question: what sport you like the most
 *             firstanswer: soccer
 *             secondanswer: basketball
 *             thirdanswer: golf
 *             fourthanswer: boxing
 *       404:
 *         description: question not found with the specified ID.
 *         content:
 *           application/json:
 *             example:
 *               error: question {id} not found
 */

// tell the data base to show us one question 
router.get('/:id', async (request, response) => {
    try {
        const id = request.params.id
        const result = await questions_dal.get_question_by_id(id)
        // use if statement to see if the data base got our ask
        if (result) {
            response.status(200).json(result.data)
        } else {
            response.status(404).json({ error: `Question-${id}-not-found` })
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
 * /api/questions:
 *   post:
 *     summary: Create a new question
 *     description: Create a new question record with the provided details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                  question:
 *                      type: string
 *                      description: The question's title
 *                  firstanswer:
 *                      type: string
 *                      description: The question's first answer
 *                  secondanswer:
 *                      type: string
 *                      description: The question's second answer
 *                  thirdanswer:
 *                      type: string
 *                      description: The question's third answer
 *                  fourthanswer:
 *                      type: string
 *                      description: The question's fourth answer
 *             example:
 *               question: what sport you like the most
 *               firstanswer: soccer
 *               secondanswer: basketball
 *               thirdanswer: golf
 *               fourthanswer: boxing
 *     responses:
 *       201:
 *         description: question created successfully.
 *         content:
 *           application/json:
 *             example:
 *               new_question:
 *                   id: 3
 *                   question: what sport you like the most
 *                   firstanswer: soccer
 *                   secondanswer: basketball
 *                   thirdanswer: golf
 *                   fourthanswer: boxing
 *               url: /api/questions/3
 *       404:
 *         description: Bad request. Ensure all required fields are provided.
 *         content:
 *           application/json:
 *             example:
 *               error: insert question failed.
 */

// tell the data base to insert the new question
router.post('', async (request, response) => {
    try {
        const new_question = request.body
        const result = await questions_dal.insert_question(new_question)
        response.status(201).json({ new_question: result.data, url: `/api/questions/${result.data.id}` })
    } catch (e) {
        const error_number = Math.floor(Math.random() * 1000000) + 1000000
        console.log(`${error_number}: ${e.message}`)
        response.status(404).json({ status: "insert-question-failed" })
    }
})

// DELETE
/**
 * @swagger
 * /api/questions/{id}:
 *   delete:
 *     summary: Delete question by ID
 *     description: Delete the question record with the specified ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the question to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: question deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               error: question deleted
 *       404:
 *         description: question not found with the specified ID.
 *         content:
 *           application/json:
 *             example:
 *               error: delete question failed
 */

// tell the data base to delete the one question 
router.delete('/:id', async (request, response) => {
    const id = request.params.id
    const result = await questions_dal.delete_question(id)
    try {
        // use if statement to see if the data base got our ask
        if (result) {
            response.status(200).json({ result: "question-deleted" })
        } else { response.status(404).json({ status: "delete-question-failed" }) }
    }
    catch (e) {
        const error_number = Math.floor(Math.random() * 1000000) + 1000000;
        console.log(`${error_number}: ${e.message}`)
    }
})

// DELETE
/**
 * @swagger
 * /api/questions/table/questions-delete-table:
 *   delete:
 *     summary: Delete question's table
 *     description: Delete all the questions record.
 *     responses:
 *       200:
 *         description: question's table has deleted from data base.
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

// tell the data base to delete the questions table
router.delete('/table/questions-delete-table', async (request, response) => {
    const result = await questions_dal.delete_table()
    try {
        // use if statement to see if the data base got our ask
        if (result) {
            response.status(200).json({ status: "table-deleted" })
        } else { response.status(404).json({ status: "delete-table-failed" }) }

    }
    catch (e) {
        const error_number = Math.floor(Math.random() * 1000000) + 1000000;
        console.log(`${error_number}: ${e.message}`);
    }
})

// POST
/**
 * @swagger
 * /api/questions/table/questions-create-table:
 *   post:
 *     summary: Create the question's table
 *     description: Create the question's table in data base.
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

// tell the data base to create the questions table
router.post('/table/questions-create-table', async (request, response) => {
    try {
        const result = await questions_dal.create_table()
        console.log(result)
        response.status(201).json({ status: "table-created" })
    } catch (e) {
        const error_number = Math.floor(Math.random() * 1000000) + 1000000
        console.log(`${error_number}: ${e.message}`)
        response.status(404).json({ status: "create-table-failed" })
    }
})

// POST
/**
 * @swagger
 * /api/questions/table/questions-create5:
 *   post:
 *     summary: Create the 5 new questions
 *     description: Create 5 new questions in data base.
 *     responses:
 *       201:
 *         description: questions created successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: 5 new questions created
 *       404:
 *         description: cannot insert new questions.
 *         content:
 *           application/json:
 *             example:
 *               error: insert 5 new questions failed.
 */

// tell the data base to insert the new 5 questions
router.post('/table/questions-create5', async (request, response) => {
    try {
        const result = await questions_dal.insert_questions5()
        // use if statement to see if the data base got our ask
        if (result) {
            response.status(201).json({ result: "5-new-questions-created" })
        } else {
            response.status(404).json({ status: "insert-5-new-questions-failed" })
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
 * /api/questions/{id}:
 *   put:
 *     summary: update a question
 *     description: update a question with the provided details.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the question to update.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                  question:
 *                      type: string
 *                      description: The question's title
 *                  firstanswer:
 *                      type: string
 *                      description: The question's first answer
 *                  secondanswer:
 *                      type: string
 *                      description: The question's second answer
 *                  thirdanswer:
 *                      type: string
 *                      description: The question's third answer
 *                  fourthanswer:
 *                      type: string
 *                      description: The question's fourth answer
 *             example:
 *               question: what sport you like the most
 *               firstanswer: soccer
 *               secondanswer: basketball
 *               thirdanswer: golf
 *               fourthanswer: boxing
 *     responses:
 *       200:
 *         description: question updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: question updated successfully
 *       404:
 *         description: Bad request. Ensure all required fields are provided.
 *         content:
 *           application/json:
 *             example:
 *               error: question not found.
 */

// tell the data base to update a question
router.put('/:id', async (request, response) => {
    const questionid = request.params.id;
    const questiondata = request.body;
    try {
        const result = await questions_dal.update_question(questionid, questiondata);
        // use if statement to see if the data base got our ask
        if (result) {
            response.status(200).json({ status: "question-updated-successfully", data: result.data });
        } else {
            response.status(404).json({ error: "question-not-found" })
        }
    } catch (e) {
        const error_number = Math.floor(Math.random() * 1000000) + 1000000
        console.log(`${error_number}: ${e.message}`)
    }
})

module.exports = router