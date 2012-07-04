(function($) {
    $.widget('psm.cprogress', {
	//Default options
	options: {
	    value: 50,
	    duration: 1500,
	    easing: 'easeOutCubic',
	    fg: '',
	    bg: '',
	    textFormat: '{v}%'
	},
	//Setup widget
	_create: function() {
	    var $prog = $('<div/>').addClass('cprogress'),
	    $text = $('<div/>').addClass('cprogress-text'),
	    $ctx = $('<canvas/>');
	    
	    //store objects into options
	    this.options.store = {
		$prog: $prog,
		$text: $text,
		$ctx: $ctx,
		bgImg: null,
		fgImg: null,
		ctx: null
	    };

	    //load images and canvas
	    this._reloadImages($.proxy(function() {
		//prepend to target
		$prog.append($text).append($ctx).prependTo(this.element);
		
		//fade in element
		$prog.fadeTo(500, 1);
		
		//call paint methods
		this.paint();
	    }, this));
	},
	//Use the _setOption method to response to changes to options
	_setOption: function(key, value) {
	    $.Widget.prototype._setOption.apply(this, arguments);

	    if(key == 'value') this.paint();
	},
	//destroy methods to cleanup DOM changes
	destroy: function() {
	    var self = this;
	    
	    self.options.store.$prog.fadeTo(500, 0, function() {
		self.options.store.$prog.remove();
		$.Widget.prototype.destroy.call(self);
	    });
	},
	//repaints the progress bar
	paint: function() {
	    var $elm = this.element,
	    opts = this.options,
	    store = opts.store,
	    ctx = store.ctx;

	    //if($elm.width() == 0 || $elm.height() == 0)
	    //this._reloadImages();

	    if(opts.text) this._setText();
	    else store.$text.hide();

	    if(opts.value > 100) opts = 100;
	    if(opts.value < 0) opts = 0;

	    //use data-value to animate the paint
	    $elm.animate(
		{
		    'data-progress-value': this.options.value
		},
		{
		    duration: this.options.duration,
		    easing: this.options.easing,
		    step: $.proxy(function(step) {
			this._paint(step / 100);
			this._setText(step);
		    }, this)
		}
	    );
	},
	//private helpers
	_paint: function(prct) {
	    var store = this.options.store,
	    w = this.element.width(),
	    h = this.element.height(),
	    x = w / 2,
	    y = h / 2,
	    radius = h / 2,
	    top = 3 * Math.PI / 2,
	    circle = 2 * Math.PI,
	    ctx = store.ctx;

	    //clear canvas
	    ctx.clearRect(0, 0, w, h);
	    ctx.save();

	    //draw background
	    ctx.drawImage(store.bgImg, 0, 0);

	    ctx.beginPath();
	    ctx.lineWidth = 5;
	    ctx.arc(x, y, radius, top, top + (circle * prct), false);
	    ctx.lineTo(x, y);
	    ctx.closePath();
	    ctx.clip();

	    //draw foreground
	    ctx.drawImage(store.fgImg, 0, 0);
	    ctx.restore();
	},
	_setText: function(val) {
	    this.options.store.$text.show().text(this.options.textFormat.replace('{v}', Math.round(val)));
	},
	_reloadImages: function(cb) {
	    //reload images
	    var store = this.options.store,
	    mt = parseInt(store.$prog.css('marginTop').replace('ems', ''), 10),
	    ml = parseInt(store.$prog.css('marginLeft').replace('ems', ''), 10),
	    done = 0;
	    
	    //instantiate new Image objects
	    store.bgImg = new Image();
	    store.fgImg = new Image();

	    //setup onload callbacks
	    store.bgImg.onload = store.fgImg.onload = $.proxy(function() {
		done++;
		if(done == 2) {
		    //make element height/width match images
		    this.element.width(store.bgImg.width);
		    this.element.height(store.bgImg.height);
		    
		    //setup main div container
		    //store.$prog.css('marginLeft', (this.element.width() / 2) + ml)
		    //.css('marginTop', (this.element.height() / 2) + mt);
		    
		    //setup canvas
		    //store.$ctx.width(this.element.width()).height(this.element.height());
		    
		    //grab the context
		    store.ctx = store.$ctx.get(0).getContext('2d');

		    cb();
		}
	    }, this);

	    //setup source for images
	    store.bgImg.src = this.options.bg;
	    store.fgImg.src = this.options.fg;
	}
    });
})(jQuery);