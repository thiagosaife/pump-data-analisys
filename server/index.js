import express from 'express';
import parser from 'simple-excel-to-json'

const PORT = 8080;
const app = express();

const csv = parser.parseXls2Json('../src/data/demoPumpDayData.csv');

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});

app.get('/api', (req, res) => {
  res.send(csv);
});
