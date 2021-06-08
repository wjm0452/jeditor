import dom from "./dom";

const _range = {
    getDoc(doc?: Document): Document {
        if (!doc) {
            return document;
        } else if (doc.nodeType === Node.DOCUMENT_NODE) {
            return doc;
        } else {
            return doc.ownerDocument;
        }
    },

    setRange(start: Node, startOffset: number, end: Node, endOffset: number) {
        const range: Range = this.getRange();
        range.setStart(start, startOffset);
        range.setEnd(end, endOffset);
    },

    getRange(doc?: Document): Range {
        const selection = this.getDoc(doc).getSelection();

        if (selection.rangeCount) {
            return this.getDoc(doc).getSelection().getRangeAt(0);
        }
        return null;
    },

    getStart(doc?: Document): Node {
        return this.getRange(doc).startContainer;
    },

    getEnd(doc?: Document): Node {
        return this.getRange(doc).endContainer;
    },

    split(node: Node, offset: number, root: Node, endPoint?: boolean): Node {
        endPoint = !!endPoint;

        let range = document.createRange();

        if (endPoint) {
            range.setStart(node, offset);
            range.setEndAfter(root);
        } else {
            range.setStartBefore(root);
            range.setEnd(node, offset);
        }

        const splitNode = range.extractContents();
        dom.trim(splitNode);

        if (endPoint) {
            return root.parentNode.insertBefore(splitNode, root.nextSibling);
        } else {
            return root.parentNode.insertBefore(splitNode, root);
        }
    },

    textNodes(range?: Range): Node[] {

        if (!range) {
            range = this.getRange();
        }

        const root = range.commonAncestorContainer;
        let start = range.startContainer;
        let startOffset = range.startOffset;
        let end = range.endContainer;
        let endOffset = range.endOffset;

        if (start.nodeType !== 3) {
            start = start.childNodes[startOffset];
            startOffset = 0;
        }

        if (end.nodeType !== 3) {
            end = end.childNodes[endOffset];
            endOffset = 0;
        }

        const nodes: Node[] = [];
        let node = start;

        do {
            if (dom.isTextNode(node)) {
                nodes.push(node);
            }

            if (node === end) {
                break;
            }
        } while ((node = dom.nextNode(node, root)));

        return nodes;
    },

    textSplitAndGet(range: Range = null) {

        range = range || this.getRange();

        let start: Node = range.startContainer;
        let end: Node = range.endContainer;
        let startOffset = range.startOffset;
        let endOffset = range.endOffset;

        if (end instanceof Text) {
            if (end.data.length < endOffset) {
                end.splitText(endOffset);
            }
        }

        if (start instanceof Text) {

            let tmp = start.splitText(startOffset);

            if (start === end) {
                end = tmp;
                endOffset -= startOffset;
            }

            startOffset = 0;
            start = tmp;


        }

        this.setRange(start, startOffset, end, endOffset);

        return range;
    }
};

export default _range;