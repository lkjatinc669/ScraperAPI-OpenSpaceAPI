require("dotenv").config()

//fileFunction for debugging
function filename() {
    return module.filename.slice(__filename.lastIndexOf(path.sep) + 1)
}

const printer = require("./src/extra/colorPrinter")
const path = require("path")
const express = require("express");
const fileUpload = require('express-fileupload');
const connection = require("./src/db/connection");
const logo = require("./logo")

scraperaccRoute = require("./src/routes/scraperaccRoutes")

const PORT = 6699;
const app = express();
app.use(fileUpload());

app.use("/scraper-account", scraperaccRoute)

app.get("/", (req, res)=>{
    res.json({ "ERROR": true, "ERRCODE": "GET_NOT_ALLOWED", "DESC": "Insecure way of Sending Data", "DATA": null })
})
app.post("/", (req, res)=>{
    res.json({ "ERROR": true, "ERRCODE": "NO_PATH_EXIST", "DESC": "Invalid Path or Path not Exist", "DATA": null })
})

printer.info(logo)
printer.info("[INFO] : Initiating Database Connection")
connection.query("SELECT 1=1")
    .then(data => {
        if (data[0][0]['1=1'] == 1) {
            printer.info("[INFO] : Database Connection Successfull")
            printer.info("[INFO] : Starting Server")
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
        }
    })
    .catch(err => {
        printer.warning("[Error] : DB Connection Failed " + err);
        printer.warning("[Error] : Closing Connection And Exiting");
    });
