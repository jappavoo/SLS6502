class Register {
    #value = 0;
    #bits = 8;
    #label;
    
    constructor(bits, v, label) {
	this.#bits = bits;
	this.#value = v & ((1<<bits)-1);
	this.#label = label;
    }
    valueToString() {
	var s = this.#value.toString(2);
	while (s.length < this.#bits) s = "0" + s;
	return s;
    }
    set(v) {
	this.#value = v & ((1<<this.#bits)-1);
	this.#label.textContent = this.valueToString();
	anim.start(1000);
    }
    get() {
	return this.#value;
    }
};

const SLS6502 = {    
    init: function() {
	this.ABB = new Register(16, 0x0000,
				document.getElementById('ABBValueText'));
    },
    step: function() {
	console.log("SLS6502.step()")
	this.ABB.set(this.ABB.get()+1);
    }
};


const dot = {
    sprite: null,
    track: null,

    // Initialize the dot: connect sprite and track properties with supplied SVG elements
    init: function(sprite, track) {
        this.sprite = document.getElementById(sprite);
        this.track = document.getElementById(track);
	this.move(0);
    },
    
    // Put the dot on its spot
    move: function(u) {
        const p = this.track.getPointAtLength(u * this.track.getTotalLength());
	let y = p.y - (this.sprite.getBBox().height)/2;
        this.sprite.setAttribute("transform", `translate(${p.x}, ${y})`);
    },

    reset: function() {
	console.log("reset");
	this.move(0);
    }
};

const anim = {
    start: function(duration) {
        this.duration = duration;
        this.tZero = Date.now();

        requestAnimationFrame(() => this.run());
    },
    
    run: function() {
        let u = Math.min((Date.now() - this.tZero) / this.duration, 1);
	var finished = false;
	
        if (u < 1) {
            // Keep requesting frames, till animation is ready
            requestAnimationFrame(() => this.run());
        } else {
            finished = true;
        }
	
	dot.move(u);

	if (finished) this.onFinish();

    },
    
    onFinish: function() {
	dot.reset();
    }
};

window.onload = () => {
    dot.init('ABV', 'ABB-MC');
    SLS6502.init();
} 
