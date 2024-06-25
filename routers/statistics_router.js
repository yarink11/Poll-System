const express = require('express');
const statistics_dal = require('../dals/statistics_dal');
const router = express.Router();
const logger = require('../logger/my_logger')

// GET by ID
/**
 * @swagger
 * /api/statistics/question/options/{id}:
 *   get:
 *     summary: Get a question details by ID
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
 *             example:
 *               question: 
 *                  id: 2
 *                  question: what sport you like the most
 *                  firstanswer: soccer
 *                  secondanswer: basketball
 *                  thirdanswer: golf
 *                  fourthanswer: boxing
 *               counts: 
 *                  option1: 1
 *                  option2: 3
 *                  option3: 2
 *                  option4: 4
 *       404:
 *         description: count options of question failed,
 *         content:
 *           application/json:
 *             example:
 *               error: request failed
 */

// show how much users answered on each option of question
router.get('/question/options/:id', async (request, response) => {
    const questionid = request.params.id
    try {
        const result = await statistics_dal.count_options_of_question(questionid)
        // use if statement to see if the data base got our ask
        if (result) {
            response.status(200).json(result)
        } else { response.status(404).json({ status: "request-failed" }) }
    } catch (e) {
        const error_number = Math.floor(Math.random() * 1000000) + 1000000
        console.log(`${error_number}: ${e.message}`)
    }

})

// GET by ID
/**
 * @swagger
 * /api/statistics/question/total/{id}:
 *   get:
 *     summary: Get a question details by ID
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
 *             example:
 *               question: 
 *                  id: 2
 *                  question: what sport you like the most
 *                  firstanswer: soccer
 *                  secondanswer: basketball
 *                  thirdanswer: golf
 *                  fourthanswer: boxing
 *               total: 4    
 *       404:
 *         description: get total answers of question failed.
 *         content:
 *           application/json:
 *             example:
 *               error: request failed
 */

// show how much users answered on a question
router.get('/question/total/:id', async (request, response) => {
    const questionid = request.params.id
    try {
        const result = await statistics_dal.total_answers_of_question(questionid)
        // use if statement to see if the data base got our ask
        if (result) {
            response.status(200).json(result)
        } else { response.status(404).json({ status: "request-failed" }) }

    } catch (e) {
        const error_number = Math.floor(Math.random() * 1000000) + 1000000
        console.log(`${error_number}: ${e.message}`)
    }
})

// GET by ID
/**
 * @swagger
 * /api/statistics/user/answers/{id}:
 *   get:
 *     summary: Get a user details by ID
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
 *               name: Jhon Doe
 *               answer: 
 *                  questionid: 2
 *                  question: what sport you like the most
 *                  firstanswer: soccer
 *                  secondanswer: basketball
 *                  thirdanswer: golf
 *                  fourthanswer: boxing
 *                  selectedanswer: 3
 *       404:
 *         description: get the user answers failed.
 *         content:
 *           application/json:
 *             example:
 *               error: request failed
 */

// show the answers of a user
router.get('/user/answers/:id', async (request, response) => {
    const userid = request.params.id;
    try {
        const result = await statistics_dal.user_answers(userid)
        // use if statement to see if the data base got our ask
        if (result) {
            response.status(200).json(result)
        } else { response.status(404).json({ status: "request-failed" }) }
    } catch (e) {
        const error_number = Math.floor(Math.random() * 1000000) + 1000000
        console.log(`${error_number}: ${e.message}`)
    }
})

// GET by ID
/**
 * @swagger
 * /api/statistics/user/total/{id}:
 *   get:
 *     summary: Get a user details by ID
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
 *               name: Jhon Doe
 *               total: 4
 *               
 *       404:
 *         description: get the total of questions the user has answered failed.
 *         content:
 *           application/json:
 *             example:
 *               error: request failed
 */

// count how much questions the user answered on 
router.get('/user/total/:id', async (request, response) => {
    const userid = request.params.id;
    try {
        const result = await statistics_dal.number_questions_answered(userid)
        // use if statement to see if the data base got our ask
        if (result) {
            response.status(200).json(result)
        } else { response.status(404).json({ status: "request-failed" }) }
    } catch (e) {
        const error_number = Math.floor(Math.random() * 1000000) + 1000000
        console.log(`${error_number}: ${e.message}`)
    }
})

// GET ALL
/**
 * @swagger
 * /api/statistics/questions/total:
 *   get:
 *     summary: Get a questions details 
 *     description: Retrieve questions details,
 *     responses:
 *       200:
 *         description: Successful response with the questions details.
 *         content:
 *           application/json:
 *             example:
 *               question: 
 *                  id: 2
 *                  question: what sport you like the most
 *                  firstanswer: soccer
 *                  secondanswer: basketball
 *                  thirdanswer: golf
 *                  fourthanswer: boxing
 *               counts: 
 *                  option1: 1
 *                  option2: 3
 *                  option3: 2
 *                  option4: 4
 *       404:
 *         description: count options of total questions,
 *         content:
 *           application/json:
 *             example:
 *               error: request failed
 */

// show how much users answered on each option of all the questions
router.get('/questions/total', async (request, response) => {
    try {
        const result = await statistics_dal.total_questions()
        // use if statement to see if the data base got our ask
        if (result) {
            response.status(200).json(result)
        } else { response.status(404).json({ status: "request-failed" }) }
    } catch (e) {
        const error_number = Math.floor(Math.random() * 1000000) + 1000000
        console.log(`${error_number}: ${e.message}`)
    }
})
module.exports = router