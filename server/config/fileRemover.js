const fs = require('fs')
const path = require('path')

// filename parameter is used to construct the file path using 'path.join' to ensure proper file path handling
const fileRemover = (filename) => {
    const filePath = path.join(__dirname, "../uploads", filename)
    // used to remove file asynchronously
    fs.unlink(filePath, (err) => {
        if (err) {
            // ENOENT code indicates that file doesn't exist
            if (err.code === "ENOENT") {
                console.log(`File ${filename} doesn't exist, won't remove it.`)
            }
            else {
                console.log(err.message);
                console.error(`Error occured while trying to remove file ${filename}`)
            }
        }
        // If the file is successfully removed, success message is logged
        else {
            console.log(`Removed ${filename}`)
        }
    })
}

module.exports = {fileRemover}