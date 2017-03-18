var $sidebar = $('#sidebar');
var $footer = $('#footer');
var $content = $('#content');
var $article = $('#article');
var SPACING_TOP = 20;
var SPACING_BOTTOM = 23;
var temp = 0;

if ($sidebar.length) {
    
    var sidebarBaseOffsetTop = $sidebar.offset().top;
    var windowScrollLast = $(window).scrollTop();
    var sidebarBaseOffsetBottom = sidebarBaseOffsetTop + $sidebar.height();

    var windowScroll;
    var windowBottomScroll;
    var sidebarBottomAtWindowBottom;
    var sidebarTopAtWindowTop;
    var sidebarBottomAtFooterTop;

    function SidebarPosition() {
        windowScroll = $(window).scrollTop();
        windowBottomScroll = windowScroll + $(window).height();
        sidebarBottomAtWindowBottom = windowBottomScroll - $sidebar.height();
        sidebarTopAtWindowTop = windowScroll + SPACING_TOP;
        sidebarBottomAtFooterTop = $(footer).offset().top - SPACING_BOTTOM;

        if ($sidebar.height() > $(window).height()) {

            if (windowScroll > windowScrollLast) {
                if (sidebarBottomAtWindowBottom > $sidebar.offset().top) {
                    if (windowBottomScroll > sidebarBottomAtFooterTop) {
                        $sidebar.css({ 'top': sidebarBottomAtFooterTop - sidebarBaseOffsetBottom });
                    } else {
                        $sidebar.css({ 'top': windowBottomScroll - sidebarBaseOffsetBottom });
                    }
                } else if (sidebarBottomAtWindowBottom < sidebarBaseOffsetTop) {
                    $sidebar.css({ 'top': 0 });
                }
            } else {
                if (sidebarTopAtWindowTop < sidebarBaseOffsetTop) {
                    $sidebar.css({ 'top': 0 });
                } else if (sidebarTopAtWindowTop < $sidebar.offset().top) {
                    $sidebar.css({ 'top': sidebarTopAtWindowTop - sidebarBaseOffsetTop });
                }
            }

        } else {

            if (sidebarTopAtWindowTop < sidebarBaseOffsetTop) {
                $sidebar.css({ 'top': 0 });
            } else if (sidebarTopAtWindowTop > sidebarBaseOffsetTop) {
                $sidebar.css({ 'top': sidebarTopAtWindowTop - sidebarBaseOffsetTop });
            }

        }    

        windowScrollLast = windowScroll;
    }

    $(document).ready(function () {
        SidebarPosition();
    });

    $(window).scroll(function () {
        SidebarPosition();
    });
}