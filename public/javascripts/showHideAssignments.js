$('#showAll').click(function() {
  $('.assignment').each(function(i) {
    $(this).show();
  });
});

$('#showUnsubmitted').click(function() {
  $('.assignment').each(function(i) {
    let status = $(this).attr('data-status');
    if (status !== 'Hastily submitted') {
      $(this).show();
    } else {
      $(this).hide();
    }
  });
});
