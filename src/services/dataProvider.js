import parser from 'simple-excel-to-json';

export default async function provider() {
  try {
    const csv = await parser.parseXls2Json('src/data/demoPumpDayData.csv');
    return csv;
  } catch (error) {
    return error;
  }
}

// provider().then((data) => console.log(data));