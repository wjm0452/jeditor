import Widget from "../ui/widget";

class LayerPopup extends Widget {

    constructor(options: any = {}) {

        if (!options.target) {
            options.target = document.body;
        }

        super(options);
    }

    public render() {

        if (!this.el) {
            this.el = document.createElement('div');
            this.options.target.appendChild(this.el);
        }

        this.el.classList.add('layerPopup');

        this.hide();
        this.setContent(this.template());
    }

    public template() {
        return '<div />'
    }

    public isShow() {
        return this.el.style.display !== 'none';
    }

    public show() {
        this.el.style.display = 'block';
        this.fire('show');
    }

    public hide() {
        this.el.style.display = 'none';
        this.fire('hide');
    }

    public remove() {
        this.el.parentNode.removeChild(this.el);
        this.el = null;
    }

    public setContent(node: string | Node) {

        if (typeof node === 'string') {
            this.el.innerHTML = node;
        }
        else {
            let childNode;
            while (childNode = this.el.firstChild) {
                this.el.removeChild(childNode);
            }
            this.el.appendChild(node);
        }
    }

    public css(prop: any, value: any) {
        this.el.style[prop] = value;
        return this;
    }
}

export default LayerPopup;