const multer = require('multer');
const crypto=require('crypto');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/uploads')
  },
  filename: function (req, file, cb) 
  {    
    crypto.randomBytes(16, function(err, buffer) {
	const filename=buffer.toString('hex')+file.originalname;
     cb(null, filename);
   });
  }
})
const upload = multer({ storage: storage });
const cpUpload = upload.any();

module.exports={upload,cpUpload};


