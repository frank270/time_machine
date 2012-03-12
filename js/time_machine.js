
(function($) {
  var default_options = {
    scale_factor    :  0.9,
    vertical_offset : 20,
    vertical_decay  : -0.25,

    animation_duration: 200,
    fade_factor: 0.10
  };

  function left_offset(width, scaled_width) {
    return (width - scaled_width) * 0.5;
  }

  function scale_width(original_width, scale_factor, i) {
     return original_width * Math.pow(scale_factor, i);
  }

  function top_offset(base_offset, decay_factor, i) {
    if (i === 0) {
      return 0;
    }

    return -1 * i * (base_offset * Math.pow(i, decay_factor));
  }

  function opacity(fade_factor, i) {
    return  1 - (i * fade_factor);
  }

  function get_width(node) {
    var jq_node = $(node);
    return jq_node.width();
  }

  $.fn.timeMachine = function(options) {
    // TODO: clone + merge defaults to options
    var opts = default_options;

    var images = $(this.find("img").get().reverse());
    var width  = $(images.get(0)).width();
    this.css({ "width" : width + "px" });


    images.each(function(i, img) {
      $(img).addClass("time_machine_img");
    });


    var to   = top_offset.bind(null, opts.vertical_offset, opts.vertical_decay);
    var sw   = scale_width.bind(null, width, opts.scale_factor);
    var opac = opacity.bind(null, opts.fade_factor);

    function get_css(i) {
      var scaled_width = sw(i);
      return {
        "width"      : scaled_width + "px",
        "top"        : to(i),
        "margin-left": left_offset(width, scaled_width),
        "opacity"    : opac(i)
      }
    }

   function on_keyup(e) {
     var code = e.keyCode || e.which;

    // up arrow
    if (code === 38) {
      e.preventDefault();
      advance_frame();
      return false;
    }

    // down arrow
    else if (code === 40) {
      e.preventDefault();
      regress_frame();
      return false;
    }
  }

  var front_index = 0;

  function animate_frames(duration) {
    images.each(function(i, img) {
      var index = i - front_index;

      if (index < 0) {
        return; 
      }

      $(img).animate(get_css(index), duration);
    });
  }


  function advance_frame() {
    if (front_index === images.get().length-1) {
      return; 
    }

    var first = $(images.get(front_index));
    first.animate({ "top": 30}, 200);
    first.fadeOut(200);
    front_index += 1;
    animate_frames(400);
  }

  function regress_frame() {
    if (front_index === 0) {
      return; 
    }

    var first = $(images.get(front_index-1));
    first.fadeIn(200);
    first.animate({ "top": 0 }, 200);
    front_index -= 1;
    animate_frames(400);
  }

    // bind handler for key events
    $(document).keyup(on_keyup);
    this.click(advance_frame);

    // initial setup
    animate_frames(800); 
  }
})(jQuery)

