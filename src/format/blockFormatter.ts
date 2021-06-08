import Formatter from "../formatter"
import domUtils from "../util/dom";
import rangeUtils from "../util/range";

class BlockFormatter extends Formatter {

    _lineNode: RegExp = /^(P|DIV|H[1-6])$/i;
    _blockNode: RegExp = /^(P|DIV|H[1-6]|TH|TD)$/i;

    public format(tagName: string, attrs: any = {}) {

        tagName = tagName.toUpperCase();

        const range = this.getRange();
        let start = range.startContainer;
        let end = range.endContainer;
        let startOffset = range.startOffset;
        let endOffset = range.endOffset;

        if (tagName) {
            let nodes: Node[] = this.getLineNodes(range);
            nodes.filter(node => this._lineNode.test(node.nodeName)).forEach(node => this.addFormat(tagName, attrs, node));
        }
        else if (attrs.style) {

            if (range.collapsed) {
                let emptyNode = domUtils.createZWS();
                range.insertNode(emptyNode);
                range.selectNodeContents(emptyNode);
            }

            let nodes: Node[] = this.getBlockNodes(range);
            // addStyle
            nodes.forEach(node => {
                domUtils.addStyle(node, attrs.style);
            });
        }

        rangeUtils.setRange(start, startOffset, end, endOffset);
    }

    public hasFormat(tagName: string, attrs: any = {}) {

        let textNodes = rangeUtils.textNodes();

        return textNodes.findIndex((node) => {
            return domUtils.closest(node, tagName, attrs, this.editor.textarea) != null;
        }) != -1;
    }

    public addFormat(tagName: string, attrs: any = {}, node: Node) {
        if (tagName !== node.nodeName) {
            domUtils.changeNode(node, tagName);
        }
        if (attrs.style) {
            domUtils.addStyle(node, attrs.style);
        }
    }

    public getLineNodes(range: Range): Node[] {

        const start = this.editor.getLineNode(range.startContainer.nodeType === 3 ? range.startContainer : range.startContainer.childNodes[range.startOffset]);
        const end = this.editor.getLineNode(range.endContainer.nodeType === 3 ? range.endContainer : range.endContainer.childNodes[range.endOffset]);

        let lineNodes: Node[] = [];
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

    public getBlockNodes(range: Range): Node[] {

        let textNodes = rangeUtils.textNodes(range);
        let blockNodes: Node[] = [];

        textNodes.forEach(node => {
            let block = this.editor.getBlockNode(node);
            if (blockNodes.indexOf(block) === -1) {
                blockNodes.push(block);
            }
        });

        return blockNodes;
    }

    public getFormatValue(tagName: string, attrs: string): any {
        let nodes: Node[] = this.getLineNodes(this.getRange());
        if (nodes.length) {
            return nodes[0].nodeName;
        }
    }
}

export default BlockFormatter;