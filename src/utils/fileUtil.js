// src/utils/fileUtil.js
const fs = require('fs');
const path = require('path');

function createTempDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

module.exports = {
    createTempDir
};
