const assert = require('assert')
const questions_dal = require('../dals/questions_dal')
const answers_dal = require('../dals/answers_dal')
const users_dal = require('../dals/users_dal')

describe('Testing  basic functionallity of the questions dal', () => {
    it('create the table', async () => {
        const actual = await questions_dal.create_table()
        const expected = { status: 'success' }
        assert.deepStrictEqual(expected, actual)
    })
    it('create 5 new questions', async () => {
        const actual = await questions_dal.insert_questions5()
        const expected = { status: 'success' }
        assert.deepStrictEqual(expected, actual)
    })
    it('create new question', async () => {
        const new_question = {
            "id": 6,
            "question": "what sport you like the most",
            "firstanswer": "soccer",
            "secondanswer": "basketball",
            "thirdanswer": "golf",
            "fourthanswer": "boxing"
        }
        const actual = await questions_dal.insert_question(new_question)
        const expected = {
            status: "success",
            data: actual.data
        }
        assert.deepStrictEqual(expected, actual)
    })
    it('get a question by ID', async () => {
        const actual = await questions_dal.get_question_by_id(6)
        const expected = {
            status: "success",
            data: actual.data
        }
        assert.deepStrictEqual(expected, actual)
    })
    it('get all questions', async () => {
        const actual = await questions_dal.get_all_questions()
        const expected = {
            status: "success",
            data: actual.data
        }
        assert.deepStrictEqual(expected, actual)
    })
    it('update a question', async () => {
        const updated_question = {
            "id": 6,
            "question": 'What is your favorite color?',
            "firstanswer": 'Red',
            "secondanswer": 'Blue',
            "thirdanswer": 'Green',
            "fourthanswer": 'Yellow'
        }
        const actual = await questions_dal.update_question(6, updated_question)
        const expected = {
            status: "success",
            data: actual.data
        }
        assert.deepStrictEqual(expected, actual)
    })
    it('delete a question', async () => {
        await users_dal.create_table()
        await answers_dal.create_table()
        const actual = await questions_dal.delete_question(6)
        const expected = {
            status: "success",
            data: actual.data
        }
        assert.deepStrictEqual(expected, actual)
    })
    it('delete question`s table', async () => {
        await users_dal.delete_table()
        const actual = await questions_dal.delete_table()
        const expected = { status: "success" }
        assert.deepStrictEqual(expected, actual)
    })
})