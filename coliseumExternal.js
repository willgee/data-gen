const fs = require("fs");
const faker = require("faker");

/* [
    {
        pocFullName: 'Fred Flintstone',
        pocAddress: '123 Main St.',
        pocEmail: 'fred@hotmail.com',
        pocPhone: '321.456.7788',
        publicationDate: new Date(),
        publishingOrg: 'NSA',
        subject: 'Barney and Wilma',
        body: 'Trouble is brewing in bedrock!'
    }
] */

let coliseumData = [];
const publishingOrgList = [
    "NSA",
    "CIA",
    "FBI",
    "NGA",
    "ARMY",
    "NAVY",
    "AIR FORCE",
    "MARINES",
    "FOREIGN SERVICE"
]

function randomDate(startDate, endDate, startHour, endHour) {
    var date = new Date(+startDate + Math.random() * (endDate - startDate));
    var hour = (startHour + Math.random() * (endHour - startHour)) | 0;
    date.setHours(hour);
    return date.getTime();
}

function randomDateInRange(days) {
    var today = new Date();
    var past = new Date(today.getTime() - days * 24 * 60 * 60 * 1000);
    return randomDate(today, past, 0, 23);
}

// Pull in the Reuters data and prepare it for use
let rawData = fs.readFileSync(
    "node_modules/reuters-21578-json/data/full/reuters-001.json"
);
let reutersArray = JSON.parse(rawData);

// Main loop for generating data objects
for (let index = 0; index < 4; index++) {

    // Get the Reuters article object.
    let article = reutersArray[index];

    // Declare document object. This is the main container for the coliseum data array
    let searchDocument = {};
    searchDocument.subject = article.title;
    searchDocument.publishingOrg = publishingOrgList[Math.floor(Math.random() * publishingOrgList.length)];
    searchDocument.publicationDate = randomDateInRange(90);

    // Get article body from Reuters corpus
    if (article.body) {
        searchDocument.body = article.body.replace(/[^\x20-~]+/g, ""); // Remove all non-printable ASCII
    } else {
        while (typeof reutersArray[index].body == "undefined") {
            index++;
            if (reutersArray[index].body) {
                searchDocument.body = reutersArray[index].body.replace(/[^\x20-~]+/g, "");
            } else {
                console.log(
                    "\n\n #############  NO Data " +
                    typeof reutersArray[index].body +
                    "\n\n"
                );
            }
        }
    }

    // Build the POC
    searchDocument.pocFullName = faker.name.firstName() + ' ' + faker.name.lastName();
    searchDocument.pocAddress = faker.address.streetAddress();
    searchDocument.pocEmail = faker.internet.email();
    searchDocument.pocPhone = faker.phone.phoneNumber();
    //console.log(searchDocument);

    coliseumData.push(searchDocument);

    // ** NOTE: Use this code below for new line delimited Elastic search JSON.
    // Else use the code outside of the loop for writing a well formed JSON file
    /* let document = JSON.stringify(searchDocument) + '\n';
    try {
        fs.appendFileSync('out/coliseumDataDelimited.json', document)
    } catch (error) {
        console.log(error);
    } */
} // end of data generation loop

// Write the JSON to disk
let data = JSON.stringify(coliseumData);
fs.open("out/coliseumData.json", "w", function (err, fd) {
    if (err) throw err;
    fs.write(fd, data, err => {
        if (err) throw err;
        console.log("The coliseum documents have been created => out/coliseumData.json");
    });
}); 