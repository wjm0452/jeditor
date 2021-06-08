import './editor.scss';
import 'bootstrap-icons/bootstrap-icons.svg';

import Toolbar from "./toolbar/toolbar";
import InlineFormatter from "./format/inlineFormatter";
import StyleFormatter from "./format/styleFormatter";
import domUtils from "./util/dom";
import rangeUtils from "./util/range";
import ToolbarButton from "./toolbar/toolbarButton";
import ToolbarPopupButton from "./toolbar/toolbarPopupButton";
import ColorLayerPopup from "./popup/colorLayerPopup";
import ListFormatter from "./format/listFormatter";
import ToolbarCombo from "./toolbar/toolbarCombo";
import BlockFormatter from "./format/blockFormatter";
import ToolbarEditCombo from './toolbar/toolbarEditCombo';
import Formatter from './formatter';
import FormatterCommand from './command/FormatterCommand';
import InputFormatter from './format/inputForamtter';
import ToolbarColor from './toolbar/toolbarColor';

class Editor {

    public el: HTMLElement;

    private toolbar: Toolbar;
    private textarea: HTMLElement;

    private _range: Range;

    private commands: Map<string, FormatterCommand>;
    private formatters: Map<string, Formatter>;

    constructor(options: any = {}) {

        if (typeof options.el === 'string') {
            this.el = document.querySelector(options.el);
        }

        this.commands = new Map();
        this.formatters = new Map();

        this.render();
    }

    render() {

        this.el.classList.add('j-editor');

        // toolbar
        const toolbarElem = document.createElement('div');
        this.toolbar = new Toolbar({
            el: toolbarElem
        });

        this.el.insertBefore(toolbarElem, this.el.firstChild);

        // editable area
        this.textarea = document.createElement('div');
        this.textarea.classList.add('editable-area');
        this.textarea.setAttribute('contenteditable', 'true');

        this.el.appendChild(this.textarea);

        this.initFormatter(); // set commands list
        this.initCommands(); // command
        this.initToolbar(); // toolbar item
        this.initShortcut(); // short cut
        this.initEvents(); // event bind

        this.newLine();
    }

    public command(name: string, ...args: any) {
        this.focus();
        const command = this.commands.get(name);
        if (command) {
            command.execute(...args);
            this.toolbar.updateState();
        }
    }

    public isFormatted(name: string, ...args: any) {
        const command = this.commands.get(name);
        if (command) {
            return command.isFormatted(...args);
        }
        return false;
    }

    public getFormattedValue(name: string, ...args: any) {
        const command = this.commands.get(name);
        if (command) {
            return command.getFormattedValue(...args);
        }
        return false;
    }

