require("dotenv").config();
const fetch = require("node-fetch");

const data = {
  consumer_key: process.env.POCKET_CONSUMER_KEY,
  access_token: process.env.POCKET_ACCESS_TOKEN,
  detailType: "complete",
};
fetch("https://getpocket.com/v3/get", {
  method: "POST", // *GET, POST, PUT, DELETE, etc.
  mode: "cors", // no-cors, *cors, same-origin
  cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
  credentials: "same-origin", // include, *same-origin, omit
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
    "X-Accept": "application/json",
  },
  redirect: "follow", // manual, *follow, error
  referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  body: JSON.stringify(data), // body data type must match "Content-Type" header
})
  .then((response) => response.json())
  .then((pocket) => {
    const list = Object.entries(pocket.list);
    const pocketList = list.map((g) => g[1]);
    const shuffled = pocketList.sort(() => 0.5 - Math.random());
    const selectedLinks = shuffled.slice(0, 10);
    const authors = selectedLinks.map((y) =>
      y.authors !== undefined
        ? Object.entries(y.authors)
        : { authors: "no authors" }
    );
    // .map((u) => Object.entries(u));
    const pocketData = authors.map((_, i) => ({
      ...selectedLinks[i],
      itemAuthors: authors[i],
    }));
    console.log(authors);

    // .map((x) => Object.entries(x).reduce((a, b) => a.concat(b), []))
    // .map((d) => (d === [] ? "" : Object.entries(d)));
    // console.log(authors);

    // console.log(authors.map((z) => (z === "" ? "" : z.Name)));
  })
  .catch((err) => console.log(err));

// const fetch = require("node-fetch");
// require("dotenv").config();
// const http = require("http");

// // // // * Github api
// // // // * The github api doesn't have an endpoint dedicated to pinned repos, and
// // // // * thats why im using my starred repos and filtering them by author
// // // // * or "login" (in this case pamelazoe).
// // // // * The starred repos endpoint don't include the topics of every project,
// // // // * but by crossing the id of the filtered starred repos with the repos endpoint,
// // // // * I'm able to collect the data I wan't to display in the page:
// // // // * Name, Url, Image, Demo Url, Description and Topics

// const username = "pamelazoe";
// // /repos/:owner/:repo/contents/:path
// // http
// //   .createServer((req, res) => {
// //     if (req.url === "/githubbranch") {
// //       console.log("github");
// //       res.writeHead(200, { "Content-Type": "application/json" });
// const token = process.env.GITHUB_PERSONAL_TOKEN;
// fetch(`https://api.github.com/users/${username}/starred`, {
//   headers: {
//     authorization: `token ${token}`,
//   },
// })
//   .then((response) => response.json())
//   .then((data) => {
//     // res.end(JSON.stringify(data));
//     console.log(data);
//   })
//   .catch((error) => console.log(error));
// //   }
// // })
// // .listen(3000, () => {
// //   console.log("Server running at http://127.0.0.1:3000/");
// // });
// // /repos/:owner/:repo/branches

// {
//   added_at: '2020-09-25T18:27:14Z',
//   added_by: {
//     external_urls: [Object],
//     href: 'https://api.spotify.com/v1/users/zoepamela',
//     id: 'zoepamela',
//     type: 'user',
//     uri: 'spotify:user:zoepamela'
//   },
//   is_local: false,
//   primary_color: null,
//   track: {
//     album: [Object],
//     artists: [Array],
//     available_markets: [Array],
//     disc_number: 1,
//     duration_ms: 302363,
//     episode: false,
//     explicit: true,
//     external_ids: [Object],
//     external_urls: [Object],
//     href: 'https://api.spotify.com/v1/tracks/6rVExngxHtsUSdjmv7Xdxy',
//     id: '6rVExngxHtsUSdjmv7Xdxy',
//     is_local: false,
//     name: 'Dough & Damani',
//     popularity: 56,
//     preview_url: 'https://p.scdn.co/mp3-preview/ab04d0cd821db4e1d5e364a502b107ab7a82da39?cid=96f5dde3bd8a49e2bbd5e1340eff9502',
//     track: true,
//     track_number: 4,
//     type: 'track',
//     uri: 'spotify:track:6rVExngxHtsUSdjmv7Xdxy'
//   },
//   video_thumbnail: { url: null }
// }
