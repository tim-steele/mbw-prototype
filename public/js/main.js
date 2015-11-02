var breakpoint = new function(){
    var value;
    this.set = function(bp) {
        if (value === bp) return;
        else {
            value = bp;
        }
        $(window).trigger("break", value);
    };
    this.get = function() {
        return value;
    }
};

$(window).on("resize", (function(){
    var getBP = function getBP() {
        var w = $(window).width();

        if (w >= 1200) breakpoint.set("lg");
        else if (w >= 992) breakpoint.set("md");
        else if (w >= 767) breakpoint.set("sm");
        else breakpoint.set("xs");

        return getBP;
    }();

    return getBP;
})());

$(document).ready(function() {
    // Stuff to do when document is ready;

    // If any read more components are on the page;
    $('.read-more-details').on('click', function(e){
        e.preventDefault();

        var trigger = $(this),
            expander = $("#" + $(this).data('expand')),
            expanded = expander.data('collapsed'),
            collapsedText = $(this).data('collapsed-content') || 'see more details <i class="fa fa-chevron-down"></i>',
            expandedText = $(this).data('expanded-content') || 'hide details <i class="fa fa-chevron-up"></i>',
            interContainer = $(this).data('inter-container') || '.more-details-list',
            height = $(this).data('closed-height') || '10em';

        if (expanded) {
            var height = expander.find(interContainer).height();
            expander.animate({
                height: height,
            }, 500, function() {
                expander.data('collapsed', false);
                trigger.html(expandedText);
            })
        } else {
            expander.animate({
                height: height,
            }, 500, function() {
                expander.data('collapsed', true);
                trigger.html(collapsedText);
            })
        }
    });

    // Setting it so the bigger image pops up in a modal;
    $(".modal-image").on("click", function(e) {
        var target = this;

        if (target.nodeName != "IMG") target = $(this).find("img").get(0);

        $('.modal-body').html("<div style='text-align:center;'><img src='" + $(target).attr('src') + "'/></div>"); // here asign the image to the modal when the user click the enlarge link
        $('.modal-title').html($(target).attr('alt'));
        $('.modal').modal('show'); // imagemodal is the id attribute assigned to the bootstrap modal, then i use the show function
    });

    $('[data-target="modal"]').on('click', function(e) {
        e.preventDefault();
        $.when($.ajax({
            url: $(this).attr('href')
        })).done(
            $.proxy(function(data){
                $('.modal-title').html($(this).attr('title'));
                $('.modal-body').html(data);
                $('.modal').modal('show');
            }, this)
        )
    });

    // Activating product carousel;
    $('.slick-accent-carousel').slick({
        centerMode: true,
        centerPadding: '60px',
        focusOnSelect: false,
        initialSlide: 1,
        lazyLoad: 'ondemand',
        nextArrow: "<button class='btn btn-info products-carousel-right'><i class='fa fa-chevron-right'></i>",
        prevArrow: "<button class='btn btn-info products-carousel-left'><i class='fa fa-chevron-left'></i>",
        slidesToShow:3,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3
                }
            },
            {
                breakpoint: 769,
                settings: {
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    });

    var offCanvasWidget = function(container) {
        var defaultHeight,
            container           = $(container),
            offCanvasContainer  = container.find('.sidebar-offcanvas'),
            backButton          = container.find('.product-option-close'),
            state               = false;

        $(window).on("break", function() {
            init();
        });

        function toggleState() {
            if (state) state = false;
            else state = true;
            return state;
        }

        function init() {
            var bp = breakpoint.get();
            if (bp === "lg" || bp === "md") {
                if ($(container).find(".list-group-item.active").length == 0) handlePanel($(container).find(".list-group-item").get(0));
                else handlePanel($(container).find(".list-group-item.active").get(0));
            }
        }

        function swapActiveMenu(el) {
            container.find('.list-group-item').removeClass('active');
            if (el) $(el).addClass('active');
        }

        function swapActivePanels(panel) {
            container.find('.product-options-panels .product-option').removeClass('active');
            if (panel) panel.addClass('active');
        }

        function handlePanel(e) {
            var el              = e.target || e,
                id              = $(el).data("target"),
                panel           = $('#'+id),
                currentState    = toggleState(),
                isMobile        = ((/lg|md/.test(breakpoint.get()))? false: true),
                canvasHeight;

            backButton.data('target',id);
            swapActiveMenu(el);
            swapActivePanels();

            if (!isMobile) {
                swapActivePanels(panel);
            } else {
                panel.toggleClass('active');

                canvasHeight = offCanvasContainer.height();

                (canvasHeight > defaultHeight)? container.css('height',canvasHeight):container.css('height',defaultHeight);

                $('.row-offcanvas').toggleClass('active');

            }
        }

        defaultHeight = container.height();

        $(container).on('click','[data-toggle="offcanvas"]',function(e){
            e.preventDefault();
        });

        $(container).on('click', '[data-toggle="offcanvas"]', handlePanel);

        init();

    };

    // Handle Off Canvas Elements
    $.each($('.row-offcanvas'), function(index, element) {
        new offCanvasWidget(element);
    });
});
