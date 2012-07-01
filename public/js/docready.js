$(function() {
    $('a.dash').addClass('selected');
    $('#nav a').on('click', function(e) {
	$('#nav a').removeClass('selected');
	$(this).addClass('selected');
    });
});