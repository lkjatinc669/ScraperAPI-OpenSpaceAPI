require("dotenv").config();
const printer = require("../extra/colorPrinter");
const generator = require("../extra/generators");
const connection = require("../db/connection");
const mailer = require("../extra/mailer")
const md5 = require("md5")
const jTable = "openspacejointable"
const scrTable = "openspacescrapertable"
const logTable = "openspacelogintable"
const fpTable = "openspacefptable"

async function jsteponeCracks(mail) {
    const init = await jcheckmailExists(mail)
    if (init) {
        return [false, "MAIL_EXISTS", "Mail Already Exists", null]
    }
    jvToken = generator(40)
    var jvExist = await jvtokenExist(jvToken)
    while (jvExist) { jvToken = generator(40); jvExist = await jvtokenExist(jvToken) }
    jfToken = generator(40)
    var jfExist = await jftokenExist(jfToken)
    while (jfExist) { jfToken = generator(40); jfExist = await jftokenExist(jfToken) }

    const tempotp = genOTP();
    const otp = tempotp[0]
    const otphash = tempotp[1]
    const y = await jmailExist(mail)
    if (y) {
        const yy = await jupdategmail(mail, otphash, jvToken, jfToken)
        if (yy == 1) {
            const yyy = await mailer.sendJMailOTP(mail, otp)
            if (yyy) {
                return [true, "OTP_RESEND", "OTP ReSend Successfully", [jvToken]]
            } else {
                return [false, "OTP_SEND_ERROR", "OTP Send Error", null]
            }
        } else {
            return [false, "DATABASE_UPDATE_ERROR", "Error in Updating Database", null]
        }
    } else {
        const yy = await jinsertgmail(mail, otphash, jvToken, jfToken)
        if (yy == 1) {
            const yyy = await mailer.sendJMailOTP(mail, otp)
            if (yyy) {
                return [true, "OTP_SEND", "OTP Send Successfully", [jvToken]]
            } else {
                return [false, "OTP_SEND_ERROR", "OTP Send Error", null]
            }
        } else {
            return [false, "DATABASE_UPDATE_ERROR", "Error in Updating Database", null]
        }
    }
}


async function jcheckmailExists(mail) {
    QUERY = `SELECT * FROM ${scrTable} where scraperMail='${mail}'`;
    const [yy] = await connection.query(QUERY)
        .catch(error => printer.warning("[ERROR] : " + error))
    if (yy.length == 0) { return false } else { return true }
}

async function jinsertgmail(mail, hash, vtoken, ftoken) {
    QUERY = `INSERT INTO ${jTable} (mail, otphash, vtoken, ftoken) 
    VALUES ('${mail}', '${hash}', '${vtoken}', '${ftoken}')`
    const [yy] = await connection.query(QUERY)
        .catch(error => printer.warning("[ERROR] : " + error))
    return await yy['affectedRows']
}

async function jupdategmail(mail, hash, vtoken, ftoken) {
    QUERY = `update ${jTable} SET
    otphash='${hash}', 
    vtoken= '${vtoken}', ftoken = '${ftoken}', time=CURRENT_TIMESTAMP WHERE mail='${mail}'`
    const [yy] = await connection.query(QUERY)
        .catch(error => printer.warning("[ERROR] : " + error))
    return await yy['affectedRows']
}

async function jmailExist(mail) {
    QUERY = `SELECT * FROM ${jTable} where mail='${mail}'`;
    const [yy] = await connection.query(QUERY)
        .catch(error => printer.warning("[ERROR] : " + error))
    if (yy.length == 0) { return false } else { return true }
}

async function jvtokenExist(vtoken) {
    QUERY = `SELECT mail FROM ${jTable} where vtoken='${vtoken}'`;
    const [yy] = await connection.query(QUERY)
        .catch(error => printer.warning("[ERROR] : " + error))
    if (yy.length == 0) { return false } else { return true }
}

