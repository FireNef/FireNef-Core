import * as THREE from "three";
import { Object3d } from "./object3d.js";
import { Attribute } from "../attributes.js";

export class DirectionalLightComponent extends Object3d {
    constructor(name = "Directional Light") {
        super(name);
        const lightAttribute = new Attribute("Directional Light");
        lightAttribute.addField("Color", "color", new THREE.Color(0xffffff));
        lightAttribute.addField("Intensity", "number", 1);
        this.attributes.push(lightAttribute);

        this.object3D = new THREE.DirectionalLight(0xffffff, 1);
        this.object3D.name = name;
    }

    updateLightProperties() {
        const color = this.getAttributeFieldValue(1, 0);
        const intensity = this.getAttributeFieldValue(1, 1);
        this.object3D.color = color;
        this.object3D.intensity = intensity;
    }

    async setAttributeFieldValue(attribute = 0, field = 0, value, type) {
        await super.setAttributeFieldValue(attribute, field, value, type);
        if (attribute == 1) this.updateLightProperties();
    }
}