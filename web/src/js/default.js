/* globals Appc, $, window, document, app */

Appc.afterHeaderRender(function () {

	$('#appc-unified-header-sitename').html('<a href="/">Developer</a>');

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
