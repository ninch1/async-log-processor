const express = require('express');
const jobsRoute = require('./controllers/jobs');
const errorMiddleware = require('./middleware/errorMiddleware');
const ErrorResponse = require('./utils/ErrorResponse');

const PORT = 3000;

const app = express();

app.use('/jobs', jobsRoute);

app.use((req, res, next) => {
  next(new ErrorResponse(`URL: ${req.url} does not exist.`, 404));
});

app.use(errorMiddleware);

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
