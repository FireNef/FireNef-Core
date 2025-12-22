import * as FIRENEF from "firenef";

export class FPSCounterScript extends FIRENEF.Script {
    constructor(name = "FPS Counter Script") {
        super(name);
    }

    start() {
        this.fpsCounter = this.parent?.element.querySelector("#fpsCounter");
        this.renderer = this.highestParent?.renderer;
    }

    update() {
        if (this.fpsCounter && this.renderer) {
            this.fpsCounter.textContent = 
                "FPS: " + Math.floor(this.renderer.fps) +
                " | 1% Lows: " + Math.floor(this.renderer.fpsLow) +
                " | 1% Highs: " + Math.floor(this.renderer.fpsHigh);
        }
    }
}