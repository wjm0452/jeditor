import './colorPicker.scss';

import Widget from '../ui/widget';
import colorUtil from './color';
import Movable from '../ui/movable';

class ColorPicker extends Widget {

    private slide: Movable;
    private sideSlide: Movable;
    private palette: HTMLElement;

    getSlideWidth(): number {
        return this.options.slideWidth || 120;
    }

    getSlideHeight(): number {
        return this.options.slideHeight || 120;
    }

    render() {
        this.el.appendChild(this.template());
    }

    created() {

        this.setTranslateXY(this.getSideHandle(), 0, this.sideSlide.el.clientHeight / 2);

        this.on('slide', () => {
            const { r, g, b } = this.getRGB();
            this._setRGB(r, g, b);
            this._setSideRGB(r, g, b);

            this.fire('change', {
                r, g, b
            });
        });

        this.on('_select', (e: any) => {
            const { r, g, b } = e;

            this.setRGB(r, g, b);

            this.fire('change', {
                r, g, b
            });

            this.fire('select', {
                r, g, b
            });
        });

        const okButton = this.el.querySelector('.display-color').querySelector('.button-ok');
        okButton.addEventListener('click', () => {
            this.fire('_select', this.getRGB());
        });
    }

    template() {

        this.palette = this._palette();
        this.slide = this._slide();
        this.sideSlide = this._sideSlide();

        const conatiner = document.createElement('div');

        conatiner.appendChild(this.palette);
        conatiner.appendChild(this.slide.el);
        conatiner.appendChild(this.sideSlide.el);

        const buttonGroup = document.createElement('div');
        buttonGroup.classList.add('display-color');
        buttonGroup.innerHTML = `
        <span class="d-inline-block print-color">&nbsp;</span>
        <input type="text" class="form-control form-control-sm input-rgb input-r">
        <input type="text" class="form-control form-control-sm input-rgb input-g">
        <input type="text" class="form-control form-control-sm input-rgb input-b">
        <button class="btn btn-primary btn-sm button-ok">OK</button>`;

        const fragment = document.createDocumentFragment();

        fragment.appendChild(conatiner);
        fragment.appendChild(buttonGroup);

        return fragment;
    }

    _slide() {

        let tmp = document.createElement('div');
        tmp.classList.add('d-inline-block');
        tmp.classList.add('color-slide');
        const svgFillColor = this.uid();
        const svgFillBlack = this.uid();

        tmp.innerHTML = `<svg width="100%" height="100%">
          <defs>
            <linearGradient id="${svgFillColor}">
              <stop stop-color="rgb(255,0,0)" offset="0%" />
              <stop stop-color="rgb(255,255,0)" offset="16.66%" />
              <stop stop-color="rgb(0,255,0)" offset="33.33%" />
              <stop stop-color="rgb(0,255,255)" offset="50%" />
              <stop stop-color="rgb(0,0,255)" offset="63.66%" />
              <stop stop-color="rgb(255,0,255)" offset="88.33%" />
              <stop stop-color="rgb(255,0,0)" offset="100%" />
            </linearGradient>
            <linearGradient id="${svgFillBlack}" x1="0" x2="0" y1="0" y2="1">
              <stop stop-color="rgb(0,0,0)" stop-opacity="0" offset="0%" />
              <stop stop-color="rgb(0,0,0)" stop-opacity="1" offset="100%" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#${svgFillColor})"></rect>
          <rect width="100%" height="100%" fill="url(#${svgFillBlack})"></rect>
          <path
            class="slide-handle"
            transform="translate(0, 0)"
            d="M -5 0 L 5 0 M 0 -5 V 5 5"
            fill="transparent"
            stroke="black"
            stroke-width="1"
          />
        </svg>`;

        const slide = new Movable({
            el: tmp
        });

        slide.on('click', (e: any) => {
            const x = e.x,
                y = e.y;

            this.setTranslateXY(this.getHandle(), x, y);
            this.fire('slide', {});
        });

        slide.on('move', (e: any) => {
            const x = e.x,
                y = e.y;

            this.setTranslateXY(this.getHandle(), x, y);
            this.fire('slide', {});
        });

        return slide;
    }

