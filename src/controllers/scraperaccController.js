const verifier = require("../extra/verifier")
const scraperData = require("../models/scraperaccData")

async function joinstart(req, res){
    const list = filterFetchV1(req.query);
    if (!list[0]){
        res.json({
            "ERROR": true,
            "ERRCODE": list[1],
            "DESC": list[2],
            "DATA": null
        })
    } else {
        const yy = await scraperData.jsteponeCracks(list[3][0])
        if(!yy[0]){
            res.json({
                "ERROR": true,
                "ERRCODE": yy[1],
                "DESC": yy[2],
                "DATA": null
            })
        } else {
            res.json({
                "ERROR": false,
                "ERRCODE": yy[1],
                "DESC": yy[2],
                "DATA": {
                    "vtoken": yy[3][0]
                }
            })
        }
    }
}

function filterFetchV1(r) {
    if(r.mail){
        if (verifier.verifyMail(r.mail)){
            return [true, null, null, [r.mail]]
        } else {
            return [false, "PROVIDE_VALIDMAIL", "Provide a vlaid mail", null]
        }
    }
    return [false, "PROVIDE_MAIL", "Provide a mail", null]
}

async function verifyjotp(req, res){
    const list = filterFetchV2(req.query)
    if(!list[0]){
        res.json({
            "ERROR": true,
            "ERRCODE": list[1],
            "DESC": list[2],
            "DATA": null
        })
    } else {
        const yy = await scraperData.jsteptwoCracks(list[3][0], list[3][1], list[3][2])
        if(!yy[0]){
            res.json({
                "ERROR": true,
                "ERRCODE": yy[1],
                "DESC": yy[2],
                "DATA": null
            })
        } else {
            res.json({
                "ERROR": false,
                "ERRCODE": "NO_ERROR",
                "DESC": null,
                "DATA": {
                    "ftoken": yy[3][0]
                }
            })
        }
    }
}

function filterFetchV2(r){
    isMailExist = false
    isVTokenExist = false
    isOTPhashExist = false
    rStr = "Provide"
    ERRCODESTR = "PROVIDE"
    if (r.mail){
        if(verifier.verifyMail(r.mail)){
            isMailExist = true
        } else {
            rStr += " Valid Mail"; ERRCODESTR += "_VALIDMAIL"
        }
        rStr += " Mail"; ERRCODESTR += "_MAIL"
    }

    if (r.vtoken){
        isVTokenExist = true
    } else {
        rStr += " vtoken"; ERRCODESTR += "_VTOKEN"
    }

    if(r.otphash){
        isOTPhashExist = true
    } else {
        rStr += " otphash"; ERRCODESTR += "_OTPHASH"
    }

    if(isMailExist && isVTokenExist && isOTPhashExist){
        return [true, "No_ERROR", null, [r.mail, r.vtoken, r.otphash]]
    } else {
        return [false, ERRCODESTR, rStr, null]
    }
}

async function joinfinalstep(req, res){
    const list = filterFetchV3(req.query)
    if(!list[0]){
        res.json({
            "ERROR": true,
            "ERRCODE": list[1],
            "DESC": list[2],
            "DATA": null
        })
    } else {
        const yy = await scraperData.jfinalstepCracks(list[3][0], list[3][1], list[3][2], list[3][3], list[3][4], list[3][5])
        if(!yy[0]){
            res.json({
                "ERROR": true,
                "ERRCODE": yy[1],
                "DESC": yy[2],
                "DATA": null
            })
        } else {
            res.json({
                "ERROR": false,
                "ERRCODE": yy[1],
                "DESC": null,
                "DATA": null
            })
        }
    }
}

