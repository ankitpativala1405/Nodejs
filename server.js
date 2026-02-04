const express = require("express");
const dotenv = require("dotenv");
const mysqlpool = require("./config/db");
const integrationRouter = require("./routes/integration.route");
const authRouter = require("./routes/auth.route");

dotenv.config();
const app = express();

app.use(express.json());

app.use("/api/integration", integrationRouter);
app.use('/api/auth', authRouter)

app.get("/", (req, res) => {
  res.status(200).send("Backend Server Worked");
});

const Port = process.env.PORT;

mysqlpool
  .query("SELECT 1")
  .then(() => {
    console.log("Database Connected .....");

    app.listen(Port, (err) => {
      if (!err) {
        console.log(`Server Running On Port ${Port}`);
      } else {
        console.log('Error on Server', err)
      }
    });
  })
  .catch((err) => {
    console.error("DB Connection Failed:", err.message);
  });
