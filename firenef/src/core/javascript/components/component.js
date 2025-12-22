export class Component {
    constructor (name = "component") {
        this.name = name;

        this.children = [];
        this.parent = null;

        this.started = false;
        this._enable = true;

        this._visible = true;
        this.actualVisible = true;

        this.attributes = [];
    }

    appendChild(child) {
        if (this.children.includes(child)) return console.warn("Cannot add same child to Component twice.");
        if (child.parent) return console.warn("Cannot add component to multiple parents.");
        if (this === child) return console.warn("Cannot add itself as child.");

        this.children.push(child);
        child.parent = this;

        if (child.parentAdded && typeof child.parentAdded === "function") child.parentAdded();
    }

    removeChild(child) {
        const index = this.children.indexOf(child);
        if (index === -1) return console.warn("Cannot remove none existing child");
        if (child.parentRemoved && typeof child.parentRemoved === "function") child.parentRemoved();

        this.children.splice(index, 1);
        child.parent = null;
    }

    removeParent() {
        if (this.parent) {
            if (this.parent.removeChild && typeof this.parent.removeChild === "function") {
                this.parent.removeChild(this);
            } else {
                this.parentRemoved();
                this.parent = null;
            }
        }
    }

    addParent(parent) {
        if (parent.appendChild && typeof parent.appendChild === "function") parent.appendChild(this);
    }

    parentRemoved() {

    }

    parentAdded() {

    }

    hasChild(child) {
        return this.children.includes(child);
    }

    hasChildren() {
        return this.children.length !== 0;
    }

    getChildrenRunOrder() {
        return this.children;
    }

    getAttributeFieldValue(attribute = 0, field = 0) {
        return this.attributes[attribute].fields[field].value;
    }

    async setAttributeFieldValue(attribute = 0, field = 0, value, type) {
        return await this.attributes[attribute].fields[field].setValue(value, type);
    }

    get highestParent() {
        return this.parent ? (this.parent?.highestParent ?? this.parent) : this;
    }

    getFirstParentOfType(type) {
        let p = this.parent;
        while (p) {
            if (p instanceof type) return p;
            p = p.parent;
        }
        return null;
    }

    set visible(visible = true) {
        this._visible = visible;
        this.updateVisiblity();
    }

    updateVisiblity() {
        if (this._visible && this._enable && (!this.parent || this.parent.actualVisible)) {
            this.actualVisible = true;
            this.visiblityChanged();
            if (this.children.length > 0) this.children.forEach(c => c.updateVisiblity());
        } else {
            this.actualVisible = false;
            this.visiblityChanged();
            if (this.children.length > 0) this.children.forEach(c => c.updateVisiblity());
        }
    }

    visiblityChanged() {

    }

    get visible() {
        return this._visible;
    }

    set enable(enable = true) {
        this._enable = enable;
        this.updateVisiblity();
    }

    get enable() {
        return this._enable;
    }

    start() {

    }

    update() {

    }
}