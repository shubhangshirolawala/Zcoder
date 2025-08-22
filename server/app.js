require('dotenv').config();
require('express-async-errors');

const cors = require('cors');


const express = require('express');
const app = express();


const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); //for handling image upload



// error handler

const connectDB = require('./db/connect');
const authenticateUser = require('./middleware/authentication');

// routers
const contestRoutes = require("./routes/contestRoutes");
const authRouter = require('./routes/auth');
const questionsRouter = require("./routes/questions");
const commnetsRouter = require("./routes/comments");
const userRouter = require("./routes/user")
const chatRouter = require("./routes/chat");
// const contestRoutes = require("./routes/contestRoutes");
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
// const questions = require('./models/questions');
const friendMessageRoutes = require("./routes/friendMessages");


app.use(express.json());

app.use(cors());

// routes
app.get('/', (req, res) => {
  res.send('Zcoder api');
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/questions/',authenticateUser,questionsRouter);
app.use("/api/v1/comments", authenticateUser, commnetsRouter);
app.use('/api/v1/user',authenticateUser,userRouter)
app.use('/api/v1/chat', chatRouter);
app.use("/api", friendMessageRoutes);
// app.use('/api/v1/patient', authenticateUser, vitalsRouter);
// app.use('/api/v1/doctor', authenticateUser, doctorRouter);


app.use('/api/contests', contestRoutes);
app.get("/", (req, res) => {
  res.redirect("/api/contests"); // Redirect to a different route
});

app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);

// app.use("/api/contests/", contestRoutes);
// app.get("/", (req, res) => {
//   res.redirect("/api/contests"); // Redirect to a different route
// });
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
