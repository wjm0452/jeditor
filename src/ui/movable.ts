import Widget from "./widget";

class Movable extends Widget {

    _isMove: boolean = false;

    created() {
        const baseElement: HTMLElement = this.getMovableElement();
        const doc = baseElement.ownerDocument;

        baseElement.addEventListener("selectstart", (e) => { e.preventDefault(); })
        baseElement.addEventListener("mousedown", this._mouseDown.bind(this));

        doc.addEventListener("mousemove", this._mouseMove.bind(this));
        doc.addEventListener("mouseup", this._mouseUp.bind(this));
    }

    getMovableElement() {
        return this.el;
    }

    _mouseDown(e: MouseEvent) {
        this._isMove = true;
    }

    _mouseMove(e: MouseEvent) {
        if (this._isMove) {
            const param = {
                ...this.getMousePosition(e.clientX, e.clientY),
                originEvent: e
            };

            this.fire('move', param);
        }
    }

    _mouseUp(e: MouseEvent) {

        if (this._isMove) {
            const param = {
                ...this.getMousePosition(e.clientX, e.clientY),
                originEvent: e
            };

            this.fire('click', param);
        }

        this._isMove = false;
    }

    getMousePosition(x: number, y: number): object {
        const referenceNode: HTMLElement = this.getMovableElement();
        const rect = referenceNode.getBoundingClientRect();

        x = x - rect.left;

        if (x < 0) {
            x = 0;
        } else if (x > rect.width) {
            x = rect.width;
        }

        y = y - rect.top;

        if (y < 0) {
            y = 0;
        } else if (y > rect.height) {
            y = rect.height;
        }

        return {
            x,
            y
        };
    }


}

export default Movable;