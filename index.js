const express = require("express");
const nodemailer = require("nodemailer");
require('dotenv').config()
const cors = require('cors');
const router = express.Router();

const app = express();

const port = 5000;

// Body parser
app.use(express.json())

app.use(cors());

app.use("/", router);

// app.options('/contact', function(req, res) {
//     app.use(express.methodOverride());
//     app.use(express.bodyParser());
//     app.use(function(req, res, next) {
//       res.header("Access-Control-Allow-Origin", "*");
//       res.header("Access-Control-Allow-Headers", "X-Requested-With");
//       next();
//     });
//  });

app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  next();
});
// app.use(cors({
//   origin: '*'
// }));

const contactEmail = nodemailer.createTransport({
  service: 'gmail',
  host: "smtp.example.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.DB_EMAIL,
    pass: process.env.DB_PASS,
  },
});

contactEmail.verify((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Ready to Send");
  }
});

router.get("/contact", (req, res) => {
  res.send("Welcome to a basic express router - contact page");
});

router.post("/contact", (req, res, next) => {
  const name = req.body.name;
  console.log('endpoint hit')
  const email = req.body.email;
  const message = req.body.message; 
  const mail = {
    from: name,
    to: process.env.DB_EMAIL,
    subject: "Contact Form Submission",
    html: `<p>Name: ${name}</p>
           <p>Email: ${email}</p>
           <p>Message: ${message}</p>`,
  };
  contactEmail.sendMail(mail, (error) => {
    if (error) {
      res.json({ status: "ERROR" });
    } else {
      res.json({ status: "Message Sent" });
    }
  });
});

// Home route
router.get("/", (req, res) => {
  res.send("Welcome to a basic express App");
});


// Mock API
router.get("/users", (req, res) => {
  res.json([
    { name: "William", location: "Abu Dhabi" },
    { name: "Chris", location: "Vegas" }
  ]);
});

router.post("/user", (req, res) => {
  const { name, location } = req.body;

  res.send({ status: "User created", name, location });
});

// Listen on port 5000
app.listen(port, () => {
  console.log(`Server is booming on port 5000
Visit http://localhost:5000`);
});
