import { Object2d } from "./object2d.js";

export class Group3d extends Object2d {
    constructor(name = "2D Group") {
        super(name);
    }

    static baseType = "group2d"
    static type = "group2d"

    static icon = ["group2d", ...super.icon];
}