async function jftokenExist(ftoken) {
    QUERY = `SELECT mail FROM ${jTable} where ftoken='${ftoken}'`;
    const [yy] = await connection.query(QUERY)
        .catch(error => printer.warning("[ERROR] : " + error))
    if (yy.length == 0) { return false } else { return true }
}

async function jsteptwoCracks(mail, vtoken, otphash) {
    const y = await jverifyOTP(vtoken, otphash)
    if (!y) {
        return [false, "OTP_UNVERIFIED", "Otp, Unverified", null]
    } else {
        if (y[0]['mail'] == mail) {
            return [true, "OTP_VERIFIED", "Otp, Verified", [y[0]['ftoken']]]
        } else {
            return [false, "OTP_UNVERIFIED", "Otp, Unverified", null]
        }
    }
}

async function jverifyOTP(vtoken, otphash) {
    QUERY = `SELECT mail, ftoken FROM ${jTable} where vtoken='${vtoken}' AND otphash='${otphash}'`;
    const [yy] = await connection.query(QUERY)
        .catch(error => printer.warning("[ERROR] : " + error))
    if (yy.length == 0) { return false } else { return yy }
}

async function jfinalstepCracks(mail, vtoken, ftoken, otphash, password, scraperid) {
    const y = await jverifyfvToken(mail, vtoken, ftoken, otphash)
    if (!y) {
        return [false, "UNVERIFIED", "Unable to Verify", null]
    } else {
        var stoken = generator(40)
        var sTExist = await checkMainTokenExist(stoken)
        while (sTExist) { stoken = generator(40); sTExist = await checkMainTokenExist(stoken) }

        const yy = await jcheckscraperidExists(scraperid)
        if (yy) {
            return [false, "ID_EXISTS", "Id already Exists", null]
        } else {
            const yyy = await jfinalInsert(scraperid, mail, password, stoken)
            if (yyy == 0) {
                return [false, "DATA_VERIFIED_CREATION_ERROR", "Data Verified, Creation Error", null]
            } else {
                return [true, "DATA_VERIFIED_USER_CREATED", "Data Verified, User Created", null]
            }
        }

    }
}

async function jverifyfvToken(mail, vtoken, ftoken, otphash) {
    QUERY = `SELECT * FROM ${jTable} where mail='${mail}' AND vtoken='${vtoken}' AND ftoken='${ftoken}' AND otphash='${otphash}'`;
    const [yy] = await connection.query(QUERY)
        .catch(error => printer.warning("[ERROR] : " + error))
    if (yy.length == 0) { return false } else { return true }
}

async function checkMainTokenExist(token) {
    QUERY = `SELECT * FROM ${scrTable} where scrapertoken='${token}'`;
    const [yy] = await connection.query(QUERY)
        .catch(error => printer.warning("[ERROR] : " + error))
    if (yy.length == 0) { return false } else { return true }
}

async function jcheckscraperidExists(id) {
    QUERY = `SELECT * FROM ${scrTable} where scraperID='${id}'`;
    const [yy] = await connection.query(QUERY)
        .catch(error => printer.warning("[ERROR] : " + error))
    if (yy.length == 0) { return false } else { return true }
}

async function jfinalInsert(id, mail, password, token) {
    QUERY = `INSERT INTO openspacescrapertable (scraperID, scraperMail, scraperPassword, scraperToken, scraperCreationTime) 
    VALUES ('${id}', '${mail}', '${password}', '${token}', CURRENT_TIMESTAMP)`
    const [yy] = await connection.query(QUERY)
    .catch(error => printer.warning("[ERROR] : " + error))
    return await yy['affectedRows']
}

// ==================================================================================================================
// ============================================= LOGIN - LOGIN - LOGIN ==============================================
// ==================================================================================================================

