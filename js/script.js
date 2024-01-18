$(document).ready(function() {
    var main = $("#main");
    var editor = $('#editor');
    var base = $('#base');
    var sensitivity = 5; // Adjust the sensitivity based on your preference
    var topScroll = false;
    var bottomScroll = false;
    var leftScroll = false;
    var rightScroll = false;

    var letters_string = "abcdefghijklmnopqrstuvwxyz";
    var letters_array = letters_string.split('');

    var DRAG_OPTION = false;
    var DRAG_KEY_DOWN = false;
    var PARENT;
    var CHILDREN = [];

    var DATA_ARRAY = [];

    $(".loading").click(function() {
        $(".loading").addClass('hidden');
    })

    
    


    editor.mousemove(function(e) {
        base[0].style.left = (e.clientX - 40) + "px";
        base[0].style.top = (e.clientY - 15) + "px";
    })

    function CollectAllDataToBeSaved() {
        var DATA_ARRAY = [];
        let boxes = $(".box");
        for(let i = 0; i < boxes.length; i++) {
            let obj = {
                
            }
        }
    }


    function dragElement(elmnt) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        elmnt.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            if(!DRAG_OPTION) {
                return;
            }
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();

            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;

            // // set the element's new position:
            // elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            // elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";

            let boxes = CHILDREN;
            for (let i = 0; i < boxes.length; i++) {
                boxes[i].style.top = (boxes[i].offsetTop - pos2) + "px";
                boxes[i].style.left = (boxes[i].offsetLeft - pos1) + "px";
            }

            moveLines(elmnt.classList[0], pos1, pos2);
        }

        function closeDragElement() {
            /* stop moving when mouse button is released:*/
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    function moveLines(clas, pos1, pos2) {
        // move all children lines
        let prefix = "l_" + clas;
        let lines = $('[class^="' + prefix + '"]');

        for (let i = 0; i < lines.length; i++) {
            if (lines[i].classList[0] == prefix) {
                lines[i].attributes.x2.value = parseInt(lines[i].attributes.x2.value) - pos1;
                lines[i].attributes.y2.value = parseInt(lines[i].attributes.y2.value) - pos2;
            }
            else {
                lines[i].attributes.x1.value = parseInt(lines[i].attributes.x1.value) - pos1;
                lines[i].attributes.y1.value = parseInt(lines[i].attributes.y1.value) - pos2;
                lines[i].attributes.x2.value = parseInt(lines[i].attributes.x2.value) - pos1;
                lines[i].attributes.y2.value = parseInt(lines[i].attributes.y2.value) - pos2;
            }
        }
    }



    function scrollTop() {
        main.scrollTop(main.scrollTop() - sensitivity);
        console.log(main.scrollTop());
        if(topScroll) {
            setTimeout(scrollTop, 25);
        }
    }

    function scrollBottom() {
        main.scrollTop(main.scrollTop() + sensitivity);
        console.log(main.scrollTop());
        if(bottomScroll) {
            setTimeout(scrollBottom, 25);
        }
    }

    function scrollLeft() {
        main.scrollLeft(main.scrollLeft() - sensitivity);
        console.log(main.scrollLeft());
        if(leftScroll) {
            setTimeout(scrollLeft, 25);
        }
    }

    function scrollRight() {
        main.scrollLeft(main.scrollLeft() + sensitivity);
        console.log(main.scrollLeft());
        if(rightScroll) {
            setTimeout(scrollRight, 25);
        }
    }
   


    $(".top").mouseenter(function() {
        topScroll = true;
        scrollTop();
    })

    $(".top").mouseleave(function(e) {
        topScroll = false;
    })

    $(".bottom").mouseenter(function(e) {
        
        bottomScroll = true;
        scrollBottom();
    })

    $(".bottom").mouseleave(function(e) {
        bottomScroll = false;
    })

    $(".left").mouseenter(function(e) {
        leftScroll = true;
        scrollLeft();
    })

    $(".left").mouseleave(function(e) {
        leftScroll = false;
    })

    $(".right").mouseenter(function(e) {
        rightScroll = true;
        scrollRight();
    })

    $(".right").mouseleave(function(e) {
        rightScroll = false;
    })

    editor.click(function(e) {
        createBox(e.offsetX - 40, e.offsetY - 15);
    })

    function findAllChildren(parent_class) {
        var prefix = parent_class;

        // select all elements that starts with parent element class
        var children = $('[class^="' + prefix + '"]');
        return children;
    }

    function findAvailableClassName(parent_class) {
        var prefix = parent_class;
        var lengthToMatch = parent_class.length + 1;


        // select all elements that starts with parent element class
        var elements = $('[class^="' + prefix + '"]');

        let occupied_letters = [];
        for(let i = 0; i < elements.length; i++) {
            let class_name = elements[i].classList[0];
            if(class_name.length == lengthToMatch) {
                let occupied_letter = class_name[class_name.length - 1];
                occupied_letters.push(occupied_letter);
            }
        }

        // subtract  occupied letters from all letters to define which letters are available
        let free_letters = letters_array.filter(function(element) {
            return !occupied_letters.includes(element);
        });

        // and then return first available letter 
        return free_letters[0];
    }

    function connectWithLine(parent, child, class_name) {
        var line = document.createElementNS('http://www.w3.org/2000/svg','line');
        line.classList.add("l_" + class_name);
        line.classList.add("line");

        line.setAttribute('x1', parent.offsetLeft + 40);
        line.setAttribute('y1', parent.offsetTop + 15);
        line.setAttribute('x2', child.offsetLeft + 40);
        line.setAttribute('y2', child.offsetTop + 15);
        line.setAttribute('stroke', "black");

        $("#lines").append(line);
    }

    function createBox(x, y) {
        // check if this is first box
        if($(".box")[0] == undefined) {
            // first box
            let div = document.createElement("DIV");
            div.classList.add("a");
            div.classList.add("box");
            div.classList.add("focused");
            div.style.top = y + "px";
            div.style.left = x + "px";

            let input = document.createElement("INPUT");
            input.classList.add("name");
            div.append(input);
            editor.append(div);
            input.focus();
        }
        else {
            let parent_class = $(".focused")[0].classList[0];
            let new_class_ending = findAvailableClassName(parent_class);
            let new_class = parent_class + new_class_ending;
            let div = document.createElement("DIV");
            div.classList.add(new_class);
            div.classList.add("box");
            div.style.top = y + "px";
            div.style.left = x + "px";

            let input = document.createElement("INPUT");
            input.classList.add("name");
            div.append(input);

            editor.append(div);
            connectWithLine($(".focused")[0], div, new_class);
            input.focus();
        }
        
    }

    editor.on("mousedown", ".box", function(e) {
        e.stopPropagation();
        if($(".focused")[0] != undefined) {
            $(".focused").removeClass("focused");
        }
        $(this).addClass("focused");

        if(DRAG_OPTION) {
            // define parent and children
            PARENT = $(".focused")[0];
            CHILDREN = findAllChildren(PARENT.classList[0]);

            dragElement(PARENT);
        }
    })

    editor.on("click", ".box", function(e) {
        e.stopPropagation();
    })


    $(".fa-solid").click(function() {
        $(this).toggleClass("icon-active");
        if($(this).hasClass("fa-up-down-left-right")) {
            if($(this).hasClass("icon-active")) {
                DRAG_OPTION = true;
                dragElement($(".focused")[0]);
            }
            else {
                DRAG_OPTION = false;
            }
            
        }
    })

});