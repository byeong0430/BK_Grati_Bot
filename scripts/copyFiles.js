const fs = require('fs')
const copyDir = require('copy-dir')
const path = require('path')

// To be run after transpiling the src directory to the build directory
// Non js/ts files are not copied with the Typescript compiler

fs.mkdirSync(__dirname + '/../dist/json')
copyDir.sync(__dirname + '/../src/json', __dirname + '/../dist/json')
