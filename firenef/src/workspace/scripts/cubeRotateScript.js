import * as FIRENEF from "firenef";

export class CubeRotateScript extends FIRENEF.Script {
    constructor(name = "Cube Rotate Script") {
        super(name);
    }

    update() {
        const rotationSpeed = 0.5;
        const cube = this.parent;
        if (cube && cube.threeObject) {
            cube.rotateXBy(rotationSpeed);
            cube.rotateYBy(rotationSpeed);
        }
    }
}