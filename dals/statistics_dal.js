const knex = require('knex')
const config = require('config')
const logger = require('../logger/my_logger')

const data_base = knex({
    client: 'pg',
    connection: {
        host: config.db_connection.host,
        user: config.db_connection.user,
        password: config.db_connection.password,
        database: config.db_connection.database
    }
})

// function to show how much users answered on each option of question
async function count_options_of_question(questionid) {
    try {
        // the command that show the question
        const questionresult = await data_base.raw(`SELECT * FROM questions WHERE id = ${questionid}`)
        if (questionresult.rows.length === 0) {
            throw new Error(`Question with ID ${questionid} not found`)
        }
        const question = questionresult.rows[0]
        // the command that count the ids that choose all options in the question
        const countsresult = await data_base.raw(`SELECT selectedanswer, COUNT(id) as count FROM answers 
            WHERE questionid = ${questionid} GROUP BY selectedanswer`)
        const counts = countsresult.rows
        const countsobject = {}
        // command to insert the amount of answered options to the list
        counts.forEach(row => {
            countsobject[`option${row.selectedanswer}`] = row.count
        })
        return {
            question: question,
            counts: countsobject
        }
    } catch (e) {
        const error_number = Math.floor(Math.random() * 1000000) + 1000000;
        logger.error(`${error_number}: ${e.message}`)
    }
}

// function to show how much users answered on question
async function total_answers_of_question(questionid) {
    try {
        // the command that show the question
        const questionresult = await data_base.raw(`SELECT * FROM questions WHERE id = ${questionid}`)
        if (questionresult.rows.length === 0) {
            throw new Error(`Question with ID ${questionId} not found`);
        }
        const question = questionresult.rows[0]
        // the command that count the ids that answered the question
        const totalresult = await data_base.raw(`SELECT COUNT(id) AS count FROM answers WHERE questionid = ${questionid}`)
        const total = totalresult.rows[0]
        return {
            question: question,
            total: total.count
        };
    } catch (e) {
        const error_number = Math.floor(Math.random() * 1000000) + 1000000;
        logger.error(`${error_number}: ${e.message}`)
    }
}

// function to show the answers of user
async function user_answers(userid) {
    try {
        // the command to see the user`s name
        const userresult = await data_base.raw(`SELECT firstname, lastname FROM users WHERE id = ${userid}`)
        if (userresult.rows.length === 0) {
            throw new Error(`User with ID ${userid} not found`)
        }
        const user = userresult.rows[0]
        const fullname = `${user.firstname} ${user.lastname}`
        // the command that show the questions and what the user select on each question
        const answers = await data_base.raw(`
            SELECT 
                questionid,
                question, 
                firstanswer, 
                secondanswer, 
                thirdanswer, 
                fourthanswer, 
                selectedanswer 
            FROM answers 
            JOIN questions ON questionid = questions.id 
            WHERE answers.userid = ${userid}`)
        return {
            name: fullname,
            answer: answers.rows
        }
    } catch (e) {
        const error_number = Math.floor(Math.random() * 1000000) + 1000000;
        logger.error(`${error_number}: ${e.message}`)
    }
}

// function to show how much questions the user answered
async function number_questions_answered(userid) {
    try {
        // the command to see the user`s name
        const userresult = await data_base.raw(`SELECT firstname, lastname FROM users WHERE id = ${userid}`)
        if (userresult.rows.length === 0) {
            throw new Error(`User with ID ${userid} not found`)
        }
        const user = userresult.rows[0]
        const fullname = `${user.firstname} ${user.lastname}`
        // the command to count the questions this user have answered on
        const total = await data_base.raw(`SELECT COUNT(questionid) AS total FROM answers WHERE userid = ${userid}`)
        return {
            name: fullname,
            total: total.rows[0].total
        }
    } catch (e) {
        const error_number = Math.floor(Math.random() * 1000000) + 1000000;
        logger.error(`${error_number}: ${e.message}`)
    }
}

// function to show how much users answered on each option of all questions
async function total_questions() {
    try {
        // command to show the questions
        const questions = await data_base.raw("select * from questions")
        // the command that count the ids that choose all options in the every question
        const countsresult = await data_base.raw(`SELECT questionid, selectedanswer, COUNT(id) as count 
            FROM answers GROUP BY questionid, selectedanswer`)
        const counts = countsresult.rows
        // map command to add the counts of options to the questions
        const result = questions.rows.map(question => {
            const questioncounts = counts.filter(count => count.questionid === question.id)
            const countsobject = {}
            questioncounts.forEach(row => {
                countsobject[`option${row.selectedanswer}`] = row.count
            })
            return {
                question: question,
                counts: countsobject
            }

        })
        return result
    } catch (e) {
        const error_number = Math.floor(Math.random() * 1000000) + 1000000;
        logger.error(`${error_number}: ${e.message}`)
    }
}
module.exports = {
    count_options_of_question,
    total_answers_of_question,
    user_answers,
    number_questions_answered,
    total_questions
}