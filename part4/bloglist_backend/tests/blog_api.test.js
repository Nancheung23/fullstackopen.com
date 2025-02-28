const { test, after, beforeEach, describe } = require('node:test');
const assert = require('node:assert/strict');
const Blog = require('../models/blog');
const User = require('../models/user');
const helper = require('./test_helper');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);

describe('when there is initially some blogs saved', () => {
    beforeEach(async () => {
        await Blog.deleteMany({});
        await User.deleteMany({});

        const testUser = {
            username: "root",
            name: "Superuser",
            password: "secret"
        };

        const userResponse = await api.post('/api/users').send(testUser);
        testUser.id = userResponse.body.id;

        const loginResponse = await api.post('/api/login').send({
            username: testUser.username,
            password: testUser.password
        });

        global.testToken = loginResponse.body.token;
        global.testUserId = testUser.id;

        for (const blog of helper.initialBlogs) {
            let blogObject = new Blog({ ...blog, user: testUser.id });
            await blogObject.save();
        }
    });

    // 4.8: Blog List Tests, step 1
    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    });

    test('blogs return equal length as initialBlogs', async () => {
        const response = await api.get('/api/blogs');
        assert.strictEqual(response.body.length, helper.initialBlogs.length);
    });

    test('the first blog is about React patterns', async () => {
        const response = await api.get('/api/blogs');
        const titles = response.body.map(e => e.title);
        // assert.strictEqual(contents.includes('HTML is easy'), true);
        assert(titles.includes('React patterns'));
    });
});

describe('view specific blog', () => {
    // 4.9: Blog List Tests, step 2
    test('a specific blog can be viewed', async () => {
        const blogAtStart = await helper.blogsInDb();
        const blogToView = blogAtStart[0];
        const resultBlog = await api
            .get(`/api/blogs/${blogToView.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/);
        // remove buffer
        assert.deepStrictEqual(resultBlog.body, blogToView);
    });

    test('fails with status code 400 id is invalid', async () => {
        const invalidId = '5a3d5da59070081a82a3445';
        await api
            .get(`/api/blogs/${invalidId}`)
            .expect(400);
    });
});

describe('addition of a new blog', () => {
    // 4.10: Blog List Tests, step 3
    test('a valid blog can be added', async () => {
        const newBlog = {
            title: "The Clean Code Blog",
            author: "Robert C. Martin",
            url: "https://blog.cleancoder.com/uncle-bob/2019/05/18/737-Max-8.html",
            likes: 0
        };

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${global.testToken}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const blogsAtEnd = await helper.blogsInDb();
        const titles = blogsAtEnd.map(e => e.title);
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);
        assert(titles.includes('The Clean Code Blog'));
    });


    // 4.12*: Blog List tests, step 5
    test('blog without title is not added', async () => {
        const newBlog = {
            author: "Robert C. Martin",
            url: "https://blog.cleancoder.com/uncle-bob/2019/11/08/OpenLetterLinuxFoundation.html",
            likes: 11,
        };
        const blogsAtStart = await helper.blogsInDb();
        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${global.testToken}`)
            .send(newBlog)
            .expect(400)
            .expect('Content-Type', /application\/json/);
        const blogsAtEnd = await helper.blogsInDb();
        const titles = blogsAtEnd.map(e => e.title);
        assert.strictEqual(blogsAtEnd.length, blogsAtStart.length);
        assert(!titles.includes('Open Letter to the Linux Foundation'));
    });

    // 4.11*: Blog List Tests, step 4
    test('add blog with missing likes', async () => {
        const newBlog = {
            title: "737 Max 8",
            author: "Robert C. Martin",
            url: "https://blog.cleancoder.com/uncle-bob/2019/05/18/737-Max-8.html"
        };

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${global.testToken}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/);
        const blogAtEnd = await helper.blogsInDb();
        assert.deepStrictEqual(blogAtEnd[blogAtEnd.length - 1].likes, 0);
    });

    // 4.12*: Blog List tests, step 5
    test('add blog with missing url', async () => {
        const newBlog = {
            title: "The Disinvitation",
            author: "Robert C. Martin",
            likes: 17
        };
        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${global.testToken}`)
            .send(newBlog)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        const blogsAtEnd = await helper.blogsInDb();
        const titles = blogsAtEnd.map(blog => blog.title);
        assert(!titles.includes('The Disinvitation'));
    });
});

// 4.13 Blog list expansions, step1
describe('deletion of the blog', () => {
    test('a blog can be deleted', async () => {
        const blogAtStart = await helper.blogsInDb();
        const blogToDelete = blogAtStart[blogAtStart.length - 1];

        if (!blogToDelete) {
            throw new Error("No blog found for test user!");
        }

        console.log(blogToDelete);

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', `Bearer ${global.testToken}`)
            .expect(204);

        const blogAtEnd = await helper.blogsInDb();
        const titles = blogAtEnd.map(blog => blog.title);
        assert(!titles.includes(blogToDelete.title));
        assert.strictEqual(blogAtEnd.length, blogAtStart.length - 1);
    });
});

// 4.14 Blog list expansions, step2
describe('update blog information', () => {
    test('update single blog info', async () => {
        const updateBody = {
            title: 'Test Contra-variance',
            author: 'Robert C. Martin',
            url: 'https://blog.cleancoder.com/uncle-bob/2017/10/03/TestContravariance.html',
            likes: 11
        };
        const blogAtStart = await helper.blogsInDb();
        const blogToUpdate = blogAtStart[blogAtStart.length - 1];
        await api
            .patch(`/api/blogs/${blogToUpdate.id}`)
            .set('Authorization', `Bearer ${global.testToken}`)
            .send(updateBody)
            .expect(200)
            .expect('Content-Type', /application\/json/);
        const blogAtEnd = await helper.blogsInDb();
        const titles = blogAtEnd.map(blog => blog.title);
        assert(!titles.includes('737 Max 8'));
        assert(titles.includes('Test Contra-variance'));
    })
});

after(async () => {
    await mongoose.connection.close();
});