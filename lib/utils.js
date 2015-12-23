var $ = module.exports = {
  encodeForURI: encodeForURI
};

function encodeForURI(str) {
  return encodeURIComponent(str).replace(/%20/g, '+');
}
