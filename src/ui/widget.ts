class Widget {

    el: HTMLElement;
    options: any;

    _events: Map<string, object[]>;

    constructor(options: any = {}) {

        if (typeof options.el === 'string') {
            options.el = document.querySelector(options.el);
        }

        this.el = options.el;

        this.options = options;
        this._events = new Map();

        this.render();
        this.created();
    }

    render() { }

    created() { }

    on(eventName: string, handler: any, context: any = window) {
        let eventList: any[] = this._events.get(eventName);

        if (eventList == null) {
            this._events.set(eventName, []);
            eventList = this._events.get(eventName);
        }

        eventList.push({
            handler,
            context
        });
    }

    off(eventName: string, handler: any) {
        let eventList: any[] = this._events.get(eventName);

        if (eventList && eventList.length) {
            let idx = eventList.findIndex((obj: any) => { return obj.handler === handler });
            if (idx != -1) {
                eventList.splice(idx, 1);
            }
        }
    }

    fire(eventName: string, ...args: any) {
        let eventList: object[] = this._events.get(eventName);
        if (eventList && eventList.length) {
            eventList.forEach((obj: any) => {
                obj.handler.call(obj.context, ...args);
            });
        }
    }

    uid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

}

export default Widget;