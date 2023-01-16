let isDragging = false;
   document.addEventListener('mousedown', function(event) {

    let dragElement = event.target.closest('.draggable');

        dragElement.ondragstart = function() {
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
        dragElement.onmouseup = function() {
            document.removeEventListener('mousemove', onMouseMove);
            dragElement.onmouseup = null;
            console.log("x: " + event.clientX);
            console.log("y: " + event.clientY);
        };
    });
// https://javascript.info/mouse-drag-and-drop

