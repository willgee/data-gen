const fs = require("fs");

let surveyArray = fs.readFileSync(
    "out/surveys.json"
  );

  console.log(JSON.parse( surveyArray)[0].questions);