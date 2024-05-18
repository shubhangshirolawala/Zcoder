require('dotenv').config();
require('express-async-errors');

const cors = require('cors');


const express = require('express');
const app = express();

// error handler

const connectDB = require('./db/connect');
const authenticateUser = require('./middleware/authentication');

// routers
const authRouter = require('./routes/auth');
const questionsRouter = require("./routes/questions");
const commnetsRouter = require("./routes/comments");

const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const questions = require('./models/questions');

app.use(express.json());
// extra packages
app.use(cors());

// routes
app.get('/', (req, res) => {
  res.send('Zcoder api');
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/questions/',authenticateUser,questionsRouter);
app.use("/api/v1/comments", authenticateUser, commnetsRouter);
// app.use('/api/v1/patient', authenticateUser, vitalsRouter);
// app.use('/api/v1/doctor', authenticateUser, doctorRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 4000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
