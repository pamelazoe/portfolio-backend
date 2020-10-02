const http = require("http");
require("dotenv").config();
const fetch = require("node-fetch");
const SpotifyWebApi = require("spotify-web-api-node");

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const githubToken = process.env.GITHUB_PERSONAL_TOKEN;
const username = "pamelazoe";
http
  .createServer((req, res) => {
    if (req.url === "/spotify") {
      console.log("spotify");
      res.writeHead(200, { "Content-Type": "application/json" });
      // ******************************************************
      // *                     SpotifyApi
      // ******************************************************
      const spotifyApi = new SpotifyWebApi({
        clientId,
        clientSecret,
      });
      // Retrieve an access token.
      spotifyApi.clientCredentialsGrant().then(
        (data) => {
          // console.log('The access token expires in ' + data.body['expires_in']);
          // console.log('The access token is ' + data.body['access_token']);
          // Save the access token so that it's used in future calls
          spotifyApi.setAccessToken(data.body.access_token);
          spotifyApi.getPlaylist("1vc3ZDNjfXwft4OvvMhdPK").then((playlist) => {
            // return Object.entries(data.body.tracks.items);
            // console.log(Object.entries(data.body.tracks.items))
            const spotList = Object.entries(playlist.body.tracks.items).map(
              (g) => g[1].track
            );
            // console.log(playlist.body.external_urls.spotify);
            console.log(playlist.body.tracks.items);
            // console.log(Object.entries(playlist.body));
            const shuffled = spotList.sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, 10);
            const track = selected.map((x) => x.name);
            const album = selected.map((x) => x.album.name);
            const artist = selected.map((x) => x.artists.map((y) => y.name));
            const image = selected.map((x) => x.album.images);
            const spotifyUri = selected.map((x) => x.uri);
            const object = track.map((_, i) => ({
              track: track[i],
              spotifyUri: spotifyUri[i],
              album: album[i],
              artist: artist[i],
              image: image[i],
              ytSearch: `https://www.youtube.com/results?search_query=${
                track[i]
              } ${artist[i].map((x) => x).join(" ")}`,
            }));
            // console.log(object);
            // return data.body.tracks.items;
            res.end(JSON.stringify(object));
          });
        },
        (err) => {
          console.log(
            "Something went wrong when retrieving an access token",
            err
          );
        }
      );
    } else if (req.url === "/pocket") {
      console.log("pocket");
      res.writeHead(200, { "Content-Type": "application/json" });
      // ******************************************************
      // *                     PocketApi
      // ******************************************************
      const data = {
        consumer_key: process.env.POCKET_CONSUMER_KEY,
        access_token: process.env.POCKET_ACCESS_TOKEN,
        detailType: "complete",
      };
      // Default options are marked with *
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
          const authors = selectedLinks
            .map((y) =>
              y.authors
                ? y.authors
                : {
                    "000000000": {
                      name: "No Author",
                    },
                  }
            )
            .map((u) => Object.entries(u))
            .reduce((a, b) => a.concat(b), [])
            .map((t) => t[1]);
          // .map((h) => h.name);
          // const pocketData = authors.map((_, i) => ({
          //   ...selectedLinks[i],
          //   itemAuthors: authors[i],
          // }));
          res.end(JSON.stringify(authors));
        })
        .catch((err) => console.log(err));
    } else if (req.url === "/github") {
      console.log("github");
      res.writeHead(200, { "Content-Type": "application/json; text/html" });
      // ******************************************************
      // *                     GithubApi
      // ******************************************************
      fetch(`https://api.github.com/users/${username}/starred`, {
        headers: {
          authorization: `token ${githubToken}`,
        },
      })
        .then((response) => response.json())
        .then((starred) => {
          const starredItems = starred.filter(
            (user) => user.owner.login === "pamelazoe" && user.private === false
          );
          fetch(`https://api.github.com/users/${username}/repos`, {
            method: "GET",
            headers: {
              Accept: "application/vnd.github.mercy-preview+json",
              authorization: `token ${githubToken}`,
            },
          })
            .then((data) => data.json())
            .then((repos) => {
              console.log(repos.stat);
              const starredRepos = starredItems.map((item) =>
                repos.filter((repo) => repo.id === item.id)
              );
              const name = starredRepos.map((n) =>
                n.map((x) => x.name).toString()
              );
              const url = starredRepos.map((u) =>
                u.map((y) => y.html_url).toString()
              );
              const image = starredRepos.map((u) =>
                u
                  // .map((y) => `${y.html_url}/blob/master/${y.name}.jpg`)
                  // .toString()
                  .map(
                    (y) =>
                      `https://raw.githubusercontent.com/${username}/${y.name}/master/${y.name}.jpg`
                  )
                  .toString()
              );
              const demoUrl = starredRepos.map((d) =>
                d
                  .map((w) => (w.homepage !== null ? w.homepage : w.url))
                  .toString()
              );
              const description = starredRepos.map((d) =>
                d
                  .map((q) =>
                    q.description !== null
                      ? q.description
                      : "No description provided"
                  )
                  .toString()
              );
              const topics = starredRepos.map((t) => t.map((v) => v.topics));

              const repoData = name.map((_, i) => ({
                name: name[i],
                url: url[i],
                image: image[i],
                demoUrl: demoUrl[i],
                description: description[i],
                topics: topics[i].reduce((a, b) => a.concat(b), []),
              }));
              // console.log(repoData);
              res.end(JSON.stringify(repoData));
            })
            .catch((err) => console.log(err));
        })
        .catch((error) => console.log(error));
    } else if (req.url === "/") {
      res.writeHead(200, { "Content-Type": "application/json; text/html" });
      res.end(
        JSON.stringify({
          hello: "welcome to this very simple backend for my portfolio.",
          "functional routes": 3,
          routes: [
            "/github, where I use the github API for a projects section on my own website. For this I starred a few of my own projects and then filtered them by author (in this case myself) to display their main characteristics (name, repository/demo links, tags, description, etc).",
            "/spotify, where I use the Spotify API to retrieve 10 random songs of my most listened playlist.",
            "/pocket, where I use the Pocket API to retrieve 10 random saved articles.",
          ],
          feedback: "pmlzoe@gmail.com",
        })
      );
    } else {
      console.log("404");
      res.writeHead(404, { "Content-Type": "application/json; text/html" });
      res.end("Not found");
    }
  })
  .listen(3000, () => {
    console.log("Server running at http://127.0.0.1:3000/");
  });
