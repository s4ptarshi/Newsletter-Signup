const express = require("express")
const bodyParser = require("body-parser")
const https = require("https")
const app = express()
const dotenv = require("dotenv")
dotenv.config()
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static("public"))

app.get("/", (req, res) => {
    res.sendFile(`${__dirname}/signup.html`)
})

app.post("/failure", (req,res) => {
    res.redirect("/")
})

app.post("/", (req, res) => {
    const firstName = req.body.fName
    const lastName = req.body.lName
    const email = req.body.email
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data)

    const url = `https://${process.env.server}.api.mailchimp.com/3.0/lists/${process.env.listId}`

    const options = {
        method: `POST`,
        auth: `anystring:${process.env.apiKey}`
    }

    const request = https.request(url, options, (response) => {
        response.on("data", (data) => {
            console.log(JSON.parse(data))
        })

        if (response.statusCode === 200) {
            res.sendFile(`${__dirname}/success.html`)
        }
        else res.sendFile(`${__dirname}/failure.html`)

    })

    request.write(jsonData)
    request.end()
})

app.listen(3000, () => {
    console.log(`server is listening to port 3000`)
    console.log(process.env.apiKey)
})
