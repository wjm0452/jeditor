
const _color = {
    color255(v: number) {
        if (v > 255) {
            v = 255;
        }
        if (v < 0) {
            v = 0;
        }

        return Math.floor(v);
    },

    toRgb(rgb: string): any {

        if (rgb.startsWith('#')) {
            rgb = rgb.substring(1);
            return [parseInt(rgb.substring(0, 2), 16), parseInt(rgb.substring(2, 4), 16), parseInt(rgb.substring(4, 6), 16)];
        }
        else if (rgb.startsWith('rgb')) {
            let tmp = rgb.replace('rgb(', '').replace(')', '').split(',');
            return { r: Number(tmp[0].trim()), g: Number(tmp[1].trim()), b: Number(tmp[2].trim()) };
        }

        return null;
    },

    rgbToHex(r: number, g: number, b: number): string {
        return '#' + (
            Number(r).toString(16).padStart(2, "0") +
            Number(g).toString(16).padStart(2, "0") +
            Number(b).toString(16).padStart(2, "0")
        );
    },

    getMousePosition(referenceNode: HTMLElement, pos: any[]): number[] {
        const rect = referenceNode.getBoundingClientRect();
        let [x, y] = pos;

        x = x - rect.left;

        if (x < 0) {
            x = 0;
        } else if (x > rect.width) {
            x = rect.width;
        }

        y = y - rect.top;

        if (y < 0) {
            y = 0;
        } else if (y > rect.height) {
            y = rect.height;
        }

        return [x, y];
    }
};

export default _color;