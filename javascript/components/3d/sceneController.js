import { Component } from "../component.js";
import { Attribute } from "../attributes.js";
import { SceneComponent } from "./scene.js";
import { Renderer3D } from "../renderer3D.js";

export class SceneController extends Component {
    constructor(name = "Scene Controller") {
        super(name);

        this.renderer = null;

        const selectedSceneAttribute = new Attribute("Selected Scene");
        selectedSceneAttribute.addField("Scene", "child", 0);
        this.attributes.push(selectedSceneAttribute);
    }

    static group = "General 3D";

    start() {
        this.renderer = this.getFirstParentOfType(Renderer3D);
        if (!this.renderer) this.enable = false;
    }

    update() {
        const index = this.getAttributeFieldValue(0, 0);
        const scene = this.children[index];

        if (!(scene instanceof SceneComponent)) return;

        this.renderer.setScene(scene);
        this.renderer.setCamera(scene.currentCamera ? scene.currentCamera : null);
    }
}