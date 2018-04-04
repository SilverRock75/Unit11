$('#addAssignment').submit(function(e) {
    $('.alert.alert-danger').remove();
    var points = $('input#points').val(), success = true;
    if (!$('input#name').val() || !$('input#due').val() || !points) {
        $(this).prepend('<div role="alert" class="alert alert-danger">All fields required, please try again</div>');
        success = false;
    }

    points = parseInt(points);
    if (points < 0 || points > 100) {
        $(this).prepend('<div role="alert" class="alert alert-danger">Points must be between 0-100. Please try again</div>');
        success = false;
    }

    return success;
});
