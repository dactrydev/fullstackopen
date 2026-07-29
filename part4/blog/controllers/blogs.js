const Blog = require('../models/blogs')
const User = require('../models/users')
const { userExtractor } = require('../utils/middleware')
const blogRouter = require('express').Router()

blogRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { blogs: 0 })
  res.json(blogs)
})

blogRouter.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id)
  if (!blog) return res.status(404).end()
  res.json(blog)
})

blogRouter.post('/', userExtractor, async (req, res) => {
  const data = req.body

  const user = await User.findById(req.userId)
  if (!user) {
    return res.status(400).json({ error: 'User missing or not valid' })
  }

  const blog = new Blog({
    ...data,
    user: user._id,
  })
  await blog.save()
  await User.updateOne(
    { _id: user._id },
    {
      $push: {
        blogs: blog._id,
      },
    },
  )
  res.status(201).json(blog)
})

blogRouter.delete('/:id', userExtractor, async (req, res) => {
  const user = await User.findById(req.userId)
  if (!user) {
    return res.status(400).json({ error: 'User missing or not valid' })
  }

  const blog = await Blog.findById(req.params.id)
  if (!blog) return res.status(204).end()

  if (user.id.toString() !== blog.user.toString())
    return res.status(401).json({ error: 'Only the creator can delete a blog' })

  await Blog.findByIdAndDelete(blog._id)
  await User.updateOne({ _id: blog.user }, { $pull: { blogs: blog._id } })
  res.status(204).end()
})

blogRouter.put('/:id', userExtractor, async (req, res) => {
  const updated = await Blog.findByIdAndUpdate(
    req.params.id,
    { likes: req.body.likes },
    { returnDocument: 'after' },
  )
  if (!updated) return res.status(404).end()
  res.json(updated)
})

module.exports = blogRouter
