// Matrix Library (for you to write!)

// You should modify the routines listed below to complete the assignment.
// Feel free to define any classes, global variables and helper routines that you need.
var matrix = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
function Init_Matrix()
{

    let one = 0;
    for (let i = 0; i < 16; i++) {
        if (i == one) {
            matrix[i] = 1;
            one += 5;
        } else {
            matrix[i] = 0;
        }

    }
}

function Translate(x, y, z)
{
    let nM = [1, 0, 0, x, 0, 1, 0, y, 0, 0, 1, z, 0, 0, 0, 1];
    multiply(matrix, nM);
}

function Scale(x, y, z)
{
    let nM = [x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1];
    multiply(matrix, nM);
}

function RotateX(theta)
{
    angle = radians(theta);
    let matrix1= [1, 0, 0, 0, 0, Math.cos(angle), (-Math.sin(angle)), 0, 0, (Math.sin(angle)), Math.cos(angle), 0, 0, 0, 0, 1];
    multiply(matrix, matrix1);
}

function RotateY(theta)
{
    angle = radians(theta);
    let matrix1= [Math.cos(angle), 0, Math.sin(angle), 0, 0, 1, 0, 0, -(Math.sin(angle)), 0, Math.cos(angle), 0, 0, 0, 0, 1];
    multiply(matrix, matrix1);
}

function RotateZ(theta)
{
    angle = radians(theta);
    let matrix1= [Math.cos(angle), -(Math.sin(angle)), 0, 0, Math.sin(angle), Math.cos(angle), 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    multiply(matrix, matrix1);
}
function multiply( arr1, arr2) {
   let newMatrix = [[],[],[],[]];
    let matrix1 = [[arr1[0],arr1[1], arr1[2], arr1[3]], [arr1[4], arr1[5], arr1[6], arr1[7]], [arr1[8], arr1[9], arr1[10], arr1[11]], [arr1[12],arr1[13],arr1[14],arr1[15]]];
    let matrix2 = [[arr2[0],arr2[1], arr2[2], arr2[3]], [arr2[4], arr2[5], arr2[6], arr2[7]], [arr2[8], arr2[9], arr2[10], arr2[11]], [arr2[12],arr2[13],arr2[14],arr2[15]]];
    for (let i = 0; i < matrix1.length; i++) {
        for (let j = 0; j < (matrix2[0].length); j++) {
            let sum = 0;
            for (let k = 0; k < (matrix1[0].length); k++) {
                sum += (matrix1[i][k] * matrix2[k][j]);
            }
            newMatrix[i][j] = sum;
        }
    }
    matrix =  [newMatrix[0][0], newMatrix[0][1], newMatrix[0][2], newMatrix[0][3], newMatrix[1][0],  newMatrix[1][1], newMatrix[1][2], newMatrix[1][3], newMatrix[2][0], newMatrix[2][1], newMatrix[2][2], newMatrix[2][3], newMatrix[3][0],newMatrix[3][1],newMatrix[3][2],newMatrix[3][3]];
}

function Print_Matrix()
{
  console.log("Current Matrix:\n");
  let s = "";
  for (let i = 0; i < 16; i++) {
     if (i == 15) {
      s += matrix[i];
     } else {
      s += matrix[i] + ", ";
     }
     if ((i + 1) % 4 == 0 && i != 0) {
         s += "\n";
     }
   }
    console.log(s);
    console.log("");
  // add code here!
}
