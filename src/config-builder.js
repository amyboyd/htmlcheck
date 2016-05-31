'use strict';

const utils = require('./utils');
const tester = require('./tester');

const builder = {
    dirs: [],

    files: [],

    globs: [],

    selectors: [],

    /**
     * All files with the '.html' extension in the given directory will be added to the test.
     *
     * @param {String} dir For example 'src/html/'.
     */
    inDir: function(dir) {
        const self = utils.copyObject(this);
        self.dirs.push(dir);
        return self;
    },

    /**
     * The file at the given path will be added to the test.
     *
     * @param {String} path For example 'src/html/index.html'.
     */
    inFile: function(path) {
        const self = utils.copyObject(this);
        self.files.push(path);
        return self;
    },

    /**
     * All files that match the given glob will be added to the test.
     *
     * @param {String} glob For example 'src/html/**.{html|twig}'.
     */
    inGlob: function(glob) {
        const self = utils.copyObject(this);
        self.globs.push(glob);
        return self;
    },

    /**
     * @param {String} selector A HTML query selector. For example 'a.button, button'.
     */
    forElements: function(selector) {
        const self = utils.copyObject(this);
        self.selectors.push(selector);
        return self;
    },

    test: function(testerFunction) {
        tester.run(utils.copyObject(this), testerFunction);
        return this;
    },
};

module.exports = builder;
