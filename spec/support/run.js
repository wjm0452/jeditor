const Jasmine = require("jasmine");
const JasmineConsoleReporter = require("jasmine-console-reporter");

var jasmine = new Jasmine();
jasmine.loadConfigFile("spec/support/jasmine.json");
jasmine.addReporter(new JasmineConsoleReporter());
jasmine.execute();
