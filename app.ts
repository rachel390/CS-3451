// library source and docs at https://github.com/Qix-/color
import  Color  from 'color'

// a simple implementation of a circular buffer for holding 
// a fixed size set of points in PointSet
import * as ps from './pointset';

// simple convenience 
function randomColor() {
    return Color({
        r: Math.random() * 255, 
        g: Math.random() * 255, 
        b: Math.random() * 255
    })
}

function midpoint(p1: ps.MousePosition, p2: ps.MousePosition) {
    let t: ps.MousePosition = {x: (p1.x + p2.x)/2, y: (p1.y + p2.y)/2};
    return t;
}

// yes, it's one line, but it's one less thing for you to figure out
function darken(color: Color) {
    return color.darken(0.25)   // creates a new color
}
function lighten(color: Color) {
    return color.opaquer(-0.1)   // creates a new color
}


// an interface that describes what our Rectangle object might look like.  
// Remember, a Typescript interface is just a description of the required
// properties (and methods, although we don't use methods here) an object
// must implement.  It is not a class or an object itself.
interface Rectangle {
    p1: ps.MousePosition;
    p2: ps.MousePosition;
    color: Color;
    width: number;
    height: number;
    /*
    1 = top left
    2 = top right
    3 = bottom left
    4 = bottom right
    */
    p1corner: number; 
    btmLeft: ps.MousePosition;
    topRight: ps.MousePosition;
    btmRight: ps.MousePosition;
    topLeft: ps.MousePosition;
}

interface Triangle {
    v1: ps.MousePosition;
    v2: ps.MousePosition;
    //v3: ps.MousePosition;
    //color: Color;
}

// A class for our application state and functionality
class Drawing {
    // the constructor paramater "canv" is automatically created 
    // as a property because the parameter is marked "public" in the 
    // constructor parameter
    //    canv: HTMLCanvasElement
    //
    // rendering context for the canvas, also public
    //    ctx: CanvasRenderingContext2D

    // some suggested properties you might use in your implementation
    mousePosition: ps.MousePosition | null = null;
    xCoord = 0;
    yCoord = 0;
    firstPt = false;
    secondPt = false;
    leftx = 0;
    lefty = 0;
    rightx = 0;
    righty = 0;
    width = 0;
    height = 0;
    corner = 0;
    btmleftx = 0;
    btmlefty = 0;
    toprightx = 0;
    toprighty = 0;
    mouseColor = Color("blue");
    justAdded = false;
    clickStart: ps.MousePosition | null = null;
    rects: Array <Rectangle>;   // an array that only contains objects that
                                // satisfy the Rectangle interface
    points: ps.PointSet;
    triangles: Array <Triangle>; 
    
    

    // a simple wrapper to reliably get the offset within an DOM element
    // We need this because the mouse position in the mouse event is
    // relative to the Window, but we want to specify draw coordinates
    // relative to the canvas DOM element  
    // see: http://www.jacklmoore.com/notes/mouse-position/
    static offset(e: MouseEvent): ps.MousePosition {
        e = e || <MouseEvent> window.event;

        var target = <Element> (e.target || e.srcElement),
            rect = target.getBoundingClientRect(),
            offsetX = e.clientX - rect.left,
            offsetY = e.clientY - rect.top;

        return {x: offsetX, y: offsetY};
    }

    
    

    // Web pages are reactive; Javascript is single threaded, and all 
    // javascript code in your page is executed in response to 
    // some action.   Actions include
    // - by the user (various callbacks like mouse and keyboard callback)
    // - by timers (we can use a timeout function to execute something in
    //   the future)
    // - things like network actions (e.g., fetch this resource, call this
    //   code when it's been retrieved)
    // - a callback synchronized with the next display refresh rate 
    //   that was created for doing animation
    // 
    // We use the this last one, triggered by a call to 
    //      requestAnimationFrame(() => this.render());
    // to do continuous rendering.  The requestAnimationFrame has one
    // parameter, a function.  The "() => this.render()" syntax is a 
    // shorthand for writing inline functions.  It says "this is a function
    // with no parameters" ("() =>") whose body is one line of code, the 
    // "this.render()" call.  It could also be
    //              requestAnimationFrame(() => {
    //                   this.render()
    //                });
    // where the function body is betwee {} and we could write more methods.

