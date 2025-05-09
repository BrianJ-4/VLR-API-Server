const parser = require("node-html-parser");
const fs = require('fs');

async function getPage(file) {
    const html = fs.readFile("") 
    const doc = parser.parse(response.data);
    console.log(response.data)
    return doc;
}

async function getExpectedOutput(file) {

}