const express = require('express')
const app = express()
const port = process.env.PORT || 5000

app.get('/', (req, res) => {
    res.send("Hello this is the travelagency main api")
})

app.listen(port, () => {
    console.log("Running server port number is", port)
})