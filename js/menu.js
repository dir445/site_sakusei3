$('.menu-item-link').click(function() {
    $(this).toggleClass('menu-open');
    $('+.submenu',this).slideToggle();
    return false;
});

let accordionMenu = $('#accordion-menu');

$('#nav-toggle').click(function() {
    $(this).toggleClass('fa-bars');
    $(this).toggleClass('fa-times');
    accordionMenu.slideToggle();
});

$(window).resize(function() {
    if($(window).innerWidth > 800) {
        accordionMenu.show();
    }
});