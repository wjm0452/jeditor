import InlineFormatter from "./inlineFormatter"
import domUtils from "../util/dom";
import rangeUtils from "../util/range";

class StyleFormatter extends InlineFormatter {

    public format(tags: any[]) {

        this.removeFormat(tags);
        this.addFormat(tags);

        this.mergeInlines(tags);
    }

    public hasAttrs(node: Node, tagName: string, attrs: any = {}): boolean {

        if (!node || (tagName && node.nodeName !== tagName.toUpperCase())) {
            return false;
        }

        const style = attrs.style;

        if (node instanceof HTMLElement) {
            const styleObj: any = node.style;
            for (let k in style) {
                if (!styleObj[k]) {
                    return false;
                }
            }
        }
        else if (!tagName) {
            return false;
        }

        return true;
    }

    public removeFormat(tags: any[]) {
        this.splitFormat(tags);
    }

    public getFormatValue(tags: any[]): any {

        let textNodes = rangeUtils.textNodes();

        while (textNodes.length) {
            let node = textNodes.shift();
            for (let i = 0; i < tags.length; i++) {
                let tag = tags[i];
                let formatNode: any = this.findNode(node, tag);
                if (formatNode) {
                    let result: any = {};
                    let styleObj = tag.attrs.style;
                    for (let k in styleObj) {
                        return formatNode.style[k];
                    }
                }
            }

        }

        return null;
    }
}

export default StyleFormatter;