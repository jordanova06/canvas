import { TOOL_LINE, TOOL_RECTANGLE, TOOL_CIRCLE, TOOL_TRIANGLE, TOOL_PENCIL, TOOL_BRUSH, TOOL_PAINT_BUCKET, TOOL_ERASER } from "./tools.js";
import Point from "./point-class.js";
import { getMouseCoordsOnCanvas, findDistance } from "./utility.js";
import Fill from "./fill-class.js";

export default class Paint{
    constructor(canvasId){
        this.canvas = document.getElementById(canvasId);
        this.context = canvas.getContext('2d');
      
        this.context.lineCap = "round";
        this.undoStack = [];
        this.undoLimit = 5;
    }

    set activeTool(tool){
        this.tool = tool;
    }

    set lineWidth(linewidth){
        this._lineWidth = linewidth;
        this.context.lineWidth = this._lineWidth;
    }

    set brushSize(brushsize){
        this._brushSize = brushsize;
        this.context.brushSize = this._brushSize;
    }

    set selectedColor(color){
        this.color = color;
        this.context.strokeStyle = this.color;
    }

    init(){
        this.canvas.onmousedown = e => this.onMouseDown(e);
    }

    onMouseDown(e){
        this.saveData = this.context.getImageData(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);

        if(this.undoStack.length >= this.undoLimit) 
        {
            this.undoStack.shift();
        }

        this.undoStack.push(this.saveData);
        

        this.canvas.onmousemove = e => this.onMouseMove(e);
        document.onmouseup = e => this.onMouseUp(e);

        this.startPos = getMouseCoordsOnCanvas(e, this.canvas);
        // console.log(this.startPos);

        if(this.tool == TOOL_PENCIL || this.tool == TOOL_BRUSH){
            this.context.beginPath();
            this.context.moveTo(this.startPos.x, this.startPos.y);
        }
        else if(this.tool == TOOL_PAINT_BUCKET){
            new Fill(this.canvas, this.startPos, this.color);
        }
        else if(this.tool == TOOL_ERASER){
            this.context.strokeStyle = "FFFFFF";
            this.context.beginPath();
            this.context.moveTo(this.startPos.x, this.startPos.y);
        }
    }

    onMouseMove(e){
       this.currentPos = getMouseCoordsOnCanvas(e, this.canvas);
       switch(this.tool){
           case TOOL_LINE:
           case TOOL_RECTANGLE:
           case TOOL_CIRCLE:
           case TOOL_TRIANGLE:
               this.drawShape(this._lineWidth);
               break;
           case TOOL_PENCIL:
               this.freeDraw(this._lineWidth);
               break;
           case TOOL_BRUSH:
               this.freeDraw(this._brushSize);
               break;
            case TOOL_ERASER:
                this.freeDraw(this._brushSize);
                break;
           default:
               break;
       } 
    }

    onMouseUp(e){
        // removing the events
        this.canvas.onmousemove = null;
        document.onmouseup = null;
    }

    drawShape(lineWidth){
        this.context.putImageData(this.saveData, 0, 0);

        this.context.beginPath();

        if(this.tool == TOOL_LINE){
        this.context.moveTo(this.startPos.x, this.startPos.y);
        this.context.lineTo(this.currentPos.x, this.currentPos.y);
        }
        else if(this.tool == TOOL_RECTANGLE){
            this.context.rect(this.startPos.x, this.startPos.y, this.currentPos.x - this.startPos.x, this.currentPos.y - this.startPos.y);
        }
        else if(this.tool == TOOL_CIRCLE){
            // distance formula 
            let distance = findDistance(this.startPos, this.currentPos);
            this.context.arc(this.startPos.x, this.startPos.y, distance, 0, 2*Math.PI, false);
        }
        else if(this.tool == TOOL_TRIANGLE){
            this.context.moveTo((this.startPos.x + (this.currentPos.x - this.startPos.x) / 2), this.startPos.y);
            this.context.lineTo(this.startPos.x, this.currentPos.y); 
            this.context.lineTo(this.currentPos.x, this.currentPos.y);
            this.context.closePath();
        }
        
        this.context.lineWidth = lineWidth;
        this.context.stroke();
        
    }


    freeDraw(lineWidth){
        this.context.lineJoin = "round";
        this.context.lineWidth = lineWidth;
        this.context.lineTo(this.currentPos.x, this.currentPos.y);
        this.context.stroke();
    }


    undoPaint(){
        if(this.undoStack.length > 0){
            this.context.putImageData(this.undoStack[this.undoStack.length - 1], 0, 0);
            this.undoStack.pop();
        }
        else{
            alert("No more undos available!");
        }
    }

    clearCanvas(){
        this.context.clearRect(0, 0, canvas.width, canvas.height);
    }
    
}
