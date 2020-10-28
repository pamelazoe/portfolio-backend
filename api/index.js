module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  const index = JSON.stringify({
    hello: 'welcome to this very simple backend for my portfolio.',
    functional_routes: 3,
    routes: [
      '/github, where I use the github API for a projects section on my own website. For this I starred a few of my own projects and then filtered them by author (in this case myself) to display their main characteristics (name, repository/demo links, tags, description, etc).',
      '/spotify, where I use the Spotify API to retrieve 10 random songs of my most listened playlist.',
      '/pocket, where I use the Pocket API to retrieve 10 random saved articles.',
    ],
    feedback: 'pmlzoe@gmail.com',
  });
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  res.status(200).send(index);
};
