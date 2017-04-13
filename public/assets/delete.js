
$(document).ready(function () {
    $('li').on('click', function () {
        var item = $(this).text().replace(/ /g, "-");
        $.ajax({
            type: 'GET',
            url: '/todo/delete/' + item,
            success: function (data) {
                location.reload();
            }
        });
    });
});

