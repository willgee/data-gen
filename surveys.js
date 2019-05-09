const fs = require("fs");
const faker = require("faker");

let surveyArray = [];
const projectList = [
  { icon: "fab fa-autoprefixer", title: "A4" },
  { icon: "fas fa-balance-scale", title: "Agile JCITA" },
  { icon: "fas fa-archway", title: "Agile Workforce" },
  { icon: "fab fa-buffer", title: "Asset Space" },
  { icon: "fas fa-chess-king", title: "CCDB" },
  { icon: "fas fa-chess-knight", title: "CHROME" },
  { icon: "fas fa-crosshairs", title: "OWL" },
  { icon: "fas fa-dice-d20", title: "CORE-D" },
  { icon: "fas fa-feather-alt", title: "CRATE" },
  { icon: "fas fa-fire", title: "COLISEUM" },
  { icon: "fas fa-ghost", title: "DICE" },
  { icon: "fas fa-frog", title: "RIPTIDE" },
  { icon: "fas fa-hat-wizard", title: "SCRM TAC" }
];
const questionList = [
  "Overall",
  "Schedule",
  "Quality",
  "Responsive",
  "Punctual",
  "Hygene",
  "Coolness",
  "Acurate"
];

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

let rawData = fs.readFileSync(
  "node_modules/reuters-21578-json/data/full/reuters-001.json"
);
let reutersArray = JSON.parse(rawData);

for (let index = 0; index < 40; index++) {
  let article = reutersArray[index];
  let questions = questionList.slice();
  
  let questionArray = [];
  let randomProject = projectList[Math.floor(Math.random() * projectList.length)];

  let surveyObj = { };
  surveyObj.icon = randomProject.icon;
  surveyObj.projectTitle = randomProject.title;
  surveyObj.timeStamp = randomDateInRange(90);

  let pocObj = { };
  pocObj.firstName = faker.name.firstName();
  pocObj.lastName = faker.name.lastName();
  surveyObj.poc = pocObj;

  // Random question and score generation
  let i = 0;
  while (i < 4) {
    let questionObj = {};
    let randomIndex = Math.floor(Math.random() * questions.length);
    let randomQuestion = questions.splice(randomIndex, 1)[0];
    let randomRating = Math.ceil(Math.random() * 4);
    questionObj.label = randomQuestion;
    questionObj.rating = randomRating;
    questionArray.push(questionObj);
    i++;  
  }
  // Store the completed questions array in the survey object
  surveyObj.questions = questionArray;
  
  // Get article from reuters corpus
  if (article.body) {    
    surveyObj.feedback = article.body.replace(/[^\x20-~]+/g, ""); // Remove all non-printable ASCII
  } else {
    while (typeof reutersArray[index].body == "undefined") {
      index++;
      if (reutersArray[index].body) {
        surveyObj.feedback = reutersArray[index].body.replace(/[^\x20-~]+/g, "");       
      } else {
        console.log(
          "\n\n #############  NO Data " +
            typeof reutersArray[index].body +
            "\n\n"
        );
      }
    }
  }
  // Push the completed survey oject into the main survey container
  surveyArray.push(surveyObj);
} // end of survey generation loop

// Write the JSON to disk
let surveyList = JSON.stringify(surveyArray);
fs.open("out/surveys.json", "w", function(err, fd) {
  if (err) throw err;
  fs.write(fd, surveyList, err => {
    if (err) throw err;
    console.log("The surveys have been created => out/surveys.json");
  });
});
