$('.menu-item-link').click(function() {
    $(this).toggleClass('menu-open');
    $('+.submenu',this).slideToggle();
    return false;
});

$('#nav-toggle').click(function() {
    $(this).toggleClass('fa-bars');
    $(this).toggleClass('fa-times');
    $('+#accordion-menu',this).slideToggle();
});