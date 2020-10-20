import { TOOL_LINE, TOOL_RECTANGLE, TOOL_CIRCLE, TOOL_TRIANGLE, TOOL_PENCIL, TOOL_BRUSH, TOOL_PAINT_BUCKET, TOOL_ERASER } from "./tools.js";
import Paint from "./paint-class.js";

// creating 
let paint = new Paint("canvas");
paint.init();
// default selected tool
paint.activeTool = TOOL_PENCIL;
// default width for shapes, pencil and brush
paint.lineWidth = 1;
paint.brushSize = 4;
// default selected color - black
paint.selectedColor = "#000000";


document.querySelectorAll("[data-command]").forEach(
    item => {
        item.addEventListener("click", (e) => {
            let command = item.getAttribute("data-command");
            if (command == "undo") {
                paint.undoPaint();
            }
            else {
                paint.clearCanvas();
            }
        });
    }
);

document.querySelectorAll("[data-tool]").forEach(
    item => {
        item.addEventListener("click", (e) => {
            // removes the "active" class from any other tool that might be selected
            document.querySelector("[data-tool].active").classList.toggle("active");
            // toggle - removes or adds a class name to an element (if it has "active" it'll delete it, if it doesn't it will add it)
            item.classList.toggle("active");

            // on click of a tool, get the attribute's value (which tool it is) and pass it as the active tool in the object
            let selectedTool = item.getAttribute("data-tool");
            paint.activeTool = selectedTool;

            switch (selectedTool) {
                case TOOL_LINE:
                case TOOL_RECTANGLE:
                case TOOL_CIRCLE:
                case TOOL_TRIANGLE:
                case TOOL_PENCIL: // if the shapes or pencil is selected display the pencil width options   
                    document.querySelector(".group.for-shapes").style.display = "block";
                    document.querySelector(".group.for-brush").style.display = "none";
                    break;
                case TOOL_BRUSH:
                    document.querySelector(".group.for-brush").style.display = "block";
                    document.querySelector(".group.for-shapes").style.display = "none";
                    break;
                case TOOL_ERASER: // if the brush or eraser is selected display the brush width options
                    document.querySelector(".group.for-brush").style.display = "block";
                    document.querySelector(".group.for-shapes").style.display = "none";
                    paint.selectedColor = "#FFFFFF";
                    break;
                default: // if the bucket is selected don't display width options 
                    document.querySelector(".group.for-brush").style.display = "none";
                    document.querySelector(".group.for-shapes").style.display = "none";
                    break;
            }

        });
    }
);

document.querySelectorAll("[data-line-width]").forEach(
    item => {
        item.addEventListener("click", (e) => {
            document.querySelector("[data-line-width].active").classList.toggle("active");
            item.classList.toggle("active");

            // on click of a line size it gets the attribute value of it and passes it as the active line size in the object
            let linewidth = item.getAttribute("data-line-width");
            paint.lineWidth = linewidth;
        });
    }
);

document.querySelectorAll("[data-brush-width]").forEach(
    item => {
        item.addEventListener("click", (e) => {
            document.querySelector("[data-brush-width].active").classList.toggle("active");
            item.classList.toggle("active");

            // on click of a brush size it gets the attribute value of it and passes it as the active brush size in the object
            let brushsize = item.getAttribute("data-brush-width");
            paint.brushSize = brushsize;
        });
    }
);

document.querySelectorAll("[data-color]").forEach(
    item => {
        item.addEventListener("click", (e) => {
            document.querySelector("[data-color].active").classList.toggle("active");
            item.classList.toggle("active");

            // on click of a color it gets the attribute value of it and passes it as the selected color in the object
            let color = item.getAttribute("data-color");
            paint.selectedColor = color;

        });
    }
);


let colorPicker = document.querySelector(".color-picker");
let customColor = colorPicker.value;
colorPicker.addEventListener("input", (e) => {
    colorPicker.classList.toggle("active");
    customColor = colorPicker.value;
    paint.selectedColor = customColor;
});