const blogRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const middleware = require('../utils/middleware');

// used express-async-errors to do automatical try-catch block
// 4.20 *: Blog List Expansion, step8


blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
    response.json(blogs);
    // Blog
    //     .find({})
    //     .then(blogs => {
    //         response.json(blogs);
    //     })
});

blogRouter.get('/:id', async (req, res) => {
    const blog = await Blog
        .findById(req.params.id)
        .populate('user', { username: 1, name: 1 });
    if (blog) {
        res.status(200).json(blog);
    } else {
        res.status(404).end();
    }
    // Blog
    //     .findById(req.params.id)
    //     .then(blog => {
    //         res.json(blog);
    //     })
});

// 4.17: Blog List Expansion, step5
// 4.19: Blog List Expansion, step7
blogRouter.post('/', middleware.jwtValidation, middleware.userExtractor, async (request, response) => {
    const body = request.body;
    const user = await User.findById(request.userId);

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: (body.likes) && (body.likes >= 0) ? body.likes : 0,
        user: user.id
    });
    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
    return response.status(201).json(savedBlog);
});

// 4.13 Blog list expansions, step1
// 4.21 *: Blog List Expansion, step9
blogRouter.delete('/:id', middleware.jwtValidation, middleware.userExtractor, async (req, res) => {
    const deleteId = req.params.id;
    const blog = await Blog.findById(deleteId).populate('user');
    if (!blog) {
        return res.status(404).json({ error: 'Blog not found' });
    };
    if (!blog.user || blog.user._id.toString() !== req.userId) {
        return res.status(403).json({ error: 'Unauthorized user' });
    };
    const result = await Blog.findByIdAndDelete(deleteId);
    return res.status(204).send(result);
});

// 4.14 Blog list expansions, step2
// 4.21 *: Blog List Expansion, step9
blogRouter.put('/:id', middleware.jwtValidation, middleware.userExtractor, async (req, res) => {
    const updateId = req.params.id;
    const updateBody = req.body;
    const result = await Blog.findByIdAndUpdate(
        updateId,
        { $set: updateBody },
        { new: true, runValidators: true }
    );
    if (!result) {
        return res.status(404).json({ error: 'Blog not found' });
    };
    return res.status(200).json(result);
});

module.exports = blogRouter;