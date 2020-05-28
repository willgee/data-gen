const { createReadStream } = require('fs');
const split = require('split2');
const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: 'http://localhost:9200' });

/* createReadStream('./out/surveys.json')
    .pipe(split())
    .on('data', function (line) {
        console.log(line);
    }) */



async function run() {
    const result = await client.helpers.bulk({
        datasource: createReadStream('./out/surveysDelimited.json').pipe(split()),
        onDocument(doc) {
            return {
                index: { _index: 'surveys' }
            }
        }
    })
    console.log(result)
}

run();