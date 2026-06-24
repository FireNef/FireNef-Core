import { Object2d } from "./object2d.js";
import { Attribute } from "../attribute.js";
import * as PIXI from "pixi";

export class Graphics2D extends Object2d {
    constructor(name = "Graphics 2d") {
        super(name);

        const shapeAttr = new Attribute("Shape");
        shapeAttr.addField("Shape Type", "string", "Rectangle", {
            options: ["Rectangle", "Circle", "Ellipse", "Polygon"],
        });
        shapeAttr.addField("Dimentions", "vec2", { x: 100, y: 100 });
        shapeAttr.addField("Polygon Path", "string", "0,0, 100,0, 100,100, 0,100", {
            description: "Comma-separated X,Y pairs for custom polygons"
        });

        shapeAttr.addField("Fill Color", "color", "#ff0000");
        shapeAttr.addField("Fill Alpha", "float", 1.0, { min: 0.0, max: 1.0 });

        shapeAttr.addField("Line Width", "float", 1.0, { min: 0.0 });
        shapeAttr.addField("Line Color", "color", "#000000");
        shapeAttr.addField("Line Alpha", "float", 1.0, { min: 0.0, max: 1.0 });


        shapeAttr.addField("Z Index", "number", 0);
        this.attributes.push(shapeAttr);

        this.object2D = new PIXI.Graphics();
        this.object2D.name = name;
    }

    static baseType = "graphics2d"
    static type = "graphics2d"
    static icon = ["graphics2d", ...Object2d.icon]

    updateAllProperties() {
        this.redrawShape();
    }

    start() {
        super.start();
        this.updateAllProperties();
    }

    redrawShape() {
        if (!this.object2D) return;

        this.object2D.clear();

        const type = this.getAttr("Shape", "Shape Type");
        const dims = this.getAttr("Shape", "Dimentions");
        const polyPathStr = this.getAttr("Shape", "Polygon Path");

        const fillColor = this.getAttr("Shape", "Fill Color");
        const fillAlpha = this.getAttr("Shape", "Fill Alpha");

        const lineWidth = this.getAttr("Shape", "Line Width");
        const lineColor = this.getAttr("Shape", "Line Color");
        const lineAlpha = this.getAttr("Shape", "Line Alpha");

        if (lineWidth > 0) {
            const parsedLineColor = PIXI.Color.shared.setValue(lineColor).toNumber();
            this.object2D.lineStyle({
                width: lineWidth,
                color: parsedLineColor,
                alpha: lineAlpha,
                alignment: 0.5
            });
        }

        const parsedFillColor = PIXI.Color.shared.setValue(fillColor).toNumber();
        this.object2D.beginFill(parsedFillColor, fillAlpha);

        switch (type) {
            case "Circle":
                this.object2D.drawCircle(0, 0, dims.x);
                break;
            case "Ellipse":
                this.object2D.drawEllipse(0, 0, dims.x, dims.y);
                break;
            case "Polygon":
                const points = this.parsePolygonPoints(polyPathStr);
                if (points.length >= 6) {
                    this.object2D.drawPolygon(points);
                }
                break;
            case "Rectangle":
            default:
                const halfW = dims.x / 2;
                const halfH = dims.y / 2;
                this.object2D.drawRect(-halfW, -halfH, dims.x, dims.y);
                break;
        }

        this.object2D.endFill();

        const zIndex = this.getAttr("Shape", "Z Index");
        if (this.object2D.zIndex !== zIndex) {
            this.object2D.zIndex = zIndex;
            if (this.object2D.parent) this.object2D.parent.sortChildren();
        }
    }

    parsePolygonPoints(str) {
        if (!str) return [];
        return str.split(/[,\s]+/)
                  .map(num => parseFloat(num))
                  .filter(num => !isNaN(num));
    }

    async setAttributeFieldValue(attribute, field, value, type) {
        await super.setAttributeFieldValue(attribute, field, value, type);
        if (attribute == "Shape") this.redrawShape();
    }
}
