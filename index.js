const express = require("express");
const nodemailer = require("nodemailer");
require('dotenv').config()
const cors = require('cors');
const stripe = require('stripe')('sk_test_51JO53hGd6y5dsV4wldeuMRLbt9xf101lbVCgOGiFaODbUAbZraWxtozER3CLknN71cDa1jshIDRTw8MMjohbtKAn00grvq64e8');
const router = express.Router();

const app = express();

const port = 5000;

app.use(express.static('.'));

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


router.get("/contact", (req, res) => {
  res.send("Welcome to a basic express router - contact page");
});

router.post("/contact", (req, res, next) => {
  
const contactEmail = nodemailer.createTransport({
  service: 'gmail',
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
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
      res.json({ status: "ERROR", error});
    } else {
      res.json({ status: "Message Sent" });
    }
  });
});

// Home route
router.get("/", (req, res) => {
  res.send("Welcome to a basic express app");
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


router.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: [
      'card',
    ],
    line_items: [
      {
        // TODO: replace this with the `price` of the product you want to sell
        price: 'price_1JO5NBGd6y5dsV4wVkW3JIvI',
        quantity: 1
      },
    ],
    mode: 'payment',
    success_url: `http://localhost:3000?success=true`,
    cancel_url: `http://localhost:3000?canceled=true`,
  });

  res.redirect(303, session.url)
});