async function lsteponeCracks(mail, password) {
    lToken = generator(40)
    var lTokenEx = await lcheckLTokenExists(lToken)
    while (lTokenEx) { lToken = generator(40); lTokenEx = await lcheckLTokenExists(lToken) }
    const y = await lcheckLogin(mail, password)
    if (!y) {
        return [false, "INVALID_CREDENTIALS", "The Username or Password is Incorrect", null]
    } else {
        const tempotp = genOTP();
        const otp = tempotp[0]
        const otphash = tempotp[1]
        const yy = await lcheckLMailExists(mail)
        if (yy) {
            const yyy = await lupdateLTable(mail, lToken, otphash)
            if (yyy == 1) {
                const yyyy = await mailer.sendJMailOTP(mail, otp)
                if (yyyy) {
                    return [true, "OTP_RESEND", "OTP ReSend Successfully", [lToken]]
                } else {
                    return [false, "OTP_SEND_ERROR", "OTP Send Error", null]
                }
            } else {
                return [false, "DATABASE_UPDATE_ERROR", "Error in Updating Database", null]
            }
        } else {
            const yyy = await linsertLTable(mail, lToken, otphash)
            if (yyy == 1) {
                const yyyy = await mailer.sendJMailOTP(mail, otp)
                if (yyyy) {
                    return [true, "OTP_SEND", "OTP Send Successfully", [lToken]]
                } else {
                    return [false, "OTP_SEND_ERROR", "OTP Send Error", null]
                }
            } else {
                return [false, "DATABASE_UPDATE_ERROR", "Error in Updating Database", null]
            }
        }
    }
}

async function lcheckLogin(mail, password) {
    QUERY = `SELECT * FROM ${scrTable} where scrapermail='${mail}' and scraperpassword = '${password}'`;
    const [yy] = await connection.query(QUERY)
        .catch(error => printer.warning("[ERROR] : " + error))
    if (yy.length == 0) { return false } else { return true }
}

async function linsertLTable(mail, ltoken, otphash){
    QUERY = `INSERT INTO ${logTable} (mail, ltoken, otphash, time) VALUES ('${mail}', '${ltoken}', '${otphash}', CURRENT_TIMESTAMP)`
    const [yy] = await connection.query(QUERY)
        .catch(error => printer.warning("[ERROR] : " + error))
    if (yy.length == 0) { return false } else { return true }
}

async function lupdateLTable(mail, ltoken, otphash){
    QUERY = `UPDATE ${logTable} SET ltoken='${ltoken}', otphash='${otphash}', time=CURRENT_TIMESTAMP WHERE mail='${mail}'` 
    const [yy] = await connection.query(QUERY)
        .catch(error => printer.warning("[ERROR] : " + error))
    return await yy['affectedRows']
}

async function lcheckLTokenExists(ltoken) {
    QUERY = `SELECT * FROM ${logTable} where ltoken='${ltoken}'`;
    const [yy] = await connection.query(QUERY)
        .catch(error => printer.warning("[ERROR] : " + error))
    if (yy.length == 0) { return false } else { return true }
}

async function lcheckLMailExists(mail) {
    QUERY = `SELECT * FROM ${logTable} where mail='${mail}'`;
    const [yy] = await connection.query(QUERY)
        .catch(error => printer.warning("[ERROR] : " + error))
    if (yy.length == 0) { return false } else { return true }
}

async function lstepfinalCracks(mail, password, ltoken, otphash){
    const y = await lchecklTokenOTP(mail, ltoken, otphash)
    if(!y){
        return [false, "OTP_VERIFICATION_FAILED", "OTP Unverified", null]
    } else {
        const yy = await lgetData(mail, password)
        if (!yy){
            return [false, "OTP_VERIFED_FETCH_ERROR", "OTP Verified Successfully, Error in Fetching Data", null]
        } else {
            return [true, "NO_ERROR", null, [yy[0]['scraperID'], yy[0]['scraperMail'], yy[0]['scraperToken']]]
        }
    }
}

async function lgetData(mail, password) {
    QUERY = `SELECT * FROM ${scrTable} where scrapermail='${mail}' and scraperpassword = '${password}'`;
    const [yy] = await connection.query(QUERY)
        .catch(error => printer.warning("[ERROR] : " + error))
    if (yy.length == 0) { return false } else { return yy }
}

