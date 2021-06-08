import Formatter from "../formatter"
import domUtils from "../util/dom";
import rangeUtils from "../util/range";

class ListFormatter extends Formatter {

    _blockNode: RegExp = /^(P|DIV|UL|OL|H[1-6])$/i;
    _listNode: RegExp = /^(UL|OL)$/i;

    public format(tagName: string) {
        const range = rangeUtils.getRange();
        let nodes: Node[] = this.getLineNodes(range);

        if (nodes.every(node => this._blockNode.test(node.nodeName))) {
            this.addFormat(range, tagName, nodes);
        }
    }

    public hasFormat(tagName: string) {
        const textNodes = rangeUtils.textNodes();
        return textNodes.findIndex((node) => !!domUtils.closest(node, tagName, {}, this.editor.textarea)) != -1;
    }

    public addFormat(range: Range, tagName: string, nodes: Node[]) {

        let start = range.startContainer;
        let end = range.endContainer;
        let startOffset = range.startOffset;
        let endOffset = range.endOffset;;

        let listWrapper: Node;

        nodes.forEach(node => {
            if (this.isListNode(node)) {
                if (node.nodeName !== tagName.toUpperCase()) {
                    node = domUtils.changeNode(node, tagName);
                }

                listWrapper = node;
            }
            else {

                if (!listWrapper) {
                    listWrapper = document.createElement(tagName);
                    node.parentNode.insertBefore(listWrapper, node);
                }

                node = domUtils.changeNode(node, 'li');
                listWrapper.appendChild(node);
            }
        });

        rangeUtils.setRange(start, startOffset, end, endOffset);
    }

    public isListNode(node: Node | string): boolean {

        if (!node) {
            return false;
        }

        const nodeName: string = node instanceof Node ? node.nodeName : node;
        return this._listNode.test(nodeName);
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

export default ListFormatter;