//header
$(function() {
    $('.nav-toggle').click(function() {
        $(this).toggleClass('fa-bars');
        $(this).toggleClass('fa-times');
        $(this).next().slideToggle();
        $(this).next().toggleClass('active');
    });

    $(window).resize(function() {
        console.log(window.innerWidth );
        if(window.innerWidth >= 600 ) {
            $('header ul').css('display','flex');
        }
        else {
            if($('header ul').hasClass('active')) {
                $('header ul').css('display','block');
            } else {
                $('header ul').css('display','none');
            }
        }
    });
});


$(function() {
    $('.menu-item-link').click(function() {
        $(this).toggleClass('menu-open');
        $('+.submenu',this).slideToggle();
        return false;
    });
    
    const accordionMenu = $('#accordion-menu');
    


    function isToggleOpen() {
        return navToggle.hasClass('fa-times');
    }
    
    // $(window).resize(function() {
    //     if($(window).innerWidth() > 800 ){
    //         if(!isToggleOpen()) {
    //             accordionMenu.animate( { width: 'show' }, 'slow' );
    //         }                
    //     }
    //     else {
    //         if(isToggleOpen()) {
    //             accordionMenu.animate( { width: 'hide' }, 'slow' );
    //         }           
    //     }
    // });
});
