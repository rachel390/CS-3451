

function setup() {
  createCanvas (800, 800); 
  //noStroke();
  noLoop();
}


function draw() {
  background (200, 200, 255); 
  //ellipse(width/2, height/2, width/4,height/4);
  ellipse(width/2, width/2, width/4, width/4);
  drawCircle(width/2,width/2, width/4, 6);
  
}
function drawCircle(x,y,  diameter, level) {

  const tt = (126 * level) / 4.0;
  fill(tt);
  //side bois
  //x = r * cos(theta)
  //y = r * sin(theta)
  if (level > 1) {  
    level = level - 1;  
  }
  let pointCount = 6;
  for(let i =0; i < TWO_PI; i += TWO_PI / pointCount){
    let xex = diameter * Math.cos(i) + x;
    let y = diameter * Math.sin(i) + x;
    circle(xex,y,diameter/2);
    //drawCircle(xex, y, diameter/2, level);
  }
}
