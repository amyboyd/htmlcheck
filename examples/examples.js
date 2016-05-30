#!/usr/bin/env node

const htmlcheck = require('../src/index.js');

/**
 * Check that every <button> and <a class="button"> have an icon and an aria-label.
 */
htmlcheck
    .forElements('button')
    .forElements('a.button')
    .inFile('examples/buttons-example.html')
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

/**
 * Check that every <button> and <a> have one of 'href', 'ng-href', or 'ng-click'.
 */
htmlcheck
    .forElements('button')
    .forElements('a')
    .inFile('examples/angular-links-example.html')
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
