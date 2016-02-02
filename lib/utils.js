var $ = module.exports = {
	getRandom: getRandom,
	extractImageSrc: extractImageSrc
};

function getRandom(min, max) {
	return Math.random() * (max - min) + min;
}

function extractImageSrc(html) {
	var match = html.match(/<img[^>]+src="([^"]+)"[^>]+>/);

	if (match) {
		return match[1];
	}
}
