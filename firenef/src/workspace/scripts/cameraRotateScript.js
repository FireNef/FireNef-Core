import * as FIRENEF from "firenef";

export class CameraRotateScript extends FIRENEF.Script {
    constructor(name = "Camera Rotate Script") {
        super(name);
    }

    start() {
        this.camera = this.parent;
        this.camera.rotationOrder = "YXZ";
    }

    update() {
        const now = performance.now();
        const rotationSpeed = 0.5;
        if (this.camera && this.camera.threeObject) {
            this.camera.rotationY = Math.sin(now * 0.001 * rotationSpeed) * 20;
            this.camera.rotationX = 0;
        }
    }
}