function filterFetchV3(r) {
    isMailExist = false
    isVTokenExist = false
    isFTokenExist = false
    isOTPhashExist = false
    isPasswordExist = false
    isScraperIdExist = false
    rStr = "Provide"
    ERRCODESTR = "PROVIDE"
    if (r.mail){
        if(verifier.verifyMail(r.mail)){
            isMailExist = true
        } else {
            rStr += " Valid Mail"; ERRCODESTR += "_VALIDMAIL"
        }
        rStr += " Mail"; ERRCODESTR += "_MAIL"
    }

    if (r.vtoken){
        isVTokenExist = true
    } else {
        rStr += " vtoken"; ERRCODESTR += "_VTOKEN"
    }

    if (r.ftoken){
        isFTokenExist = true
    } else {
        rStr += " ftoken"; ERRCODESTR += "_FTOKEN"
    }

    if(r.otphash){
        isOTPhashExist = true
    } else {
        rStr += " otphash"; ERRCODESTR += "_OTPHASH"
    }

    if(r.password){
        if(verifier.verifyPassword(r.password)){
            isPasswordExist = true
        } else {
            rStr += " Valid Password"; ERRCODESTR += "_VALIDPASSWORD"
        }
        rStr += " Password"; ERRCODESTR += "_PASSWORD"
    }
    
    if (r.scraperid){
        isScraperIdExist = true
    } else {
        rStr += " scraperid"; ERRCODESTR += "_SCRAPERID"
    }

    if(isMailExist && isVTokenExist && isFTokenExist && isOTPhashExist && isPasswordExist && isScraperIdExist){
        return [true, "No_ERROR", null, [r.mail, r.vtoken, r.ftoken, r.otphash, r.password, r.scraperid]]
    } else {
        return [false, ERRCODESTR, rStr, null]
    }
}

// ==================================================================================================================
// ============================================= LOGIN - LOGIN - LOGIN ==============================================
// ==================================================================================================================

async function loginstart(req, res){
    const list = filterFetchV4(req.query)
    if(!list[0]){
        res.json({
            "ERROR": true,
            "ERRCODE": list[1],
            "DESC": list[2],
            "DATA": null
        })
    } else {
        const yy = await scraperData.lsteponeCracks(list[3][0], list[3][1])
        if(!yy[0]){
            res.json({
                "ERROR": true,
                "ERRCODE": yy[1],
                "DESC": yy[2],
                "DATA": null
            })
        } else {
            res.json({
                "ERROR": false,
                "ERRCODE": yy[1],
                "DESC": null,
                "DATA": {
                    "ltoken": yy[3][0]
                }
            })
        }
    }
}

function filterFetchV4(r) {
    isMailExist = false
    isPasswordExist = false
    rStr = "Provide"
    ERRCODESTR = "PROVIDE"
    if (r.mail){
        if(verifier.verifyMail(r.mail)){
            isMailExist = true
        } else {
            rStr += " Valid Mail"; ERRCODESTR += "_VALIDMAIL"
        }
        rStr += " Mail"; ERRCODESTR += "_MAIL"
    }

    if(r.password){
        if(verifier.verifyPassword(r.password)){
            isPasswordExist = true
        } else {
            rStr += " Valid Password"; ERRCODESTR += "_VALIDPASSWORD"
        }
        rStr += " Password"; ERRCODESTR += "_PASSWORD"
    }

    if(isMailExist && isPasswordExist){
        return [true, "No_ERROR", null, [r.mail, r.password]]
    } else {
        return [false, ERRCODESTR, rStr, null]
    }
}

async function verifylotp(req, res){
    const list = filterFetchV5(req.query)
    if(!list[0]){
        res.json({
            "ERROR": true,
            "ERRCODE": list[1],
            "DESC": list[2],
            "DATA": null
        })
    } else {
        const yy = await scraperData.lstepfinalCracks(list[3][0], list[3][1], list[3][2], list[3][3])
        if(!yy[0]){
            res.json({
                "ERROR": true,
                "ERRCODE": yy[1],
                "DESC": yy[2],
                "DATA": null
            })
        } else {
            res.json({
                "ERROR": false,
                "ERRCODE": yy[1],
                "DESC": null,
                "DATA": {
                    "name": yy[3][0],
                    "mail": yy[3][1],
                    "token": yy[3][2]
                }
            })
        }
    }
}

