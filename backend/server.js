const express = require("express");
const cors = require("cors");
const contestRoutes = require("./routes/contestRoutes");

const app = express();

app.use(express.json());
app.use(cors()); // Enable CORS for all routes

// Routes
app.use("/api/contests", contestRoutes);
app.get("/", (req, res) => {
  res.redirect("/api/contests"); // Redirect to a different route
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
