import { google } from 'googleapis';
// Authenticate using OAuth 2.0
// import path from "path"
// const KEY_FILE_PATH = path.join("cred.json");
// console.log(KEY_FILE_PATH)

const auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_DRIVE_CRED, // Path to your OAuth 2.0 credentials file
    scopes: ['https://www.googleapis.com/auth/drive'] // Scope for Google Drive API
  });
  // Create a new Google Drive client
  const drive = google.drive({ version: 'v3', auth });
export const uploadFileToDrive = async (fileBuffer, fileName) => {
    try {
        // Check if the file already exists in Google Drive
        const fileList = await drive.files.list({
            q: `name = '${fileName}' and mimeType = 'application/vnd.google-apps.spreadsheet'`,
            fields: 'files(id)'
        });
        console.log("fileList:   ",fileList.data.files);
        let fileId;
        if (fileList.data.files.length > 0) {
            fileId = fileList.data.files[0].id;
        } else {
            // Create a new Google Sheets file if it doesn't exist
            const newFileMetadata = {
                name: fileName,
                mimeType: 'application/vnd.google-apps.spreadsheet'
            };
            const newFile = await drive.files.create({
                resource: newFileMetadata,
                fields: 'id'
            });
            fileId = newFile.data.id;
        }

        // Upload the file buffer to Google Drive
        const data = await drive.files.update({
            fileId: fileId,
            media: {
                mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                body: fileBuffer
            },
            uploadType: 'multipart',
            fields: 'id'
        });


        console.log('File uploaded and sheets appended successfully.', data);
    } catch (error) {
        console.error('Error uploading and appending sheets:', error);
        throw error;
    }
};