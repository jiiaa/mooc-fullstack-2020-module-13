const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { SECRET } = require('../util/config');
const { User } = require('../models');
const { Token } = require('../models');

router.post('/', async (req, res, next) => {
  const { username, password } = req.body;
  
  const user = await User.findOne({
    where: {
      username
    }
  });

  if (user.disabled === true) {
    res.status(403).json({ error: 'User is disabled' });
  }

  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash);
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

  const saveToken = Token.build({ token, userId: user.id });
  try {
    const response = await saveToken.save();
    res.status(200).send({
      token, username: user.username, name: user.name
    });
  } catch(error) {
    next(error);
  }
});

module.exports = router;
