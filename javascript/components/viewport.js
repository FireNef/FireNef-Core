import { Component } from "./component.js";
import { Attribute } from "./attributes.js";

export class Viewport extends Component {
    constructor(name = "Viewport") {
        super(name);

        const viewportAttribute = new Attribute("Viewport");
        viewportAttribute.addField("Locked Aspect Ratio", "boolean", true);
        viewportAttribute.addField("Resolution Width", "number", 1920);
        viewportAttribute.addField("Resolution Height", "number", 1080);
        this.attributes.push(viewportAttribute);

        this.aspecRatio = 16 / 9;
        this.actualResolution = { width: 1920, height: 1080 };
        this.oldResolution = this.actualResolution;

        this.resolutionUpdateList = [];

        this.viewportElement = document.createElement('div');
        this.viewportElement.id = "viewport";
        this.viewportElement.style.width = "100%";
        this.viewportElement.style.height = "100%";
        this.viewportElement.style.maxWidth = "100%";
        this.viewportElement.style.maxHeight = "100%";
        this.viewportElement.style.minWidth = "100%";
        this.viewportElement.style.minHeight = "100%";
        this.viewportElement.style.overflow = "hidden";
    }

    start() {
        this.getViewportCapableComponent().appendChild(this.viewportElement);

        this.viewportResize();
        this.viewportElement.addEventListener("resize", () => this.viewportResize());
    }

    async setAttributeFieldValue(attribute = 0, field = 0, value, type) {
        await super.setAttributeFieldValue(attribute, field, value, type);
        this.viewportResize();
    }

    viewportResize() {
        if (this.getAttributeFieldValue(0, 0)) {
            this.positionElementsAspectRatio(this.viewportElement, this.aspecRatio);
        } else {
            this.positionElementsFreeForm(this.viewportElement);
        }

        if (this.oldResolution.width != this.actualResolution.width || this.oldResolution.height != this.actualResolution.height) {
            this.resolutionUpdateList.forEach(callback => callback(this.actualResolution.width, this.actualResolution.height));
            this.oldResolution.width = this.actualResolution.width;
            this.oldResolution.height = this.actualResolution.height;
        }
    }

    positionElementsFreeForm(container) {

        const vw = this.viewportElement.clientWidth;
        const vh = this.viewportElement.clientHeight;

        const windowRatio = vw / vh;

        if (windowRatio > this.aspecRatio) {
            this.actualResolution.width = vh * this.aspecRatio;
            this.actualResolution.height = vh;
        } else {
            this.actualResolution.width = vw;
            this.actualResolution.height = vw / this.aspecRatio;
        }

        this.aspecRatio = this.actualResolution.width / this.actualResolution.height;

        for (const element of container.children) {
            element.style.position = "absolute";
            element.style.width = "100vw";
            element.style.height = "100vh";
            element.style.left = 0;
            element.style.top = 0;
        }
    }

    positionElementsAspectRatio(container, aspecRatio) {
        const vw = this.viewportElement.clientWidth;
        const vh = this.viewportElement.clientHeight;

        this.actualResolution.width = this.getAttributeFieldValue(0, 1);
        this.actualResolution.height = this.getAttributeFieldValue(0, 2);

        this.aspecRatio = this.actualResolution.width / this.actualResolution.height;

        let width = vw;
        let height = width * (1 / aspecRatio);

        if (height > vh) {
            height = vh;
            width = height * aspecRatio;
        }

        for (const element of container.children) {
            element.style.position = "absolute";
            element.style.width = width + "px";
            element.style.height = height + "px";
            element.style.left = (vw - width) / 2 + "px";
            element.style.top = (vh - height) / 2 + "px";
        }
    }
}