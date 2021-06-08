class NodeWalker {
    _start: Node;
    _end: Node;
    _current: Node;
    _next: Node;
    constructor(start: Node, end: Node) {
        this._start = start;
        this._end = end;
        this._current = null;
        this._next = start;
    }

    next() {

        this._current = this._next;

        let start = this._start;
        let end = this._end;
        let node = this._current;


        if (this._current === end) { // end...
            this._next = null;
        }
        else {

            do {

                if (node.firstChild) {
                    node = node.firstChild;
                    break;
                }

                if (node.nextSibling) {
                    node = node.nextSibling;
                    break;
                }

                node = node.parentNode;

                while (node) {

                    if (node.nextSibling) {
                        node = node.nextSibling;
                        break;
                    }

                    node = node.parentNode;
                }

            } while (false);

            this._next = node;
        }


        return this._current;
    }

    hasNext() {
        return !!this._next;
    }


}

export default NodeWalker;