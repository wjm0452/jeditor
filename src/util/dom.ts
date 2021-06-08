import NodeWalker from "./nodeWalker";

const NodeVisit = {
    CONTINUE: 1,
    TERMINATE: 2,
    SKIP_SIBLINGS: 4,
    SKIP_SUBTREE: 8,
};

const _dom = {
    NodeVisit: NodeVisit,

    getDoc(doc?: Document): Document {
        if (!doc) {
            return document;
        } else if (doc.nodeType === Node.DOCUMENT_NODE) {
            return doc;
        } else {
            return doc.ownerDocument;
        }
    },

    isTextNode(node: Node): boolean {
        return node && node.nodeType === Node.TEXT_NODE;
    },

    nextNode(node: Node, root: Node): Node {
        if (arguments.length == 1) {
            node = root;
            root = null;
        }

        if (node.firstChild) {
            return node.firstChild;
        }

        while (node) {
            if (root) {
                if (root === node) {
                    node = null;
                    break;
                }
            }
            if (node.nextSibling) {
                return node.nextSibling;
            } else {
                node = node.parentNode;
            }
        }

        return node;
    },

    hasAttrs(node: Node, tagName: string, attrs: any = {}): boolean {

        if (!node || (tagName && node.nodeName !== tagName.toUpperCase())) {
            return false;
        }

        if (node instanceof HTMLElement) {

            if (!tagName && !attrs.style && !Object.keys(attrs.style).length) {
                return false;
            }

            const style = attrs.style;
            const styleObj: any = node.style;

            for (let k in style) {
                if (styleObj[k] != style[k]) {
                    return false;
                }
            }
        }
        else if (!tagName) {
            return false;
        }

        return true;
    },

    trim(node: Node): Node {
        if (this.isTextNode(node)) {
            return node;
        } else {
            const childNodes: NodeList = node.childNodes;

            for (let i = childNodes.length - 1; i >= 0; i--) {
                let childNode: Node = childNodes[i];
                if (this.isTextNode(childNode)) {
                    if (childNode.nodeValue.length === 0) {
                        node.removeChild(childNode);
                    }
                } else {
                    childNode = this.trim(childNode);
                    if (childNode.childNodes.length === 0) {
                        node.removeChild(childNode);
                    }
                }
            }

            return node;
        }
    },

    createElement(tagName: string, attrs: any = {}) {

        const element = document.createElement(tagName);
        this.setAttrs(element, attrs);

        return element;
    },

    createZWS(): Text {
        return document.createTextNode('\u200B');
    },

    getPathTo(node: Node, root: Node): Node[] {
        const paths: Node[] = [];

        do {
            if (!node) {
                paths.length = 0;
                break;
            }

            paths.push(node);

            if (node === root) {
                break;
            }
        } while ((node = node.parentNode));

        return paths;
    },

    findTopNode(node: Node, tagName: string = null, attrs: any = {}, root: Node = document.querySelector('body')): Node {

        let formatNode;

        while (true) {
            node = this.findParentNode(node, tagName, attrs, root);
            if (!node) {
                break;
            }
            formatNode = node;
        }

        return formatNode;
    },

    findParentNode(node: Node, tagName: string, attrs: any = {}, root: Node): Node {

        if (node === root) {
            return null;
        }

        return this.closest(node.parentNode, tagName, attrs, root);
    },

    closest(node: Node, tagName: string, attrs: any = {}, root: Node): Node {

        do {
            if (this.hasAttrs(node, tagName, attrs)) {
                return node;
            }
            node = node.parentNode;
        } while (node && node !== root);

        return null
    },

    /**
     * navigate node
     *
     * @param {Function} callback function to called when navigating nodes
     * @returns {number} TERMINATE, SKIP_SUBTREE, SKIP_SIBLINGS
     */
    navigate(node: Node, callback: Function): number {
        let current = node.firstChild;
        let next;
        while (current) {
            next = current.nextSibling; // when the callback is called, it could have been deleted node
            var visitResult = callback(current);

            if (visitResult === NodeVisit.TERMINATE) {
                return NodeVisit.TERMINATE;
            }

            if (visitResult !== NodeVisit.SKIP_SUBTREE) {
                if (current.firstChild) {
                    this.navigate(current, callback);
                }
            }

            if (visitResult === NodeVisit.SKIP_SIBLINGS) {
                return NodeVisit.CONTINUE;
            }

            current = next;
        }

        return NodeVisit.CONTINUE;
    },

    setAttrs(node: Node, attrs: any = {}) {
        const wrapNode: any = node;
        const style = attrs.style;

        for (let k in style) {
            wrapNode.style[k] = style[k];
        }

        return node;
    },

    wrapAttrs(node: Node, tagName: string, attrs: any = {}) {
        const wrapNode: any = this.createElement(tagName, attrs);
        this.wrap(node, wrapNode);
    },

    unwrapAttrs(node: Node, attrs: any = {}) {

        const style = attrs.style;

        if (node instanceof HTMLElement) {
            const styleObj: any = node.style;

            for (let k in style) {
                styleObj[k] = null;
            }

            if (node.classList.length === 0 && node.style.length === 0) {
                return this.unwrap(node);
            }

            return node;
        } else {
            return this.unwrap(node);
        }
    },

    wrap(node: Node, wrap: Node) {
        node.parentNode.insertBefore(wrap, node);
        return wrap.appendChild(node);
    },

    unwrap(node: Node) {

        const parentNode: Node = node.parentNode;

        while (node.firstChild) {
            parentNode.insertBefore(node.firstChild, node);
        }

        return parentNode.removeChild(node);
    },

    splitTree(node: Node, offset: number, refenreceNode: Node = null, toRight: boolean = true) {

        const rootNode = refenreceNode ? refenreceNode.parentNode : null;

        while (true) {

            if (offset !== 0) {
                if (node instanceof Text) { // text
                    if (offset < node.nodeValue.length) {
                        this.split(node, offset, toRight);
                    }
                }
                else {
                    this.split(node, offset, toRight);
                }

                if (toRight) {
                    node = node.nextSibling;
                }
            }

            if (!node || !rootNode || node.parentNode === rootNode) {
                break;
            }

            offset = this.indexOf(node);
            node = node.parentNode;
        }
    },

    split(node: Node, offset: number, toRight: boolean = true): Node[] {
        return toRight ? this.splitToRight(node, offset) : this.splitToLeft(node, offset);
    },

    splitToLeft(node: Node, offset: number): Node[] {

        if (node instanceof Text) {
            let tmp = node.substringData(0, offset);
            let leftNode = document.createTextNode(tmp);
            node.deleteData(0, offset);
            node.parentNode.insertBefore(leftNode, node);
            return [leftNode, node];
        }

        let cloneNode = node.cloneNode(false);
        let child = node.firstChild;

        while (child) {

            let next = child.nextSibling;
            if (offset > 0) {
                cloneNode.appendChild(child);
            }

            child = next;
            offset--;
        }

        node.parentNode.insertBefore(cloneNode, node);

        return [cloneNode, node];

    },

    splitToRight(node: Node, offset: number) {

        if (node instanceof Text) {
            return [node, node.splitText(offset)];
        }

        let cloneNode = node.cloneNode(false);
        let child = node.firstChild;

        while (child) {

            let next = child.nextSibling;
            if (offset <= 0) {
                cloneNode.appendChild(child);
            }

            child = next;
            offset--;
        }

        node.parentNode.insertBefore(cloneNode, node.nextSibling);

        return [node, cloneNode];
    },

    indexOf(node: Node): number {

        const childNodes = node.parentNode.childNodes;
        for (let i = 0; i < childNodes.length; i++) {
            if (childNodes[i] === node) {
                return i;
            }
        }

        return -1;
    },

    insert(node: Node, referenceNode: any, offset: number): Node {
        if (this.isTextNode(referenceNode)) {
            const parentNode = referenceNode.parentNode;
            let next;

            if (offset == null) {
                next = referenceNode.nextSibling;
            } else if (offset === 0) {
                next = referenceNode;
            } else if (offset >= referenceNode.data.length) {
                next = referenceNode.nextSibling;
            } else {
                next = referenceNode.splitText(offset);
            }

            return parentNode.insertBefore(node, next);
        } else {
            let next;

            if (offset == null) {
                next = referenceNode.lastChild;
            } else {
                next = referenceNode.firstChild;

                while (next && offset > 0) {
                    next = next.nextSibling;
                    offset--;
                }
            }

            return referenceNode.insertBefore(node, next);
        }
    },

    remove(node: Node): Node {
        return node.parentNode.removeChild(node);
    },

    addStyle(node: Node, style: any = {}) {

        if (!(node instanceof HTMLElement)) {
            return;
        }

        let k: any;
        for (k in style) {
            node.style[k] = style[k];
        }

    },

    removeStyle(node: Node, style: any = {}) {

        if (!(node instanceof HTMLElement)) {
            return;
        }

        if (typeof style === 'string') {
            style = { [style]: '' };
        }

        let k: any;
        for (k in style) {
            node.style[k] = null;
        }
    },

    textNodes(start: Node, end: Node): Node[] {

        const nodes: Node[] = [];
        const nodeWalker: NodeWalker = new NodeWalker(start, end);

        while (nodeWalker.hasNext()) {
            let node = nodeWalker.next();

            if (node.nodeType === 3) {
                nodes.push(node);
            }
        }

        return nodes;
    },

    equals(node1: Node, node2: Node) {

        if (node1 === node2) {
            return true;
        }

        if (node1 == null || node2 == null) {
            return false;
        }

        if (node1.nodeName !== node2.nodeName) { return false; }
        if (node1.nodeType !== node2.nodeType) { return false; }

        if (node1 instanceof Text && node2 instanceof Text) {
            return node1.nodeValue === node2.nodeValue;
        }

        if (node1 instanceof HTMLElement && node2 instanceof HTMLElement) {

            if (node1.attributes.length !== node2.attributes.length) {
                return false;
            }

            if (node1.style.length !== node2.style.length) {
                return false;
            }

            for (let i = 0; i < node1.classList.length; i++) {
                if (!node2.classList.contains(node1.classList[i])) {
                    return false;
                }
            }

            let styleObj1: any = node1.style;
            let styleObj2: any = node2.style;
            for (let i = 0; i < styleObj1.length; i++) {
                let k = styleObj1[i];

                if (styleObj1[k] !== styleObj2[k]) {
                    return false;
                }
            }

            return true;
        }

        return false;
    },

    mergeInlines(node: Node) {

        let INLINE_NODES = /B|I|U|SPAN/;
        let child = node.firstChild;

        while (child) {

            if (INLINE_NODES.test(child.nodeName)) {
                if (this.equals(child, child.nextSibling)) {
                    this.mergeNode(child, child.nextSibling);
                }

                this.mergeInlines(child);
            }

            child = child.nextSibling;
        }
    },

    mergeNode(node: Node, ...nodes: Node[]): Node {

        if (nodes.length === 0) {
            return node;
        }

        nodes.forEach(target => {
            while (target.firstChild) {
                node.appendChild(target.firstChild);
            }
            node.parentNode.removeChild(target);
        });

        return node;
    },

    changeNode(node: Node, changeNode: Node | string): Node {

        if (typeof changeNode === 'string') {
            changeNode = node.ownerDocument.createElement(changeNode);
        }

        node.parentNode.insertBefore(changeNode, node);

        while (node.firstChild) {
            changeNode.appendChild(node.firstChild);
        }

        node.parentNode.removeChild(node);

        return changeNode;
    },

    html(node: HTMLElement, html: string | HTMLElement) {

        if (html instanceof HTMLElement) {

            while (node.firstChild) {
                node.removeChild(node.firstChild);
            }

            node.appendChild(html);
        }
        else {
            node.innerHTML = html;
        }
    }
}

export default _dom;