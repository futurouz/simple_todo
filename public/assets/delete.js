$(document).ready(function () {
    $('li').on('click', function () {
        var item = $(this).text().replace(/ /g, "-");
        $.ajax({
            type: 'DELETE',
            url: '/todo/' + item,
            success: function (data) {
                location.reload();
            }
        });
    });
});

