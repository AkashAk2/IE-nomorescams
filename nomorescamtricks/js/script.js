$(window).on("load", function () {

    "use strict";

/* ===================================
        Loading Timeout
 ====================================== */
    $('.side-menu').removeClass('hidden');

    setTimeout(function(){
        $('.loader').fadeOut();
    }, 1000);
});

/* ===================================
     Side Menu
 ====================================== */
if ($(".sidemenu_toggle").length) {
    $(".sidemenu_toggle").on("click", function () {
        $(".side-menu").removeClass("side-menu-opacity");
        $(".pushwrap").toggleClass("active");
        $(".side-menu").addClass("side-menu-active"), $("#close_side_menu").fadeIn(700)
    }), $("#close_side_menu").on("click", function () {
        $(".side-menu").removeClass("side-menu-active"), $(this).fadeOut(200), $(".pushwrap").removeClass("active");
        setTimeout(function(){
            $(".side-menu").addClass("side-menu-opacity");
        }, 500);
    }), $(".side-nav .navbar-nav .nav-link").on("click", function () {
        $(".side-menu").removeClass("side-menu-active"), $("#close_side_menu").fadeOut(200), $(".pushwrap").removeClass("active");
        setTimeout(function(){
            $(".side-menu").addClass("side-menu-opacity");
        }, 500);
    }), $(".btn_sideNavClose").on("click", function () {
        $(".side-menu").removeClass("side-menu-active"), $("#close_side_menu").fadeOut(200), $(".pushwrap").removeClass("active");
        setTimeout(function(){
            $(".side-menu").addClass("side-menu-opacity");
        }, 500);
    });
}

/* ===================================
     Nav Scroll
 ====================================== */
jQuery(function ($) {
    "use strict";

    $(window).on('scroll', function () {
        if ($(this).scrollTop() > 260) { // Set position from top to add class
            $('.fixed-nav-on-scroll').removeClass('d-none');
        }
        else {
            $('.fixed-nav-on-scroll').addClass('d-none');
        }
    });
});

$(".scroll").on("click", function(event){
    event.preventDefault();
    $('html,body').animate({
        scrollTop: $(this.hash).offset().top - 0}, 800);
});

/*===================================
    Go Top Scroll
====================================== */
$(function(){
    // Scroll Event
    $(window).on('scroll', function(){
        var scrolled = $(window).scrollTop();
        if (scrolled > 260) $('.go-top').addClass('active');
        if (scrolled < 260) $('.go-top').removeClass('active');
    });
    // Click Event
    $('.go-top').on('click', function() {
        $("html, body").animate({ scrollTop: "0" },  500);
    });
});

/* =====================================
      Wow Animations
 ======================================== */
if ($(window).width() > 767) {
    var wow = new WOW({
        boxClass: 'wow',
        animateClass: 'animated',
        offset: 0,
        mobile: false,
        live: true
    });
    new WOW().init();
}

/* ===================================
     Rotating Text
 ====================================== */
if ($(".js-rotating").length) {
    $(".js-rotating").Morphext({
        // The [in] animation type. Refer to Animate.css for a list of available animations.
        animation: "flipInX",
        // An array of phrases to rotate are created based on this separator. Change it if you wish to separate the phrases differently (e.g. So Simple | Very Doge | Much Wow | Such Cool).
        separator: ",",
        // The delay between the changing of each phrase in milliseconds.
        speed: 3000,
        complete: function () {
            // Called after the entrance animation is executed.
        }
    });
}

/* ===================================
      Cube Portfolio
====================================== */
$('#js-grid-mosaic-flat').cubeportfolio({
    filters: '#js-filters-mosaic-flat',
    layoutMode: 'mosaic',
    sortByDimension: true,
    mediaQueries: [{
        width: 1600,
        cols: 6,
    }, {
        width: 991,
        cols: 4,
    }, {
        width: 767,
        cols: 2,
    }, {
        width: 480,
        cols: 1,
        options: {
            caption: '',
            gapHorizontal: 15,
            gapVertical: 15,
        }
    }],
    defaultFilter: '*',
    animationType: 'fadeOutTop',
    gapHorizontal: 0,
    gapVertical: 0,
    gridAdjustment: 'responsive',
    caption: 'zoom',
    displayType: 'fadeIn',
    displayTypeSpeed: 100,

    // lightbox
    lightboxDelegate: '.cbp-lightbox',
    lightboxGallery: true,
    lightboxTitleSrc: 'data-title',
    lightboxCounter: '<div class="cbp-popup-lightbox-counter">{{current}} of {{total}}</div>',

    plugins: {
        loadMore: {
            element: '#js-loadMore-mosaic-flat',
            action: 'click',
            loadItems: 3,
        }
    },
});

/* ===================================
    Counter
====================================== */
$('.count').each(function() {
    $(this).appear(function() {
        var originalText = $(this).text();
        var isDollarSignPresent = originalText.startsWith('$');
        var numberValue = isDollarSignPresent ? parseFloat(originalText.replace('$', '')) : parseFloat(originalText);

        $(this).prop('Counter', 0).animate({
            Counter: numberValue
        }, {
            duration: 3000,
            easing: 'swing',
            step: function(now) {
                $(this).text((isDollarSignPresent ? "$" : "") + Math.ceil(now));
            }
        });
    });
});



/* ===================================
    Reviews
====================================== */
$('.testimonial #testimonial-carousal').owlCarousel({
    loop:true,
    margin:120,
    nav:false,
    dots:true,
    autoplay:true,
    responsive:{
        0:{
            items:1
        },
        600:{
            items:1
        },
        1000:{
            items:2
        }
    }
});

