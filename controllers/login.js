const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { SECRET } = require('../util/config');
const User = require('../models/user');

router.post('/', async (req, res) => {
  const { username, password } = req.body;
  console.log({ username });
  console.log({ password });
  
  const user = await User.findOne({
    where: {
      username
    }
  });
  console.log({ user });

  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash);
  console.log({ passwordCorrect });
  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'Invalid username or password'
    });
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  };

  const token = jwt.sign(userForToken, SECRET);

  res.status(200).send({
    token, username: user.username, name: user.name
  });
});

module.exports = router;
