// alert('Hello world!');

document.write('<H1>SLS 6502</H1>');

var canvas = document.createElement('canvas');

canvas.id = "canvas";
canvas.width = 1224;
canvas.height = 768;
canvas.style.zIndex = 8;
canvas.style.position = "absolute";
canvas.style.border = "1px solid";

var body = document.getElementsByTagName("body")[0];
body.appendChild(canvas);

class Register {
    #value = 0;
    #bits = 8;
    #name = "";
    #fontwidth=24;
    #borderwidth=4;
    #height;
    #x;
    #y;
    
    constructor(name, bits, x, y,  v) {
	this.#name = name;
	this.#bits = bits;
	this.#x = x;
	this.#y = y;
	this.#height = (this.#borderwidth * 2) + this.#fontwidth;
	this.#value = v & ((1<<bits)-1);
	console.log(name + " bits=" + this.#bits + " value=" + this.#value.toString(2));
    }

    getHeight() { return this.#height; }
    
    draw(ctx) {
	console.log("Register.draw()");

	ctx.font = this.#fontwidth + "px Courier";
	let text = ctx.measureText(this.name);

	console.log("text.width: " + text.width + "text.height: " +  text.actualBoundingBoxAscent);
	
	let cellWidth = this.#borderwidth + this.#fontwidth;
	let cellHeight = this.#borderwidth * 2 + text.actualBoundingBoxAscent;
	let texty = this.#y +  cellHeight / 2 + text.actualBoundingBoxAscent/2;
	let textxoff = cellWidth / 2 - this.#borderwidth*2 ;

	console.log("x: " + this.#x + " y: " + this.#y +
	    " borderwidth: " + this.#borderwidth + 
		    " fontwidth: " +  this.#fontwidth +
		    " cellWidth: " + cellWidth +
		    " cellHeight: " + cellHeight +
		    " texty: " + texty +
		    " textxoff:" + textxoff);
	
	
	ctx.fillText(this.#name, this.#x+0, texty);
        let cx=this.#x + (this.#fontwidth * this.#name.length) + this.#borderwidth 
	for (let i=0; i<this.#bits; i++) {
	    let bit = ((this.#value >>> ((this.#bits-1) - i))) & 0b1;
	    ctx.strokeRect(cx, this.#y, cellWidth, cellHeight);
	    ctx.fillText(bit, cx + textxoff, texty)
	    //	    ctx.fillText("1", i, this.#y);
	    cx += cellWidth;

	    console.log(bit)
	}

	ctx.fillText("(0x" +  this.#value.toString(16) + ")" , cx + textxoff, texty)
	console.log(this.#fontwidth + "px Arial");

    }
}
 
var canvas = document.getElementById('canvas');
console.log(canvas)
var ctx = canvas.getContext('2d');

let y=4
var AR = new Register(" A",8,0,y,0xff);

y+=AR.getHeight();
var XR = new Register(" X",8,0,y,0x88);
y+=XR.getHeight();
var YR = new Register(" Y",8,0,y,0x88);
y+=YR.getHeight();
var PC = new Register("PC",16,0,y,0x0400);
y+=PC.getHeight();
var S = new Register(" S",8,0,y,0x0400);
y+=S.getHeight();
var SR = new Register("SR",8,0,y,0x0400);
y+=SR.getHeight() + 20;
var ABB = new Register("ABB",16,0,y,0x0400);
y+=ABB.getHeight();
var DBB = new Register("DBB",8,0,y,0x0400);
y+=DBB.getHeight();
var IR = new Register(" IR",8,0,y,0x0400);

AR.draw(ctx);
XR.draw(ctx);
YR.draw(ctx);
PC.draw(ctx);
S.draw(ctx);
SR.draw(ctx);

ABB.draw(ctx);
DBB.draw(ctx);
IR.draw(ctx);
