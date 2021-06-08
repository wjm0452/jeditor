import LayerPopup from "../popup/layerPopup";
import ToolbarButton from "./toolbarButton";

class ToolbarPopupButton extends ToolbarButton {

    layerPopup: LayerPopup;

    constructor(options: any) {
        super(options);
        this.layerPopup = options.layerPopup;
    }

    render() {
        super.render();
        this.el.addEventListener('click', this._onClick.bind(this));
        this.getEditor().el.addEventListener('click', (e: any) => {
            if (!e.path.some((node: any) => node === this.el || node === this.layerPopup.el)) {
                this.close();
            }
        });
    }

    public getLayerPopup(): LayerPopup {
        return this.layerPopup;
    }

    _onClick() {
        this.layerPopup.css('top', this.el.offsetTop + this.el.offsetHeight + 'px').css('left', this.el.offsetLeft + 'px');

        if (this.layerPopup.isShow()) {
            this.layerPopup.hide();
        }
        else {
            this.layerPopup.show();
        }
    }

    public open() {
        this.layerPopup.show();
    }

    public close() {
        this.layerPopup.hide();
    }

}

export default ToolbarPopupButton;