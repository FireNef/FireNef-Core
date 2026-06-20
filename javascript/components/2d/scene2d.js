import { Object2d } from "./object2d.js";
import { Attribute } from "../attributes.js";
import { ComponentController } from "../component.js";

export class Scene2DComponent extends Object2d {
    constructor(name = "Scene 2d") {
        super(name, false);
        
        const environmentAttribute = new Attribute("Environment");
        environmentAttribute.addField("Sort Children", "boolean", true);
        environmentAttribute.addField("Ambient Tint", "color", "#ffffff");
        this.attributes.push(environmentAttribute);

        const boundsAttribute = new Attribute("World Bounds");
        boundsAttribute.addField("Use Bounds Clamping", "boolean", false);
        boundsAttribute.addField("Min Coordinates", "vec2", { x: 0, y: 0 });
        boundsAttribute.addField("Max Coordinates", "vec2", { x: 1920, y: 1080 });
        this.attributes.push(boundsAttribute);

        this.currentCamera = null;

        this.updateDepthLimit = 100000;
    }

    static baseType = "scene2D";
    static type = "scene2D";

    updateAllProperties() {
        this.updateEnvironment();
    }

    updateEnvironment() {
        this.object2D.sortableChildren = this.getAttr("Environment", "Sort Children");
    }

    async setAttributeFieldValue(attribute, field, value, type) {
        await super.setAttributeFieldValue(attribute, field, value, type);
        if (attribute == "Environment") this.updateEnvironment();
    }

    start() {
        this.updateDepthLimit = this.getFirstParentOfType(ComponentController)?.updateDepthLimit || 100000;
        this.updateAllProperties();
    }

    renderUpdate(alpha = 1.0) {
        if (!this.enable) return;
        
        this.renderUpdateChildCluster(alpha, this.children);

        if (this.currentCamera) {

            this.object2D.position.set(0, 0);
            this.object2D.scale.set(1, 1);
            this.object2D.rotation = 0;

            this.currentCamera.object2D.updateTransform();

            const cameraGlobalPos = this.currentCamera.object2D.toGlobal({ x: 0, y: 0 });

            const wt = this.currentCamera.object2D.worldTransform;
            const cameraGlobalRotRadians = Math.atan2(wt.b, wt.a);

            const cameraZoom = this.currentCamera.getAttr("Camera", "Zoom") || 1.0;

            const screenOffsetX = 0;
            const screenOffsetY = 0;

            this.object2D.scale.set(cameraZoom);
            this.object2D.rotation = -cameraGlobalRotRadians;

            this.object2D.position.x = screenOffsetX - (cameraGlobalPos.x * cameraZoom);
            this.object2D.position.y = screenOffsetY - (cameraGlobalPos.y * cameraZoom);
        } else {
            this.object2D.position.set(0, 0);
            this.object2D.scale.set(1, 1);
            this.object2D.rotation = 0;
        }
    }

    renderUpdateChildCluster(alpha, children, depth = 0) {
        if (children.length === 0) return;
        if (depth >= this.updateDepthLimit) return;
        for (const child of children) {
            if (!child.enable) continue;
            if (child.renderUpdate && typeof child.renderUpdate === "function") {
                child.renderUpdate(alpha);
            }
            this.renderUpdateChildCluster(alpha, child.getChildrenRunOrder(), depth + 1);
        }
    }
}