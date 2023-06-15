import fs from 'fs'
import path from 'path'

const fileRemover = (filename) => {
    fs.unlink(path.join(__dirname, "../uploads", filename), function (err) {
        if(err && err.code === "ENOENT") {
            // the file doesn't exist
            console.log(`File ${filename} does not exist`)
        }
        else if (err) {
            console.log(err.message)
            console.log(`Error occured while trying to delete file ${filename}`)
        }
        else {
            console.log(`File ${filename} removed`)
        }
    })
}

export {fileRemover}