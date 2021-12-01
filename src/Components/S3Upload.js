import S3FileUpload from 'react-s3';

export let S3config = {
    bucketName: `${process.env.REACT_APP_BUCKET_NAME}`,
    dirName: `${process.env.REACT_APP_DIR_NAME}`, /* optional */
    region: `${process.env.REACT_APP_REGION_NAME}`,
    accessKeyId: `${process.env.REACT_APP_ACCESS_KEY_ID}`,
    secretAccessKey: `${process.env.REACT_APP_SECRET_ACCESS_KEY}`
}
export let uploadImages = (file) => {
    
    return S3FileUpload.uploadFile(file, S3config);
        
}