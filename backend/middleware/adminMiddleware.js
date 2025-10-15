const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next(); // If user is an admin, proceed to the next function
  } else {
    res.status(401); // 401 means 'Unauthorized'
    throw new Error('Not authorized as an admin');
  }
};

module.exports = { admin };