async function lchecklTokenOTP(mail, ltoken, otphash){
    QUERY = `SELECT * FROM ${logTable} where mail='${mail}' AND ltoken='${ltoken}' AND otphash='${otphash}'`;
    const [yy] = await connection.query(QUERY)
        .catch(error => printer.warning("[ERROR] : " + error))
    if (yy.length == 0) { return false } else { return true }
}


// ==================================================================================================================
// ============================== FORGOT-PASSWORD - FORGOT-PASSWORD - FORGOT-PASSWORD ===============================
// ==================================================================================================================

async function fpsteponeCracks(mail){
    const init = await fpcheckmailExists(mail)
    if (!init) {
        return [false, "MAIL_NOT_EXISTS", "Mail Not Exists", null]
    }
    fpToken = generator(40)
    var fpExist = await fptokenExist(fpToken)
    while (fpExist) { fpToken = generator(40); fpExist = await fptokenExist(fpToken) }

    const tempotp = genOTP();
    const otp = tempotp[0]
    const otphash = tempotp[1]
    const y = await fpmailExist(mail)
    if (y) {
        const yy = await fpupdatemail(mail, otphash, fpToken)
        if (yy == 1) {
            const yyy = await mailer.sendJMailOTP(mail, otp)
            if (yyy) {
                return [true, "OTP_RESEND", "OTP ReSend Successfully", [fpToken]]
            } else {
                return [false, "OTP_SEND_ERROR", "OTP Send Error", null]
            }
        } else {
            return [false, "DATABASE_UPDATE_ERROR", "Error in Updating Database", null]
        }
    } else {
        const yy = await fpinsertmail(mail, otphash, fpToken)
        if (yy == 1) {
            const yyy = await mailer.sendJMailOTP(mail, otp)
            if (yyy) {
                return [true, "OTP_SEND", "OTP Send Successfully", [fpToken]]
            } else {
                return [false, "OTP_SEND_ERROR", "OTP Send Error", null]
            }
        } else {
            return [false, "DATABASE_UPDATE_ERROR", "Error in Updating Database", null]
        }
    }
}

async function fpcheckmailExists(mail) {
    QUERY = `SELECT * FROM ${scrTable} where scraperMail='${mail}'`;
    const [yy] = await connection.query(QUERY)
        .catch(error => printer.warning("[ERROR] : " + error))
    if (yy.length == 0) { return false } else { return true }
}

async function fpinsertmail(mail, hash, fptoken) {
    QUERY = `INSERT INTO ${fpTable} (mail, otphash, fptoken, time) 
    VALUES ('${mail}', '${hash}', '${fptoken}', CURRENT_TIMESTAMP)`
    const [yy] = await connection.query(QUERY)
        .catch(error => printer.warning("[ERROR] : " + error))
    return await yy['affectedRows']
}

async function fpupdatemail(mail, hash, fptoken) {
    QUERY = `update ${fpTable} SET
    otphash='${hash}', 
    fptoken = '${fptoken}', time=CURRENT_TIMESTAMP WHERE mail='${mail}'`
    const [yy] = await connection.query(QUERY)
        .catch(error => printer.warning("[ERROR] : " + error))
    return await yy['affectedRows']
}

async function fpmailExist(mail) {
    QUERY = `SELECT * FROM ${fpTable} where mail='${mail}'`;
    const [yy] = await connection.query(QUERY)
        .catch(error => printer.warning("[ERROR] : " + error))
    if (yy.length == 0) { return false } else { return true }
}

async function fptokenExist(fptoken) {
    QUERY = `SELECT mail FROM ${fpTable} where fptoken='${fptoken}'`;
    const [yy] = await connection.query(QUERY)
        .catch(error => printer.warning("[ERROR] : " + error))
    if (yy.length == 0) { return false } else { return true }
}

