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



//Quiz
$(document).ready(function() {
    // Global variables
    let currentSlide = 1;
    let totalWeightedYesAnswers = 0;
    let totalWeightedQuestions;
    let type = null;

    $('#prev').addClass('button-disabled');  // Make the previous button disabled initially

    $("#slide1 .options button").click(function() {
        type = $(this).data("type");
    
        if (type === "text") {
            totalWeightedQuestions = 3 + 2 + 3 + 3 + 3 + 3;
        } else if (type === "call") {
            totalWeightedQuestions = 3 + 3 + 3 + 3 + 3 + 3 + 3;
        } else if (type === "email") {
            totalWeightedQuestions = 2 + 2 + 3 + 2 + 2 + 4 + 2 + 3 + 2 + 1;
        }
    
        // Activate the 'Next' button, but don't switch slides immediately
        $('#next').removeClass('button-disabled').addClass('activated');
    });
    
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }
    

    $(".options button").click(function() {
        if ($(this).attr("data-weight")) {
            let weight = parseInt($(this).attr("data-weight"));
            totalWeightedYesAnswers += weight;
        }
        $(this).siblings().removeClass('active');
        $(this).addClass('active');
    
        // Enable the 'Next' button
        $('#next').removeClass('button-disabled').addClass('activated');
    });
    
    
    

    // Previous button function
    $("#prev").click(debounce(function() {
        if (currentSlide === 2) {
            // If on the second slide, switch back to the main slide1 regardless of the type
            switchSlide(`slide${currentSlide}-${type}`, `slide1`);
        } else if (currentSlide > 2) {
            switchSlide(`slide${currentSlide}-${type}`, `slide${currentSlide - 1}-${type}`);
        }
    }, 500));  // 500ms debounce



    $("#next").click(function() {
        if($(this).hasClass('button-disabled')) {
            return;  // Do nothing if the button is disabled
        }
    
        const totalSlides = (type === "text" ? 7 : type === "call" ? 8 : 11);
    
        // Check if we're on slide 1 and have a type selected
        if (currentSlide === 1 && type) {
            switchSlide('slide1', `slide2-${type}`);
            return;
        }
    
        if (currentSlide < totalSlides) {
            switchSlide(`slide${currentSlide}-${type}`, `slide${currentSlide + 1}-${type}`);
        } else {
            displayResult();
        }
    });
    
    

    function switchSlide(oldSlide, newSlide) {
        $('.slide').hide().removeClass('active');  // Hide all slides
        $(`#${oldSlide}`).removeClass('active'); 
        $(`#${newSlide}`).addClass('active').fadeIn(500);
    
        $(`#${oldSlide}`).fadeOut(300, function() {
            $(this).removeClass('active');
            $(`#${newSlide}`).addClass('active').fadeIn(500);
        });
    
        updateProgressBar(newSlide.split('-')[0].replace('slide', ''));
        $('#next').addClass('button-disabled');
        $('#next').removeClass('activated');
        
        // Check if it's the first slide
        if (newSlide === 'slide1') {
            $('#prev').addClass('button-disabled');
        } else {
            $('#prev').removeClass('button-disabled');
        }
    
        // Determine the total slides based on type
        const totalSlides = (type === "text" ? 7 : type === "call" ? 8 : 11);
        // Update the next button's text based on current slide
        if (currentSlide === totalSlides) {
            $('#next').text('Result');
        } else {
            $('#next').text('Next');
        }
        
    
        console.log(`Switching from ${oldSlide} to ${newSlide}`);
    }
    
    
    
    

    function updateProgressBar(slideNumber) {
        currentSlide = parseInt(slideNumber);
        const totalSlides = (type === "text" ? 7 : type === "call" ? 8 : 11);
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
        
        let evaluationMessage = "";
        let textColor = "#000"; // default color
    
        if(percentage < 30) {
            evaluationMessage = "Likely not a scam";
            textColor = "green";
        } else if(percentage >= 30 && percentage <= 50) {
            evaluationMessage = "High chance of being a scam";
            textColor = "pink";
        } else {
            evaluationMessage = "Likely a scam";
            textColor = "red";
        }
    
        $("#evaluationMessage").text(evaluationMessage).css("color", textColor);
        $("#resultPercentage").css("color", textColor);
    
        if(percentage > 30) {
            $("#scamwatchLink").show();
        } else {
            $("#scamwatchLink").hide();
        }
    
        $(".result-section").show();
    
        // Hide the next and previous buttons
        $('#next').hide();
        $('#prev').hide();
    }
    
    
    

    function resetQuiz() {
        // Reset global variables
        totalWeightedYesAnswers = 0;
        currentSlide = 1;
        type = null;
    
        // Clear the active state from option buttons
        $(".options button").removeClass('active');
    
        // Hide all slides
        $('.slide').hide().removeClass('active');
        // Show the initial slide
        $('#slide1').show().addClass('active');
    
        // Reset progress bar
        $('#progressBar').css("width", "0%");
    
        // Reset result percentage
        $('#resultPercentage').text('NaN');
    
        // Clear the hover effect from option buttons
        $(".options button").removeClass('hover');
    
        // Enable the 'Next' button and show it
        $('#next').removeClass('button-disabled').show().text('Next');
    
        // Hide result section and reset the result text
        $(".result-section").hide();
        $("#resultPercentage").text('');
    
        // Hide the previous button initially
        $('#prev').show().addClass('button-disabled');
    }
    
    

    
    // Use jQuery only for the restartQuiz click event
    $("#restartQuiz").click(function() {
        resetQuiz();
    });
    
    
});

