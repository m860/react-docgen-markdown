import yargs from "yargs"

const argv = yargs.help()
    .alias("h", "help")
    .alias("v", "version")
    .argv;
