var $ = module.exports = {
	getRandom: getRandom
};

function getRandom(min, max) {
	return Math.random() * (max - min) + min;
}
