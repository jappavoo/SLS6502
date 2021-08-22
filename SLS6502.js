var AnimationSpeed = 1000;
    
class Register {
    #value = 0;
    #bits = 8;
    #label;
    #buses = [];
    
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
	for (const bus of this.#buses)  {
	    bus.activate(this);
	}
    }
    
    get() {
	return this.#value;
    }

    addBus(bus) {
	this.#buses.push(bus);
    }
    
};

class MC {
    set(v) {
	console.log("MC: set: " + v);
    }
};

class Sprite {
    #path  = null;
    #sprite = null;

    // Initialize the dot: connect sprite and track properties with supplied SVG elements
    constructor(pathid, spriteid) {
	this.#path = document.getElementById(pathid);
        this.#sprite = document.getElementById(spriteid);
	this.move(0);
    }
    
    // Put the dot on its spot
    move(u) {
        const p = this.#path.getPointAtLength(u * this.#path.getTotalLength());
	let y = p.y - (this.#sprite.getBBox().height)/2;
        this.#sprite.setAttribute("transform", `translate(${p.x}, ${y})`);
    }

    reset() {
	// console.log("reset");
	this.move(0);
    }
};


class SpriteAnimation {
    #sprite = null;
    #finFunc = null;
    
    constructor(pathid, spriteid) {
	this.#sprite = new Sprite(pathid, spriteid);
    }
    
    start(finishFunc) {
        this.tZero = Date.now();
	this.#finFunc = finishFunc;
	
        requestAnimationFrame(() => this.run());
    }
    
    run() {
        let u = Math.min((Date.now() - this.tZero) / AnimationSpeed, 1);
	var finished = false;
	
        if (u < 1) {
            // Keep requesting frames, till animation is ready
            requestAnimationFrame(() => this.run());
        } else {
            finished = true;
        }
	
	this.#sprite.move(u);

	if (finished) this.onFinish();

    }
    
    onFinish() {
	// console.log("onFinish");
	this.#sprite.reset();
	if (this.#finFunc != null) this.#finFunc();
    }
};


class Bus {
    #objs = [];
    #anim = null;
    
    constructor(pathid, spriteid) {
	this.#anim = new SpriteAnimation(pathid, spriteid);
    }

    addObj(obj) {
	this.#objs.push(obj);
    }

    setObjValues(src) {
	let value = src.get();
	
	for (const obj of this.#objs)  {
	    if (obj != src)  {
		obj.set(value);
	    }
	}
    }
    
    activate(src) {
	if (AnimationSpeed > 0) {
	    this.#anim.start(()=>{ this.setObjValues(src);})
	} else {
	    this.setObjValues(src);
	}
    }
};

const SLS6502 = {    
    init: function() {
	this.ABB = new Register(16, 0x0000,
				document.getElementById('ABBValueText'));
	this.MC = new MC();
	let bus = new Bus('ABB-MC','ABV');
	bus.addObj(this.ABB);
	bus.addObj(this.MC);
	this.ABB.addBus(bus);
    },
    
    step: function() {
	// console.log("SLS6502.step()")
	this.ABB.set(this.ABB.get()+1);
    }
};



window.onload = () => {
    SLS6502.init();
} 