function filterFetchV5(r) {
    isMailExist = false
    isLTokenExist = false
    isOTPhashExist = false
    isPasswordExist = false
    rStr = "Provide"
    ERRCODESTR = "PROVIDE"
    if (r.mail){
        if(verifier.verifyMail(r.mail)){
            isMailExist = true
        } else {
            rStr += " Valid Mail"; ERRCODESTR += "_VALIDMAIL"
        }
        rStr += " Mail"; ERRCODESTR += "_MAIL"
    }

    if (r.ltoken){
        isLTokenExist = true
    } else {
        rStr += " ltoken"; ERRCODESTR += "_LTOKEN"
    }

    if(r.otphash){
        isOTPhashExist = true
    } else {
        rStr += " otphash"; ERRCODESTR += "_OTPHASH"
    }

    if(r.password){
        if(verifier.verifyPassword(r.password)){
            isPasswordExist = true
        } else {
            rStr += " Valid Password"; ERRCODESTR += "_VALIDPASSWORD"
        }
        rStr += " Password"; ERRCODESTR += "_PASSWORD"
    }

    if(isMailExist && isPasswordExist && isLTokenExist && isOTPhashExist){
        return [true, "No_ERROR", null, [r.mail, r.password, r.ltoken, r.otphash]]
    } else {
        return [false, ERRCODESTR, rStr, null]
    }
}

// ==================================================================================================================
// ============================== FORGOT-PASSWORD - FORGOT-PASSWORD - FORGOT-PASSWORD ===============================
// ==================================================================================================================

async function fpstart(req, res){
    const list = filterFetchV6(req.query);
    if (!list[0]){
        res.json({
            "ERROR": true,
            "ERRCODE": list[1],
            "DESC": list[2],
            "DATA": null
        })
    } else {
        const yy = await scraperData.fpsteponeCracks(list[3][0])
        if(!yy[0]){
            res.json({
                "ERROR": true,
                "ERRCODE": yy[1],
                "DESC": yy[2],
                "DATA": null
            })
        } else {
            res.json({
                "ERROR": false,
                "ERRCODE": yy[1],
                "DESC": yy[2],
                "DATA": {
                    "fptoken": yy[3][0]
                }
            })
        }
    }
}

function filterFetchV6(r) {
    if(r.mail){
        if (verifier.verifyMail(r.mail)){
            return [true, null, null, [r.mail]]
        } else {
            return [false, "PROVIDE_VALIDMAIL", "Provide a Valid mail", null]
        }
    }
    return [false, "PROVIDE_MAIL", "Provide a mail", null]
}

async function verifyfpotp(req, res){
    const list = filterFetchV7(req.query)
    if(!list[0]){
        res.json({
            "ERROR": true,
            "ERRCODE": list[1],
            "DESC": list[2],
            "DATA": null
        })
    } else {
        const yy = await scraperData.fpsteptwoCracks(list[3][0], list[3][1], list[3][2])
        if(!yy[0]){
            res.json({
                "ERROR": true,
                "ERRCODE": yy[1],
                "DESC": yy[2],
                "DATA": null
            })
        } else {
            res.json({
                "ERROR": false,
                "ERRCODE": "NO_ERROR",
                "DESC": null,
                "DATA": null
            })
        }
    }
}

function filterFetchV7(r){
    isMailExist = false
    isFPTokenExist = false
    isOTPhashExist = false
    rStr = "Provide"
    ERRCODESTR = "PROVIDE"
    if (r.mail){
        if(verifier.verifyMail(r.mail)){
            isMailExist = true
        } else {
            rStr += " Valid Mail"; ERRCODESTR += "_VALIDMAIL"
        }
        rStr += " Mail"; ERRCODESTR += "_MAIL"
    }

    if (r.fptoken){
        isFPTokenExist = true
    } else {
        rStr += " fptoken"; ERRCODESTR += "_FPTOKEN"
    }

    if(r.otphash){
        isOTPhashExist = true
    } else {
        rStr += " otphash"; ERRCODESTR += "_OTPHASH"
    }

    if(isMailExist && isFPTokenExist && isOTPhashExist){
        return [true, "No_ERROR", null, [r.mail, r.fptoken, r.otphash]]
    } else {
        return [false, ERRCODESTR, rStr, null]
    }
}

