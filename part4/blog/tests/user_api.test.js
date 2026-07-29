const { beforeEach, describe, test, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/users')
const mongoose = require('mongoose')
const { usersInDb } = require('../utils/test_helpers')
const api = supertest(app)
const endpoint = '/api/users'
const rootUser = {
  username: 'root',
  passwordHash: 'passwordHash',
}
beforeEach(async () => {
  await User.deleteMany({})
  // make sure the unique index on username exists before testing it
  await User.init()
  const user = new User(rootUser)
  await user.save()
})
describe('user api', () => {
  test('create succeeds with a fresh username', async () => {
    const userAtStart = await usersInDb()
    const newUser = { username: 'Max', password: 'password' }
    await api
      .post(endpoint)
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const userAtEnd = await usersInDb()
    assert.strictEqual(userAtEnd.length, userAtStart.length + 1)

    const usernames = userAtEnd.map((u) => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('the password hash is not returned', async () => {
    const res = await api
      .post(endpoint)
      .send({ username: 'Max', password: 'password' })
      .expect(201)
    assert.strictEqual(res.body.passwordHash, undefined)
    assert.strictEqual(res.body.password, undefined)
  })

  test('creation fails when username is already taken', async () => {
    const userAtStart = await usersInDb()
    const res = await api
      .post(endpoint)
      .send({ username: rootUser.username, password: 'password' })
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(res.body.error.includes('expected `username` to be unique'))

    const userAtEnd = await usersInDb()
    assert.strictEqual(userAtStart.length, userAtEnd.length)
  })

  test('creation fails when username is shorter than 3 characters', async () => {
    const userAtStart = await usersInDb()
    const res = await api
      .post(endpoint)
      .send({ username: 'ab', password: 'password' })
      .expect(400)

    assert(res.body.error.includes('invalid username or password'))

    const userAtEnd = await usersInDb()
    assert.strictEqual(userAtStart.length, userAtEnd.length)
  })

  test('creation fails when password is shorter than 3 characters', async () => {
    const userAtStart = await usersInDb()
    const res = await api
      .post(endpoint)
      .send({ username: 'qwerty', password: 'qw' })
      .expect(400)

    assert(res.body.error.includes('invalid username or password'))

    const userAtEnd = await usersInDb()
    assert.strictEqual(userAtStart.length, userAtEnd.length)
  })

  test('creation fails when username or password is missing', async () => {
    const userAtStart = await usersInDb()
    await api.post(endpoint).send({ username: 'qwerty' }).expect(400)
    await api.post(endpoint).send({ password: 'password' }).expect(400)

    const userAtEnd = await usersInDb()
    assert.strictEqual(userAtStart.length, userAtEnd.length)
  })
})
after(async () => {
  await mongoose.connection.close()
})
