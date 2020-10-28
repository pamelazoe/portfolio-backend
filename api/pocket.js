require('dotenv').config();
const fetch = require('node-fetch');

const pocketConsumerKey = process.env.POCKET_CONSUMER_KEY;
const pocketAccessToken = process.env.POCKET_ACCESS_TOKEN;

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://pamelazoe.now.sh');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  // ******************************************************
  // *                     PocketApi
  // ******************************************************
  const data = {
    consumer_key: pocketConsumerKey,
    access_token: pocketAccessToken,
    detailType: 'complete',
  };
  // Default options are marked with *
  fetch('https://getpocket.com/v3/get', {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'X-Accept': 'application/json',
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((pocket) => {
      const list = Object.entries(pocket.list);
      const pocketList = list.map((item) => item[1]);
      const shuffled = pocketList.sort(() => 0.5 - Math.random());
      const selectedLinks = shuffled.slice(0, 10);
      const authors = selectedLinks.map((author) => author.name);
      const pocketData = authors.map((_, i) => ({
        ...selectedLinks[i],
        itemAuthors: authors[i],
      }));
      res.status(200).send(pocketData);
    })
    .catch((err) => console.log(err));
};
