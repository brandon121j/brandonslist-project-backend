const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

const userRouter = require('./routes/users/usersRouter');
const postingsRouter = require('./routes/postings/postingsRouter');


app.use(cors());
// app.options('http://localhost:4000/', cors());

if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());

app.use('/api/auth/users', userRouter);
app.use('/api/auth/postings', postingsRouter);
app.use('/api/public/images', express.static(__dirname + '/public/images/'));

module.exports = app;
