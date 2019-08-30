/* 01 - Variables */
/* 02 - page calculations */
/* 03 - function on document ready */
/* 04 - function on page load */
/* 05 - function on page resize */
/* 06 - function on page scroll */
/* 07 - swiper sliders */
/* 08 - buttons, clicks, hovers */

var _functions = {};

jQuery(function($) {

	"use strict";

	/*================*/
	/* 01 - VARIABLES */
	/*================*/
	var swipers = [], winW, winH, winScr, _ismobile = navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i), _isFF = 'MozAppearance' in document.documentElement.style;

	/*========================*/
	/* 02 - page calculations */
	/*========================*/
	_functions.pageCalculations = function(){
		winW = $(window).width();
		winH = $(window).height();
	};

	/*=================================*/
	/* 03 - function on document ready */
	/*=================================*/

	// Check if mobile mobile device
	if(_ismobile) $('body').addClass('mobile');

	// Main set time out for content loaded
	setTimeout( function() {
		// Add class after page loaded
		$('body').addClass('loaded');

		// Page calculations functuin
		_functions.pageCalculations();

		// Custom select init
		$('.SelectBox').SumoSelect();

		// Delate main page loader
		$('#loader-wrapper').fadeOut(200);

		// Swiper init function
		_functions.initSwiper();

	}, 700);

	/*==============================*/
	/* 04 - function on page resize */
	/*==============================*/
	_functions.resizeCall = function(){
		_functions.pageCalculations();
	};
	
	if(!_ismobile){
		$(window).resize(function(){
			_functions.resizeCall();
		});
	} else{
		window.addEventListener("orientationchange", function() {
			_functions.resizeCall();
		}, false);
	}

	/*==============================*/
	/* 05 - function on page scroll */
	/*==============================*/
	$(window).scroll(function(){
		_functions.scrollCall();
	});

	_functions.scrollCall = function(){
		winScr = $(window).scrollTop();
	};

	/*=====================*/
	/* 06 - swiper sliders */
	/*=====================*/
	var initIterator = 0;
	_functions.initSwiper = function(){
		$('.swiper-container').not('.initialized').each(function(){								  
			var $t = $(this);								  

			var index = 'swiper-unique-id-'+initIterator;

			$t.addClass('swiper-'+index+' initialized').attr('id', index);
			$t.find('>.swiper-pagination').addClass('swiper-pagination-'+index);
			$t.parent().find('>.swiper-button-prev').addClass('swiper-button-prev-'+index);
			$t.parent().find('>.swiper-button-next').addClass('swiper-button-next-'+index);

			var slidesPerViewVar = ($t.data('slides-per-view'))?$t.data('slides-per-view'):1;
			if(slidesPerViewVar!='auto') slidesPerViewVar = parseInt(slidesPerViewVar, 10);

			swipers['swiper-'+index] = new Swiper('.swiper-'+index,{
				pagination: '.swiper-pagination-'+index,
		        paginationClickable: true,
		        nextButton: '.swiper-button-next-'+index,
		        prevButton: '.swiper-button-prev-'+index,
		        slidesPerView: slidesPerViewVar,
		        autoHeight:($t.is('[data-auto-height]'))?parseInt($t.data('auto-height'), 10):0,
		        loop: ($t.is('[data-loop]'))?parseInt($t.data('loop'), 10):0,
				autoplay: ($t.is('[data-autoplay]'))?parseInt($t.data('autoplay'), 10):0,
		        breakpoints: ($t.is('[data-breakpoints]'))? { 
		        	767: { slidesPerView: parseInt($t.attr('data-xs-slides'), 10) }, 
		        	991: { slidesPerView: parseInt($t.attr('data-sm-slides'), 10) }, 
		        	1199: { slidesPerView: parseInt($t.attr('data-md-slides'), 10) }, 
		        	1500: {slidesPerView: parseInt($t.attr('data-lt-slides'), 10)} } : {},
		        initialSlide: ($t.is('[data-ini]'))?parseInt($t.data('ini'), 10):0,
		        speed: ($t.is('[data-speed]'))?parseInt($t.data('speed'), 10):500,
		        keyboardControl: true,
		        mousewheelControl: ($t.is('[data-mousewheel]'))?parseInt($t.data('mousewheel'), 10):0,
		        mousewheelReleaseOnEdges: true,
		        direction: ($t.is('[data-direction]'))?$t.data('direction'):'horizontal',
				spaceBetween: ($t.is('[data-space]'))?parseInt($t.data('space'), 10):0,
				parallax: (_isFF)?($t.data('parallax'), 0): ($t.is('[data-parallax]'))?parseInt($t.data('parallax'), 10):0,
				centeredSlides: ($t.is('[data-centered]'))?parseInt($t.data('centered'), 10):0,
			});
			swipers['swiper-'+index].update();
			initIterator++;
		});

		$('.swiper-container.swiper-control-top').each(function(){
			swipers['swiper-'+$(this).attr('id')].params.control = swipers['swiper-'+$(this).closest('.coupleSwiperWrapper').find('.swiper-control-bottom').attr('id')];
		});
		$('.swiper-container.swiper-control-bottom').each(function(){
			swipers['swiper-'+$(this).attr('id')].params.control = swipers['swiper-'+$(this).closest('.coupleSwiperWrapper').find('.swiper-control-top').attr('id')];
		});
	};

	$('.swiper-control-bottom .swiper-slide').on('click', function(){
		swipers['swiper-'+$(this).closest('.coupleSwiperWrapper').find('.swiper-control-top').attr('id')].slideTo($(this).index())
	});

	/*==============================*/
	/* 07 - buttons, clicks, hovers */
	/*==============================*/

	//open and close popup
	$(document).on('click', '.open-popup', function(e){
		e.preventDefault();
		if ( $(this).hasClass('playButton') ) { //Check if video popup
	 		var videoSrc = $(this).attr('data-video-src');
				setTimeout(function() {
					$('.popupContent').find('iframe').attr('src', videoSrc + '??modestbranding=1;iv_load_policy=0;modestbranding=1;showinfo=0&amp;autoplay=1');
				},400);
				$('.popupContent').removeClass('active');
			}
		$('.popupContent').removeClass('active');
		$('.popupWrapper, .popupContent[data-rel="'+$(this).data('rel')+'"]').addClass('active');
		$('html').addClass('overflow-hidden');
		return false;
	});

	$(document).on('click', '.popupWrapper .buttonClose, .popupWrapper .layerClose', function(){
		$('.popupWrapper, .popupContent').removeClass('active');
		$('.popupContent').find('iframe').attr('src', '');
		$('html').removeClass('overflow-hidden');
		return false;
	});
	
	//Function OpenPopup
	function openPopup(foo){
		$('.popup-content').removeClass('active');
		$('.popup-wrapper, .popup-content[data-rel="'+foo+'"]').addClass('active');
		$('html').addClass('overflow-hidden');
		return false;
	}

	//Tabs
	var tabsFinish = 0;
	$('.tabMenu').on('click', function() {
		if($(this).hasClass('active') || tabsFinish) return false;
		tabsFinish = 1;
        var tabsWrapper = $(this).closest('.tabsBlock'),
        	tabsMenu = tabsWrapper.find('.tabMenu'),
        	tabsItem = tabsWrapper.find('.tabEntry'),
        	index = tabsMenu.index(this);
        
        tabsItem.filter(':visible').fadeOut(function(){
        	tabsItem.eq(index).fadeIn(function(){
        		tabsFinish = 0;
        	});
        });
        tabsMenu.removeClass('active');
        $(this).addClass('active');
    });

	//Accordeon
	$('.accordeonTitle').on('click', function(){
		$(this).closest('.accordeon').find('.accordeonTitle').not(this).removeClass('active').next().slideUp();
		$(this).addClass('active').next().slideDown();
	});
    
	//Smooth Scroll
    if(!_ismobile) SmoothScroll({ stepSize: 100 });

});