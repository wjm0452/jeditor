import Widget from "../ui/widget";
import ToolbarItem from "./toolbarItem";

class Toolbar extends Widget {

    items: ToolbarItem[];

    constructor(options: any = {}) {
        super(options);
        this.items = [];
    }

    public render() {
        this.el.classList.add('j-toolbar');
    }

    public insertItem(item: ToolbarItem, index?: number): ToolbarItem {

        if (index === undefined) {
            this.el.appendChild(item.el);
        }
        else {
            this.el.insertBefore(item.el, this.el.children[index]);
        }

        this.items.splice(index, 0, item);

        if (item.el) {
            item.el.classList.add('j-toolbar-item');
        }

        return item;
    }

    public getItem(index: number): ToolbarItem {
        return this.items[index];
    }

    public updateState() {
        // animationFrame
        window.requestAnimationFrame(() => {
            this.items.forEach((item: ToolbarItem) => {
                item.updateState();
            });
        });
    }
}

export default Toolbar;