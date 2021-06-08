import Formatter from "../formatter"
import domUtils from "../util/dom";
import rangeUtils from "../util/range";

class WrapFormatter extends Formatter {

    _blockNode: RegExp = /^(P|DIV|H[1-6])$/;

    public format(tagName: string) {

        tagName = tagName.toUpperCase();

        const range = rangeUtils.getRange();
        let nodes: Node[] = this.getLineNodes(range);

        if (nodes.every(node => this._blockNode.test(node.nodeName))) {
            this.addFormat(range, tagName, nodes);
        }
    }

    public addFormat(range: Range, tagName: string, nodes: Node[]) {

        let start = range.startContainer;
        let end = range.endContainer;
        let startOffset = range.startOffset;
        let endOffset = range.endOffset;;

        nodes.forEach(node => {
            if (tagName !== node.nodeName) {
                domUtils.changeNode(node, tagName);
            }
        });

        rangeUtils.setRange(start, startOffset, end, endOffset);
    }

    public getLineNodes(range: Range) {

        const start = this.editor.getLineNode(range.startContainer.nodeType === 3 ? range.startContainer : range.startContainer.childNodes[range.startOffset]);
        const end = this.editor.getLineNode(range.endContainer.nodeType === 3 ? range.endContainer : range.endContainer.childNodes[range.endOffset]);

        let lineNodes = [];
        let started: boolean = false, ended = false;
        let node: Node = this.editor.textarea.firstChild;

        while (node) {

            if (node === start) {
                started = true;
            }
            if (started) {
                lineNodes.push(node);
            }
            if (node === end) {
                ended = true;
                break;
            }

            node = node.nextSibling;
        }

        return lineNodes;
    }
}

export default WrapFormatter;