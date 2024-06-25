const express = require('express')
const body_parser = require('body-parser')
const cors = require('cors')
const config = require('config')
const path = require('path')
const cookieParser = require('cookie-parser');
const users_router = require('./routers/users_router')
const page_router = require('./routers/page_router')
const logger = require('./logger/my_logger')
const questions_router = require('./routers/questions_router')
const answers_router = require('./routers/answers_router')
const statistics_router = require('./routers/statistics_router')
const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const app = express()

app.use(body_parser.json())

app.use(cors())
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Library API",
            version: "1.0.0",
            description: "My REST API",
        },
        servers: [
            {
                url: "/",
            },
        ],
    },
    apis: ["./routers/*.js"],
}

const specs = swaggerJsdoc(options)
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs)
)

// the request will pass here each time
app.get('*', (request, response, next) => {
    console.log(request.url);
    if (request.url == "/questions.html") {
        if (!request.cookies.auth) {
            response.status(200).redirect('./login.html')
            return
        }
    }
    if (request.url == "/signup.html") {
        if (request.cookies.auth) {
            response.status(200).redirect('./questions.html')
            return
        }
    }
    if (request.url == "/login.html") {
        if (request.cookies.auth) {
            response.status(200).redirect('./questions.html')
            return
        }
    }
    if (request.url == "/logout.html" || request.url == "/finished.html") {
        response.clearCookie('auth')
    }

    next()
})

app.use(express.static(path.join('.', '/static/')))

app.use('/api/users', users_router)
app.use('', page_router)
app.use('/api/questions', questions_router)
app.use('/api/answers', answers_router)
app.use('/api/statistics',statistics_router)


const server_api = app.listen(config.server.port, () => {
    logger.info(`====== express server is running on port ${config.server.port} =======`)
})

