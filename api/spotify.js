require("dotenv").config();
const SpotifyWebApi = require("spotify-web-api-node");
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 5 * 60 });

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const myPlaylist = "1vc3ZDNjfXwft4OvvMhdPK";
const spotifyApi = new SpotifyWebApi({
  clientId,
  clientSecret,
});

module.exports = (req, res) => {
  // res.setHeader('Access-Control-Allow-Origin', 'https://pamelazoe.now.sh');
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  success = cache.get("spotify-response");
  if (success) {
    res.status(200).send(success);
  } else if (success === undefined) {
    spotifyApi.clientCredentialsGrant().then(
      (data) => {
        // console.log('The access token expires in ' + data.body['expires_in']);
        // console.log('The access token is ' + data.body['access_token']);
        // Save the access token so that it's used in future calls
        spotifyApi.setAccessToken(data.body.access_token);
        spotifyApi.getPlaylist(myPlaylist).then((playlist) => {
          // return Object.entries(data.body.tracks.items);
          // console.log(Object.entries(data.body.tracks.items))
          const spotList = Object.entries(playlist.body.tracks.items).map(
            (playlist) => playlist[1].track
          );
          // console.log(playlist.body.external_urls.spotify);
          // console.log(playlist.body.tracks.items);
          // console.log(Object.entries(playlist.body));
          const shuffled = spotList.sort(() => 0.5 - Math.random());
          const selected = shuffled.slice(0, 10);
          const track = selected.map((item) => item.name);
          const album = selected.map((item) => item.album.name);
          const artist = selected.map((item) =>
            item.artists.map((artist) => artist.name)
          );
          const image = selected.map((item) => item.album.images);
          const spotifyUri = selected.map((item) => item.uri);
          const object = track.map((_, i) => ({
            track: track[i],
            spotifyUri: spotifyUri[i],
            album: album[i],
            artist: artist[i],
            image: image[i],
            ytSearch: `https://www.youtube.com/results?search_query=${
              track[i]
            } ${artist[i].map((data) => data).join(" ")}`,
          }));
          // console.log(object);
          // return data.body.tracks.items;
          cache.set("spotify-response", object);
          caching = cache.set("spotify-response", object);
          res.status(200).send(object);
          // res.status(200).send(object);
        });
      },
      (err) => {
        console.log(
          "Something went wrong when retrieving an access token",
          err
        );
      }
    );
  } else {
    res.status(200).send({
      message: "Error, please contact me at pmlzoe@gmail.com",
    });
  }

  // Retrieve an access token.
};
