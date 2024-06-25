const assert = require('assert')
const questions_dal = require('../dals/questions_dal')
const answers_dal = require('../dals/answers_dal')
const users_dal = require('../dals/users_dal')

describe('Testing  basic functionallity of the answers dal', () => {
    it('create the table', async () => {
        await questions_dal.create_table()
        await users_dal.create_table()
        const actual = await answers_dal.create_table()
        const expected = { status: 'success' }
        assert.deepStrictEqual(expected, actual)
    })
    it('create 5 new answers', async () => {
        await questions_dal.insert_questions5()
        await users_dal.insert_users5()
        const actual = await answers_dal.insert_answers5()
        const expected = { status: 'success' }
        assert.deepStrictEqual(expected, actual)
    })
    it('create new answer', async () => {
        const new_answer = {
            "id": 6,
            "userid": 1,
            "questionid": 2,
            "answerdate": "1.1.2001",
            "selectedanswer": 2
        }
        const actual = await answers_dal.insert_answer(new_answer)
        const expected = {
            status: "success",
            data: actual.data
        }
        assert.deepStrictEqual(expected, actual)
    })
    it('get an answer by user and question', async () => {
        const actual = await answers_dal.get_answer_by_user_and_question(1, 2)
        const expected = {
            status: "success",
            data: actual.data
        }
        assert.deepStrictEqual(expected, actual)
    })
    it('get all answers', async () => {
        const actual = await answers_dal.get_all_answers()
        const expected = {
            status: "success",
            data: actual.data
        }
        assert.deepStrictEqual(expected, actual)
    })
    it('delete answer`s table', async () => {
        const actual = await answers_dal.delete_table()
        await users_dal.delete_table()
        await questions_dal.delete_table()
        const expected = { status: "success" }
        assert.deepStrictEqual(expected, actual)
    })
})