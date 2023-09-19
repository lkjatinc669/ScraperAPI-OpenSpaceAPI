

function get(){
    
}

function filterFetchv1(r){

}

function add(){

}

function filterFetchv2(r){

}



function getError(req, res){
    res.json({ "ERROR": true, "ERRCODE": "GET_NOT_ALLOWED", "DESC": "Insecure way of Sending Data", "DATA":null })
}

function notAllowed(req, res){
    res.json({"ERROR":true, "ERRCODE": "NO_PATH_EXIST", "DESC": "Invalid Path or Path not Exist", "DATA":null})
}

module.exports = { getError, add, get, notAllowed}