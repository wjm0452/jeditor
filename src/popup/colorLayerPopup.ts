import LayerPopup from "./layerPopup";
import ColorPicker from "../color/colorPicker";
import colorUtil from "../color/color";

class ColorLayerPopup extends LayerPopup {

    colorPicker: ColorPicker;

    public created() {

        const that = this;
        super.render();

        this.colorPicker = new ColorPicker({
            el: this.el.querySelector('.color-picker')
        });

        this.colorPicker.on('select', (e: any) => {
            that.hide();
            that.options.select(colorUtil.rgbToHex(e.r, e.g, e.b));
        });


        const onShow = () => {
            this.colorPicker.refresh();
            this.off('show', onShow);
        };

        this.on('show', onShow);
    }

    public template() {
        return `<div class="color-picker"></div>`;
    }
}

export default ColorLayerPopup;