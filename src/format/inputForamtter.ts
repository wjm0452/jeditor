import Formatter from "../formatter";
import domUtils from "../util/dom";
import rangeUtils from "../util/range";

class InputFormatter extends Formatter {

    public format(text: string) {

        const range = this.getRange();

        let newNode = document.createTextNode(text);

        const cloneRange = range.cloneRange();
        cloneRange.collapse(false);
        cloneRange.insertNode(newNode);

        if (!range.collapsed) {
            range.extractContents();
        }

        range.selectNodeContents(newNode);
        range.collapse(false);
    }

}

export default InputFormatter;