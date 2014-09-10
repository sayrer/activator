activator
=========

An experiment with TypeScript and event activation with purely virtual event targets.

Event handling code comes from the [Closure Library](https://github.com/google/closure-library/), but ported to TypeScript. Most of the code in the project comes directly from there.

To see the CommonJS output,

    cd activator/
    tsc src/activator/* --module commonjs --outDir output/