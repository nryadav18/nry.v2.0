var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var nodemailer = require('nodemailer');
var bodyParser = require('body-parser');
var cors = require('cors'); // Optional: for handling cross-origin requests

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// Middleware setup
app.use(cors());  // Enable CORS (if needed)
app.use(bodyParser.json())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const PORT = 5000

app.listen(PORT, function (){
  console.log(`Server is Running at ${PORT}`)
})

// Set up Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can replace with any other email service
  auth: {
    user: 'nedurirajeswaryadav5@gmail.com',  // Replace with your email
    pass: 'rgef icay kemu tvgn'    // Replace with your email password or use an App Password for Gmail with 2FA
  }
});

// POST route to handle email form submission
app.post('/send-email', (req, res) => {
  const { Name, E_mail, Phone, Message } = req.body;

  const mailOptions = {
    from: E_mail,  // Sender's email
    to: 'nedurirajeswaryadav5@gmail.com', // Recipient's email
    subject: `A Sweet Message from ${Name}`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>A Sweet Message</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            color: #333;
            width: 100%;
            max-width : 100svw;
          }
          .email-container {
            width: 100%;
            background-color: #ffffff;
            max-width: 100svw;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          .email-header {
            background-color: #007bff;
            padding: 15px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          .email-header h1 {
            color: white;
            font-size: 24px;
            margin: 0;
          }
          .email-body {
            padding: 20px;
            background-color: #f9f9f9;
            border-radius: 0 0 8px 8px;
          }
          .email-body h2 {
            font-size: 20px;
            color: #333;
            margin-bottom: 10px;
          }
          .email-body p {
            font-size: 16px;
            line-height: 1.5;
            color: #555;
          }
          .email-body .message {
            background-color: #f4f4f4;
            padding: 10px;
            border-radius: 5px;
            margin-top: 15px;
            font-style: italic;
            color: #333;
          }
          .email-footer {
            margin-top: 20px;
            text-align: center;
            font-size: 12px;
            color: #777;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="email-header">
            <h1>Message from Fans through your Portfolio</h1>
          </div>
          <div class="email-body">
            <h2>Message from ${Name}</h2>
            <p><strong>Name:</strong> ${Name}</p>
            <p><strong>Company:</strong> ${Company}</p>
            <p><strong>Email Address:</strong> ${E_mail}</p>
            <p><strong>Phone Number:</strong> ${Phone}</p>
            <h3>Message:</h3>
            <p class="message">${Message}</p>
          </div>
          <div class="email-footer">
            <p>Thank you for your message! We'll get back to you soon.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ message: 'Failed to send email', error });
    } else {
      console.log('Email sent: ' + info.response);
      return res.status(200).json({ message: 'Email sent successfully' });
    }
  });
});

// Catch all route for 404 - not found
app.use((req, res, next) => {
  res.status(404).json({ message: 'Page not found. Please check the URL.' });
});

// Error handler middleware
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
