const router = require('express').Router();
const jwt = require('jsonwebtoken');

const { SECRET } = require('../util/config');
const { Token } = require('../models');

// Verify the token and extract the user info
const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
    } catch (error){
      console.log({ error });
      return res.status(401).json({ error: 'Token invalid' });
    }
  } else {
    return res.status(401).json({ error: 'Token missing' });
  }
  next();
}

router.delete('/', tokenExtractor, async (req, res, next) => {
  if (!req.decodedToken) {
    return res.status(400).json({ error: 'Token missing or invalid '});
  }
  try {
    const response = await Token.destroy({
      where: { user_id: req.decodedToken.id }
    });
    res.json(response);
  } catch(error) {
    next(error);
  }
});

module.exports = router;
