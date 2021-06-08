import Formatter from "../formatter"
import domUtils from "../util/dom";
import rangeUtils from "../util/range";

class InlineFormatter extends Formatter {

    public format(...args: any) {

        const range = rangeUtils.getRange();
        const tags = args.length ? args[0] : this.options.tags;

        if (this.hasFormat(tags)) {
            this.removeFormat(tags);
        }
        else {
            this.addFormat(tags);
        }

        this.mergeInlines(tags);
    }

    public textNodes(): Node[] {
        return rangeUtils.textNodes(this.getRange());
    }

    public hasAttrs(node: Node, tagName: string, attrs: any = {}): boolean {

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
    }

    public findNode(node: Node, tag?: any, rootNode?: Node) {

        if (!tag) {
            tag = { tagName: 'span' };
        }

        if (!rootNode) {
            rootNode = this.getEditor().textarea
        }

        do {
            if (this.hasAttrs(node, tag.tagName, tag.attrs)) {
                return node;
            }
            node = node.parentNode;
        } while (node && node !== rootNode);

        return null;
    }

    public findFormatNode(node: Node, tags: any[], rootNode?: Node): Node {
        for (let i = 0; i < tags.length; i++) {
            let formatNode = this.findNode(node, tags[i], rootNode);
            if (formatNode) {
                return formatNode;
            }
        }

        return null;
    }

    public hasFormat(tags: any): boolean {
        const textNodes = this.textNodes();

        return textNodes.findIndex((node) => {
            return this.findFormatNode(node, tags) != null;
        }) !== -1;
    }

    public findFormat(node: Node, tags: any[]): any {
        const editor = this.getEditor();
        const el = editor.textarea;

        return tags.find((tag: any) => {
            return domUtils.closest(node, tag.tagName, tag.attrs, el) != null;
        });
    }

    public addFormat(tags: any[]) {

        const editor = this.getEditor();
        const range = this.getRange();

        if (range.collapsed) {
            let formatNode = this.findFormatNode(range.startContainer, tags);
            if (!formatNode) {
                let emptyNode = domUtils.createZWS();
                range.insertNode(emptyNode);
                range.selectNodeContents(emptyNode);
            }
        }

        let start = range.startContainer;
        let end = range.endContainer;
        let startOffset = range.startOffset;
        let endOffset = range.endOffset;

        const textNodes = rangeUtils.textNodes(range);
        const tag = tags[0];

        textNodes.forEach((node) => {

            if (node === end) {
                domUtils.splitToRight(node, endOffset);
            }
            if (node === start) {
                domUtils.splitToLeft(node, startOffset);
                if (start === end) {
                    endOffset -= startOffset;
                }
                startOffset = 0;
            }

            let formatNode = this.findFormatNode(node, tags);

            if (!tag.tagName && !formatNode) {
                formatNode = this.findNode(node);
            }

            if (formatNode) {
                domUtils.setAttrs(formatNode, tag.attrs);
            }
            else {
                domUtils.wrapAttrs(node, tag.tagName || 'SPAN', tag.attrs);
            }
        });

        rangeUtils.setRange(start, startOffset, end, endOffset);
    }

    public removeFormat(tags: any[]) {

        const editor = this.getEditor();
        const range = rangeUtils.getRange();

        this.splitFormat(tags);

        let start = range.startContainer;
        let end = range.endContainer;
        let startOffset = range.startOffset;
        let endOffset = range.endOffset;

        let tag = tags[0];

        rangeUtils.textNodes(range).forEach((node) => {
            let formatNode = this.findFormatNode(node, tags);
            if (formatNode) {
                domUtils.unwrapAttrs(formatNode, tag.attrs);
            }
        });

        range.setStart(start, startOffset);
        range.setEnd(end, endOffset);
    }

    public splitFormat(tags: any[]) {

        const editor = this.getEditor();
        const range = this.getRange();

        if (range.collapsed) {
            let tmp = domUtils.createZWS();
            range.insertNode(tmp);
            range.selectNodeContents(tmp);
        }

        let start = range.startContainer;
        let end = range.endContainer;
        let startOffset = range.startOffset;
        let endOffset = range.endOffset;
        let common = range.commonAncestorContainer;

        let tag = tags[0];
        let formatNode = this.findFormatNode(common, tags);

        if (!tag.tagName && !formatNode) {
            formatNode = this.findNode(common);
        }

        let started = false, ended = false;
        let that = this;

        splitNode(common, formatNode);

        function splitNode(node: Node, formatNode: Node = null) {

            if (started && ended) {
                return;
            }

            if (node === start) {
                started = true;
            }

            if (domUtils.isTextNode(node)) {
                if (started && !ended) {

                    if (node === start) {
                        domUtils.splitTree(node, startOffset, formatNode, false);
                        if (start === end) {
                            endOffset -= startOffset;
                        }

                        startOffset = 0;
                    }

                    if (node === end) {
                        domUtils.splitTree(node, endOffset, formatNode, true);
                    }

                    if (formatNode && node !== start && node !== end) {
                        domUtils.splitTree(node, 0, formatNode, false);
                    }
                }
            }
            else {

                let tmp = that.findFormatNode(node, tags, common);

                if (!tmp && !formatNode) {
                    tmp = that.findNode(node, null, common);
                }

                if (tmp) { formatNode = tmp; }

                if (node.hasChildNodes) {
                    let child = node.firstChild;

                    while (child) {
                        let next = child.nextSibling;
                        splitNode(child, formatNode);
                        child = next;
                    }
                }
            }

            if (node === end) {
                ended = true;
            }
        }

        range.setStart(start, startOffset);
        range.setEnd(end, endOffset);
    }

    public mergeInlines(tags: any[]) {
        // domUtils.mergeInlines(range.commonAncestorContainer);
        // range.commonAncestorContainer.normalize();
    }
}

export default InlineFormatter;