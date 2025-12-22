import { Component } from "../component.js";
import { Attribute } from "../attributes.js";

export class UiElement extends Component {
    constructor (name = "Ui Element") {
        super(name);

        this.attributes.push(new Attribute("Ui"));
        this.attributes[0].addField("html", "path", "");
        this.attributes[0].addField("css", "path", "");
        this.attributes[0].addField("Isolate Style", "boolean", false);

        this.element = document.createElement('div');
        this.element.name = name;

        this.host = null;
        this.shadow = null;
        this.style = null;
        this.inneritedStyles = [];

        this.currentChild = 1;
    }

    appendElement(element) {
        this.host.appendChild(element);
        this.updateElement();
    }

    removeElement(element) { 
        this.host.removeChild(element);
        this.updateElement();
    }

    updateElement() {
        const nodes = this.host.children;

        for (let i = 0; i < nodes.length; i++) {
            nodes[i].slot = `c${i + 1}`;
        }
    }

    parentRemoved() {
        if (this.host) this.parent.removeElement(this.host);
    }

    parentAdded() {
        if (this.host) this.parent.appendElement(this.host);
    }

    visiblityChanged() {
        if (this.actualVisible) {
            if (!this.host || this.host.isConnected) return;
            this.parent.appendElement(this.host);
        } else {
            if (this.host && this.host.isConnected) this.parent.removeElement(this.host);
        }
    }

    start() {
        
        this.inneritedStyles = this.parent?.inneritedStyles ?? [];
        this.inneritedStyles.push(this.parent?.style);
        if (this.getAttributeFieldValue(0, 2)) this.inneritedStyles = [];

        this.host = document.createElement('div');
        this.shadow = this.host.attachShadow({ mode: "open" });

        this.style = new CSSStyleSheet();
        this.style.replaceSync(this.getAttributeFieldValue(0, 1));

        this.shadow.adoptedStyleSheets = [...this.inneritedStyles, this.style];

        const htmlString = this.getAttributeFieldValue(0, 0);
        const template = document.createElement("template");

        template.innerHTML = htmlString.trim();

        this.element.appendChild(template.content);
        this.shadow.append(this.element);

        this.parent.appendElement(this.host);
    }
}