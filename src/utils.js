'use strict';

const glob = require('glob');

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

module.exports = {
    resolveGlobs,
    copyObject,
    escapeRegExp,
    rightTrim,
    getUniqueAndSortedPaths,
};
