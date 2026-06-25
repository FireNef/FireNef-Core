import { Object2d } from "./object2d.js";
import { Attribute } from "../attributes.js";
import * as PIXI from "pixi";

export class BitmapText2D extends Object2d {
    constructor(name = "Bitmap Text 2D") {
        super(name);

        const contentAttr = new Attribute("Text Content");
        contentAttr.addField("String", "string", "000000");
        contentAttr.addField("Font Name", "string", "Arial", {
            description: "Must match the registered key identifier of your loaded bitmap font xml/json"
        });
        contentAttr.addField("Z Index", "number", 0);
        this.attributes.push(contentAttr);

        const formattingAttr = new Attribute("Formatting");
        formattingAttr.addField("Font Size", "number", 32, { min: 1, max: 500 });
        formattingAttr.addField("Tint Color", "color", "#ffffff");
        formattingAttr.addField("Align", "string", "left", {
            options: ["left", "center", "right"]
        });
        formattingAttr.addField("Letter Spacing", "number", 0);
        this.attributes.push(formattingAttr);

        this.object2D = new PIXI.BitmapText({
            text: "000000",
            style: {
                fontFamily: "Arial",
                fontSize: 32,
                align: "left"
            }
        });
        this.object2D.name = name;
        this.object2D.anchor.set(0.5);
    }

    static baseType = "bitmaptext2D";
    static type = "bitmaptext2D";
    static icon = ["text", ...Object2d.icon];

    updateAllProperties() {
        this.syncBitmapText();
    }

    start() {
        super.start();
        this.updateAllProperties();
    }

    syncBitmapText() {
        if (!this.object2D) return;

        const textString = this.getAttr("Text Content", "String");
        const fontFamily = this.getAttr("Text Content", "Font Name");

        const fontSize = this.getAttr("Formatting", "Font Size");
        const tintColor = this.getAttr("Formatting", "Tint Color");
        const align = this.getAttr("Formatting", "Align");
        const letterSpacing = this.getAttr("Formatting", "Letter Spacing");

        const parsedTintColor = PIXI.Color.shared.setValue(tintColor).toNumber();

        this.object2D.text = textString;

        this.object2D.style = {
            fontFamily: fontFamily,
            fontSize: fontSize,
            align: align,
            letterSpacing: letterSpacing
        };

        this.object2D.tint = parsedTintColor;

        const zIndex = this.getAttr("Text Content", "Z Index");
        if (this.object2D.zIndex !== zIndex) {
            this.object2D.zIndex = zIndex;
            if (this.object2D.parent) this.object2D.parent.sortChildren();
        }
    }

    async setAttributeFieldValue(attribute, field, value, type) {
        await super.setAttributeFieldValue(attribute, field, value, type);

        if (attribute === "Text Content" || attribute === "Formatting") {
            this.syncBitmapText();
        }
    }
}