if ($(window).width() > 992) {
    $(".parallax").parallaxie({
        speed: 0.55,
        offset: 0,
    });
}


//Underline
$(document).ready(function() {
    setActiveLink();

    $(window).on('scroll', function() {
        setActiveLink();
    });

    $('.nav-link.line').on('click', function(event) {
        // Remove active class from all nav-link elements
        $('.nav-link.line').removeClass('active');
        
        // Add active class to the clicked link
        $(this).addClass('active');
    });
});

function setActiveLink() {
    // Determine the current page's URL
    var currentUrl = window.location.href;
    var wasActiveSet = false; // flag to check if any link was set to active

    $('.nav-link.line').each(function() {
        var linkUrl = $(this).attr('href');
        
        // Check if the current URL matches with the link's href
        if (currentUrl.endsWith(linkUrl) || currentUrl.includes(linkUrl)) {
            $('.nav-link.line').removeClass('active');
            $(this).addClass('active');
            wasActiveSet = true;
        }
    });

    // If no link was set to active, default to the first link (e.g., Home)
    if (!wasActiveSet) {
        $('.nav-link.line').first().addClass('active');
    }
}


// // Function to get total weighted questions based on communication type (text/call)
// function getTotalWeightedQuestions() {
//     if(type === "text") {
//         return 3 + 2 + 3 + 3 + 3 + 3; // Sum of the absolute weight for text type questions
//     } else if(type === "call") { 
//         // Sum of absolute weights for all call-related questions
//         return Math.abs(3) + Math.abs(-1) + 
//                Math.abs(3) + Math.abs(-1) + 
//                Math.abs(3) + Math.abs(-1) + 
//                Math.abs(3) + Math.abs(-1) + 
//                Math.abs(3) + Math.abs(-1) + 
//                Math.abs(3) + Math.abs(-1) + 
//                Math.abs(3) + Math.abs(-1);
//     }
// }

//Quiz
$(document).ready(function() {
    // Global variables
    let currentSlide = 1;
    let totalWeightedYesAnswers = 0;
    let totalWeightedQuestions;
    let type = null;


    // Starting the quiz
    $("#slide1 .options button").click(function() {
        type = $(this).data("type");
        
        // Initialize totalWeightedQuestions based on the type selected
        if(type === "text") {
            totalWeightedQuestions = 3 + 2 + 3 + 3 + 3 + 3; // Sum of the absolute weight for text type questions
        } else {
            totalWeightedQuestions = 21;
        }

        switchSlide(`slide1`, `slide2-${type}`);
    });


    $(".options button").click(function() {
        // Check if data-weight attribute exists
        if($(this).attr("data-weight")) {
            let weight = parseInt($(this).attr("data-weight"));
            console.log(`Clicked weight: ${weight}`);
    
            totalWeightedYesAnswers += weight;
            console.log(`Total Weighted Yes Answers: ${totalWeightedYesAnswers}`);

        }
        // Highlight the clicked button and clear others
        $(this).siblings().removeClass('active');
        $(this).addClass('active');
    });
    


    // Previous button logic
    $("#prev").click(function() {
        if (currentSlide > 2) {
            switchSlide(`slide${currentSlide}-${type}`, `slide${currentSlide - 1}-${type}`);
        }
    });

    // Next button logic
    $("#next").click(function() {
        if (currentSlide < (type === "text" ? 7 : 8)) {
            switchSlide(`slide${currentSlide}-${type}`, `slide${currentSlide + 1}-${type}`);
        } else {
            displayResult();
        }
    });

    // Switching slide function
    function switchSlide(oldSlide, newSlide) {
        $(`#${oldSlide}`).fadeOut(300, function() {
            $(this).removeClass('active');
            $(`#${newSlide}`).addClass('active').fadeIn(500);
        });
        updateProgressBar(newSlide.split('-')[0].replace('slide', ''));
    }

    function updateProgressBar(slideNumber) {
        currentSlide = parseInt(slideNumber);
        const totalSlides = (type === "text" ? 7 : 8);  // 7 slides for text, 8 for call
        const progress = (currentSlide / totalSlides) * 100;
        $("#progressBar").css("width", `${progress}%`);
    }

    function calculateScamPercentage() {
        console.log(`Total Weighted Yes Answers: ${totalWeightedYesAnswers}`);
        console.log(`Total Weighted Questions: ${totalWeightedQuestions}`);
        if (totalWeightedQuestions === 0) {
            return 0;  // Avoid division by zero
        }
        let percentage = (totalWeightedYesAnswers / totalWeightedQuestions) * 100;
        
        // Ensure the percentage is between 0 and 100
        return Math.max(0, Math.min(percentage, 100));
    }
    
    
    

    function displayResult() {
        let percentage = calculateScamPercentage();
        $("#resultPercentage").text(`${percentage.toFixed(0)}`);
        $(".result-section").show();
    }

    function resetQuiz() {
        // Reset global variables
        totalWeightedYesAnswers = 0;
        currentSlide = 1;
        type = null;

        // Hide all slides
        $('.slide').hide().removeClass('active');
        // Show the initial slide
        $('#slide1').show().addClass('active');

        // Reset progress bar
        $('#progressBar').css("width", "0%");

        // Reset result percentage
        $('#resultPercentage').text('NaN');

         // Hide result section and reset the result text
         $(".result-section").hide();
         $("#resultPercentage").text('');  // Clear the result text
    }
    

    
    // Use jQuery only for the restartQuiz click event
    $("#restartQuiz").click(function() {
        resetQuiz();
    });
    
    // resetQuiz();
    
});