async function fpsteptwoCracks(mail, fptoken, otphash) {
    const y = await fpverifyOTP(fptoken, otphash)
    if (!y) {
        return [false, "OTP_UNVERIFIED", "Otp, Unverified", null]
    } else {
        if (y[0]['mail'] == mail) {
            return [true, "OTP_VERIFIED", "Otp, Verified", [y[0]['ftoken']]]
        } else {
            return [false, "OTP_UNVERIFIED", "Otp, Unverified", null]
        }
    }
}

async function fpverifyOTP(fptoken, otphash) {
    QUERY = `SELECT mail FROM ${fpTable} where fptoken='${fptoken}' AND otphash='${otphash}'`;
    const [yy] = await connection.query(QUERY)
        .catch(error => printer.warning("[ERROR] : " + error))
    if (yy.length == 0) { return false } else { return yy }
}

async function fpfinalstepCracks(mail, fptoken, otphash, password) {
    const y = await fpverifyfpToken(mail, fptoken, otphash)
    if (!y) {
        return [false, "UNVERIFIED", "Unable to Verify", null]
    } else {
        const yyy = await fpfinalUpdate(mail, password)
        if (yyy == 0) {
            return [false, "DATA_VERIFIED_CREATION_ERROR", "Data Verified, Creation Error", null]
        } else {
            return [true, "DATA_VERIFIED_USER_CREATED", "Data Verified, User Created", null]
        }
    }
}

async function fpverifyfpToken(mail, fptoken, otphash) {
    QUERY = `SELECT * FROM ${fpTable} where mail='${mail}' AND fptoken='${fptoken}' AND otphash='${otphash}'`;
    const [yy] = await connection.query(QUERY)
        .catch(error => printer.warning("[ERROR] : " + error))
    if (yy.length == 0) { return false } else { return true }
}

async function fpfinalUpdate(mail, password) {
    QUERY = `UPDATE ${scrTable} SET 
    scraperPassword = '${password}'
    WHERE scraperMail = '${mail}'`
    const [yy] = await connection.query(QUERY)
    .catch(error => printer.warning("[ERROR] : " + error))
    return await yy['affectedRows']
}

// ==================================================================================================================
// ======================================= GENERATOR - GENERATOR - GENERATOR ========================================
// ==================================================================================================================

async function genTokenCracks(mail, password, token) {
    const y = await gGetData(mail, password, token)
    if (!y){
        return [false, "INVALID_DATA_CREDENTIALS", "Invalid Data", null]
    } else {
        var MainToken = generator(40)
        var MainTokenExists = await checkMainTokenExist(MainToken)
        while (MainTokenExists) { MainToken = generator(40); MainTokenExists = await checkMainTokenExist(MainToken) }
        const yy = await updateMainToken(y[0]['scraperID'], MainToken)
        if(yy == 0){
            return [false, "VALID_CREDENTIALS_TOKEN_ERROR", "Invalid Data", null]
        } else {
            return [true, "NEW_TOKEN_GENERATED", null, [y[0]['scraperID'], y[0]['scraperMail'], MainToken]]
        }
    }
}

async function gGetData(mail, password, token){
    QUERY = `SELECT * FROM ${scrTable} where scrapermail='${mail}' and scraperpassword = '${password}' and scrapertoken='${token}'`;
    const [yy] = await connection.query(QUERY)
        .catch(error => printer.warning("[ERROR] : " + error))
    if (yy.length == 0) { return false } else { return yy }
}

async function updateMainToken(scraperid, token){
    QUERY = `UPDATE ${scrTable} SET
    scrapertoken = '${token}'
    WHERE scraperid = '${scraperid}'`
    const [yy] = await connection.query(QUERY)
        .catch(error => printer.warning("[ERROR] : " + error))
    return await yy['affectedRows']
}

function genOTP() {
    const out = generator(8)
    const outhash = md5(out)
    return [out, outhash]
}

module.exports = { 
    jsteponeCracks, 
    jsteptwoCracks, 
    jfinalstepCracks, 
    lsteponeCracks, 
    lstepfinalCracks,
    fpsteponeCracks, 
    fpsteptwoCracks, 
    fpfinalstepCracks, 
    genTokenCracks
}