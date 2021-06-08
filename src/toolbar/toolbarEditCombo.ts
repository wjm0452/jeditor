import ToolbarItem from "./toolbarItem";

class ToolbarEditCombo extends ToolbarItem {

    inputWrapper: HTMLElement;
    itemWrapper: HTMLElement;

    constructor(options: any = {
        tagName: 'div',
        items: [],
        className: '',
        click: null
    }) {
        options.tagName = options.tagName || 'div';
        super(options);
    }

    public render() {

        const options = this.options;
        this.el = document.createElement(options.tagName);

        this.renderInput();
        this.renderItem(options.items);

        if (options.className) {
            options.className.split(' ').forEach((className: string) => { this.el.classList.add(className); });
        }
    }

    protected renderInput() {

        const editor: any = this.getEditor();

        this.inputWrapper = document.createElement('span');
        this.inputWrapper.classList.add('input-group');
        this.inputWrapper.innerHTML = this.template();

        this.inputWrapper.querySelector('.combo-input').addEventListener('keyup', (e: any) => {
            let target: any = e.target;

            if (e.key === 'Enter') {
                this.select(target.value);
            }
            else if (e.key === 'Escape') {
                this.close();
            }
            else {
                // this.filter(target.value);
            }
        });

        this.inputWrapper.querySelector('.combo-open').addEventListener('click', (e) => {
            if (this.isOpen()) {
                this.close();
            }
            else {
                this.itemWrapper.focus();
                this.open();
            }
        });

        editor.el.addEventListener('click', (e: any) => {
            if (!e.path.some((node: any) => node === this.el)) {
                this.close();
            }
        });

        this.el.appendChild(this.inputWrapper);
    }

    protected renderItem(items: any[]) {

        this.itemWrapper = document.createElement('ul');
        this.itemWrapper.classList.add('list-group');
        this.itemWrapper.classList.add('d-none');
        this.itemWrapper.innerHTML = this.itemTemplate(items);

        this.itemWrapper.addEventListener('click', (e) => {
            let target: any = e.target;
            if (target.classList.contains('list-group-item')) {
                this.selectByUid(target.dataset.uid);
            }
        });

        this.el.appendChild(this.itemWrapper);
    }

    public template(): string {
        return `
        <input type="search" class="form-control combo-input">
        <span class="input-group-text combo-open">
        <svg class="bi" width="12" height="12" fill="currentColor"><use xlink:href="/dist/bootstrap-icons.svg#caret-down-fill"/></svg>
        </span>`;
    }

    public itemTemplate(items: any[]): string {

        if (!items || !items.length) {
            return '';
        }

        let html = '';
        items.forEach((obj: any) => {
            let uid = this.uid();
            obj.uid = uid;
            html += `<li class="list-group-item" data-uid="${uid}">${obj.text}</li>`;
        });

        return html;
    }

    public items() {
        return this.options.items;
    }

    public selectByUid(uid: string) {
        let item = this.items().find((item: any) => item.uid === uid);
        this.select(item.value);
    }

    public select(value: string) {

        let item = this.items().find((item: any) => item.value === value);

        if (!item) { return; }

        this.itemWrapper.querySelectorAll('.selected').forEach((node: Element) => {
            node.classList.remove('selected');
        });

        let selectNode = Array.prototype.find.call(this.itemWrapper.querySelectorAll('.list-group-item'), (node) => node.dataset.uid === item.uid);
        selectNode.classList.add('selected');

        this.setValue(value);
        this.close();
        this.command(value);
    }

    public filter(inputText: string) {
        let items = !inputText ?
            this.options.items :
            this.options.items.filter((item: any) => item.value.startsWith(inputText) || item.text.startsWith(inputText));

        this.itemWrapper.innerHTML = this.itemTemplate(items);
    }

    public isOpen(): boolean {
        return !this.el.querySelector('.list-group').classList.contains('d-none');
    }

    public open() {
        this.el.querySelector('.list-group').classList.remove('d-none');
        this.el.querySelector('.list-group').classList.add('d-block');
        return this;
    }

    public close() {
        this.el.querySelector('.list-group').classList.remove('d-block');
        this.el.querySelector('.list-group').classList.add('d-none');
        return this;
    }

    public setValue(value: any = '') {
        let input: HTMLInputElement = this.inputWrapper.querySelector('.combo-input');
        let item = this.items().find((item: any) => item.value === value);
        input.value = item ? item.text : '';
    }

    public updateState() {
        let value = this.getEditor().getFormattedValue(...this.getCommandArgs());
        this.setValue(value);
    }

    /**
     * uid를 생성하여 반환한다.
     * 
     * @memberof cb
     * @returns {string}
     */
    public uid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

}

export default ToolbarEditCombo;