    render() {
        // Store the current drawing transformation matrix (and other state)
        this.ctx.save();
        
        // Use the identity matrix while clearing the canvas (just in case you change it someday!)
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.fillStyle = "lightgrey";
        this.ctx.fillRect(0, 0, this.canv.width, this.canv.height);
        
        // Restore the transform
        
        this.ctx.restore();   

        if (this.mousePosition?.x) {
            this.xCoord = this.mousePosition.x;
        }
        if (this.mousePosition?.y) {
            this.yCoord = this.mousePosition.y;
        }
        

        // **** TODO *****
        // if the mouse is over the canvas, it's position is here, otherwise it's null
        // add code to deal with the mouse position each render frame
        if (this.mousePosition) {
            this.mousePosition = this.mousePosition;
        } else {
            let m: ps.MousePosition = {x: 0, y: 0};
            this.points.addPoint(m);
        }

        // add code to draw rectangles we have so far at the back
        for (let i = 0; i < this.rects.length; i++) {
            this.ctx.strokeStyle = "black";
            this.ctx.lineWidth = 3;
            this.ctx.strokeRect(this.rects[i].p1.x, this.rects[i].p1.y, (this.rects[i].p2.x - this.rects[i].p1.x), (this.rects[i].p2.y - this.rects[i].p1.y));
            //first diagonal            
            this.ctx.beginPath();
            this.ctx.moveTo(this.rects[i].p1.x, this.rects[i].p1.y);
            this.ctx.lineTo(this.rects[i].p2.x, this.rects[i].p2.y);
            this.ctx.stroke();
            //second diagonal
            this.ctx.moveTo(this.rects[i].p2.x, this.rects[i].p1.y);
            this.ctx.lineTo(this.rects[i].p1.x, this.rects[i].p2.y);
            this.ctx.stroke();
            //triangles
            let temp = this.height < this.width ? this.width : this.height;
            //console.log("corner: %d", this.corner);
            //this.ctx.fillStyle = "blue";
            //this.ctx.fillRect(this.rects[i].btmRight.x, this.rects[i].btmRight.y, 10, 10);
            this.recurseTriangles(this.rects[i], temp, this.ctx);
        }      

        // add code to draw points with the oldest ones more transparent 
        for (let i = this.points.length - 1; i >= 0; i--){
            this.ctx.fillStyle = this.mouseColor.string();
            this.mouseColor = lighten(this.mouseColor);
            if (i == 0) {
                this.mouseColor = Color("blue");
            }
            this.ctx.fillRect(this.points.getPoint(i).x, this.points.getPoint(i).y, 4, 4);
            if (this.points.getPoint(this.points.length - 1) == this.points.getPoint(i)) {
                let m: ps.MousePosition = {x: 0, y: 0};
                this.points.addPoint(m);
            }
        }
        

        // if we've clicked, add code draw the rubber band
        if (this.clickStart) {
            this.leftx = this.xCoord;
            this.lefty = this.yCoord;
            if (!this.justAdded) {
                this.ctx.strokeStyle = "black";
                this.ctx.lineWidth = .5;
                this.ctx.strokeRect(this.leftx, this.lefty, (this.rightx - this.leftx), (this.righty - this.lefty));
            }
               
        }
        
        // do it again!  and again!  AND AGAIN!  AND ... 
        
        requestAnimationFrame(() => this.render());
    }
    scale = 1;
    trinum = 1;
    recurseTriangles(rect: Rectangle, size: number, ctx: CanvasRenderingContext2D) {
        for (let i = 0; i < 4; i++) {
            this.ctx.beginPath();
            ctx.lineJoin = "bevel";
            let v1: ps.MousePosition = {x:0, y: 0};
            let v2: ps.MousePosition = {x:0, y: 0};
            let v3: ps.MousePosition = {x:0, y: 0};
            if (i == 0) {
  
                v1.x = rect.btmLeft.x + (rect.width/2);
                v1.y = rect.btmLeft.y;
                this.trinum = 0;
                ctx.moveTo(rect.btmLeft.x + (rect.width/2), rect.btmLeft.y);
                v2.x = rect.btmLeft.x + (3*(rect.width/4));
                v2.y = rect.btmLeft.y - (rect.height/4);
                ctx.lineTo(rect.btmLeft.x + (3*(rect.width/4)), rect.btmLeft.y - (rect.height/4));
                v3.x = rect.btmLeft.x + (rect.width/4);
                v3.y = rect.btmLeft.y- (rect.height/4);
                ctx.lineTo(rect.btmLeft.x + (rect.width/4), rect.btmLeft.y- (rect.height/4));
                ctx.lineTo(rect.btmLeft.x + (rect.width/2), rect.btmLeft.y);
            } else if (i == 1) {
                this.trinum = 1;
                v1.x = rect.btmLeft.x + rect.width;
                v1.y = rect.btmLeft.y - (rect.height/2);
     
                ctx.moveTo(rect.btmLeft.x + rect.width, rect.btmLeft.y - (rect.height/2));
                v2.x = rect.btmLeft.x + (3*(rect.width/4));
                v2.y = rect.btmLeft.y - (3* rect.height/4);
                ctx.lineTo(rect.btmLeft.x + (3*(rect.width/4)), rect.btmLeft.y - (3* rect.height/4));
                v3.x = rect.btmLeft.x + (3*rect.width/4);
                v3.y = rect.btmLeft.y- (rect.height/4);
                ctx.lineTo(rect.btmLeft.x + (3*rect.width/4), rect.btmLeft.y- (rect.height/4));
                ctx.lineTo(rect.btmLeft.x + rect.width, rect.btmLeft.y - (rect.height/2));
            } else if (i == 2) {
                this.trinum = 2;
                v1.x = rect.btmLeft.x + (rect.width/2);
                v1.y = rect.btmLeft.y - (rect.height);
        
                ctx.moveTo(rect.btmLeft.x + (rect.width/2), rect.btmLeft.y - (rect.height));
                v2.x = rect.btmLeft.x + ((rect.width/4));
                v2.y = rect.btmLeft.y - (3* rect.height/4);
                ctx.lineTo(rect.btmLeft.x + ((rect.width/4)), rect.btmLeft.y - (3* rect.height/4));
                v3.x = rect.btmLeft.x + (3*rect.width/4);
                v3.y = rect.btmLeft.y- (3*rect.height/4);
                ctx.lineTo(rect.btmLeft.x + (3*rect.width/4), rect.btmLeft.y- (3*rect.height/4));
                ctx.lineTo(rect.btmLeft.x + (rect.width/2), rect.btmLeft.y - (rect.height));
            } else {
               
                v1.x = rect.btmLeft.x;
                v1.y = rect.btmLeft.y - (rect.height/2);
                this.trinum = 3;
                ctx.moveTo(rect.btmLeft.x, rect.btmLeft.y - (rect.height/2));
                v2.x = rect.btmLeft.x + ((rect.width/4));
                v2.y = rect.btmLeft.y - (3*rect.height/4);
                ctx.lineTo(rect.btmLeft.x + ((rect.width/4)), rect.btmLeft.y - (3*rect.height/4));
                v3.x = rect.btmLeft.x + (rect.width/4);
                v3.y = rect.btmLeft.y- (rect.height/4);
                ctx.lineTo(rect.btmLeft.x + (rect.width/4), rect.btmLeft.y- (rect.height/4));
                ctx.lineTo(rect.btmLeft.x, rect.btmLeft.y - (rect.height/2));
            }
            ctx.stroke();
            ctx.closePath();
            ctx.fillStyle = rect.color.string();
            ctx.fill(); 
            if (rect.width < 256 || rect.height < 256) {
                continue;      
            } else {
                //rect.color.darken(.25);
                this.innerTriangles(v1,v2,v3, rect.width, rect, ctx); 
                let t1: ps.MousePosition = {x: rect.btmLeft.x + (rect.width/4), y: rect.btmLeft.y - (3 *rect.height/4) };
                let btmleft: ps.MousePosition = {x: rect.btmLeft.x + (rect.width/4), y: rect.btmLeft.y - (rect.height/4) };
                let btmright: ps.MousePosition = {x: rect.btmRight.x - (rect.width/4), y:rect.btmLeft.y - (rect.height/4)};
                let topright: ps.MousePosition = {x:rect.topRight.x - (rect.width/4), y: rect.topRight.y + (rect.height/4)};
                let topleft: ps.MousePosition = {x: rect.topLeft.x + (rect.width/4), y: rect.topLeft.y + (rect.height/4)};
                let t2: ps.MousePosition = {x: rect.btmLeft.x + (rect.width/4) + rect.width/2, y: rect.btmLeft.y - (3 *rect.height/4) + rect.height};
                let newRect: Rectangle = {p1: t1, p2: t2, color: rect.color.darken(.25), width: rect.width/2, height: rect.height/2, p1corner: 1, btmLeft: btmleft, topRight: topright, btmRight: btmright, topLeft: topleft};
                let temp = rect.height < rect.width ? rect.width : rect.height;
                this.recurseTriangles(newRect, (temp/2), ctx);
                
           
            }
     
        }
        
        
        return;
        
        
    }

