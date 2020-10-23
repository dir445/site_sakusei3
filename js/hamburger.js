//header
$(function() {
    $('.nav-toggle').click(function() {
        $(this).toggleClass('fa-bars');
        $(this).toggleClass('fa-times');
        $(this).next().slideToggle();
        $(this).toggleClass('active');
    });

    $(window).resize(function() {
        if(window.innerWidth >= 600 ) {
            $('header ul').css('display','flex');
        }
        else {
            if($('header .nav-toggle').hasClass('active')) {
                $('header ul').css('display','block');
            } else {
                $('header ul').css('display','none');
            }
        }
    });
});
