import ToolbarItem from "./toolbarItem";

class ToolbarButton extends ToolbarItem {

    constructor(options: any = {
        tagName: 'button',
        text: '',
        className: '',
        click: null
    }) {
        options.tagName = options.tagName || 'button';
        super(options);
    }

    public render() {

        const options = this.options;
        this.el = document.createElement(options.tagName);

        if (options.template) {

            if (typeof options.template === 'string') {
                this.el.innerHTML = options.template;
            }
            else if (typeof options.template === 'function') {
                this.el.innerHTML = options.template();
            }

        }
        else {
            if (options.text) {
                this.el.appendChild(document.createTextNode(options.text));
            }
        }

        if (options.className) {
            options.className.split(' ').forEach((className: string) => { this.el.classList.add(className); });
        }

        if (options.command) {
            this.el.addEventListener('click', () => {
                this.command();
            });
        }

        if (options.click) {
            this.el.addEventListener('click', options.click);
        }
    }
}

export default ToolbarButton;