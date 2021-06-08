import Widget from "../ui/widget";

class ToolbarItem extends Widget {

    public getFormatter() {
        return this.options.formatter;
    }

    public getEditor() {
        return this.options.editor;
    }

    public command(...args: any) {
        this.getEditor().command(...this.getCommandArgs(args));
    }

    public getCommandArgs(args: any[] = []): any[] {
        const options = this.options;

        if (typeof options.command === 'function') {
            return options.command(...args);
        }
        else {
            return [].concat(options.command).concat(args);
        }
    }

    public updateState() {
        this.el.classList.toggle('active', this.getEditor().isFormatted(...this.getCommandArgs()))
    }
}

export default ToolbarItem;