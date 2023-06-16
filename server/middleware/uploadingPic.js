const multer = require('multer')
const path = require('path')

// where the files will be saved
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../uploads"))
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}=${file.originalname}`)
    }
})

const uploadPic = multer({
    storage: storage,
    limits: {
        fileSize: 1 * 1000000 // 1MB
    },
    fileFilter: function(req, file, cb) {
        let ext = path.extname(file.originalname)
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
            return cb("Only images are allowed")
        }
        cb(null, true)
    }
})

module.exports = {uploadPic}