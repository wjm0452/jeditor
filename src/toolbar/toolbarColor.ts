import ToolbarButton from "./toolbarButton";
import ToolbarItem from "./toolbarItem";

class ToolbarColor extends ToolbarItem {

    constructor(options: any = {
        tagName: 'span',
        items: [],
        className: '',
        click: null
    }) {
        options.tagName = options.tagName || 'span';
        super(options);
    }

    public render() {

        const options = this.options;
        this.el = document.createElement(options.tagName);

        this.renderInput();

        if (options.className) {
            options.className.split(' ').forEach((className: string) => { this.el.classList.add(className); });
        }
    }

    protected renderInput() {
        const editor: any = this.getEditor();
        this.el.innerHTML = this.template();

        const inputColor = this.el.querySelector('.input-color');
        inputColor.addEventListener('change', (e) => {
            const target: any = e.target;
            this.command(target.value);
        })
    }

    public template() {
        return `<label class="position-relative">
        ${this.options.template}
        <input
          type="color"
          class="input-color position-absolute invisible"
          style="left: 0px; top: 0px"
        />
      </label>`;
    }

    public updateState() { }
}

export default ToolbarColor;