    public initToolbar() {

        const that = this;

        this.toolbar.insertItem(
            new ToolbarButton({
                editor: this,
                tagName: 'button',
                className: 'btn',
                text: 'bold',
                template: `<svg class="bi" width="16" height="16" fill="currentColor"><use xlink:href="/dist/bootstrap-icons.svg#type-bold"/></svg>`,
                command: ['bold']
            })
        );

        this.toolbar.insertItem(
            new ToolbarButton({
                editor: this,
                tagName: 'button',
                className: 'btn',
                text: 'italic',
                template: `<svg class="bi" width="16" height="16" fill="currentColor"><use xlink:href="/dist/bootstrap-icons.svg#type-italic"/></svg>`,
                command: ['italic']
            })
        );

        this.toolbar.insertItem(
            new ToolbarButton({
                editor: this,
                tagName: 'button',
                className: 'btn',
                text: 'strike',
                template: `<svg class="bi" width="16" height="16" fill="currentColor"><use xlink:href="/dist/bootstrap-icons.svg#type-strikethrough"/></svg>`,
                command: ['strike']
            })
        );

        this.toolbar.insertItem(
            new ToolbarButton({
                editor: this,
                tagName: 'button',
                className: 'btn',
                text: 'underline',
                template: `<svg class="bi" width="16" height="16" fill="currentColor"><use xlink:href="/dist/bootstrap-icons.svg#type-underline"/></svg>`,
                command: ['underline']
            })
        );

        this.toolbar.insertItem(
            new ToolbarPopupButton({
                editor: this,
                tagName: 'button',
                className: 'btn',
                text: 'color',
                template: `<svg class="bi" width="16" height="16" fill="currentColor"><use xlink:href="/dist/bootstrap-icons.svg#file-earmark-font"/></svg>`,
                layerPopup: new ColorLayerPopup({
                    target: this.el,
                    select(color: string) {
                        that.command('style', [{
                            attrs: {
                                style: {
                                    color
                                }
                            }
                        }]);
                    }
                })
            })
        );

        this.toolbar.insertItem(
            new ToolbarPopupButton({
                editor: this,
                tagName: 'button',
                className: 'btn',
                text: 'backgroundColor',
                template: `<svg class="bi" width="16" height="16" fill="currentColor"><use xlink:href="/dist/bootstrap-icons.svg#file-earmark-font-fill"/></svg>`,
                layerPopup: new ColorLayerPopup({
                    target: this.el,
                    select(backgroundColor: string) {
                        that.command('style', [{
                            attrs: {
                                style: {
                                    backgroundColor
                                }
                            }
                        }]);
                    }
                })
            })
        );

        this.toolbar.insertItem(
            new ToolbarButton({
                editor: this,
                tagName: 'button',
                text: 'ul',
                className: 'btn',
                template: `<svg class="bi" width="16" height="16" fill="currentColor"><use xlink:href="/dist/bootstrap-icons.svg#list-ul"/></svg>`,
                command: ['ul']
            })
        );

        this.toolbar.insertItem(
            new ToolbarButton({
                editor: this,
                tagName: 'button',
                text: 'ol',
                className: 'btn',
                template: `<svg class="bi" width="16" height="16" fill="currentColor"><use xlink:href="/dist/bootstrap-icons.svg#list-ol"/></svg>`,
                command: ['ol']
            })
        );

        this.toolbar.insertItem(
            new ToolbarButton({
                editor: this,
                tagName: 'button',
                text: 'left',
                className: 'btn',
                template: `<svg class="bi" width="16" height="16" fill="currentColor"><use xlink:href="/dist/bootstrap-icons.svg#text-left"/></svg>`,
                command: ['alignLeft']
            })
        );

        this.toolbar.insertItem(
            new ToolbarButton({
                editor: this,
                tagName: 'button',
                text: 'center',
                className: 'btn',
                template: `<svg class="bi" width="16" height="16" fill="currentColor"><use xlink:href="/dist/bootstrap-icons.svg#text-center"/></svg>`,
                command: ['alignCenter']
            })
        );

        this.toolbar.insertItem(
            new ToolbarButton({
                editor: this,
                tagName: 'button',
                text: 'right',
                className: 'btn',
                template: `<svg class="bi" width="16" height="16" fill="currentColor"><use xlink:href="/dist/bootstrap-icons.svg#text-right"/></svg>`,
                command: ['alignRight']
            })
        );

        this.toolbar.insertItem(
            new ToolbarEditCombo({
                editor: this,
                className: 'edit-combo',
                items: [
                    { text: '맑은 고딕', value: '"Malgun Gothic"' },
                    { text: '돋움', value: 'Dotum' },
                    { text: 'D2Coding', value: 'D2Coding' },
                ],
                command(fontFamily: any) {
                    return ['style', [
                        {
                            attrs: {
                                style: {
                                    fontFamily
                                }
                            }
                        }
                    ]];
                }
            })
        );

        this.toolbar.insertItem(
            new ToolbarEditCombo({
                editor: this,
                className: 'edit-combo',
                items: [
                    { text: '10px', value: '10px' },
                    { text: '12px', value: '12px' },
                    { text: '15px', value: '15px' },
                    { text: '18px', value: '18px' },
                    { text: '20px', value: '20px' },
                    { text: '24px', value: '24px' },
                    { text: '28px', value: '28px' },
                    { text: '32px', value: '32px' },
                ],
                command(fontSize: any) {
                    return ['style', [
                        {
                            attrs: {
                                style: {
                                    fontSize
                                }
                            }
                        }
                    ]];
                }
            })
        );

        this.toolbar.insertItem(
            new ToolbarEditCombo({
                editor: this,
                className: 'edit-combo',
                items: [
                    { text: 'H1', value: 'H1' },
                    { text: 'H2', value: 'H2' },
                    { text: 'H3', value: 'H3' },
                    { text: 'H4', value: 'H4' },
                    { text: 'H5', value: 'H5' },
                    { text: 'H6', value: 'H6' }
                ],
                command(htag: any) {
                    return ['block', htag];
                }
            })
        );

    }

