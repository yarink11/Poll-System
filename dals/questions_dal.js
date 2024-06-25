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

// function for create questions table with sql command
async function create_table() {
    try {
        // the command
        const result = await data_base.raw(`CREATE TABLE questions (
                id SERIAL PRIMARY KEY,
                question VARCHAR(255) NOT NULL,
                firstanswer VARCHAR(255) NOT NULL,
                secondanswer VARCHAR(255) NOT NULL,
                thirdanswer VARCHAR(255) NOT NULL,
                fourthanswer VARCHAR(255) NOT NULL,
                UNIQUE(question)
            );`)
        // show in logger that the table created
        logger.info('create finished successfully')
        return {
            status: "success",
        }
    }
    catch (e) {
        const error_number = Math.floor(Math.random() * 1000000) + 1000000
        logger.error(`${error_number}: ${e.message}`)
        throw new Error('Table already exist')
    }
}

// function for insert 5 new questions with sql command
async function insert_questions5() {
    try {
        // insert every question alone and not together 
        const question1 = await data_base.raw(`INSERT INTO questions (question, firstanswer, secondanswer, thirdanswer, fourthanswer) VALUES ('Which season do you enjoy the most','Spring','Summer','Fall','Winter')`)
        const question2 = await data_base.raw(`INSERT INTO questions (question, firstanswer, secondanswer, thirdanswer, fourthanswer) VALUES ('Which type of food do you prefer','Italian','Mexican','Chinese','Indian')`)
        const question3 = await data_base.raw(`INSERT INTO questions (question, firstanswer, secondanswer, thirdanswer, fourthanswer) VALUES ('What kind of music do you like to listen to','Rock','Pop','Rap','Classic')`)
        const question4 = await data_base.raw(`INSERT INTO questions (question, firstanswer, secondanswer, thirdanswer, fourthanswer) VALUES ('What type of movies do you enjoy watching','Action','Comedy','Drama','Science Fiction')`)
        const question5 = await data_base.raw(`INSERT INTO questions (question, firstanswer, secondanswer, thirdanswer, fourthanswer) VALUES ('Which kind of pets do you prefer','Dogs','Cats','Birds','Fish')`)
        const questions = { question1, question2, question3, question4, question5 }
        // for loop to see if any question already in data base
        for (var question in questions) {
            const check = await data_base.raw(`SELECT * FROM questions WHERE question LIKE '${question.question}'`)
            if (check.rowCount > 0) {
                throw new Error('questions already exist')
            }
        }
        // show in logger that the questions inserted
        logger.info('Questions inserted successfully')
        return {
            status: "success",
        }

    }
    catch (e) {
        const error_number = Math.floor(Math.random() * 1000000) + 1000000;
        logger.error(`${error_number}: ${e.message}`)
    }
}

// function to see all the questions in data base
async function get_all_questions() {
    try {
        const questions = await data_base.raw("select * from questions")
        return {
            status: "success",
            data: questions.rows
        }
    }
    catch (e) {
        const error_number = Math.floor(Math.random() * 1000000) + 1000000;
        logger.error(`${error_number}: ${e.message}`)
    }
}

// function to see question in data base
async function get_question_by_id(id) {
    try {
        const questions = await data_base.raw(`select * from questions where id = ${id}`)
        if (questions.rows.length === 0) {
            return null
        }
        return {
            status: "success",
            data: questions.rows[0]
        }
    }
    catch (e) {
        const error_number = Math.floor(Math.random() * 1000000) + 1000000;
        logger.error(`${error_number}: ${e.message}`)
    }
}

// function to update the question with the id 
async function update_question(id, questiondata) {
    try {
        // check if the request have all the data
        const requiredFields = ['question', 'firstanswer', 'secondanswer', 'thirdanswer', 'fourthanswer']
        for (const field of requiredFields) {
            if (!questiondata[field]) {
                throw new Error(`${field} is required`)
            }
        }
        // the command in sql to update data
        const result = await data_base.raw(`UPDATE questions 
            SET question='${questiondata.question}', firstanswer='${questiondata.firstanswer}', secondanswer='${questiondata.secondanswer}', thirdanswer='${questiondata.thirdanswer}', fourthanswer='${questiondata.fourthanswer}'
            WHERE id = ${id} RETURNING id`)
        console.log(result[0])
        return {
            status: "success",
            data: result[0]
        }
    } catch (e) {
        const error_number = Math.floor(Math.random() * 1000000) + 1000000;
        logger.error(`${error_number}: ${e.message}`)
    }
}

// function to insert new question
async function insert_question(new_question) {
    try {
        delete new_question.id
        // check if the request have all the data
        const requiredFields = ['question', 'firstanswer', 'secondanswer', 'thirdanswer', 'fourthanswer']
        for (const field of requiredFields) {
            if (!new_question[field]) {
                throw new Error(`${field} is required`);
            }
        }
        // the command in sql to insert data
        const result = await data_base.raw(`INSERT INTO questions (question, firstanswer, secondanswer, thirdanswer, fourthanswer) 
            VALUES ('${new_question.question}', '${new_question.firstanswer}','${new_question.secondanswer}','${new_question.thirdanswer}','${new_question.fourthanswer}') RETURNING id`)
        const id = result.rows[0].id
        return {
            status: "success",
            data: { id, ...new_question }
        }
    }
    catch (e) {
        const error_number = Math.floor(Math.random() * 1000000) + 1000000
        logger.error(`${error_number}: ${e.message}`)
        return {
            status: "error",
            internal: false,
            error: e.message.replace("/", "'")
        }
    }
}

// function to delete a question
async function delete_question(id) {
    try {
        // check if the question exist
        const question = await data_base.raw(`SELECT * FROM questions WHERE id=${id}`)
        if (!question.rowCount) {
            throw new Error('question does not exist')
        }
        // the command in sql to delete the question and the answers of it
        const result = await data_base.raw(`DELETE from questions where id=${id};
            DELETE from answers where questionid=${id}`)
            // show in logger that the question deleted
        console.log(result[0].rowCount)
        logger.info(`question ${id} deleted`)
        return {
            status: "success",
            data: result[0].rowCount
        }
    }
    catch (e) {
        const error_number = Math.floor(Math.random() * 1000000) + 1000000;
        logger.error(`${error_number}: ${e.message}`)

    }
}

// function to delete the questions table
async function delete_table() {
    try {
        // the command to delete the questions table and answers table 
        await data_base.raw(`DROP TABLE IF EXISTS answers;
            DROP TABLE questions`)
        logger.info(`question's table deleted`)
        return {
            status: "success"
        }
    }
    catch (e) {
        const error_number = Math.floor(Math.random() * 1000000) + 1000000;
        logger.error(`${error_number}: ${e.message}`)
    }
}

module.exports = {
    get_all_questions, get_question_by_id, insert_question,
    delete_question, delete_table, update_question,
    create_table, insert_questions5
}