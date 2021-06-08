class Formatter {

    editor: any;
    options: any;

    constructor(options: any = {}) {
        this.editor = options.editor;
        this.options = options;
    }

    public getOptions(): any {
        return this.options;
    }

    public getEditor() {
        return this.editor;
    }

    public getDocument(): Document {
        return this.getEditor().el.ownerDocument;
    }

    public getRange(): Range {
        return document.getSelection().getRangeAt(0);
    }

    public format(...args: any) { }

    public hasFormat(...args: any): boolean { return false; }

    public getFormatValue(...args: any): any { return null; }
}


export default Formatter;