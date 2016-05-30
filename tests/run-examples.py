#!/usr/bin/env python3

import subprocess
import sys

print('Running examples/examples.js')
process = subprocess.Popen(['node', 'examples/examples.js'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
process.wait()
stdout = process.stdout.read().decode('utf-8')
stderr = process.stderr.read().decode('utf-8')

expectedLinesUnsorted = [
    'File "examples/angular-links-example.html": Selector "a": Link with text "Empty link action 1" has no action; add one of "href", "ng-href" or "ng-click"',
    'File "examples/angular-links-example.html": Selector "a": Link with text "Empty link action 2" has no action; add one of "href", "ng-href" or "ng-click"',
    'File "examples/angular-links-example.html": Selector "button": Link with text "Empty link action 3" has no action; add one of "href", "ng-href" or "ng-click"',
    'File "examples/buttons-example.html": Selector "a.button": Button with text "Edit" does not have aria-label attribute; add this for screen readers',
    'File "examples/buttons-example.html": Selector "button": Button with text "Delete" does not have aria-label attribute; add this for screen readers',
    'File "examples/buttons-example.html": Selector "button": Button with text "Delete" has 0 icons, should have one',
    'File "examples/buttons-example.html": Selector "button": Button with text "X" has 0 icons, should have one',
]
for expectedLine in expectedLinesUnsorted:
    if not expectedLine in stderr:
        print('Expected to see line in stderr, but was not present: ' + expectedLine)
        sys.exit(1)

if stdout != '':
    print('Expected stdout to be empty, but was: ' + stdout)
    sys.exit(1)

print('Passed')
sys.exit(0)
