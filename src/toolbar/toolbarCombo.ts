import ToolbarButton from "./toolbarButton";

class ToolbarCombo extends ToolbarButton {

    constructor(options: any = {
        tagName: 'select',
        items: [],
        className: '',
        click: null
    }) {
        options.tagName = options.tagName || 'select';
        super(options);
    }

    public render() {

        const options = this.options;
        this.el = document.createElement(options.tagName);

        if (options.items.length) {
            options.items.forEach((obj: any) => {
                let option = document.createElement('option');
                option.value = obj.value;
                option.text = obj.text;

                this.el.appendChild(option);
            });
        }

        if (options.className) {
            options.className.split(' ').forEach((className: string) => { this.el.classList.add(className); });
        }

        this.el.addEventListener('change', (e: any) => {
            this.command(e.target.value);
        });
    }

    public setValue(value: any = '') {
        if (this.el instanceof HTMLInputElement || this.el instanceof HTMLSelectElement) {
            this.el.value = value;
        }
    }

    public updateState() {
        const value = this.getEditor().getFormattedValue(...this.getCommandArgs());
        this.setValue(value);
    }
}

export default ToolbarCombo;