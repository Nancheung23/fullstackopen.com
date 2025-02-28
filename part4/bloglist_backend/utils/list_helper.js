const lodash = require('lodash');


// 4.3: helper functions and unit tests, step1
const dummy = blogs => {
    return 1;
};

// 4.4: Helper Functions and Unit Tests, step 2
const totalLikes = blog => {
    return blog ? blog[0].likes : null;
};

// 4.5: Helper Functions and Unit Tests, step 3
const favouriteBlog = blogs => {
    const blog = blogs
        .sort((a, b) => b.likes - a.likes)[0]
    return {
        title: blog.title,
        author: blog.author,
        likes: blog.likes
    }
};

// 4.6*: Helper Functions and Unit Tests, step 4
const mostBlogs = blogs => {
    const authors = lodash.countBy(blogs, 'author');
    const result = lodash.sortBy(Object.entries(authors).map(([author, count]) => ({
        author,
        count
    })), 'count');
    const author = result[result.length - 1];
    return {
        author: author.author,
        blogs: author.count
    };
}

// 4.7*: Helper Functions and Unit Tests, step 5
const mostLikes = blogs => {
    const authorList = lodash.groupBy(blogs, 'author');
    const result = Object.entries(authorList).map(author => {
        return {
            author: author[0],
            likes: author[1].reduce((sum, blog) => sum + blog.likes, 0)
        }
    });
    return result.sort((a, b) => b.likes - a.likes)[0];
};

module.exports = {
    dummy,
    totalLikes,
    favouriteBlog,
    mostBlogs,
    mostLikes
};