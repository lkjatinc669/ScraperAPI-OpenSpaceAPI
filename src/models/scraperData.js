require("dotenv").config()
const md5 = require('md5')
const generator = require("../extra/generators")
const printer = require("../extra/colorPrinter")
const connection = require("../db/connection")
const mailer = require("../extra/mailer")
const scraperTable = process.env.SCRAPERTABLE;
const fpTable = process.env.FPTABLE;

async function createscraperCracks(gmail){
    const id = "0000000000"+generator.generator(20)
    const otpnhash = genOTP()
    const otp = otpnhash[0]
    const hash = otpnhash[1]
    const token = generator.generator(40)
    var yy = await createScraper(gmail);

    if (yy == 0){
        return [false, "INSERT_ERROR", "Error Occured Try Again", null]
    } else {
        if (mailer.sendMailOTP(gmail, otp)){
            return [true, "OTP_SEND", "OTP Send, Follow Next Step", [token]]
        } else {
            return [false, "OTP_SEND_ERROR", "OTP send error", null]
        }
    }
}

async function createScraper(id, gmail, otp, temptoken){
    QUERY = `INSERT INTO 'openspacescrapertable' ('scraperID', 'scraperGmail', 'scraperPassword', 'scraperToken', 'scraperCreationTime', 'otp', 'temptoken') 
    VALUES (${id}, ${gmail}, NULL, NULL, CURRENT_TIMESTAMP, ${otp}, ${temptoken})`
    const [yy] = await connection.query(QUERY)
    .catch(error => printer.warning("[ERROR] : "+error))
    return await yy['affectedRows']
}

async function verifyscraperCracks(gmail, token, otp, passwd) {
    var stoken = generator.generator(40)
    var id = generator.generator(30)
    const yy = await checkMailnTokennOTP(gmail, token, otp)
    if (!yy){
        return [false, "OTP_VERIFICATION_FAIL", "OTP Verification Failed", null]
    } else {
        const yyy = await updateUser(gmail, id, passwd, stoken)
        if (yyy==0){
            return [false, "OTP_VERIFIED_ERROR_UPDATE", "OTP Verification Successful. Error in Updating", null]
        } else {
            return [true, "NO_ERROR", null, null]
        }
    }
}

async function checkMailnTokennOTP(gmail, token, otp){
    QUERY = `SELECT * FROM ${scraperTable} where scraperGmail='${gmail}' AND token='${token}' AND otp='${otp}'`;
    const [yy] = await connection.query(QUERY)
    .catch(error => printer.warning("[ERROR] : "+error))
    if (yy.length == 0) { return false } else { return true }
}

async function updateUser(gmail, id, passwd, stoken){
    QUERY = `UPDATE ${scraperTable} 
    SET 'scraperID'='${id}','scraperPassword'='${passwd}','scraperToken'='${stoken}',
    'scraperCreationTime'='CURRENT_TIMESTAMP','otp'='NULL','temptoken'='NULL' 
    WHERE scraperGmail='${gmail}'`
    const [yy] = await connection.query(QUERY)
        .catch(error => printer.warning("[ERROR] : "+error))
    return await yy['affectedRows']
}

async function generateToken(gmail, passwd){
    const stoken = generator.generator(40)
    const id = generator.generator(30)
    const yy = await getId(gmail, passwd)
    if (!yy){
        return [false, "USER_NOTVERIFIED", "User Verification Unsuccessful", null]
    } else {
        const yyy = updateUser(gmail, id, stoken)
        if (yyy==0){
            return [false, "USER_VERIFIED_UPDATE_ERROR", "User Verification Successful. Update Error", null]
        } else {
            return [true, "No_ERROR", null, [id, token]]
        }
    }
}

async function getId(mail, passwd){
    QUERY = `SELECT scraperID FROM ${scraperTable} where scraperGmail='${mail}' AND scraperPassword='${passwd}'`;
    const [yy] = await connection.query(QUERY)
    .catch(error => printer.warning("[ERROR] : "+error))
    if (yy.length == 0) { return false } else { true }
}


async function updateUser(gmail, id, stoken){
    QUERY = `UPDATE ${scraperTable} 
    SET 'scraperID'='${id}','scraperToken'='${stoken}',
    WHERE scraperGmail='${gmail}'`
    const [yy] = await connection.query(QUERY)
        .catch(error => printer.warning("[ERROR] : "+error))
    return await yy['affectedRows']
}


async function getTokenInfo(token) {
    QUERY = `SELECT * FROM ${scraperTable} where scraperToken='${token}'`;
    const [yy] = await connection.query(QUERY)
    .catch(error => printer.warning("[ERROR] : "+error))
    if (yy.length == 0) { return false } else { return [yy] }
}
function genOTP() {
    const out = generator(8)
    const outhash = md5(out)
    return [out, outhash]
}

module.exports = {createscraperCracks, verifyscraperCracks, generateToken, getTokenInfo}