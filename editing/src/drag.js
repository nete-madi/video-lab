let isDragging = false;
document.addEventListener('mousedown', function (event) {

    let dragElement = event.target.closest('.draggable');
    var editingArea = document.querySelector("#editArea");
    var circle = document.querySelector("#circle");

    dragElement.ondragstart = function () {
        return false;
    };

    let shiftX = event.clientX - dragElement.getBoundingClientRect().left;
    let shiftY = event.clientY - dragElement.getBoundingClientRect().top;

    dragElement.style.position = 'absolute';
    dragElement.style.zIndex = 1000;
    document.body.append(dragElement);

    moveAt(event.pageX, event.pageY);

    // moves the dragElement at (pageX, pageY) coordinates
    // taking initial shifts into account
    function moveAt(pageX, pageY) {
        dragElement.style.left = pageX - shiftX + 'px';
        dragElement.style.top = pageY - shiftY + 'px';
    }

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }

    // move the dragElement on mousemove
    document.addEventListener('mousemove', onMouseMove);

    // drop the dragElement, remove unneeded handlers
    dragElement.onmouseup = function () {
        document.removeEventListener('mousemove', onMouseMove);
        dragElement.onmouseup = null;
        console.log("x: " + event.clientX);
        console.log("y: " + event.clientY);

        let Left1 = editingArea.offsetLeft; // undefined
        let Left2 = circle.offsetLeft;
        let Width1 = $("#editArea").outerWidth();
        let Width2 = $("#circle").width();
        let Top1 = editingArea.offsetTop; // undefined
        let Top2 = circle.offsetTop;
        let Height1 = $("#editArea").outerHeight();
        let Height2 = $("#circle").height();

        /*
        console.log("left1: " + Left1);
        console.log("left2: " + Left2);
        console.log("width1: " + Width1);
        console.log("Width2: " + Width2);
        console.log("Top1: " + Top1);
        console.log("Top2: " + Top2);
        console.log("Height1: " + Height1);
        console.log("Height2: " + Height2);
        */

        if( ((Left1 + Width1) >= Left2)
        && (Left1 <= (Left2 + Width2))
        && ((Top1 + Height1) >= Top2)
        && (Top1 <= (Top2 + Height2))) {
            console.log("we gottem boys");
        }
        else {
            console.log("not in bounds");
        }
    };
});
// https://javascript.info/mouse-drag-and-drop