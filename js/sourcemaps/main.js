(function($) {

    $(document).ready(function() {

        // Custom Function
        $.fn.attachDragger = function() {
            var attachment = false, lastPosition, position, difference;
            $($(this).selector).on("mousedown mouseup mousemove", function(e) {
                if (e.type == "mousedown")
                    attachment = true,
                    lastPosition = [e.clientX, e.clientY];
                if (e.type == "mouseup")
                    attachment = false;
                if (e.type == "mousemove" && attachment == true) {
                    position = [e.clientX, e.clientY];
                    difference = [(position[0] - lastPosition[0]), (position[1] - lastPosition[1])];
                    $(this).scrollLeft($(this).scrollLeft() - difference[0]);
                    $(this).scrollTop($(this).scrollTop() - difference[1]);
                    lastPosition = [e.clientX, e.clientY];
                }
            });
            $(window).on("mouseup", function() {
                attachment = false;
            });
        }
        ;

        // Video Background
        var canvasVideo = new CanvasVideoPlayer({
            videoSelector: '.video',
            canvasSelector: '.canvas',
            timelineSelector: false,
            autoplay: true,
            makeLoop: true,
            pauseOnClick: false,
            audio: false
        });

        // AOS
        setTimeout(function() {
            AOS.init({
                duration: 800
            });
        }, 2000);

        // Menu Event
        function menuEventLister() {
            var _menu = $('.s-header_wrapper');
            if (window.innerWidth < 768) {
                _menu.addClass('is_mobile');
            } else {
                if ($(window).scrollTop() > 600) {
                    _menu.addClass('is_mobile');
                } else {
                    _menu.removeClass('is_mobile').removeClass('toggled');
                    $('body').removeClass('locked');
                }
            }
        }

        $('.nav-item, .nav-item a').on('click', function() {
            $('.s-header_wrapper').removeClass('toggled');
            $('body').removeClass('locked');
        });

        menuEventLister();

        $('.menu-toggle').on('click', function(e) {
            e.preventDefault();
            $('.is_mobile').toggleClass('toggled');
            $('body').toggleClass('locked');
        });

        // Foreword Slick
        $('.foreword-slick').slick({
            dots: false,
            speed: 600,
            slidesToShow: 1,
            slideToScroll: 1,
            adaptiveHeight: true,
            infinite: false,
            prevArrow: '<div class="foreward-prev"><div class="dir">Prev</div><div class="text">Prof. Richard William Allen</div></div>',
            nextArrow: '<div class="foreward-next"><div class="dir">Next</div><div class="text">Prof. LAI Chiu Han Linda</div></div>'
        });

        // Foreword Slick Arrow
        $('.foreword-slick .arrow').each(function() {
            var _this = $(this);
            _this.on('click', function(e) {
                e.preventDefault();
                _this.prev('.text').toggleClass('open').promise().done(function() {
                    setTimeout(function() {
                        if (window.innerWidth > 768) {
                            var _slickHeight = _this.parents('.right').outerHeight();
                        } else {
                            var _slickHeight = _this.parents('.item').outerHeight();
                        }
                        $('.foreword-slick .slick-list').height(_slickHeight);
                    }, 444);
                });
                _this.toggleClass('open');
            });
        });

        $('.filter').scrollbar();

        function filterDrag() {

            if (window.innerWidth < 768) {
                $('.filter').attachDragger();
            }
        }

        filterDrag();

        var cards = $('.work-item');
        for (var i = 0; i < cards.length; i++) {
            var target = Math.floor(Math.random() * cards.length - 1) + 1;
            var target2 = Math.floor(Math.random() * cards.length - 1) + 1;
            cards.eq(target).before(cards.eq(target2));
        }

        // Work Isotope
        var $grid = $('.work').isotope({
            itemSelector: '.work-item',
            percentPosition: true,
            layoutMode: 'fitRows',
            fitRows: {
                columnWidth: '.item-sizer',
                gutter: '.gutter-sizer'
            }
        });

        // Filter Click
        $('.filter').on('click', '.filter-nav', function() {
            var _this = $(this);
            var filterValue = _this.attr('data-filter');
            $('.filter-nav').removeClass('current');
            _this.addClass('current');
            $grid.isotope({
                filter: filterValue
            });

            if (filterValue != '*') {
                $('.work-item').each(function() {
                    var _this = $(this);
                    _this.attr('data-fancybox', 'group-' + _this.attr('data-filter'));
                });
            } else {
                $('.work-item').attr('data-fancybox', 'group-all');
            }

            AOS.refresh();
        });

        // Screening Nav Offset
        var today = new Date();
        var dd = today.getDate();
        if (dd < 15) {
            dd = 15;
        }
        var start = '15';
        var offset = dd - start;

        // Screening Nav Slick
        $('.screening-nav').slick({
            dots: false,
            arrows: false,
            infinite: false,
            initialSlide: offset,
            speed: 600,
            slidesToShow: 4,
            slidesToScroll: 1,
            mobileFirst: true,
            focusOnSelect: true,
            adaptiveHeight: true,
            asNavFor: '.screening-content-slick',
            responsive: [{
                breakpoint: 650,
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 1,
                }
            }, {
                breakpoint: 768,
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 1,
                    arrows: true
                }
            }, {
                breakpoint: 960,
                settings: {
                    slidesToShow: 7,
                    slidesToScroll: 1,
                    arrows: true
                }
            }]
        });

        // Screening Content Slick
        $('.screening-content-slick').slick({
            dots: false,
            speed: 600,
            slidesToShow: 1,
            slideToScroll: 1,
            infinite: false,
            arrows: false,
            swipe: false,
            draggable: false,
            fade: true,
            adaptiveHeight: true
        })

        $('.screening.content.slick').on('afterChange', function(slick) {
            AOS.refresh();
        });

        // Reset Lightbox Content
        function resetWorkContent() {
            $('.work-detail').each(function() {
                var _this = $(this);
                if (window.innerWidth < 768) {
                    var _myImage = _this.find('.left');
                    var _myContent = _this.find('.right #text');
                } else {
                    var _myImage = _this.find('.left');
                    var _myContent = _this.find('.right');
                }
                _myImage.insertBefore(_myContent);
            });
        }

        resetWorkContent();

        AOS.refresh();

        $(window).resize(function() {
            menuEventLister();
            resetWorkContent();
            filterDrag();
        });

        $(window).scroll(function() {
            menuEventLister();
        });

    });

}
)(jQuery);

