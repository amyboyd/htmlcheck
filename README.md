htmlcheck
=========

Check HTML files for certain DOM structures and requirements. For example, does your website require
every `<button>` and `<a class="button">` to contain an icon element, like `<i class="icon ...">`?
You can use `htmlcheck` to validate that your HTML files all follow this rule.

Installation
------------

```
npm install htmlcheck
```

Examples
--------

**Check that every `<button>` and `<a class="button">` have an icon and an aria-label.**

```js
htmlcheck
    .forElements('button')
    .forElements('a.button')
    .inDir('src/templates')
    .test(function(button) {
        const icons = button.querySelectorAll('i.icon, span.icon');
        if (icons.length !== 1) {
            throw `Button with text "${button.textContent.trim()}" has ${icons.length} icons, should have one`;
        }
    })
    .test(function(button) {
        if (!button.hasAttribute('aria-label')) {
            throw `Button with text "${button.textContent.trim()}" does not have aria-label attribute; add this for screen readers`;
        }
    });
```

**Check that every `<button>` and `<a>` have one of 'href', 'ng-href', or 'ng-click'.**

```js
htmlcheck
    .forElements('a')
    .forElements('button')
    .inGlob('src/**/*.html')
    .test(function(link) {
        function isAttributeOk(attribute) {
            const value = link.getAttribute(attribute);
            return typeof value === "string" && value.length > 0;
        };

        const isOk = isAttributeOk('href') || isAttributeOk('ng-href') || isAttributeOk('ng-click');

        if (!isOk) {
            throw `Link with text "${link.textContent.trim()}" has no action; add one of "href", "ng-href" or "ng-click"`;
        }
    });
```

Run the file `examples/examples.js` to see these in action.

API
---

* `.forElements(querySelector)` - Adds elements found by the given query selector to the test, for example `.forElements('a.button')`
* `.inDir(dir)` - Adds files found in the given directory to the test, for example `.inDir('src/templates')`
* `.inFile(path)` - Adds the given file to the test, for example `.inFile('src/templates/index.html')`
* `.inGlob(glob)` - Adds files found by the given glob to the test, for example `.inGlob('src/**/*.html')`
* `.test(testFunction)` - Tests the files and query selectors with the given function, which should throw an error if the test fails. The test function is given an element with a DOM-like API, for example you can call `.querySelector()` or `.getAttribute()` on the element.

Tests
-----

To execute the tests, run `tests/run-examples.py`

To execute the examples script, run `node examples/examples.js`
