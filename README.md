# Poll-System

Poll System built with Node.js and Express, allowing users to create polls, add options, and vote. The project uses JWT for user authentication and provides an API for managing polls.

## Technologies
- Node.js + Express
- PostgreSQL (via Knex)
- JWT for user authentication
- Swagger for API documentation
- Winston for logging
- Nodemon for development

## Installation and Setup

1. **Clone the project**

git clone https://github.com/yarink11/Poll-System.git

cd Poll-System

2. **Install dependencies**

npm install

3. **Configure the database (PostgreSQL)**

Create a new PostgreSQL database

If needed, update the configuration in config/default.json with your database credentials

4. **Create initial tables**

Use Postman or a browser to send POST requests to the following URLs to create the tables:

|Table|URL for creating the table|
|----------|----------|
|Users|http://localhost:3000/api/users/table/users-create-table|
|Questions|http://localhost:3000/api/questions/table/questions-create-table|
|Answers|http://localhost:3000/api/answers/table/answers-create-table|

5. **Start the project**

npm start

The server will run by default on port 3000.

## Tests (optional)

To run automated tests:

npm test
