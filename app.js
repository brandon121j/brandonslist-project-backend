const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require('cors')

const app = express();

const userRouter = require("./routes/users/usersRouter");
const postingsRouter = require("./routes/postings/postingsRouter");

app.use(cors());
app.options("*", cors());

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

app.use("/api/auth/users", userRouter);
app.use("/api/auth/postings", postingsRouter);

module.exports = app