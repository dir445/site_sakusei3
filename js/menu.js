//index
$(function() {
    $('.menu-item-link').click(function() {
        $(this).toggleClass('menu-open');
        $(this).next().slideToggle();
        return false;
    });

    const top = $('#top');
    const topButtonAppear = 50;
    $(window).scroll(function() {
        if ($(this).scrollTop() > topButtonAppear) {
            top.addClass('appear');
        }
        else {
            top.removeClass('appear');
        }
    });

    top.click(function() {
        $('body,html').animate({scrollTop: 0}, 100); 
        return false;    
    });
});