async function fpfinalstep(req, res){
    const list = filterFetchV8(req.query)
    if(!list[0]){
        res.json({
            "ERROR": true,
            "ERRCODE": list[1],
            "DESC": list[2],
            "DATA": null
        })
    } else {
        const yy = await scraperData.fpfinalstepCracks(list[3][0], list[3][1], list[3][2], list[3][3])
        if(!yy[0]){
            res.json({
                "ERROR": true,
                "ERRCODE": yy[1],
                "DESC": yy[2],
                "DATA": null
            })
        } else {
            res.json({
                "ERROR": false,
                "ERRCODE": yy[1],
                "DESC": null,
                "DATA": null
            })
        }
    }
}

function filterFetchV8(r) {
    isMailExist = false
    isFPTokenExist = false
    isOTPhashExist = false
    isPasswordExist = false
    rStr = "Provide"
    ERRCODESTR = "PROVIDE"
    if (r.mail){
        if(verifier.verifyMail(r.mail)){
            isMailExist = true
        } else {
            rStr += " Valid Mail"; ERRCODESTR += "_VALIDMAIL"
        }
    } else {
        rStr += " Mail"; ERRCODESTR += "_MAIL"
    }

    if (r.fptoken){
        isFPTokenExist = true
    } else {
        rStr += " fptoken"; ERRCODESTR += "_FPTOKEN"
    }

    if(r.otphash){
        isOTPhashExist = true
    } else {
        rStr += " otphash"; ERRCODESTR += "_OTPHASH"
    }

    if(r.password){
        if(verifier.verifyPassword(r.password)){
            isPasswordExist = true
        } else {
            rStr += " Valid Password"; ERRCODESTR += "_VALIDPASSWORD"
        }
    } else {
        rStr += " Password"; ERRCODESTR += "_PASSWORD"
    }

    if(isMailExist && isFPTokenExist && isOTPhashExist && isPasswordExist){
        return [true, "No_ERROR", null, [r.mail, r.fptoken, r.otphash, r.password]]
    } else {
        return [false, ERRCODESTR, rStr, null]
    }
}


// ==================================================================================================================
// ======================================= GENERATOR - GENERATOR - GENERATOR ========================================
// ==================================================================================================================

async function genToken(req, res){
    const list = filterFetchV10(req.query)
    if(!list[0]){
        res.json({
            "ERROR": true,
            "ERRCODE": list[1],
            "DESC": list[2],
            "DATA": null
        })
    } else {
        const yy = scraperData.genTokenCracks(list[3][0], list[3][1], list[3][2])
    }
}

function filterFetchV10(r) {
    isMailExist = false
    isPasswordExist = false
    isTokenExist = false
    rStr = "Provide"
    ERRCODESTR = "PROVIDE"
    if (r.mail){
        if(verifier.verifyMail(r.mail)){
            isMailExist = true
        } else {
            rStr += " Valid Mail"; ERRCODESTR += "_VALIDMAIL"
        }
        rStr += " Mail"; ERRCODESTR += "_MAIL"
    }

    if(r.password){
        if(verifier.verifyPassword(r.password)){
            isPasswordExist = true
        } else {
            rStr += " Valid Password"; ERRCODESTR += "_VALIDPASSWORD"
        }
        rStr += " Password"; ERRCODESTR += "_PASSWORD"
    }

    if (r.token){
        isTokenExist = true
    } else {
        rStr += " token"; ERRCODESTR += "_TOKEN"
    }

    if(isMailExist && isPasswordExist && isTokenExist){
        return [true, "No_ERROR", null, [r.mail, r.password, r.token]]
    } else {
        return [false, ERRCODESTR, rStr, null]
    }
}

function getError(req, res){
    res.json({ "ERROR": true, "ERRCODE": "GET_NOT_ALLOWED", "DESC": "Insecure way of Sending Data", "DATA":null })
}

function notAllowed(req, res){
    res.json({"ERROR":true, "ERRCODE": "NO_PATH_EXIST", "DESC": "Invalid Path or Path not Exist", "DATA":null})
}

module.exports = { getError, joinstart, verifyjotp, joinfinalstep, loginstart, verifylotp, genToken, fpstart, verifyfpotp, fpfinalstep, notAllowed}