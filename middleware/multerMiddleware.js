import multer from 'multer'; //`multer` library, which is a middleware for uploading files
/**
 * Configuring `multer` to use disk storage
 */
const storage = multer.diskStorage({
  destination: (req, file, cd) => {
    // `destination` is a function that determines the folder where the files should be stored
    cd(null, 'public/uploads');
  },
  filename: (req, file, cd) => {
    const fileName = file.originalname;
    cd(null, fileName);
  },
});

const uploadMulter = multer({ storage }); //creating `multer` instance that specifies the storage configuration

export default uploadMulter;
