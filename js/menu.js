$('.menu-item-link').click(function() {
    $('+.submenu',this).slideToggle();
    return false;
});

$('#nav-toggle').click(function() {
    $(this).toggleClass('fa-bars');
    $(this).toggleClass('fa-times');
    $('+#accordion-menu',this).slideToggle();
});