const Blog = require('./blog');
const User = require('./user');
const ReadList = require('./read_list');
const Token = require('./token');

User.hasMany(Blog);
Blog.belongsTo(User);

User.hasMany(Token);
Token.belongsTo(User);

User.belongsToMany(Blog, {through: ReadList, as: 'readBlogs' });
Blog.belongsToMany(User, {through: ReadList, as: 'userRead' });


module.exports = { Blog, User, ReadList, Token };
