function resize() {
    if (jQuery(window).width() <= 1024) {
        jQuery('.smls-main-logo-wrapper').addClass('smls-resposive-wrap');

    } else {
        jQuery('.smls-main-logo-wrapper').removeClass('smls-resposive-wrap');
    }
}
jQuery(document).ready(function($) {
    $(window).resize(resize);
    resize();


    /*
     *
     * check window width
     */
    var smlsWindowWidth = $(window).width();
    $(window).resize(function() {
        smlsWindowWidth = $(window).width();
    });
    /*
     * Add responsive class for grid column
     */
    if (smlsWindowWidth > 1024) {

        for (i = 2; i <= 4; i++) {
            if ($('.smls-grid').hasClass('smls-tablet-column-' + i + '')) {

                $('.smls-grid').removeClass('smls-tablet-column-' + i + '');
            }
        }
        for (i = 1; i <= 2; i++) {
            if ($('.smls-grid').hasClass('smls-mobile-column-' + i + '')) {

                $('.smls-grid').removeClass('smls-mobile-column-' + i + '');
            }
        }


    }
    if (smlsWindowWidth > 740 && smlsWindowWidth <= 1024) {
        for (i = 2; i <= 6; i++) {
            if ($('.smls-grid').hasClass('smls-grid-column-' + i + '')) {

                $('.smls-grid').removeClass('smls-grid-column-' + i + '');
            }
        }
        for (i = 1; i <= 2; i++) {
            if ($('.smls-grid').hasClass('smls-mobile-column-' + i + '')) {

                $('.smls-grid').removeClass('smls-mobile-column-' + i + '');
            }
        }
    }

    if (smlsWindowWidth <= 740) {
        for (i = 2; i <= 6; i++) {
            if ($('.smls-grid').hasClass('smls-grid-column-' + i + '')) {

                $('.smls-grid').removeClass('smls-grid-column-' + i + '');
            }
        }
        for (i = 2; i <= 4; i++) {
            if ($('.smls-grid').hasClass('smls-tablet-column-' + i + '')) {

                $('.smls-grid').removeClass('smls-tablet-column-' + i + '');
            }
        }

    }


    //for horizontal slide of logo
    var smls_carousel = {};
    $('.smls-carousel-logo').each(function() {
        var id = $(this).data('id');
        var pager = $(this).data('pager');
        var controls = $(this).data('controls');
        var controls_type = $(this).data('controls-type');
        var slide_count = $(this).data('slide-count');
        var auto = $(this).data('autoplay');
        var auto_speed = $(this).data('auto-speed');
        var template = $(this).data('template');
        var arrow_type = $(this).data('arrow-type');

        if (template == 'template-2') {
            var margin = 0;
        } else {
            var margin = 15;
        }
        if (controls_type == 'arrow') {
            if (arrow_type == 'type-5') {
                var nav_type = [
                    '<i class="fa fa-arrow-left" aria-hidden="true"></i>',
                    '<i class="fa fa-arrow-right" aria-hidden="true"></i>'
                ];
            } else {
                var nav_type = [
                    '<i class="fa fa-angle-left" aria-hidden="true"></i>',
                    '<i class="fa fa-angle-right" aria-hidden="true"></i>'
                ];
            }
        } else {
            var nav_type = ['<i class="fa fa-long-arrow-left" aria-hidden="true"></i>prev', 'next<i class="fa fa-long-arrow-right" aria-hidden="true"></i>'];
        }

        smls_carousel.id = $(this).owlCarousel({
            center: false,
            items: 1,
            loop: true,
            margin: margin,
            nav: controls,
            dots: pager,
            dotsEach: true,
            navText: nav_type,
            autoplay: auto,
            autoplayHoverPause: true,
            autoplayTimeout: auto_speed,
            animateOut: 'slideOutUp',
            animateIn: 'slideInUp',
            responsiveClass: true,
            responsive: {
                768: {
                    items: slide_count
                },
                0: {
                    items: 1,
                    center: false,
                    nav: false,
                    dots: false

                },
                480: {
                    items: 1,
                    center: false,
                    nav: false,
                    dots: false

                },
                481: {
                    items: 2,
                    center: false,
                    nav: false,
                    dots: false

                },
                740: {
                    items: 2,
                    center: false,
                    nav: false,
                    dots: false

                }

            }


        });
    });



    /*
     * Tooltip
     */
    var smls_tool = {};
    $('.smls-tooltip').each(function() {
        var id = $(this).data('id');
        var tool_template = $(this).data('template');
        var tool_position = $(this).data('position');
        var animation = $(this).data('animation');
        var duration = $(this).data('duration');
        smls_tool.id = $(this).tooltipster({
            animation: 'animation',
            animationDuration: duration,
            position: tool_position, // display the tips to the right of the element
            theme: ['tooltipster-noir', 'smls-tooltip-' + tool_template + '']
        });
    });

});

