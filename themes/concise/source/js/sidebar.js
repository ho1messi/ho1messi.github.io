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

        windowScrollLast = windowScroll;
    }

/*
    var sidebarScrollTop = $sidebar.offset().top;
    var windowScrollTopDownMin = sidebarScrollTop + $sidebar.height() - $(window).height();
    var windowScrollTopUpMin = sidebarScrollTop - SPACING_TOP;
    var windowScrollTopLast = $(window).scrollTop();

    var sidebarTopMax;
    var scrollTop;
    var sidebarTop;

    function TocPosition() {
        scrollTop = $(window).scrollTop();
        sidebarTopMax = $footer.offset().top - sidebarScrollTop - $sidebar.height() - SPACING_BOTTOM;

        if (scrollTop > windowScrollTopLast) {
            if (scrollTop > windowScrollTopDownMin) {
                var temp = $sidebar.offset().top + $sidebar.height() - $(window).height();
                if (scrollTop > temp) {
                    sidebarTop = scrollTop - windowScrollTopDownMin;
                    if (sidebarTop < sidebarTopMax) {
                    console.log(1);
                        $sidebar.css({ 'top': sidebarTop });
                    } else {
                    console.log(2);
                        $sidebar.css({ 'top': sidebarTopMax });
                    }
                }
            } else {
                    console.log(3);
                $sidebar.css({ 'top': 0 });
            }
        } else {
            if (scrollTop > windowScrollTopUpMin) {
                if ($sidebar.offset().top > scrollTop + SPACING_TOP) {
                    console.log(4);
                    $sidebar.css({ 'top': scrollTop + SPACING_TOP - sidebarScrollTop })
                }
            } else {
                    console.log(5);
                $sidebar.css({ 'top': 0 });
            }
        }

        windowScrollTopLast = scrollTop;
    };
*/
/*
    function TocWidth() {
        var sidebarWidth = {
            'width': $content.innerWidth() - $article.width() - 30
        };
        var sidebarMargin = {
            'margin-left': $article.width() + 30
        };
        $toc.css(sidebarMargin);
    };
*/
    $(document).ready(function () {
        SidebarPosition();
        //TocWidth();
    });

    $(window).scroll(function () {
        SidebarPosition();
    });/*
    $(window).resize(function () {
        TocWidth();
    });
*/
}