    innerTriangles(v1: ps.MousePosition, v2: ps.MousePosition, v3: ps.MousePosition, width: number, rect: Rectangle, ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        let center = midpoint(rect.btmRight, rect.topLeft);
        
        //one side
        if (this.trinum == 0) {
            
            ctx.moveTo(midpoint(v1, rect.btmRight).x, v1.y);
            ctx.lineTo(midpoint(v2, rect.btmRight).x,midpoint(v2, rect.btmRight).y);
            ctx.lineTo(midpoint(v1, midpoint(center, rect.btmRight)).x, (midpoint(v1, midpoint(center, rect.btmLeft)).y));
            ctx.lineTo(midpoint(v1, rect.btmRight).x, v1.y);
            ctx.moveTo(midpoint(v1, rect.btmLeft).x, v1.y);
            ctx.lineTo(midpoint(v3, rect.btmLeft).x,midpoint(v3, rect.btmLeft).y);
            ctx.lineTo(midpoint(v1, midpoint(center, rect.btmLeft)).x, (midpoint(v1, midpoint(center, rect.btmLeft)).y));
            ctx.lineTo(midpoint(v1, rect.btmLeft).x, v1.y);
            ctx.moveTo(midpoint(v2, v3).x, midpoint(v2, v3).y);
            ctx.lineTo(midpoint(v2, center).x, midpoint(v2, center).y);
            ctx.lineTo(midpoint(v3, center).x, midpoint(v3, center).y);
            ctx.lineTo(midpoint(v2, v3).x, midpoint(v2, v3).y);
            ctx.closePath();
         
        } else if (this.trinum == 1 || this.trinum == 3) {
            ctx.moveTo(v1.x, v3.y);
            ctx.lineTo(midpoint(v1, v3).x, midpoint(v1, v3).y);
            ctx.lineTo(midpoint(v3, v1).x, v3.y + (rect.height/8));
            ctx.lineTo(v1.x, v3.y);
            ctx.moveTo(v1.x, v2.y);
            ctx.lineTo(midpoint(v1, v2).x, midpoint(v1, v2).y);
            ctx.lineTo(midpoint(v2, v1).x, v2.y - (rect.height/8));
            ctx.lineTo(v1.x, v2.y);
            ctx.moveTo(midpoint(v2, v3).x, midpoint(v2, v3).y);
            ctx.lineTo(midpoint(v2, center).x, midpoint(v2, center).y);
            ctx.lineTo(midpoint(v3, center).x, midpoint(v3, center).y);
            ctx.lineTo(midpoint(v2, v3).x, midpoint(v2, v3).y);
            ctx.closePath();
           
        } else if (this.trinum == 2) {
            ctx.moveTo(v2.x, v1.y);
            ctx.lineTo(midpoint(v1, v2).x, midpoint(v1, v2).y);
            ctx.lineTo(midpoint(v1, v2).x - (rect.width/4), midpoint(v1, v2).y);
            ctx.lineTo(v2.x, v1.y);
            ctx.moveTo(v3.x, v1.y);
            ctx.lineTo(midpoint(v1, v3).x, midpoint(v1, v3).y);
            ctx.lineTo(midpoint(v1, v3).x + (rect.width/4), midpoint(v1, v3).y);
            ctx.lineTo(v3.x, v1.y);
            ctx.moveTo(midpoint(v2, v3).x, midpoint(v2, v3).y);
            ctx.lineTo(midpoint(v2, center).x, midpoint(v2, center).y);
            ctx.lineTo(midpoint(v3, center).x, midpoint(v3, center).y);
            ctx.lineTo(midpoint(v2, v3).x, midpoint(v2, v3).y);
            ctx.closePath();
            
        }   
        ctx.stroke();
        ctx.fillStyle = rect.color.darken(.25).string();
        ctx.fill(); 


    }
    
