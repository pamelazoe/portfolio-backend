require('dotenv').config();
const fetch = require('node-fetch');
const githubToken = process.env.GITHUB_PERSONAL_TOKEN;
const username = 'pamelazoe';

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://pamelazoe.now.sh');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
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
        (user) => user.owner.login === 'pamelazoe' && user.private === false
      );
      fetch(`https://api.github.com/users/${username}/repos`, {
        method: 'GET',
        headers: {
          Accept: 'application/vnd.github.mercy-preview+json',
          authorization: `token ${githubToken}`,
        },
      })
        .then((data) => data.json())
        .then((repos) => {
          const starredRepos = starredItems.map((item) =>
            repos.filter((repo) => repo.id === item.id)
          );
          const name = starredRepos.map((repos) =>
            repos.map((item) => item.name)
          );
          const url = starredRepos.map((repos) =>
            repos.map((url) => url.html_url)
          );
          const image = starredRepos.map((repos) =>
            repos.map(
              (user) =>
                `https://raw.githubusercontent.com/${username}/${user.name}/master/${user.name}.jpg`
            )
          );
          const demoUrl = starredRepos.map((repos) =>
            repos.map((demo) =>
              demo.homepage !== null ? demo.homepage : demo.url
            )
          );
          const description = starredRepos.map((repos) =>
            repos.map((item) =>
              item.description !== null
                ? item.description
                : 'No description provided'
            )
          );
          const topics = starredRepos.map((repos) =>
            repos.map((repo) => repo.topics)
          );

          const repoData = name.map((_, i) => ({
            name: name[i],
            url: url[i],
            image: image[i],
            demoUrl: demoUrl[i],
            description: description[i],
            topics: topics[i].reduce((a, b) => a.concat(b), []),
          }));
          res.status(200).send(repoData);
        })
        .catch((err) => console.log(err));
    })
    .catch((error) => console.log(error));
};
