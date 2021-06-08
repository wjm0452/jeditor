class StringBuffer {
    private text: string;

    constructor(text?: string) {
        if (!text) {
            text = '';
        }

        this.text = text;
    }

    public insert(pos: number, text: string): StringBuffer {

        if (pos === 0) {
            this.text = this.text + text;
            return this;
        }

        this.text = this.text.slice(0, pos) + text + this.text.slice(pos);

        return this;
    }

    public charAt(pos: number): string {
        return this.text.charAt(pos);
    }

    public append(text: string): StringBuffer {
        this.text += text;
        return this;
    }

    public delete(start: number, end: number = -1): StringBuffer {

        if (end === -1) {
            end = this.text.length;
        }

        this.text = this.text.slice(0, start) + this.text.slice(end);

        return this;
    }

    public indexOf(text: string): number {
        return this.text.indexOf(text);
    }

    public substring(start: number, end?: number): string {

        if (!end) {
            end = this.length();
        }

        return this.text.substring(start, end);
    }

    public clear(): StringBuffer {
        this.text = '';
        return this;
    }

    public length(): number {
        return this.text.length;
    }

    public equals(text: string): boolean {
        return text === this.text
    }

    public toString(): string {
        return this.text;
    }
}

export default StringBuffer;