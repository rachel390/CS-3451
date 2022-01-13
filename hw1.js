

function setup() {
  createCanvas (800, 800); 
  //noStroke();
  noLoop();
}


function draw() {
  background (200, 200, 255); 
  //ellipse(width/2, height/2, width/4,height/4);
  sixCircle(width/2,width/2, width/4,6);
  //drawCircle(width/2,width/2, width/4, 6);
  
}
function drawCircle(x,y,  diameter, level) {

  //const tt = (126 * level) / 4.0;
  //fill(tt);
  fill('red');
  let pointCount = 6;
  //side six
  ellipse(x, y, diameter, diameter);
  //sixCircle(x, y, diameter);
  if (level > 1) {
    level = level - 1;
    drawCircle(diameter * Math.cos(0) + x,diameter * Math.sin(0) + y, diameter/2, level);
    //drawCircle(diameter * Math.cos(TWO_PI/6) + x, Math.sin(TWO_PI/6) + y, diameter/2, level);
  }
 /*
  for(let i =0; i < TWO_PI; i += TWO_PI / 6) {
    let xex = diameter * Math.cos(i) + x;
    let y = diameter * Math.sin(i) + x;
    if (level > 1) {
      level = level - 1;
      //drawCircle(xex, y, diameter/2, level);
    }
    circle(xex,y,diameter/2);
  */
    //drawCircle(xex, y, diameter/2, level);
    //drawCircle( diameter * Math.cos(i) - xex,  diameter * Math.sin(i)-y, diameter/2, level);
  //}
}
function sixCircle(x,y,diameter,level) {
   fill('blue');
   ellipse(x, y, diameter, diameter);
   for(let i =0; i < TWO_PI; i += TWO_PI / 6) {
    let xex = diameter * Math.cos(i) + x;
    let myy = diameter * Math.sin(i) + y;
    circle(xex,myy,diameter/2);
   }
   if (level > 1) {
     level = level - 1;
     for(let i =0; i < TWO_PI; i += TWO_PI / 6) {
      let xex = diameter * Math.cos(i) + x;
      let myy = diameter * Math.sin(i) + y;
      sixCircle(xex, myy, diameter/2, level);
     }
   }
}
