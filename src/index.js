#!/usr/bin/env node

'use strict';

const glob = require('glob');
const jsdom = require('jsdom');
const fs = require('fs');

function testHtmlString(html, selector, testerFunction, onError) {
    jsdom.env({
        html: html,
        done: function(err, window) {
            if (err) {
                onError(err);
                return;
            }

            const elements = window.document.querySelectorAll(selector);
            for (let i = 0; i < elements.length; i++) {
                const element = elements[i];

                try {
                    testerFunction(element);
                } catch (e) {
                    onError(e);
                }
            }
        }
    });
}

function testFile(path, selector, testerFunction, onError) {
    const prefixedOnError = (err) => onError(`File "${path}": Selector "${selector}": ${err}`);

    fs.readFile(
        path,
        'utf-8',
        function(err, html) {
            if (err) {
                prefixedOnError(err);
                return;
            }

            testHtmlString(html, selector, testerFunction, prefixedOnError);
        }
    );
}

function resolveGlobs(globs) {
    const paths = [];

    for (let i = 0; i < globs.length; i++) {
        glob.sync(globs[i]).forEach(path => paths.push(path));
    }

    return paths;
}

function copyObject(toCopy) {
    const copy = {};
    for (let key in toCopy) {
        if (toCopy[key] instanceof Array) {
            copy[key] = toCopy[key].slice(0);
        } else if (toCopy[key] instanceof Function) {
            copy[key] = toCopy[key];
        } else {
            throw 'Unsupported type to copy: ' + toCopy[key];
        }
    }
    return copy;
}

function escapeRegExp(string) {
  return string.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}

function rightTrim(string, char) {
    const regexEndingWithChar = new RegExp(escapeRegExp(char) + '+$');
    return string.replace(regexEndingWithChar, '');
}

function getUniqueAndSortedPaths(paths) {
    paths = paths.map(path => path.replace(/^\.\//, ''));

    paths = paths.sort();

    // Remove duplicates.
    paths = paths.filter(function(item, pos) {
        return paths.indexOf(item) === pos;
    });

    return paths;
}

const builderMethods = {
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
        const self = copyObject(this);
        self.dirs.push(dir);
        return self;
    },

    /**
     * The file at the given path will be added to the test.
     *
     * @param {String} path For example 'src/html/index.html'.
     */
    inFile: function(path) {
        const self = copyObject(this);
        self.files.push(path);
        return self;
    },

    /**
     * All files that match the given glob will be added to the test.
     *
     * @param {String} glob For example 'src/html/**.{html|twig}'.
     */
    inGlob: function(glob) {
        const self = copyObject(this);
        self.globs.push(glob);
        return self;
    },

    /**
     * @param {String} selector A HTML query selector. For example 'a.button, button'.
     */
    forElements: function(selector) {
        const self = copyObject(this);
        self.selectors.push(selector);
        return self;
    },

    test: function(testerFunction) {
        const dirsAsGlobs = this.dirs.map(dir => {
            return rightTrim(dir, '/') + '/**/*.html';
        });

        const allGlobs = this.globs.concat(dirsAsGlobs);

        const allFiles = resolveGlobs(allGlobs).concat(this.files);

        const uniqueFiles = getUniqueAndSortedPaths(allFiles);

        for (let i = 0; i < uniqueFiles.length; i++) {
            for (let ii = 0; ii < this.selectors.length; ii++) {
                testFile(uniqueFiles[i], this.selectors[ii], testerFunction, console.error);
            }
        }

        return this;
    },
};

module.exports = builderMethods;
