import flow from "rollup-plugin-flow"
import copy from 'rollup-plugin-copy'

export default {
    input: "./src/index.js",
    output: {
        dir: "./built",
        format: "cjs",
        banner: "#!/usr/bin/env node"
    },
    plugins: [
        flow({all: true}),
        copy({
            verbose: true,
            "./src/doc.handlebars": "./built/doc.handlebars",
            "./src/table-content.handlebars": "./built/table-content.handlebars"
        })
    ]
}