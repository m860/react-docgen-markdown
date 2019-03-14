import yargs from "yargs"
import build from "./commands/build"
import readme from "./commands/readme"

yargs.command(build);
yargs.command(readme);

yargs.demandCommand()
    .help()
    .alias("h", "help")
    .alias("v", "version")
    .argv;
