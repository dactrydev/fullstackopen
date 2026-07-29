const Blog = require('../models/blogs')
const User = require('../models/users')
const bcrypt = require('bcrypt')
const userRouter = require('express').Router()

userRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('blogs', { user: 0, author: 0 })
  res.json(users)
})

userRouter.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user) return res.status(400).end()
  res.json(user)
})

userRouter.post('/', async (req, res) => {
  const { username, password, ...rest } = req.body
  if (!(username?.length >= 3 && password?.length >= 3)) {
    return res.status(400).json({ error: 'invalid username or password' })
  }
  const passwordHash = await bcrypt.hash(password, 10)
  const user = new User({ username, passwordHash, ...rest })
  const savedUser = await user.save()
  res.status(201).json(savedUser)
})

userRouter.delete('/:id', async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user) return res.status(204).end()

  await User.findByIdAndDelete(user._id)
  await Blog.deleteMany({ _id: user.blogs })
  res.status(204).end()
})

module.exports = userRouter
