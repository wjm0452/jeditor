import Command from "../command";
import Formatter from "../formatter";

class FormatterCommand extends Command {

    private formatter: Formatter;
    private args: any;
    private options: any;

    constructor(options: any) {
        super();
        this.options = options;
        this.args = options.args;
        this.formatter = options.formatter;
    }

    public execute(...args: any) {

        if (!args || !args.length) {
            args = this.args;
        }

        this.formatter.format(...args);
    }

    public getFormatter(): Formatter {
        return this.formatter;
    }

    public isFormatted(...args: any): boolean {

        if (!args || !args.length) {
            args = this.args;
        }

        return this.formatter.hasFormat(...args);
    }

    public getFormattedValue(...args: any): any {

        if (!args || !args.length) {
            args = this.args;
        }

        return this.formatter.getFormatValue(...args);
    }
}

export default FormatterCommand;