'use strict';

(function($)
{
  $.fn.easy_number_animate = function(_options)
  {
    var defaults = {
          start_value    : 0
          ,end_value     : 100
          ,duration      : 1000  // Milliseconds
          ,before        : null
          ,after         : null
        }

        ,options = $.extend(defaults, _options)

        ,UPDATES_PER_SECOND     = 60
        ,ONE_SECOND             = 1000  // Milliseconds
        ,MILLISECONDS_PER_FRAME = ONE_SECOND / UPDATES_PER_SECOND
        ,DIRECTIONS             = {DOWN: 0, UP:1}

        ,$element        = $(this)
        ,interval        = Math.ceil(options.duration / MILLISECONDS_PER_FRAME)
        ,current_value   = options.start_value
        ,increment_value = (options.end_value - options.start_value) / interval
        ,direction       = options.start_value < options.end_value ? DIRECTIONS.UP : DIRECTIONS.DOWN
        ;

    function animate()
    {
      if(current_value !== options.end_value)
      {
        var new_value = current_value == options.end_value ? current_value : current_value + increment_value;
        if(direction === DIRECTIONS.UP)
        {
          current_value = new_value > options.end_value ? options.end_value : new_value;
        } else
        {
          current_value = new_value < options.end_value ? options.end_value : new_value;
        }
        if(typeof options.customValue === "function"){
        	new_value = options.customValue.call("", (current_value == options.end_value ? current_value : new_value));
        }
        $element.text(new_value);
        requestAnimationFrame(animate);
      } else
      {
        if(typeof options.after === 'function')
        {
          options.after($element, current_value);
        }
      }
    }

    if(typeof options.before === 'function')
    {
      options.before($element);
    }

    animate();
  };
}(jQuery));

