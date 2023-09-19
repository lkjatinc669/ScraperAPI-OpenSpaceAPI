require("dotenv").config()

const printer = require("./src/extra/colorPrinter")
const path = require("path")
const express = require("express");
const fileUpload = require('express-fileupload');

scraperRoute = require("./src/routes/scraperRoutes")
linksRoute = require("./src/routes/linksRoutes")

const PORT = 6693;
const app = express();
app.use(fileUpload());

app.use("/scraper", scraperRoute)

app.listen(PORT, function (err) {
    if (err) {
        printer.warning("[Error] : Error Occured " + err)
    }
    else {
        printer.info("[INFO] : Server Started Successfully")
        printer.info("[INFO] : Accounts API - by OpenSpaceAPI is Running on PORT " + PORT)
    }
}).on("ERROR", function (err) {
    printer.warning("[Error] : Error Occured " + e)
})