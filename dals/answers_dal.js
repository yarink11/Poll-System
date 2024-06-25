const knex = require('knex')
const config = require('config')
const logger = require('../logger/my_logger');
const { Console } = require('winston/lib/winston/transports');

const data_base = knex({
    client: 'pg',
    connection: {
        host: config.db_connection.host,
        user: config.db_connection.user,
        password: config.db_connection.password,
        database: config.db_connection.database
    }
})

// function for create answer table with sql command
async function create_table() {
    try {
        // the command
        const result = await data_base.raw(`CREATE TABLE answers (
        id SERIAL PRIMARY KEY,
        userid INTEGER REFERENCES users(id),
        questionid INTEGER REFERENCES questions(id),
        answerdate DATE NOT NULL,
        selectedanswer INTEGER CHECK (selectedanswer BETWEEN 1 AND 4),
        UNIQUE (userid,questionid)
        );`)
        // show in logger that the table created
        logger.info('create table finished successfully')
        return {
            status: "success",
        }
    }
    catch (e) {
        const error_number = Math.floor(Math.random() * 1000000) + 1000000
        logger.error(`${error_number}: ${e.message}`)
        throw new Error('users table or questions table not exist')
    }
}

// function for insert 5 new answers with sql command
async function insert_answers5() {
    try {
        // the command
        const data = await data_base.raw(
            `INSERT INTO answers (userid, questionid, answerdate, selectedanswer) VALUES (1,1,'19/1/12',1);
        INSERT INTO answers (userid, questionid, answerdate, selectedanswer) VALUES (2,2,'19/1/11',1);
        INSERT INTO answers (userid, questionid, answerdate, selectedanswer) VALUES (3,3,'19/3/23',1);
        INSERT INTO answers (userid, questionid, answerdate, selectedanswer) VALUES (4,4,'16/7/98',1);
        INSERT INTO answers (userid, questionid, answerdate, selectedanswer) VALUES (5,1,'17/02/78',4);`)
        // show in logger that the answers inserted
        logger.info('Answers inserted successfully')
        return {
            status: "success",
        }
    }
    catch (e) {
        const error_number = Math.floor(Math.random() * 1000000) + 1000000
        logger.error(`${error_number}: ${e.message}`)
        throw new Error(`Answers already exist`)
    }

}

// function to see all the users`s answers with sql command
async function get_all_answers() {
    try {
        // the command
        const answers = await data_base.raw("select * from answers")
        return {
            status: "success",
            data: answers.rows
        }
    }
    catch (e) {
        const error_number = Math.floor(Math.random() * 1000000) + 1000000
        logger.error(`${error_number}: ${e.message}`)
    }
}

// function that help us see if the user already answered the question
async function get_answer_by_user_and_question(userid, questionid) {
    try {
        // this is the command in sql to see if the user answered the question
        const answers = await data_base.raw(`select * from answers where userid = ${userid} and questionid = ${questionid}`)
        if (answers.rows.length > 0) {
            return {
                status: "success",
                data: answers.rows[0]
            }
        }
        return null
    } catch (e) {
        const error_number = Math.floor(Math.random() * 1000000) + 1000000
        logger.error(`${error_number}: ${e.message}`)
    }
}

// function to insert the new user`s question
async function insert_answer(new_answer) {
    try {
        delete new_answer.id
        let date = new Date().toLocaleString()
        new_answer.answerdate = date
        // see if the answer have all what we need
        const requiredfields = ['userid', 'questionid', 'selectedanswer']
        for (const field of requiredfields) {
            if (!new_answer[field]) {
                throw new Error(`${field} is required`)
            }
        }
        // the command in sql to insert new data
        const result = await data_base.raw(`INSERT INTO answers (userid, questionid, answerdate, selectedanswer) 
            VALUES (${new_answer.userid},${new_answer.questionid},'${date}',${new_answer.selectedanswer})
            RETURNING id`)
        const id = result.rows[0].id
        return {
            status: "success",
            data: { id, ...new_answer }
        }
    }
    catch (e) {
        const error_number = Math.floor(Math.random() * 1000000) + 1000000;
        logger.error(`${error_number}: ${e.message}`)
        return {
            status: "error",
            internal: false,
            error: e.message.replace("/", "'")
        }
    }
}

// fuction to delete the answers table
async function delete_table() {
    try {
        // the command to delete the table
        await data_base.raw(`DROP table answers`)
        // show in logger that the table deleted
        logger.info(`answer's table deleted`)
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
    get_all_answers, insert_answer,
    get_answer_by_user_and_question,
    delete_table,
    create_table, insert_answers5
}