function googleMapInit() {

    var zoom, center, style, options, map, marker, office;

    /*-----------------------------------
     ----------- Map Initialze -----------
     -----------------------------------*/
    zoom = 14;

    center = new google.maps.LatLng(22.340143,114.166342);

    office = {
        lat: 22.340143,
        lng: 114.166342
    };

    style = [{
        "featureType": "all",
        "elementType": "labels",
        "stylers": [{
            "visibility": "off"
        }, {
            "saturation": "0"
        }, {
            "lightness": "0"
        }]
    }, {
        "featureType": "administrative",
        "elementType": "all",
        "stylers": [{
            "color": "#f9d8b2"
        }]
    }, {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [{
            "color": "#eeeeee"
        }]
    }, {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [{
            "color": "#f9d8b2"
        }]
    }, {
        "featureType": "poi.attraction",
        "elementType": "all",
        "stylers": [{
            "color": "#efebe2"
        }]
    }, {
        "featureType": "poi.business",
        "elementType": "all",
        "stylers": [{
            "color": "#efebe2"
        }]
    }, {
        "featureType": "poi.government",
        "elementType": "all",
        "stylers": [{
            "color": "#dfdcd5"
        }]
    }, {
        "featureType": "poi.medical",
        "elementType": "all",
        "stylers": [{
            "color": "#dfdcd5"
        }]
    }, {
        "featureType": "poi.park",
        "elementType": "all",
        "stylers": [{
            "color": "#f9d8b2"
        }]
    }, {
        "featureType": "poi.place_of_worship",
        "elementType": "all",
        "stylers": [{
            "color": "#efebe2"
        }]
    }, {
        "featureType": "poi.school",
        "elementType": "all",
        "stylers": [{
            "color": "#efebe2"
        }]
    }, {
        "featureType": "poi.sports_complex",
        "elementType": "all",
        "stylers": [{
            "color": "#efebe2"
        }]
    }, {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [{
            "color": "#ffffff"
        }]
    }, {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [{
            "visibility": "off"
        }]
    }, {
        "featureType": "road.arterial",
        "elementType": "geometry.fill",
        "stylers": [{
            "color": "#ffffff"
        }]
    }, {
        "featureType": "road.arterial",
        "elementType": "geometry.stroke",
        "stylers": [{
            "visibility": "off"
        }]
    }, {
        "featureType": "road.local",
        "elementType": "geometry.fill",
        "stylers": [{
            "color": "#fbfbfb"
        }]
    }, {
        "featureType": "road.local",
        "elementType": "geometry.stroke",
        "stylers": [{
            "visibility": "off"
        }]
    }, {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [{
            "visibility": "off"
        }]
    }, {
        "featureType": "water",
        "elementType": "all",
        "stylers": [{
            "color": "#91faf4"
        }]
    }];

    options = {
        'zoom': zoom,
        'center': center,
        'styles': style,
        'draggable': false,
        'scrollwheel': false,
    };

    map = new google.maps.Map(document.getElementById("map"),options);

    marker = new google.maps.Marker({
        position: office,
        map: map,
        icon: 'assets/images/build/marker.png'
    });
}
