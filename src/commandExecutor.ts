import Command from "./command";

class CommandExecutor {

    private commands: Map<string, Command>;

    constructor() {
        this.commands = new Map();
    }

    public execute(name: string, ...args: any) {
        const cmd = this.commands.get(name);

        if (cmd) {
            cmd.execute(...args);
        }
    }

    public registCommand(name: string, command: Command) {
        this.commands.set(name, command);
    }

    public unregistCommand(name: string) {
        this.commands.delete(name);
    }
}

export default CommandExecutor;