    public initCommands() {

        this.commands.set('input', new FormatterCommand({
            formatter: this.formatters.get('input')
        }));

        this.commands.set('bold', new FormatterCommand({
            formatter: this.formatters.get('inline'),
            args: [[
                { tagName: 'b' },
                { tagName: 'strong' },
                {
                    attrs: {
                        style: {
                            fontWeight: 'bold'
                        }
                    }
                }
            ]]
        }));

        this.commands.set('italic', new FormatterCommand({
            formatter: this.formatters.get('inline'),
            args: [[
                { tagName: 'i' },
                { tagName: 'em' },
                {
                    attrs: {
                        style: {
                            fontStyle: 'italic'
                        }
                    }
                }
            ]]
        }));

        this.commands.set('underline', new FormatterCommand({
            formatter: this.formatters.get('inline'),
            args: [[
                { tagName: 'u' },
                {
                    attrs: {
                        style: {
                            textDecoration: 'underline'
                        }
                    }
                }
            ]]
        }));

        this.commands.set('strike', new FormatterCommand({
            formatter: this.formatters.get('inline'),
            args: [[
                { tagName: 's' },
                {
                    attrs: {
                        style: {
                            textDecoration: 'line-through'
                        }
                    }
                }
            ]]
        }));

        this.commands.set('ul', new FormatterCommand({
            formatter: this.formatters.get('list'),
            args: ['ul']
        }));

        this.commands.set('ol', new FormatterCommand({
            formatter: this.formatters.get('list'),
            args: ['ol']
        }));

        this.commands.set('alignLeft', new FormatterCommand({
            formatter: this.formatters.get('block'),
            args: ['', {
                style: {
                    textAlign: 'left'
                }
            }]
        }));

        this.commands.set('alignCenter', new FormatterCommand({
            formatter: this.formatters.get('block'),
            args: ['', {
                style: {
                    textAlign: 'center'
                }
            }]
        }));

        this.commands.set('alignRight', new FormatterCommand({
            formatter: this.formatters.get('block'),
            args: ['', {
                style: {
                    textAlign: 'right'
                }
            }]
        }));

        this.commands.set('style', new FormatterCommand({
            formatter: this.formatters.get('style')
        }));

        this.commands.set('block', new FormatterCommand({
            formatter: this.formatters.get('block')
        }));
    }

    public initFormatter() {

        this.formatters.set('input', new InputFormatter({
            editor: this
        }));

        this.formatters.set('inline', new InlineFormatter({
            editor: this
        }));

        this.formatters.set('style', new StyleFormatter({
            editor: this
        }));

        this.formatters.set('list', new ListFormatter({
            editor: this
        }));

        this.formatters.set('block', new BlockFormatter({
            editor: this
        }));
    }

    public initEvents() {

        let _isSelection = false;
        const textarea = this.textarea;

        textarea.addEventListener("keydown", (e: KeyboardEvent) => {

            if (e.key === 'Enter') {
                this.removeEmptyNode();
                if (!e.shiftKey) {
                    // e.preventDefault();
                    // this.newLine(null, true);
                }

                // if (e.shiftKey) {
                //     this.newLine();
                // } else {
                //     this.removeAll();
                // }
            }
            else if (e.key === 'Tab') {
                e.preventDefault();
            }
        });

        textarea.addEventListener("keyup", (e: KeyboardEvent) => {

            if (e.key === 'Backspace' || e.key === 'delete') {
                this.checkLine();
            }

            if (!e.shiftKey && e.key === 'Tab') {
                this.insertTab();
            }

            this.saveSelection();

            if (e.key === 'ArrowUp' || e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' ||
                e.key === 'Home' || e.key === 'End' || e.key === 'PageUp' || e.key === 'PageDown') {
                this.toolbar.updateState();
            }
        });

        textarea.addEventListener('cut', () => {
            window.setTimeout(() => { this.checkLine(); }, 0);
        });

        textarea.addEventListener("mousedown", () => {
            _isSelection = true;
            this._range = null;
        });

        // document out focus...
        document.addEventListener("mouseup", () => {
            if (_isSelection) {
                this.saveSelection();
                this.toolbar.updateState();
            }
            _isSelection = false;
        });

        textarea.addEventListener("focus", () => {
            if (this._range) {
                let selection = document.getSelection();
                selection.removeAllRanges();
                selection.addRange(this._range);
            }
        });
    }

    public focus() {
        if (document.activeElement !== this.textarea) {
            this.textarea.focus();
            if (this._range) {
                let selection = document.getSelection();
                selection.removeAllRanges();
                selection.addRange(this._range);
            }
        }
    }

