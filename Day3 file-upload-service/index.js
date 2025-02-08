const express = require('express');
const app = express();
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const File = require('./models/file-model');
const connectDb = require('./db/db');
connectDb();
require('dotenv').config();


app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
    fileFilter: (req, file, cb) => {
        // Add file type validation here if needed
        cb(null, true);
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
})


app.post('/api/upload', upload.single('file'), async (req, res) => {
    try {
        const file = new File({
            filename: req.file.filename,
            originalName: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size
        });
        await file.save();
        res.json(file);
    } catch (error) {
        res.status(500).json({ error: 'Upload failed' });
    }
});

app.get('/api/files', async (req, res) => {
    try {
        const files = await File.find().sort({ uploadDate: -1 });
        res.json(files);
    } catch (error) {
        res.status(500).json({ error: 'Could not fetch files' });
    }
});


app.listen(3000,()=>{
    console.log('Server is running on port 3000');
})