const express = require('express');
const fs = require('fs');
const multer = require('multer');
const storage = multer.diskStorage({ 
    destination: "pdfs/",
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) =>{
        if(file.mimetype === 'application/pdf'){
            cb(null, true);
        }
        else{
            cb(new Error('Only PDF files are allowed!'));
        }
    }
});
const app = express();
app.use(express.static("public"));
app.use("/pdfs", express.static("pdfs"));
app.post("/upload", 
    upload.single("pdf"),
    (req,res) => {
        res.redirect("/teacher");
    }
)
app.get('/teacher', (req, res)=> {
    const files = fs.readdirSync('pdfs');
    const pdfList = files.filter(file => file.endsWith('.pdf')).map(file => `<li><a href="/pdfs/${file}">${file}</a></li>`).join("");
    
        res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Teacher Dashboard</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="/style.css">
    </head>

    <body>
        <div class="container">

            <div class="header">
                <h1>Classroom PDF Share</h1>
                <p>Teacher Dashboard</p>
            </div>

            <div class="card">
                <h2>Upload PDF</h2>

                <div class="upload-box">
                    <form action="/upload" method="POST" enctype="multipart/form-data">
                        <input
                            class="file-input"
                            type="file"
                            name="pdf"
                            accept="application/pdf"
                            required
                        >

                        <br>

                        <button type="submit">
                            Upload PDF
                        </button>
                    </form>
                </div>
            </div>

            <div class="card">
                <h2>Available PDFs</h2>

                ${
                    pdfList
                        ? `<ul class="pdf-list">${pdfList}</ul>`
                        : `<p class="empty">No PDFs available.</p>`
                }
            </div>

            <div class="footer">
                Classroom PDF Share
            </div>

        </div>
    </body>
    </html>
            `);
   
    
});
app.get('/student', (req, res) => {

    const files = fs.readdirSync('pdfs');

    const pdfList = files
        .filter(file => file.endsWith('.pdf'))
        .map(file => `
            <li class="pdf-item">
                <span class="pdf-name">${file}</span>

                <a
                    class="open-btn"
                    href="/pdfs/${file}"
                >
                    Open PDF
                </a>
            </li>
        `)
        .join("");

    res.send(`
        <!DOCTYPE html>
        <html>

        <head>
            <title>Student PDFs</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="/style.css">
        </head>

        <body>

            <div class="container">

                <div class="header">
                    <h1>Classroom PDF Share</h1>
                    <p>Student Portal</p>
                </div>

                <div class="card">
                    <h2>Available PDFs</h2>

                    ${
                        pdfList
                            ? `<ul class="pdf-list">${pdfList}</ul>`
                            : `<p class="empty">No PDFs available.</p>`
                    }

                </div>

                <div class="footer">
                    Classroom PDF Share
                </div>

            </div>

        </body>

        </html>
    `);
});
app.listen(3000, "0.0.0.0", ()=> {
    console.log("Server is running on port 3000");
});