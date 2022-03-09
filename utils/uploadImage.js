const cloudinary = require('cloudinary').v2
const { Readable } = require('stream')

const bufferUpload = async (buffer) => {
    return new Promise((resolve, reject) => {
        const writeStream = cloudinary.uploader.upload_stream((err, result) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(result);
        });
        const readStream = new Readable({
            read() {
                this.push(buffer);
                this.push(null);
            },
        });
        readStream.pipe(writeStream);
    });
};

module.exports ={bufferUpload}