    constructor (public canv: HTMLCanvasElement, public ctx: CanvasRenderingContext2D) {
        this.ctx = ctx
        this.rects = new Array(0)  // 0 sized array
        this.triangles = new Array(0)
        this.points = new ps.PointSet()
        
        
        // All interaction in browsers is done via event handlers.  Setting
        // "onmousedown", "onmouseup", "onmousemove", and "onmouseout" on
        // the Canvas DOM element to a function will cause that function to
        // be called when the appropriate action happens.

        canv.onmousedown = (ev: MouseEvent) => {
            // this method is called when a mouse button is pressed.
            var mousePosition = Drawing.offset(ev);   
            this.clickStart = mousePosition;    
            this.mousePosition = mousePosition;
            this.rightx = this.mousePosition.x;
            this.righty = this.mousePosition.y;
            this.justAdded = false;
        }
        
        canv.onmouseup = (ev: MouseEvent) => {
            // this method is called when a mouse button is released.
            const clickEnd = Drawing.offset(ev);
            
            // **** TODO *****
            // add code here to react to mouse up events
            let m2: ps.MousePosition = {x: this.leftx, y: this.lefty};
            let m1: ps.MousePosition = {x: this.rightx, y: this.righty};

            this.width = Math.abs(m1.x - m2.x);
            this.height = Math.abs(m2.y - m1.y);
            console.log("width: %d, height: %d", this.width, this.height);

            if (m1.x < m2.x) {
                if (m1.y > m2.y) {
                    this.corner = 3;
                    this.btmleftx = m1.x;
                    this.btmlefty = m1.y;
                    this.toprightx = m2.x;
                    this.toprighty = m2.y;
                    
                    
                } else {
                    this.corner = 1;
                    this.btmleftx = m1.x;
                    this.btmlefty = m1.y + this.height;
                    this.toprightx = m1.x + this.width;
                    this.toprighty = m1.y;
                }
            } else {
                if (m1.y > m2.y) {
                    this.corner = 4;
                    this.btmleftx = m1.x - this.width;
                    this.btmlefty = m1.y;
                    this.toprightx = m1.x;
                    this.toprighty = m1.y - this.height;
                    
                } else {
                    this.corner = 2;
                    this.btmleftx = m1.x - this.width;
                    this.btmlefty = m1.y + this.height;
                    this.toprightx = m1.x;
                    this.toprighty = m1.y;
                    
                }
            }
            let c1: ps.MousePosition = {x: this.btmleftx, y: this.btmlefty};
            let c2: ps.MousePosition = {x: this.toprightx, y: this.toprighty};
            //btm right
            let c3: ps.MousePosition = {x: this.btmleftx + this.width, y: this.btmlefty};
            //topleft
            let c4: ps.MousePosition = {x: this.btmleftx, y: this.btmlefty - this.height};
            
            let newRect: Rectangle = {p1: m1, p2: m2, color: randomColor(), height: this.height, width: this.width, p1corner: this.corner, btmLeft: c1, topRight: c2, btmRight: c3, topLeft: c4};
            this.rects.push(newRect);
            this.justAdded = true;
                  
        }
        
        canv.onmousemove = (ev: MouseEvent) => {
            // this method is called when the mouse moves.   
            const mouse = Drawing.offset(ev);
            this.mousePosition = mouse 
            //console.log("x coord: %d \n y coord: %d", this.mousePosition.x, this.mousePosition.y);
            this.points.addPoint(this.mousePosition);
            
        }
        
        canv.onmouseout = (ev: MouseEvent) => {
            // this method is called when the mouse goes out of
            // the window.  
            this.mousePosition = null;
            this.clickStart = null;
        }

        
    }
}

// a global variable for our state.  We implement the drawing as a class, and 
// will have one instance
var myDrawing: Drawing;

// main function that we call below.
// This is done to keep things together and keep the variables created self contained.
// It is a common pattern on the web, since otherwise the variables below woudl be in 
// the global name space.  Not a huge deal here, of course.


function exec() {
    // find our container
    var div = document.getElementById("drawing");

    if (!div) {
        console.warn("Your HTML page needs a DIV with id='drawing'")
        return;
    }

    // let's create a canvas and to draw in
    var canv = document.createElement("canvas");
    let ctx = canv.getContext("2d");
    if (!ctx) {
        console.warn("our drawing element does not have a 2d drawing context")
        return
    }
    
    div.appendChild(canv);

    canv.id = "main";
    canv.style.width = "100%";
    canv.style.height = "100%";
    canv.width  = canv.offsetWidth;
    canv.height = canv.offsetHeight;

    window.addEventListener('resize', (event) => {
        canv.width  = canv.offsetWidth;
        canv.height = canv.offsetHeight;
    });
    

    // create a Drawing object
    myDrawing = new Drawing(canv, ctx);
    
    // kick off the rendering!
    myDrawing.render(); 
}

exec()