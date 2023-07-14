const multer = require('multer')
const path = require('path')

// Specifies where the uploaded files will be saved and how they should be named
const storage = multer.diskStorage({
    // Specifies the directory where the files will be saved
    // Absolute path to the 'uploads' directory
    destination: path.join(__dirname, '../uploads'),
    // Defines the name of the uploaded file
    // Generate unique name for each file using the current timestamp concatenated with original filename
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}=${file.originalname}`)
    }
})

const uploadPic = multer({
    // Specifies the storage configuration defined above
    storage,
    // Sets limits for the uploaded file -> max file size
    limits: {
        fileSize: 1 * 1000000 // 1 MB
    },
    // Provides a function to filter which files are accepted and uploaded
    fileFilter: (req, file, cb) => {
        // Check the file extension
        const ext = path.extname(file.originalname)
        // If it doesn't meet the requirements, return an error message via callback (cb)
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
            return cb("Only images are allowed")
        }
        // Otherwise, call back null as first argument and true second argument to indicate file is accepted
        cb(null, true)
    }
})

module.exports = {uploadPic}