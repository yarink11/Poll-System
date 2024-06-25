const express = require('express')
const users_dal = require('../dals/users_dal')
const logger = require('../logger/my_logger')
const router = express.Router()

router.get('/', async (request, response) => {
    if (!request.cookies.auth) {
        response.status(200).redirect('./login.html')
        return
    }
    else {
        response.status(200).redirect('./questions.html')
        return
    }
})

router.post('/signup_post', async (request, response) => {
    const { firstname, lastname, address, date_of_birth, email, password } = request.body
    console.log(request.body);
    const result = await users_dal.insert_user({ firstname, lastname, email, date_of_birth, address, password })
    if (result.status === "success") {
        response.cookie('auth', `${email}_${result.data.id}`)
        response.status(200).redirect('./questions.html')
    }
    else {
        logger.info(result.error);
        console.log(result.error);
        response.status(200).redirect('./error_signup.html?error=${result.status}`')
    }
})


router.post('/login_post', async (request, response) => {
    const { email, password } = request.body
    console.log(request.body);
    const result = await users_dal.try_login(email, password)
    if (result.status === "success") {
        response.cookie('auth', `${email}_${result.id}`)
        response.status(200).redirect('./questions.html')
    }
    else {
        console.log(result.error);
        response.status(200).redirect(`./error_login.html?error=${result.status}`)
    }
})

module.exports = router