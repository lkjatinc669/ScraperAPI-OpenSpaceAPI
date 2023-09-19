require("dotenv").config();
const printer = require("../extra/colorPrinter");
const generator = require("../extra/generators");
const connection = require("../db/connection");
linksTable = process.env.LINKSTABLE

async function addCracks(baseweb, scrweb, by){
    var id = generator(34)
    console.log(id)
    const yy = await add(id, baseweb, scrweb, by)
    if(yy==0){
        return false
    } else {
        return true
    }
}

async function add(id, base, link, by){
    QUERY = `INSERT INTO openspacelinkstable(websiteid, websitebase, websitelink, websiteisscraped, scrapedBy, addedOn) 
    VALUES ('${id}','${base}','${link}','0','${by}',CURRENT_TIMESTAMP)`
    const [yy] = await connection.query(QUERY)
    .catch(error => printer.warning("[ERROR] : "+error))
    return await yy['affectedRows']
}

async function getCracks(){
    const yy = await get()
    if (!yy){
        return false
    } else {
        return []
    }
}

async function get() {
    QUERY = `SELECT * FROM openspacelinkstable`;
    const [yy] = await connection.query(QUERY)
    .catch(error => printer.warning("[ERROR] : "+error))
    console.log(yy)
} (async function() {
    console.log(await addCracks("hjskalfsdjkafskld", 'ghsdjkafsafkdja', 'sfdahfsafhksadfhklsafk'))
})
get()
// (async () => {const data = await get(); console.log(data)})()
process.exit()

module.exports = { addCracks, getCracks }