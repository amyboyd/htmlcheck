'use strict';

const jsdom = require('jsdom');
const utils = require('./utils');
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

function run(config, testerFunction) {
    const dirsAsGlobs = config.dirs.map(dir => {
        return utils.rightTrim(dir, '/') + '/**/*.html';
    });

    const allGlobs = config.globs.concat(dirsAsGlobs);

    const allFiles = utils.resolveGlobs(allGlobs).concat(config.files);

    const uniqueFiles = utils.getUniqueAndSortedPaths(allFiles);

    for (let i = 0; i < uniqueFiles.length; i++) {
        for (let ii = 0; ii < config.selectors.length; ii++) {
            testFile(uniqueFiles[i], config.selectors[ii], testerFunction, function(error) {
                console.error(error);
                process.exitCode = 1;
            });
        }
    }
}

const finishPromise = new Promise(() => {});

module.exports = {
    run,
};
