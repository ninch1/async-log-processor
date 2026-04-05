module.exports = (err, req, res, next) => {
  const statusCode = err.statusCode ? err.statusCode : 500;
  res.status(err.statusCode).json({
    success: false,
    error: err.message,
  });
};
