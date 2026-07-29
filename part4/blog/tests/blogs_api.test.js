const { test, after, describe, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blogs')
const bcrypt = require('bcrypt')
const {
  oneBlogObj,
  initialBlogList,
  blogsInDb,
  incorrectId,
  userData,
  usersInDb,
} = require('../utils/test_helpers')
const User = require('../models/users')

let token
const api = supertest(app)
beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogList)
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash(userData.password, 10)
  await User.insertOne({ username: userData.username, passwordHash })
  const res = await api
    .post('/api/login')
    .send({ username: userData.username, password: userData.password })
  token = res.body.token
})
describe('test blog API', () => {
  describe('get all blogs', () => {
    test('blogs are returned as json', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
      const { body } = await api.get('/api/blogs')
      const listFromDb = body.map(({ id, ...rest }) => rest)
      assert.deepStrictEqual(listFromDb, initialBlogList)
    })
  })

  describe('addition of a blog', () => {
    test('a valid post can be added', async () => {
      const user = (await usersInDb())[0]
      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send({ userId: user.id, ...oneBlogObj })
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogs = await blogsInDb()
      assert.strictEqual(blogs.length, initialBlogList.length + 1)

      for (const blog of blogs) {
        assert.ok(blog.title, 'blog has no title')
        assert.ok(blog.author, 'blog has no author')
      }

      const titles = blogs.map((b) => b.title)
      assert(titles.includes(oneBlogObj.title))
    })

    test('the author from the request body is stored as is', async () => {
      const res = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(oneBlogObj)
        .expect(201)
      assert.strictEqual(res.body.author, oneBlogObj.author)
    })

    test('the created blog is linked to the user who added it', async () => {
      const user = (await usersInDb())[0]
      const res = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(oneBlogObj)
        .expect(201)

      assert.strictEqual(res.body.user, user.id)

      const usersAtEnd = await usersInDb()
      const blogIds = usersAtEnd[0].blogs.map((b) => b.toString())
      assert(blogIds.includes(res.body.id))
    })

    test('likes defaults to 0 when missing from request', async () => {
      const { likes, ...rest } = oneBlogObj
      const user = (await usersInDb())[0]
      const res = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send({ userId: user.id, ...rest })
        .expect(201)
      assert.strictEqual(res.body.likes, 0)
    })
  })

  describe('view single blog', () => {
    // Get single post
    test('a single blog can be viewed', async () => {
      const singleBlogId = (await blogsInDb())[0].id
      await api
        .get('/api/blogs/' + singleBlogId)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    // Non-existent id
    test('non-existent id returns status 404', async () => {
      const id = await incorrectId()
      await api.get('/api/blogs/' + id).expect(404)
    })

    // Wrong id
    test('wrong id returns status 400', async () => {
      await api.get('/api/blogs/1').expect(400)
    })
  })

  describe('delete a blog', () => {
    test('a blog can be deleted', async () => {
      const post = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'New title',
          url: 'http://link.com',
        })
        .expect(201)

      await api
        .delete('/api/blogs/' + post.body.id)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const blogs = await blogsInDb()
      assert.strictEqual(blogs.length, initialBlogList.length)

      const blogsAtEnd = blogs.map((b) => b.id)
      assert(!blogsAtEnd.includes(post.body.id))
    })

    test('deleting a non-existent blog returns 204', async () => {
      const id = await incorrectId()
      await api
        .delete('/api/blogs/' + id)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)
    })

    test('another user cannot delete a blog they did not create', async () => {
      const post = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(oneBlogObj)
        .expect(201)

      const otherUser = { username: 'mallory', password: 'qwerty' }
      await api.post('/api/users').send(otherUser).expect(201)
      const login = await api.post('/api/login').send(otherUser).expect(200)

      await api
        .delete('/api/blogs/' + post.body.id)
        .set('Authorization', `Bearer ${login.body.token}`)
        .expect(401)

      const blogsAtEnd = await blogsInDb()
      const ids = blogsAtEnd.map((b) => b.id)
      assert(ids.includes(post.body.id))
    })
  })

  describe('requests without a valid token', () => {
    test('creating a blog without a token returns 401', async () => {
      await api.post('/api/blogs').send(oneBlogObj).expect(401)

      const blogsAtEnd = await blogsInDb()
      assert.strictEqual(blogsAtEnd.length, initialBlogList.length)
    })

    test('deleting a blog without a token returns 401', async () => {
      const blog = (await blogsInDb())[0]
      await api.delete('/api/blogs/' + blog.id).expect(401)

      const blogsAtEnd = await blogsInDb()
      assert.strictEqual(blogsAtEnd.length, initialBlogList.length)
    })

    test('updating a blog without a token returns 401', async () => {
      const blog = (await blogsInDb())[0]
      await api
        .put('/api/blogs/' + blog.id)
        .send({ likes: 99 })
        .expect(401)
    })

    test('a malformed token returns 401', async () => {
      await api
        .post('/api/blogs')
        .set('Authorization', 'Bearer not-a-real-token')
        .send(oneBlogObj)
        .expect(401)
    })
  })

  //Incorrect data
  test('handle missing data in request', async () => {
    const { title, url, ...rest } = oneBlogObj
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send({ title, ...rest })
      .expect(400)

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send({ url, ...rest })
      .expect(400)

    const blogsAtEnd = await blogsInDb()
    assert.strictEqual(blogsAtEnd.length, initialBlogList.length)
  })

  // Check ids
  test('each blog has id property', async () => {
    const blogs = await blogsInDb()
    for (const blog of blogs) {
      assert.ok(blog.id, 'blog is missing id')
    }
  })

  describe('update a blog', () => {
    test('a blog can be updated', async () => {
      const blog = (await blogsInDb())[0]
      const update = await api
        .put('/api/blogs/' + blog.id)
        .set('Authorization', 'Bearer ' + token)
        .send({ likes: 3 })
        .expect(200)

      const updated = await Blog.findById(update.body.id)
      assert.strictEqual(updated.likes, 3)
    })

    test('updating a non-existent blog returns 404', async () => {
      const id = await incorrectId()
      await api
        .put('/api/blogs/' + id)
        .set('Authorization', 'Bearer ' + token)
        .send({ likes: 3 })
        .expect(404)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
