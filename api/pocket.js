require("dotenv").config();
const fetch = require("node-fetch");
import getAndSetDataFromCache from "../cache";

const pocketConsumerKey = process.env.POCKET_CONSUMER_KEY;
const pocketAccessToken = process.env.POCKET_ACCESS_TOKEN;

// ******************************************************
// *                     PocketApi
// ******************************************************
const apiCredentials = {
  consumer_key: pocketConsumerKey,
  access_token: pocketAccessToken,
  detailType: "complete",
};

const getPocketData = async () => {
  // Default options are marked with *
  const response = await fetch("https://getpocket.com/v3/get", {
    method: "POST",
    mode: "cors",
    // cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      "X-Accept": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: JSON.stringify(apiCredentials),
  });
  const pocket = await response.json();
  const list = Object.entries(pocket.list);
  const pocketList = list.map((item) => item[1]);
  const shuffled = pocketList.sort(() => 0.5 - Math.random());
  const selectedLinks = shuffled.slice(0, 10);
  const authors = selectedLinks.map((author) => author.name);
  const pocketData = authors.map((_, i) => {
    return {
      ...selectedLinks[i],
      itemAuthors: authors[i],
    };
  });
  return pocketData;
};

// const getAndSetDataFromCache = (res) => {
//   success = cache.get("pocket-response");
//   if (success) {
//     res.status(200).send(success);
//   } else if (success === undefined) {
//     getPocketData().then((data) => {
//       cache.set("pocket-response", data);
//       caching = cache.set("pocket-response", data);
//       res.status(200).send(data);
//     });
//   } else {
//     res.status(200).send({
//       message: "Error, please contact me at pmlzoe@gmail.com",
//     });
//   }
// };

// const getAndSetDataFromCache = (res, cacheKey, fetchData) => {
//   success = cache.get(cacheKey);
//   if (success) {
//     res.status(200).send(success);
//   } else if (success === undefined) {
//     fetchData().then((data) => {
//       cache.set(cacheKey, data);
//       caching = cache.set(cacheKey, data);
//       res.status(200).send(data);
//     });
//   } else {
//     res.status(200).send({
//       message: "Error, please contact me at pmlzoe@gmail.com",
//     });
//   }
// };
module.exports = (req, res) => {
  // res.setHeader('Access-Control-Allow-Origin', 'https://pamelazoe.now.sh');
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  getAndSetDataFromCache(res, "pocket-response", getPocketData);
};
