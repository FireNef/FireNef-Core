import { Component } from "./component.js";
import { Attribute } from "./attributes.js";
import { Viewport } from "./viewport.js";

export class InputHandeler extends Component {
    constructor(name = "Input Handeler") {
        super(name);

        const inputHandelerAttr = new Attribute("Input Handeler");
        inputHandelerAttr.addField("Mouse Enable", "boolean", true);
        inputHandelerAttr.addField("Keyboard Enable", "boolean", true);
        inputHandelerAttr.addField("Gamepad Enable", "boolean", true);

        inputHandelerAttr.addField("Console Enable", "boolean", true);
        this.attributes.push(inputHandelerAttr);

        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseLeftDown = false;
        this.mouseRightDown = false;
        this.mouseMiddleDown = false;
        this.mouse4Down = false;
        this.mouse5Down = false;
        this.scrollTriggerList = [];

        this.keysDown = new Map();

        this.viewport = null;

        this.resolution = { width: 0, height: 0 };
        this.offsets = { x: 0, y: 0 };
        this.elementSize = { width: 0, height: 0 };
    }

    static baseType = "inputHandeler"
    static type = "inputHandeler"
    static icon = ["inputHandeler", ...super.icon]

    static defaultID = "inputHandeler";

    updateMouseButtons(e) {
        const buttons = e.buttons;

        this.mouseLeftDown = buttons & 1;
        this.mouseRightDown = buttons & 2;
        this.mouseMiddleDown = buttons & 4;
        this.mouse4Down = buttons & 8;
        this.mouse5Down = buttons & 16;
    }

    updateMousePosition(e) {
        this.mouseX = (e.clientX - this.offsets.x) / this.elementSize.width * this.resolution.width;
        this.mouseY = (e.clientY - this.offsets.y) / this.elementSize.height * this.resolution.height;
    }

    updateOffsets(elementWidth, elementHeight, offsetX, offsetY) {
        this.offsets = { x: offsetX, y: offsetY };
        this.elementSize = { width: elementWidth, height: elementHeight };
        this.resolution = { width: this.viewport.actualResolution.width, height: this.viewport.actualResolution.height };
    }

    start() {
        this.viewport = this.getFirstParentOfType(Viewport);
        if (!this.viewport) {
            this.enable = false;
            return;
        }

        this.viewport.elementChangeUpdateList.push((w, h, l, t) => this.updateOffsets(w, h, l, t));

        document.addEventListener("onmousedown", (e) => this.updateMouseButtons(e));
        document.addEventListener("onmouseup", (e) => this.updateMouseButtons(e));
        document.addEventListener("onmousemove", (e) => this.updateMousePosition(e));

        document.addEventListener("wheel", (e) => {
            e.preventDefault();
            this.scrollTriggerList.forEach(callback => callback(e.deltaY));
        }, { passive: false });

        document.addEventListener("keydown", (e) => {
            if (e.key !== "f12" || !this.getAttr("Input Handeler", "Console Enable")) e.preventDefault();
            this.keysDown.set(e.key.toLowerCase(), true);
        });
        document.addEventListener("keyup", (e) => this.keysDown.delete(e.key.toLowerCase()));

        document.addEventListener("click", (e) => e.preventDefault());
        document.addEventListener("contextmenu", (e) => e.preventDefault());
    }
}