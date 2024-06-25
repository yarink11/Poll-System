const assert = require('assert')
const users_dal = require('../dals/users_dal')
const answers_dal = require('../dals/answers_dal')
const questions_dal = require('../dals/questions_dal')


describe('Testing  basic functionallity of the users dal', () => {
    it('create the table', async () => {
        const actual = await users_dal.create_table()
        const expected = { status: 'success' }
        assert.deepStrictEqual(expected, actual)
    })
    it('create 5 new users', async () => {
        const actual = await users_dal.insert_users5()
        const expected = { status: 'success' }
        assert.deepStrictEqual(expected, actual)
    })
    it('create new user', async () => {
        const new_user = {
            "id": 6,
            "firstname": "John",
            "lastname": "Doe",
            "email": "john.doe@example.com",
            "date_of_birth": "1.1.2001",
            "address": "maccabim 20",
            "password": "kfjashjdhfsd"
        }
        const actual = await users_dal.insert_user(new_user)
        const expected = {
            status: "success",
            data: actual.data
        }
        assert.deepStrictEqual(expected, actual)
    })
    it('try to login the page', async () => {
        const actual = await users_dal.try_login("john.doe@example.com", "kfjashjdhfsd")
        const expected = {
            status: "success",
            id: 6
        }
        assert.deepStrictEqual(expected, actual)
    })
    it('get a user by ID', async () => {
        const actual = await users_dal.get_user_by_id(6)
        const expected = {
            status: "success",
            data: actual.data
        }
        assert.deepStrictEqual(expected, actual)
    })
    it('get all users', async () => {
        const actual = await users_dal.get_all_users()
        const expected = {
            status: "success",
            data: actual.data
        }
        assert.deepStrictEqual(expected, actual)
    })
    it('update a user', async () => {
        const updated_user = {
            "id": 6,
            "firstname": "debug",
            "lastname": "debug",
            "email": "john.doe@example.com",
            "date_of_birth": "1.1.2000",
            "address": "maccabim",
            "password": "kfjashjdhfsd"
        }
        const actual = await users_dal.update_user(6, updated_user)
        const expected = {
            status: "success",
            data: actual.data
        }
        assert.deepStrictEqual(expected, actual)
    })
    it('delete a user', async () => {
        await questions_dal.create_table()
        await answers_dal.create_table()
        const actual = await users_dal.delete_user(6)
        const expected = {
            status: "success",
            data: actual.data
        }
        assert.deepStrictEqual(expected, actual)
    })
    it('delete user`s table', async () => {
        await questions_dal.delete_table()
        const actual = await users_dal.delete_table()
        const expected = { status: "success" }
        assert.deepStrictEqual(expected, actual)
    })
})