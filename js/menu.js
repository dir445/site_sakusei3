//header
$(function() {
    $('.nav-toggle').click(function() {
        $(this).toggleClass('fa-bars');
        $(this).toggleClass('fa-times');
        $(this).next().slideToggle();
        $(this).toggleClass('active');
    });

    $(window).resize(function() {
        console.log(window.innerWidth );
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

//index
$(function() {
    $('.menu-item-link').click(function() {
        $(this).toggleClass('menu-open');
        $('+.submenu',this).slideToggle();
        return false;
    });
    
    const accordionMenu = $('#accordion-menu');
    $(window).resize(function() {
        if(window.innerWidth >= 600 ){
            accordionMenu.css('display','block');             
        }
        else {
            if($('#index-menu .nav-toggle').hasClass('active')) {
                accordionMenu.css('display','block');
            } else {
                accordionMenu.css('display','none');
            }
        }
    });

    const top = $('#top');
    const topButtonAppear = 100;
    $(window).scroll(function() {
        console.log($(this).scrollTop());
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