    _sideSlide() {

        let tmp = document.createElement('div');
        tmp.classList.add('d-inline-block');
        tmp.classList.add('side-color-slide');
        const uid = this.uid();

        tmp.innerHTML = `<svg width="100%" height="100%">
        <defs>
          <linearGradient id="${uid}" x1="0" x2="0" y1="0" y2="1">
            <stop stop-color="rgb(255,255,255)" offset="0%" />
            <stop
              class="side-stop-color"
              stop-color="rgb(255,0,0)"
              offset="50%"
            />
            <stop stop-color="rgb(0,0,0)" offset="100%" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#${uid})"></rect>
        <path
          class="side-slide-handle"
          transform="translate(0, 0)"
          d="M 0 0 L 20 0"
          fill="transparent"
          stroke="black"
          stroke-width="1"
        />
      </svg>`;

        const sideSlide = new Movable({
            el: tmp
        });

        sideSlide.on('click', (e: any) => {
            const x = e.x,
                y = e.y;

            this.setTranslateXY(this.getSideHandle(), 0, y);
            this.fire('slide', {});
        });

        sideSlide.on('move', (e: any) => {
            const x = e.x,
                y = e.y;

            this.setTranslateXY(this.getSideHandle(), 0, y);
            this.fire('slide', {});
        });

        return sideSlide;
    }

    getHandle(): HTMLElement {
        return this.slide.el.querySelector('.slide-handle');
    }

    getSideHandle(): HTMLElement {
        return this.sideSlide.el.querySelector('.side-slide-handle');
    }

    getSideStopColor() {
        return this.sideSlide.el.querySelector('.side-stop-color');
    }

    _palette() {
        const RGB_COLORS = [[255, 128, 128],
        [255, 255, 128],
        [128, 255, 128],
        [0, 255, 128],
        [128, 255, 255],
        [0, 128, 255],
        [255, 128, 192],
        [255, 128, 255],
        [255, 0, 0],
        [255, 255, 0],
        [128, 255, 0],
        [0, 255, 64],
        [0, 255, 255],
        [0, 128, 192],
        [128, 128, 192],
        [255, 0, 255],
        [128, 64, 64],
        [255, 128, 64],
        [0, 255, 0],
        [0, 128, 128],
        [0, 64, 128],
        [128, 128, 255],
        [128, 0, 64],
        [255, 0, 128],
        [128, 0, 0],
        [255, 128, 0],
        [0, 128, 0],
        [0, 128, 64],
        [0, 0, 255],
        [0, 0, 160],
        [128, 0, 128],
        [128, 0, 255],
        [64, 0, 0],
        [128, 64, 0],
        [0, 64, 0],
        [0, 64, 64],
        [0, 0, 128],
        [0, 0, 64],
        [64, 0, 64],
        [64, 0, 128],
        [0, 0, 0],
        [128, 128, 0],
        [128, 128, 64],
        [128, 128, 128],
        [64, 128, 128],
        [192, 192, 192],
        [64, 0, 64],
        [255, 255, 255]];

        let tmp = document.createElement('div');
        tmp.classList.add('d-inline-block');
        tmp.classList.add('color-palette');
        tmp.innerHTML = `<div class="color-palette" style="display: inline-block; vertical-align: top">
            <ul class="color-blocks"></ul>
        </div>`;

        const palette = tmp;

        const colorBlocks: HTMLElement = palette.querySelector('.color-blocks');

        RGB_COLORS.forEach((color: number[]) => {
            let rgb = colorUtil.rgbToHex(color[0], color[1], color[2]);
            const li = document.createElement("li");
            li.classList.add("color-block");
            li.style.backgroundColor = rgb;

            colorBlocks.appendChild(li);
        });

        colorBlocks.addEventListener('mousedown', (e) => {
            e.preventDefault();
        });

        colorBlocks.addEventListener('click', (e) => {
            let target: any = e.target;
            let color = target.style.backgroundColor;

            const { r, g, b } = colorUtil.toRgb(color);
            this.fire('_select', { r, g, b });
        });

        return palette;
    }

    setTranslateXY(handle: HTMLElement, x: number, y: number) {
        handle.setAttribute(
            "stroke",
            y < this.slide.el.clientHeight / 2 ? "black" : "white"
        );

        handle.setAttribute("transform", `translate(${x}, ${y})`);
    }

    getTranslateXY(handle: HTMLElement): number[] {
        const transform = handle
            .getAttribute("transform")
            .replace("translate(", "")
            .replace(")", "")
            .split(",");

        return [Number(transform[0].trim()), Number(transform[1].trim())];
    }

    setBrithness(ratio: number) {
        const y = (255 - ratio) / 255 / 2 * this.sideSlide.el.clientHeight;
        this.setTranslateXY(this.getSideHandle(), 0, y);
    }

    getBrightness() {
        const [x, y] = this.getTranslateXY(this.getSideHandle());
        let ratio = y / this.sideSlide.el.clientHeight;
        let color = 255 * 2 * ratio;

        return 255 - color;
    }

