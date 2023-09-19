const { exec } = require("child_process");

const args = "-data 'same:// google.co/hhs/fsa' -pass Data"

const filepath = __dirname + "\\main.py"

// console.log(filename)

exec(`python ${filepath} ${args}`, (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});


// const { spawn } = require("child_process");

// const ls = spawn(`python ${filepath}`);

// ls.stdout.on("data", data => {
//     console.log(`stdout: ${data}`);
// });

// ls.stderr.on("data", data => {
//     console.log(`stderr: ${data}`);
// });

// ls.on('error', (error) => {
//     console.log(`error: ${error.message}`);
// });

// ls.on("close", code => {
//     console.log(`child process exited with code ${code}`);
// });

//add//users//
//add//scraper//
//scraper//add
//scraper//gettoken
//scraper//resettoken
//search//id
//search//author//
//search//uploadedby//
//search//custom//
//search//query//
//home//
//generator

/*
/{
    userid,
    uploadbooks = []
    favouritecategory = []
    likedbooks = []
    viewed books = []

}

{
    bookid,
    bookname,
    bookauthor = [],
    bookpath,
    bookcoverpath,
    bookgenre,
    bookkeywords = []
    bookrating ,
    volume,
    description,
    isvisible = true,
    sha1,
    language,
    publishyear,
    addedon,
    views,
    isscraped,
    isuploaded,
    uploaded.scraped on,
    

    metadata = []
}

*/