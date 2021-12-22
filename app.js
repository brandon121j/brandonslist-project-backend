const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const fileupload = require('express-fileupload'); 

const app = express();

const userRouter = require('./routes/users/usersRouter');
const postingsRouter = require('./routes/postings/postingsRouter');


app.use(cors());
app.options('*', cors());

if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

app.use('/api/auth/users', userRouter);
app.use('/api/auth/postings', postingsRouter);
app.use('/public/images', express.static(__dirname + '/public/images/'));

module.exports = app;
