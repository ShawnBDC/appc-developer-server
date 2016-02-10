/* globals Appc, $, window, document, app */

Appc.afterHeaderRender(function () {

	$('#appc-unified-header-sitename').html('<a href="/">Developer Portal</a>');

	var $menu = $('#appc-unified-header-nav .pull-left').first();

	var links = {
		'/help': 'Help',
		// '/updates': 'Updates'
	};

	for (var href in links) {
		$menu.append('<a href="' + href + '">' + links[href] + '</a>');
	}

	if (app.activeNav) {
		$menu.find('[href="' + app.activeNav + '"]').addClass('active');
	} else {
		$('#appc-unified-header-sitename').addClass('active');
	}
});

Appc.afterFooterRender(function () {

	$('#appc-unified-footer').prepend('<div class="pull-left"><a href="#">' + app.version + '</a></div>');

});

$(document).ready(function () {

	// prevent # links to actually add # to URLs
	$('a[href="#"]').click(function () {
		return false;
	});

	$('a[title],[data-toggle="tooltip"]').tooltip();

});
