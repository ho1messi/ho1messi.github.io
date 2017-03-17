var $toc = $('#post-toc');
var $footer = $('#footer');
var $content = $('#content');
var $article = $('#article');
var $active;
var SPACING_TOP = 20;
var SPACING_BOTTOM = 0;
var temp = 0;

if ($toc.length) {

    var $tocActive;

    var tocBaseOffsetTop = $toc.offset().top;
    var windowScrollLast = $(window).scrollTop();
    var tocBaseOffsetBottom = tocBaseOffsetTop + $toc.height();

    var windowScroll;
    var windowBottomScroll;
    var tocBottomAtWindowBottom;
    var tocTopAtWindowTop;
    var tocBottomAtFooterTop;
    var tocActiveOffset;

    function TocPosition() {
        windowScroll = $(window).scrollTop();
        windowBottomScroll = windowScroll + $(window).height();
        tocBottomAtWindowBottom = windowBottomScroll - $toc.height();
        tocTopAtWindowTop = windowScroll + SPACING_TOP;
        tocBottomAtFooterTop = $(footer).offset().top - SPACING_BOTTOM;

        if (windowScroll > windowScrollLast) {
            if (tocBottomAtWindowBottom > $toc.offset().top) {
                if (windowBottomScroll > tocBottomAtFooterTop) {
                    //$toc.css({ 'top': tocBottomAtFooterTop - tocBaseOffsetBottom });
                    TocPositionSet(tocBottomAtFooterTop - tocBaseOffsetBottom);
                } else {
                    //$toc.css({ 'top': windowBottomScroll - tocBaseOffsetBottom });
                    TocPositionSet(windowBottomScroll - tocBaseOffsetBottom);
                }
            } else if (tocBottomAtWindowBottom < tocBaseOffsetTop) {
                //$toc.css({ 'top': 0 });
                    TocPositionSet(0);
            } else {
                TocPositionSet($toc.offset().top - tocBaseOffsetTop);
            }
        } else {
            if (tocTopAtWindowTop < tocBaseOffsetTop) {
                //$toc.css({ 'top': 0 });
                    TocPositionSet(0);
            } else if (tocTopAtWindowTop < $toc.offset().top) {
                //$toc.css({ 'top': tocTopAtWindowTop - tocBaseOffsetTop });
                    TocPositionSet(tocTopAtWindowTop - tocBaseOffsetTop);
            } else {
                TocPositionSet($toc.offset().top - tocBaseOffsetTop);
            }
        }

        windowScrollLast = windowScroll;
    }

    function TocPositionSet(topPosition) {
        $tocActive = $('.active');
        
        if (!$tocActive.length) {
            $toc.css({ 'top': topPosition });
            console.log(1);
            return;
        }

        tocActiveOffset = $tocActive.offset().top - $toc.offset().top + topPosition;
        windowScroll = $(window).scrollTop();
        windowBottomScroll = windowScroll + $(window).height();
        
        if (tocActiveOffset < windowScroll) {
            $toc.css({ 'top': topPosition + windowScroll - tocActiveOffset });
        } else if (tocActiveOffset + 250 > windowBottomScroll) {
            $toc.css({ 'top': topPosition - tocActiveOffset - 250 + windowBottomScroll });
        } else {
            $toc.css({ 'top': topPosition });
        }
    }
/*
    function TocWidth() {
        var tocWidth = {
            'width': $content.innerWidth() - $article.width() - 30
        };
        var tocMargin = {
            'margin-left': $article.width() + 30
        };
        $toc.css(tocMargin);
    };
*/
    $(document).ready(function () {
        TocPosition();
        //TocWidth();
    });

    $(window).scroll(function () {
        TocPosition();
    });/*
    $(window).resize(function () {
        TocWidth();
    });
*/
}

var HEADERFIX = 30;

var $toclink = $('.toc-link'),
    $headerlink = $('.headerlink');

var headerlinkTop = $.map($headerlink, function (link) {
    return $(link).offset().top;
});

$(window).scroll(function () {
    var scrollTop = $(window).scrollTop();

    for (var i = 0; i < $toclink.length; i++) {
        var isLastOne = i + 1 === $toclink.length,
            currentTop = headerlinkTop[i] - HEADERFIX,
            nextTop = isLastOne ? Infinity : headerlinkTop[i+1] - HEADERFIX;
            
        if (currentTop < scrollTop && scrollTop <= nextTop) {
            $($toclink[i]).addClass('active')
        } else {
            $($toclink[i]).removeClass('active')
        }
    }
});