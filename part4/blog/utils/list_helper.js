const dummy = () => 1

const totalLikes = (blogs) => blogs.reduce((sum, { likes }) => sum + likes, 0)

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null
  return blogs.reduce((fav, blog) => (blog.likes > fav.likes ? blog : fav))
}

const countByAuthor = (blogs, getValue) => {
  const counts = {}
  for (const blog of blogs) {
    counts[blog.author] = (counts[blog.author] || 0) + getValue(blog)
  }
  return Object.entries(counts).reduce((max, entry) =>
    entry[1] > max[1] ? entry : max,
  )
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null
  const [author, count] = countByAuthor(blogs, () => 1)
  return { author, blogs: count }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null
  const [author, likes] = countByAuthor(blogs, (blog) => blog.likes)
  return { author, likes }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
