const express = require("express")
const bodyParser = require("body-parser")
const https = require("https")
const dotenv = require("dotenv")
const { dir } = require("console")

const app = express()
dotenv.config()

const apiKey = process.env.API_KEY
const audienceID = process.env.AUDIENCE_ID

app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/pages/signup.html")
})

app.post("/", function (req, res) {
  const firstName = req.body.firstName
  const lastName = req.body.lastName
  const emailAddress = req.body.emailAddress

  console.log(firstName, lastName, emailAddress)

  const data = {
    members: [
      {
        email_address: emailAddress,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  }

  const jsonData = JSON.stringify(data)

  const url = "https://us21.api.mailchimp.com/3.0/lists/" + audienceID
  const option = {
    method: "POST",
    auth: "enzeon:" + apiKey
  }

  const request = https.request(url, option, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/pages/success.html")
    } else {
      res.sendFile(__dirname + "/pages/failure.html")
    }

    response.on("data", function (data) {
      console.log(JSON.parse(data))
    })
  })

  request.write(jsonData)
  request.end()
})

// This part of code will redirect the page from failure to root dir
app.post("/failure", function (req, res) {
  res.redirect("/")
})

app.listen(process.env.PORT || 3000, function () {
  console.log(`Server is running on port ${process.env.PORT}`)
})
