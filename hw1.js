/*
var colors = [color(0, 0, 0), color(255, 0, 0), color(0, 0, 255), color(0, 255, 0)];
var randomColor = colors[floor(random(0, colors.length))];
fill(randomColor);
*/

let r = 50;
let g = 100;
let b = 100;
function setup() {
  createCanvas (800, 800); 
  noStroke();
  //noLoop();
}


function draw() {
  background (0); 
  fill('magenta');
  ellipse(width/2, height/2, width/4,height/4);
  fill(r,g,b);
  sixCircle(width/2,width/2, width/4, 5 ,4);
  //drawCircle(width/2,width/2, width/4, 6);
  
  
}

function sixCircle(x,y,diameter,level,k) {
   switch(level) {
     case 1:
       fill('purple');
       break;
     case 2:
       fill('blue');
       break;
     case 3:
       fill('green');
       break;
     case 4:
       fill('yellow');
       break;
     case 5:
       fill('orange');
       break;
     case 6:
       fill('red');
       break;
   }
   
   //circle(x, y, diameter);
   for(let i =0; i < TWO_PI; i += TWO_PI / 6) {
    let xex = diameter * Math.cos(i + mouseX/width)+ x;
    let myy = diameter * Math.sin(i + mouseX/width) +y;
    //circle(xex,myy,diameter- (mouseY/4));
    circle(xex, myy, (diameter)*(1-mouseY/height));
   }
   if (level > 1) {
     level = level - 1;
     for(let i =0; i < TWO_PI; i += TWO_PI / 6) {
      let xex = diameter * Math.cos(i) + x;
      let myy = diameter * Math.sin(i) + y;
      sixCircle(xex, myy, diameter/2, level, k * 2);
     }
   }
}
