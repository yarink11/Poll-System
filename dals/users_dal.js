const knex = require('knex')
const config = require('config')
const bcrypt = require('bcrypt');
const logger = require('../logger/my_logger');
const { error } = require('winston');

const data_base = knex({
    client: 'pg',
    connection: {
        host: config.db_connection.host,
        user: config.db_connection.user,
        password: config.db_connection.password,
        database: config.db_connection.database
    }
})

// function for create users table with sql command
async function create_table() {
    try {
        // the command
        const result = await data_base.raw(`CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                firstname VARCHAR(255) NOT NULL,
                lastname VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                date_of_birth DATE NOT NULL,
                address VARCHAR(255) NOT NULL,
                password VARCHAR(255) NOT NULL,
                CHECK (char_length(password) >= 6),
                UNIQUE(email)
            );`)
        // show in logger that the table created
        logger.info('create finished successfully')
        return {
            status: "success",
        }
    }
    catch (e) {
        const error_number = Math.floor(Math.random() * 1000000) + 1000000;
        logger.error(`${error_number}: ${e.message}`)
        throw new Error('Table already exist')
    }
}

// function for insert 5 new users with sql command
async function insert_users5() {
    try {
        // check if the users already exist
        const check = await data_base.raw(`SELECT * FROM users WHERE address LIKE 'yarin'`)
        if (check.rowCount > 0) {
            throw new Error('users already exist')
        }
        // the command to insert all the 5 users
        const salt = await bcrypt.genSalt();
        `INSERT INTO users (firstname, lastname, email, date_of_birth, address, password) VALUES ('jon','snow','jon.snow@winterfell.com','1.6.20','yarin', '${await bcrypt.hash('LongCl4w', salt)}');
        INSERT INTO users (firstname, lastname, email, date_of_birth, address, password) VALUES ('daenerys', 'targaryen', 'daenerys.targaryen@dragonstone.com','1.5.22','yarin', '${await bcrypt.hash('Dracarys7', salt)}');
        INSERT INTO users (firstname, lastname, email, date_of_birth, address, password) VALUES ('tyrion', 'lannister','tyrion.lannister@casterlyrock.com','1.5.22','yarin', '${await bcrypt.hash('VineV1ntage', salt)}');
        INSERT INTO users (firstname, lastname, email, date_of_birth, address, password) VALUES ('arya','stark','arya.stark@winterfell.com','1.5.22','yarin', '${await bcrypt.hash('NoOne9', salt)}');
        INSERT INTO users (firstname, lastname, email, date_of_birth, address, password) VALUES ('cersei','lannister','cersei.lannister@kingslanding.com','1.5.22','yarin', '${await bcrypt.hash('GreenFire', salt)}');`
            .replaceAll('\n    ', '')
            .split(';')
            .filter(query => query)
            .forEach(async query => { await data_base.raw(query + ';') })
        // show in logger that the users inserted
        logger.info('Users created successfully')
        return {
            status: "success",
        }
    }
    catch (e) {
        const error_number = Math.floor(Math.random() * 1000000) + 1000000;
        logger.error(`${error_number}: ${e.message}`)
    }

}

// function to see all the users in data base
async function get_all_users() {
    try {
        const users = await data_base.raw("select * from users")
        return {
            status: "success",
            data: users.rows
        }
    }
    catch (e) {
        const error_number = Math.floor(Math.random() * 1000000) + 1000000
        logger.error(`${error_number}: ${e.message}`)
    }
}

// function to see user in data base
async function get_user_by_id(id) {
    try {
        const users = await data_base.raw(`select * from users where id = ${id}`)
        logger.info(users.rows[0])
        return {
            status: "success",
            data: users.rows[0]
        }
    }
    catch (e) {
        const error_number = Math.floor(Math.random() * 1000000) + 1000000;
        logger.error(`${error_number}: ${e.message}`)
    }
}

