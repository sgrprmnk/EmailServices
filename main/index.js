const express = require("express");
const index = express();
const bodyParser = require("body-parser"); //middleware
const exphbs = require("express-handlebars"); //to make template easier
const path = require("path");
const sgMail = require("@sendgrid/mail"); //Sendgrid Provider

require("dotenv").config();

////////////////////////////////////
//View engine setup
////////////////////////////////////
index.engine("handlebars", exphbs());
index.set("view engine", "handlebars");

////////////////////////////////////
// Static folder
///////////////////////////////////
index.use("/public", express.static(path.join(__dirname, "public")));

////////////////////////////////////
//Body Parser Middleware
////////////////////////////////////
index.use(bodyParser.urlencoded({ extended: false }));
index.use(bodyParser.json());

index.get("/", (req, res) => {
  res.render("contact");
});

index.post("/send", (req, res) => {
  const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>  
      <li>Name: ${req.body.name}</li>
      <li>Company: ${req.body.company}</li>
      <li>Email ID: ${req.body.email}</li>
      <li>Contact Number: ${req.body.phone}</li>
    </ul>
    <h3>Type a message</h3>
    <p>${req.body.message}</p>
  `;

  try {
    try {
      //////////////////////////////
      //Using sandgrid------->>>
      //////////////////////////////
      const API_KEY =
        "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
      sgMail.setApiKey(API_KEY);

      const message = {
        to: ["sgrprmnk@gmail.com", "prmnksgr@gmail.com"],
        from: {
          name: "ICICI Innovation",
          email: "sgrprmnk@gmail.com",
        },
        subject: "ICICI Innovation",
        text: "Hello India",
        html: "<h1>Hello India</h1>",
      };

      sgMail
        .send(message)
        .then((response) => console.log("Email sent..."))
        .catch((error) => console.log(error.message));
    } catch {
      ///////////////////////////////
      //Using mailgun------->>>
      //////////////////////////////

      var mailgun = require("mailgun-js")({
        apiKey: process.env.api_key,
        domain: process.env.domain,
      });
      var data = {
        from: "sgrprmnk@gmail.com",
        to: "prmnksgr@gmail.com",
        subject: "ICICI Innovation",
        text: "Hello India",
        html: "<h1>Hello India</h1>",
      };

      mailgun.messages().send(data, function (error, body) {
        if (error) {
          console.log(error);
        }
        console.log(body);
      });
    }
    ///////////////////////////////
    //Using Amazon SES------->>>
    //////////////////////////////
  } finally {
    var ses = require("node-ses"),
      client = ses.createClient({ key: "key", secret: "secret" });

    const key = "XXXXXXXXXXXXX";
    const secret = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";

    ////////////////////////////
    // Give SES the details and let it construct the message for client.
    ///////////////////////////////
    client.sendEmail(
      {
        to: "prmnksgr@gmail.com",
        from: "sgrprmnk@gmail.com",
        cc: "innovation@icici.com",
        bcc: ["hr@icici.com", "developer@icici.com"],
        subject: "ICICI Innovation",
        message: "<h1>Hello India</h1>",
        altText: "Hello India",
      },
      function (err, data, res) {
        // ...
      }
    );

    ////////////////////////////////////
    // ... or build a message from scratch yourself and send it.
    ////////////////////////////////////
    client.sendRawEmail(
      {
        from: "sgrprmnk@gmail.com",
        rawMessage: rawMessage,
      },
      function (err, data, res) {
        console.log(res);
      }
    );
  }
  res.end();
});

index.listen(3000, () => console.log("server running..."));