    public initShortcut() {

        const textarea = this.textarea;
        textarea.addEventListener('keydown', (e) => {
            if (e.ctrlKey) {
                if (e.key === 'b') {
                    this.command('inline', 'B');
                }
                else if (e.key === 'i') {
                    this.command('inline', 'I');
                }
                else if (e.key === 's') {
                    this.command('inline', 'S');
                }
                else if (e.key === 'u') {
                    this.command('inline', 'U');
                }
            }
        });
    }

    public saveSelection(range?: Range) {
        this._range = range || rangeUtils.getRange();
    }

    public getRange(): Range {
        return rangeUtils.getRange();
    }

    public checkLine() {

        if (this.textarea.childNodes.length === 0) {
            this.newLine();
        }
        else if (this.textarea.childNodes.length === 1) {

            const childNode = this.textarea.childNodes[0];
            if (childNode instanceof Element && childNode.tagName === 'BR') {
                this.removeAll();
                this.newLine();
            }

        }
    }

    public newLine(node?: Node, focus: boolean = false): Node {
        const div = document.createElement('div');
        div.appendChild(document.createElement('br'));

        let lineNode;
        if (node) {
            lineNode = this.getLineNode(node);
            lineNode = this.textarea.insertBefore(div, lineNode.nextSibling);
        }
        else {
            lineNode = this.textarea.appendChild(div);
        }

        if (focus) {
            this.focusLine(lineNode);
        }

        return lineNode;
    }

    public getLineNode(node: Node): Node {
        const paths: Node[] = domUtils.getPathTo(node, this.textarea);

        if (paths.length < 2) {
            return null;
        }

        let lineNode: Node = paths[paths.length - 2];

        if (this.isBlock(lineNode)) {
            return lineNode;
        }

        return null;
    }

    public getBlockNode(node: Node): Node {

        const paths: Node[] = domUtils.getPathTo(node, this.textarea);

        if (paths.length < 2) {
            return null;
        }

        let resultNode: Node;
        do {
            resultNode = paths.shift();
            if (this.isBlock(resultNode)) { break; }
        } while (resultNode);

        return resultNode;
    }

    public focusLine(node: Node): Node {
        let lineNode = this.getLineNode(node);

        const range = document.createRange();
        range.setStart(lineNode, 0);
        range.setEnd(lineNode, 0);

        const selection = document.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);

        return lineNode;
    }

    public removeAll() {
        while (this.textarea.firstChild) {
            this.textarea.removeChild(this.textarea.firstChild);
        }
    }

    public _removeEmptyNode(node: any, deleteEmptyNode?: boolean) {
        const parentNode = node.parentNode;

        if (domUtils.isTextNode(node)) {
            let index = -1;
            while ((index = node.data.indexOf("\u200B")) > -1) {
                node.deleteData(index, 1);
            }

            if (node.data.length === 0) {
                parentNode.removeChild(node);
            }
        } else {
            let current = node.firstChild;
            let next;
            while (current) {
                next = current.nextSibling;
                if (current.tagName !== 'BR') {
                    this._removeEmptyNode(current);
                }
                current = next;
            }

            if (deleteEmptyNode !== false && node.childNodes.length === 0) {
                parentNode.removeChild(node);
            }
        }
    }

    public removeEmptyNode() {
        let current = this.textarea.firstChild;
        let next;
        while (current) {
            next = current.nextSibling;
            this._removeEmptyNode(current, false);
            current = next;
        }

        if (this.textarea.childNodes.length === 0) {
            this.newLine();
        }
    }

    public isBlock(node: Node | string): boolean {

        if (!node) {
            return false;
        }

        const BLOCK_NODE_NAMES = /^(P|DIV|TABLE|UL|OL|H[1-6]|TH|TD)$/i;
        const nodeName: string = node instanceof Node ? node.nodeName : node;
        return BLOCK_NODE_NAMES.test(nodeName);
    }

    public insertTab() {
        this.command('input', '\u00A0\u00A0\u00A0\u00A0');
    }

    public setText(text: string): Editor {
        this.textarea.innerText = text;
        return this;
    }

    public getText(): string {
        return this.textarea.innerText;
    }

    public setHtml(html: string): Editor {
        this.textarea.innerHTML = html;
        return this;
    }

    public getHtml(): string {
        return this.textarea.innerHTML;
    }
}

export default Editor;