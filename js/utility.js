import Point from "./point-class.js";

export function getMouseCoordsOnCanvas(e, canvas){
    let rect = canvas.getBoundingClientRect();
    let x = Math.round(e.clientX - rect.left);
    let y = Math.round(e.clientY - rect.top);
    return new Point(x, y);
}

export function findDistance(startPoint, endPoint){
    let exp1 = Math.pow(endPoint.x - startPoint.x, 2);
    let exp2 = Math.pow(endPoint.y - startPoint.y, 2);

    let distance = Math.sqrt(exp1 + exp2);
    return distance;
}

