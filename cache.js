const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 5 * 60 });

const getAndSetDataFromCache = (res, cacheKey, fetchData) => {
  success = cache.get(cacheKey);
  if (success) {
    res.status(200).send(success);
  } else if (success === undefined) {
    fetchData().then((data) => {
      cache.set(cacheKey, data);
      caching = cache.set(cacheKey, data);
      res.status(200).send(data);
    });
  } else {
    res.status(200).send({
      message: "Error, please contact me at pmlzoe@gmail.com",
    });
  }
};

module.exports = getAndSetDataFromCache;