// function to check the login of the user
async function try_login(email, password) {
    try {
        // check if the email exists
        const user = await data_base.raw(`select * from users where email LIKE '${email}';`)
        if (user.rowCount > 0) {
            // if the email exists check if his password is correct
            const result = await bcrypt.compare(password, user.rows[0].password)
            // if the password correct let the user login
            if (result)
                return {
                    status: "success",
                    id: user.rows[0].id
                }
            else
                return {
                    status: "wrong_password"
                }
        }
        else
            return {
                status: "user_does_not_exist"
            }
    } catch (e) {
        const error_number = Math.floor(Math.random() * 1000000) + 1000000;
        logger.error(`${error_number}: ${e.message}`)
    }
}

// function to insert new user
async function insert_user(new_user) {
    try {
        delete new_user.id
        // check if the request have all the data
        const requiredfields = ['firstname', 'lastname', 'email', 'date_of_birth', 'address', 'password'];
        for (const field of requiredfields) {
            if (!new_user[field]) {
                throw new Error(`${field} is required`)
            }
        }
        // check if the email already exist
        const user = await data_base.raw(`select * from users where email LIKE '${new_user.email}';`)
        if (user.rowCount > 0) {
            throw new Error(`email is already exist`)
        }
        // encode the password 
        const salt = await bcrypt.genSalt()
        new_user.password = await bcrypt.hash(new_user.password, salt)
        // the command in sql to insert the new user
        const result_ids = await data_base.raw(`INSERT INTO users (firstname, lastname, email, date_of_birth,address,password) 
            VALUES ('${new_user.firstname}','${new_user.lastname}','${new_user.email}','${new_user.date_of_birth}','${new_user.address}','${new_user.password}')
            RETURNING id`)
        const id = result_ids.rows[0].id
        return {
            status: "success",
            data: { id, ...new_user }

        }
    }
    catch (e) {
        const error_number = Math.floor(Math.random() * 1000000) + 1000000;
        logger.error(`${error_number}: ${e.message}`)
    }
}

// function to update a user
async function update_user(id, userdata) {
    try {
        // check if the request have all the data
        const requiredFields = ['firstname', 'lastname', 'email', 'date_of_birth', 'address', 'password']
        for (const field of requiredFields) {
            if (!userdata[field]) {
                throw new Error(`${field} is required`)
            }
        }
        // the request to update the data base
        const result = await data_base.raw(`UPDATE users
            SET firstname='${userdata.firstname}', lastname='${userdata.lastname}',email='${userdata.email}',date_of_birth='${userdata.date_of_birth}',address='${userdata.address}',password='${userdata.password}'
            WHERE id = ${id} RETURNING *`)
        return {
            status: "success",
            data: result[0]
        }
    } catch (e) {
        const error_number = Math.floor(Math.random() * 1000000) + 1000000;
        logger.error(`${error_number}: ${e.message}`)
    }
}

// function to delete an user
async function delete_user(id) {
    try {
        // check if the question exist
        const user = await data_base.raw(`SELECT * FROM users WHERE id=${id}`)
        if (!user.rowCount) {
            throw new Error('user does not exist')
        }
        // the command in sql to delete the user and the answers of it
        const result = await data_base.raw(`DELETE from answers where userid=${id};
        DELETE from users where id=${id}
        `)
        // show in logger that the user deleted
        logger.info(`user ${id} deleted`)
        return {
            status: "success",
            data: result.rowCount
        }
    }
    catch (e) {
        const error_number = Math.floor(Math.random() * 1000000) + 1000000;
        logger.error(`${error_number}: ${e.message}`)
    }
}

// function to delete the users table
async function delete_table() {
    try {
        // the command to delete the users table and answers table 
        const result = await data_base.raw(`DROP TABLE IF EXISTS answers ;
            DROP TABLE users`)
        logger.info('table deleted')
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
    get_all_users, get_user_by_id, insert_user,
    delete_user, delete_table, update_user,
    create_table, insert_users5, try_login
}