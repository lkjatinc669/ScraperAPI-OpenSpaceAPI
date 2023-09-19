const scraperData = require("../models/scraperData")
const mailVerifier = require("../extra/verifier")


async function joinScraper(req, res){
    const list = filterFetchv1(req.query)
    if (!list[0]){
        res.json({
            "ERROR": true,
            "ERRCODESTR": list[1],
            "DESC": list[2],
            "DATA": null
        })
    } else {
        const yyy = await scraperData.createscraperCracks(list[3][0])
        if (!yyy[0]){
            res.json({
                "ERROR": true,
                "ERRCODESTR": list[1],
                "DESC": list[2],
                "DATA": null
            })
        } else {
            res.json({
                "ERROR": false,
                "ERRCODESTR": list[1],
                "DESC": list[2],
                "DATA": {
                    "vtoken": yyy[3][0]
                }
            })
        }
    }
}

function filterFetchv1(r){
    if (r.mail){
        if (mailVerifier.verifyMail(r.mail)){
            return [true, "NO_ERROR", null, [r.mail]]
        } else {
            return [false, "PROVIDE_VALIDGMAIL", "Provide Valid Gmail", null]
        }
    } else {
        return [false, "PROVIDE_GMAIL", "Provide Gmail", null]
    }
}

async function verifyScraper(req, res){
    const list = filterFetchv2(req.query)

    if(!list[0]){
        res.json({
            "ERROR": true,
            "ERRCODESTR": list[1],
            "DESC": list[2],
            "DATA": null
        })
    } else {
        const yy = await scraperData.verifyscraperCracks(list[3][0], list[3][1], list[3][2], list[3][3])
        if (!yy[0]){
            res.json({
                "ERROR": true,
                "ERRCODESTR": yy[1],
                "DESC": yy[2],
                "DATA": null
            })
        } else {
            res.json({
                "ERROR": false,
                "ERRCODESTR": "NO_ERROR",
                "DESC": null,
                "DATA": null
            })
        }
    }
}

function filterFetchv2(r){
    rStr = "Provide "
    ERRCODESTR = "PROVIDE"

    isMailExist = false;
    isTokenExist = false;
    isOtpExist = false;
    isPasswordExist = false;
    if (r.mail){
        if (mailVerifier.verifyMail(r.mail)){
            isMailExist = true
        } else {
            ERRCODESTR += "_VALIDMAIL"
            rStr = "Provide Valid Mail"
        }
    } else {
        ERRCODESTR += "_MAIL"
        rStr = "Provide Mail"
    }

    if (r.vtoken){
        isTokenExist = true;
    } else {
        rStr += " Token"
        ERRCODESTR += "_TOKEN"
    }

    if (r.otp){
        isOtpExist = true;
    } else {
        rStr += " Otp"
        ERRCODESTR += "_OTP"
    }

    if (r.password){
        isPasswordExist = true;
    } else {
        rStr += " Password"
        ERRCODESTR += "_PASSWORD"
    }

    if (isMailExist && isTokenExist && isOtpExist && isPasswordExist){
        return [false, "NO_ERROR", null, [r.mail, r.vtoken, r.otp, r.password]]
    } else {
        return [true, ERRCODESTR, rStr, null]
    }
}

async function generateToken(req, res){
    const list = filterFetchv3(req.query)
    if (!list[0]){
        res.json({
            "ERROR": true,
            "ERRCODESTR": list[1],
            "DESC": list[2],
            "DATA": null
        })
    } else {
        const yy = await scraperData.generateToken(list[3][0], list[3][1])
        if(!yy[0]){
            res.json({
                "ERROR": true,
                "ERRCODESTR": yy[1],
                "DESC": yy[2],
                "DATA": null
            })
        } else {
            res.json({
                "ERROR": false,
                "ERRCODESTR": "NO_ERROR",
                "DESC": null,
                "DATA": {
                    "scraperId": yy[3][0],
                    "token": yy[3][1]
                }
            })
        }
    }
}

function filterFetchv3(r){
    isMailExist = false;
    isPasswordExist = false;
    if (r.mail){
        if (mailVerifier.verifyMail(r.mail)){
            isMailExist = true
        } else {
            ERRCODESTR += "_VALIDMAIL"
            rStr = "Provide Valid Mail"
        }
    } else {
        ERRCODESTR += "_MAIL"
        rStr = "Provide Mail"
    }

    if (r.password){
        isPasswordExist = true;
    } else {
        rStr += " Password"
        ERRCODESTR += "_PASSWORD"
    }
    if (isMailExist && isPasswordExist){
        return [false, "NO_ERROR", null, [r.mail, r.password]]
    } else {
        return [true, ERRCODESTR, rStr, null]
    }
}

async function getTokenDet(req, res){
    const list = filterFetchv4(req.query)
    if (!list[0]){
        res.json({
            "ERROR": true,
            "ERRCODESTR": "PROVIDE_SECRET",
            "DESC": "Provide Secret",
            "DATA": null
        })
    } else {
        const yy = await scraperData.getTokenInfo(list[3][0]);
        if (!yy){
            res.json({
                "ERROR": true,
                "ERRCODESTR": "NO_SUCH_TOKEN",
                "DESC": "No Such Token Exists",
                "DATA": null
            })
        } else {
            res.json({
                "ERROR": true,
                "ERRCODESTR": "NO_SUCH_TOKEN",
                "DESC": "No Such Token Exists",
                "DATA": {
                    "scraperID" : yy['scraperID'],
                    "scraperMail": yy['scraperGmail'],
                    "scraperCreationTime": yy['scraperCreationTime'],
                }
            })
        }
    }
}

function filterFetchv4(r){
    if(r.stoken){
        return [true, r.stoken]
    } else {
        return [false, null]
    }
}

function getError(req, res){
    res.json({ "ERROR": true, "ERRCODE": "GET_NOT_ALLOWED", "DESC": "Insecure way of Sending Data", "DATA":null })
}

function notAllowed(req, res){
    res.json({"ERROR":true, "ERRCODE": "NO_PATH_EXIST", "DESC": "Invalid Path or Path not Exist", "DATA":null})
}

module.exports = { getError, joinScraper, verifyScraper, generateToken, getTokenDet, notAllowed}