    setSaturation(r: number, g: number, b: number) {

        const PALETTE_SIZE = this.slide.el.clientHeight;
        const minVal = Math.min(Math.min(r, g), b);
        r -= minVal;
        g -= minVal;
        b -= minVal;

        const maxVal = Math.max(Math.max(r, g), b);
        const value = maxVal / 255;

        r = Math.round(r / value);
        g = Math.round(g / value);
        b = Math.round(b / value);

        let x = PALETTE_SIZE / 6,
            y = (1 - value) * PALETTE_SIZE;

        if (r === 255 && g >= 0 && b === 0) {
            // r = 255; g = ratio * 255; b = 0;
            x *= g / 255;
        } else if (r >= 0 && g === 255 && b === 0) {
            // r = 255 - ratio * 255; g = 255; b = 0;
            x *= (255 - r) / 255;
            x += 1 * (PALETTE_SIZE / 6);
        } else if (r === 0 && g === 255 && b >= 0) {
            // r = 0; g = 255; b = ratio * 255;
            x *= b / 255;
            x += 2 * (PALETTE_SIZE / 6);
        } else if (r === 0 && g >= 0 && b === 255) {
            // r = 0; g = 255 - ratio * 255; b = 255;
            x *= (255 - g) / 255;
            x += 3 * (PALETTE_SIZE / 6);
        } else if (r >= 0 && g === 0 && b === 255) {
            // r = ratio * 255; g = 0; b = 255;
            x *= r / 255;
            x += 4 * (PALETTE_SIZE / 6);
        } else if (r === 255 && g === 0 && b >= 0) {
            // r = 255; g = 0; b = 255 - ratio * 255;
            x *= (255 - b) / 255;
            x += 5 * (PALETTE_SIZE / 6);
        }

        x = Math.round(x);
        y = Math.round(y);

        this.setTranslateXY(this.getHandle(), x, y);
    }

    getSaturation() {
        const [x, y] = this.getTranslateXY(this.getHandle());

        const per = x / (this.getSlideWidth() / 6);
        const i = Math.floor(per);
        let r = 0,
            g = 0,
            b = 0;

        const ratio = per - i;

        switch (i) {
            case 0:
                // 255,0,0 -> 255,255,0
                r = 255;
                g = ratio * 255;
                b = 0;
                break;
            case 1:
                // 255,255,0 -> 0,255,0
                r = 255 - ratio * 255;
                g = 255;
                b = 0;
                break;
            case 2:
                // 0,255,0 -> 0,255,255
                r = 0;
                g = 255;
                b = ratio * 255;
                break;
            case 3:
                // 0,255,255 -> 0,0,255
                r = 0;
                g = 255 - ratio * 255;
                b = 255;
                break;
            case 4:
                // 0,0,255 -> 255,0,255
                r = ratio * 255;
                g = 0;
                b = 255;
                break;
            case 5:
                // 255,0,255 -> 255,0,0
                r = 255;
                g = 0;
                b = 255 - ratio * 255;
                break;
        }

        const value = 1 - y / this.slide.el.clientHeight;

        r = Math.round(r * value);
        g = Math.round(g * value);
        b = Math.round(b * value);

        return { r, g, b };
    }

    getRGB(): any {
        let { r, g, b } = this.getSaturation();
        let brightness = this.getBrightness();

        r = colorUtil.color255(r + brightness);
        g = colorUtil.color255(g + brightness);
        b = colorUtil.color255(b + brightness);

        return { r, g, b };
    }

    setRGB(r: number, g: number, b: number) {

        this._setRGB(r, g, b);
        this._setSideRGB(r, g, b);

        this.setSaturation(r, g, b);

        const minVal = Math.min(Math.min(r, g), b);
        this.setBrithness(minVal);
    }

    _setRGB(r: number, g: number, b: number) {
        const displayColor: HTMLElement = this.el.querySelector('.print-color');
        if (displayColor) {
            displayColor.style.backgroundColor = colorUtil.rgbToHex(r, g, b);
        }

        const inputR: HTMLInputElement = this.el.querySelector('.input-r');
        const inputG: HTMLInputElement = this.el.querySelector('.input-g');
        const inputB: HTMLInputElement = this.el.querySelector('.input-b');

        if (inputR) {
            inputR.value = '' + r;
            inputG.value = '' + g;
            inputB.value = '' + b;
        }
    }

    _setSideRGB(r: number, g: number, b: number) {
        const minVal = Math.min(Math.min(r, g), b);
        r -= minVal;
        g -= minVal;
        b -= minVal;

        const maxVal = Math.max(Math.max(r, g), b);
        const value = maxVal / 255;

        r = Math.round(r / value);
        g = Math.round(g / value);
        b = Math.round(b / value);

        this.getSideStopColor().setAttribute("stop-color", colorUtil.rgbToHex(r, g, b));
    }

    refresh() {
        this.setRGB(255, 0, 0);
    }
}

export default ColorPicker;