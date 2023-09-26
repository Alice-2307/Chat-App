const AWS = require("aws-sdk");

exports.uploadtoS3 = (file, filename) =>{

    const bucketName = process.env.BUCKET_NAME;
    const iAmUserKey = process.env.IAM_USER_KEY;
    const iAmUserSecretKey = process.env.IAM_USER_SECRET;

    const s3Bucket = new AWS.S3({
        accessKeyId: iAmUserKey,
        secretAccessKey: iAmUserSecretKey
    })
        let params = {
            Bucket: bucketName,
            Key: filename,
            Body: file.buffer,
            ACL: 'public-read'
        }
        
        return new Promise((resolve, reject) => {
        s3Bucket.upload(params, (err, s3response) => {
            if(err){
                console.log("something went wrong", err);
                reject(err);
            }
            else{
                resolve(s3response.Location)
            }
        })
    })

}