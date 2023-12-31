let socket = io("https://sketch-board-s7jw.onrender.com");
let toolsCont = document.querySelector(".tools-cont");
let optionsFlag = true;
let pencilToolCont = document.querySelector(".pencil-tool-cont");
let eraserToolCont = document.querySelector(".eraser-tool-cont");
let pencil = document.querySelector(".pencil");
let eraser = document.querySelector(".eraser");
let sticky = document.querySelector(".sticky");
let upload = document.querySelector(".upload");
let pencilFlag = false, pencilToolFlag = false;
let eraserFlag = false, eraserToolFlag = false;


pencil.addEventListener("click", (e) => {
    pencilToolFlag = !pencilToolFlag;
    pencilFlag = true;
    eraserFlag = false;

    document.body.classList.remove("eraser-cursor");
    document.body.classList.add("pencil-cursor")

    if (pencilToolFlag) {
        pencilToolCont.style.display = "block";
        eraserToolCont.style.display = "none";
        eraserToolFlag = false;
    } else {
        pencilToolCont.style.display = "none";
    }
})

eraser.addEventListener("click", (e) => {
    eraserToolFlag = !eraserToolFlag;
    eraserFlag = true;
    pencilFlag = false;

    document.body.classList.remove("pencil-cursor");
    document.body.classList.add("eraser-cursor")

    if (eraserToolFlag) {
        eraserToolCont.style.display = "flex";
        pencilToolCont.style.display = "none";
        pencilToolFlag = false;
    } else {
        eraserToolCont.style.display = "none";
    }
})

upload.addEventListener("click", (e) => {
    // Open file explorer
    let input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", ".png, .jpg, .jpeg, .svg");
    input.click();

    input.addEventListener("change", (e) => {
        let file = input.files[0];
        let url = URL.createObjectURL(file);

        let stickyTemplateHTML = `
        <div class="header-cont">
            <div class="minimize" title="minimize">➖</div>
            <div class="remove" title="delete">❌</div>
        </div>
        <div class="note-cont">
            <img src="${url}"/>
        </div>
        `;
        createSticky(stickyTemplateHTML);
    })
})

sticky.addEventListener("click", (e) => {
    let stickyTemplateHTML = `
    <div class="header-cont">
        <div class="minimize" title="minimize">➖</div>
        <div class="remove" title="delete">❌</div>
    </div>
    <div class="note-cont">
        <textarea spellcheck="false"></textarea>
    </div>
    `;

    createSticky(stickyTemplateHTML);
})

function createSticky(stickyTemplateHTML) {
    let stickyCont = document.createElement("div");
    stickyCont.setAttribute("class", "sticky-cont");
    stickyCont.innerHTML = stickyTemplateHTML;
    document.body.appendChild(stickyCont);

    let minimize = stickyCont.querySelector(".minimize");
    let remove = stickyCont.querySelector(".remove");
    noteActions(minimize, remove, stickyCont);

    stickyCont.onmousedown = function (event) {
        dragAndDrop(stickyCont, event);
    };

    stickyCont.ondragstart = function () {
        return false;
    };
}

function noteActions(minimize, remove, stickyCont) {
    remove.addEventListener("click", (e) => {
        stickyCont.remove();
    })
    minimize.addEventListener("click", (e) => {
        let noteCont = stickyCont.querySelector(".note-cont");
        let display = getComputedStyle(noteCont).getPropertyValue("display");
        if (display === "none") noteCont.style.display = "block";
        else noteCont.style.display = "none";
    })
}

function dragAndDrop(element, event) {
    let shiftX = event.clientX - element.getBoundingClientRect().left;
    let shiftY = event.clientY - element.getBoundingClientRect().top;

    element.style.position = 'absolute';
    element.style.zIndex = 1000;

    moveAt(event.pageX, event.pageY);

    function moveAt(pageX, pageY) {
        element.style.left = pageX - shiftX + 'px';
        element.style.top = pageY - shiftY + 'px';
    }

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }

    document.addEventListener('mousemove', onMouseMove);

    element.onmouseup = function () {
        document.removeEventListener('mousemove', onMouseMove);
        element.onmouseup = null;
    };
}