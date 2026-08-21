const express = require('express');
const fs = require('fs');
const multer = require('multer');
const path = require('path');

const app = express();

const labs = {
    ai: 'AI-Lab',
    cn: 'CN-Lab',
    fsd: 'FSD-II',
    tinkering: 'Tinkering-Lab'
};

/* -------------------- CREATE LAB FOLDERS -------------------- */

Object.values(labs).forEach((lab) => {
    fs.mkdirSync(path.join('pdfs', lab), { recursive: true });
});

/* -------------------- MULTER STORAGE -------------------- */

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        const lab = labs[req.params.lab];

        if (!lab) {
            return cb(new Error('Invalid lab selected'));
        }

        const uploadPath = path.join('pdfs', lab);

        cb(null, uploadPath);
    },

    filename: (req, file, cb) => {

        const safeName = path.basename(file.originalname);

        cb(null, safeName);
    }
});

/* -------------------- PDF UPLOAD CONFIGURATION -------------------- */

const upload = multer({

    storage: storage,

    fileFilter: (req, file, cb) => {

        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        }
        else {
            cb(new Error('Only PDF files are allowed!'));
        }
    }
});

/* -------------------- STATIC FILES -------------------- */

app.use(express.static('public'));

app.use('/pdfs', express.static('pdfs'));

/* -------------------- TEACHER UPLOAD -------------------- */

app.post(
    '/upload/:lab',
    upload.single('pdf'),
    (req, res) => {

        res.redirect('/teacher');
    }
);

/* -------------------- TEACHER DASHBOARD -------------------- */

app.get('/teacher', (req, res) => {

    const labSections = Object.entries(labs)
        .map(([key, lab]) => {

            const labPath = path.join('pdfs', lab);

            const files = fs.readdirSync(labPath)
                .filter(file =>
                    file.toLowerCase().endsWith('.pdf')
                );

            const pdfList = files.length
                ? `
                    <ul class="pdf-list">
                        ${files.map(file => `
                            <li class="pdf-item">

                                <span class="pdf-name">
                                    ${file}
                                </span>

                                <a
                                    class="open-btn"
                                    href="/pdfs/${encodeURIComponent(lab)}/${encodeURIComponent(file)}"
                                >
                                    Open PDF
                                </a>

                            </li>
                        `).join('')}
                    </ul>
                `
                : `
                    <p class="empty">
                        No PDFs available.
                    </p>
                `;

            return `
                <div class="card">

                    <h2>📁 ${lab}</h2>

                    ${pdfList}

                </div>
            `;

        })
        .join('');


    res.send(`

        <!DOCTYPE html>

        <html>

        <head>

            <title>Teacher Dashboard</title>

            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
            >

            <link
                rel="stylesheet"
                href="/style.css"
            >

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

                        <form
                            id="uploadForm"
                            method="POST"
                            enctype="multipart/form-data"
                        >

                            <label for="lab">
                                Select Lab
                            </label>

                            <br><br>


                            <select
                                id="lab"
                                name="lab"
                                required
                            >

                                <option value="">
                                    -- Select Lab --
                                </option>

                                <option value="ai">
                                    AI Lab
                                </option>

                                <option value="cn">
                                    CN Lab
                                </option>

                                <option value="fsd">
                                    FSD-II
                                </option>

                                <option value="tinkering">
                                    Tinkering Lab
                                </option>

                            </select>

                            <br><br>


                            <input
                                class="file-input"
                                type="file"
                                name="pdf"
                                accept="application/pdf"
                                required
                            >

                            <br><br>


                            <button type="submit">
                                Upload PDF
                            </button>

                        </form>

                    </div>

                </div>


                <div class="header">

                    <h2>Uploaded PDF Resources</h2>

                </div>


                ${labSections}


                <div class="footer">

                    Classroom PDF Share

                </div>

            </div>


            <script>

                const uploadForm =
                    document.getElementById('uploadForm');

                const labSelect =
                    document.getElementById('lab');


                uploadForm.addEventListener(
                    'submit',
                    function () {

                        const selectedLab =
                            labSelect.value;

                        if (!selectedLab) {

                            alert(
                                'Please select a lab.'
                            );

                            return;

                        }

                        uploadForm.action =
                            '/upload/' +
                            selectedLab;

                    }
                );

            </script>

        </body>

        </html>

    `);

});
/* -------------------- STUDENT PORTAL -------------------- */

app.get('/student', (req, res) => {

    res.send(`

        <!DOCTYPE html>

        <html>

        <head>

            <title>Student Portal</title>

            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
            >

            <link
                rel="stylesheet"
                href="/style.css"
            >

        </head>


        <body>

            <div class="container">

                <div class="header">

                    <h1>Classroom PDF Share</h1>

                    <p>Student Portal</p>

                </div>


                <div class="card">

                    <h2>Select Lab</h2>


                    <ul class="pdf-list">

                        <li>

                            <a href="/student/ai">

                                AI Lab

                            </a>

                        </li>


                        <li>

                            <a href="/student/cn">

                                CN Lab

                            </a>

                        </li>


                        <li>

                            <a href="/student/fsd">

                                FSD-II

                            </a>

                        </li>


                        <li>

                            <a href="/student/tinkering">

                                Tinkering Lab

                            </a>

                        </li>

                    </ul>

                </div>


                <div class="footer">

                    Classroom PDF Share

                </div>

            </div>

        </body>

        </html>

    `);

});

/* -------------------- STUDENT LAB PDF LIST -------------------- */

app.get('/student/:lab', (req, res) => {

    const lab = labs[req.params.lab];

    if (!lab) {

        return res.status(404).send('Lab not found');

    }


    const labPath =
        path.join('pdfs', lab);


    const files =
        fs.readdirSync(labPath);


    const pdfList = files

        .filter(file =>
            file.toLowerCase().endsWith('.pdf')
        )

        .map(file => `

            <li class="pdf-item">

                <span class="pdf-name">

                    ${file}

                </span>


                <a
                    class="open-btn"
                    href="/pdfs/${encodeURIComponent(lab)}/${encodeURIComponent(file)}"
                >

                    Open PDF

                </a>

            </li>

        `)

        .join('');


    res.send(`

        <!DOCTYPE html>

        <html>

        <head>

            <title>${lab}</title>

            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
            >

            <link
                rel="stylesheet"
                href="/style.css"
            >

        </head>


        <body>

            <div class="container">

                <div class="header">

                    <h1>Classroom PDF Share</h1>

                    <p>${lab}</p>

                </div>


                <div class="card">

                    <h2>Available PDFs</h2>


                    ${

                        pdfList

                            ? `<ul class="pdf-list">
                                ${pdfList}
                               </ul>`

                            : `<p class="empty">
                                No PDFs available.
                               </p>`

                    }

                </div>


                <div class="card">

                    <a
                        class="open-btn"
                        href="/student"
                    >

                        Back to Labs

                    </a>

                </div>


                <div class="footer">

                    Classroom PDF Share

                </div>

            </div>

        </body>

        </html>

    `);

});

/* -------------------- SERVER -------------------- */

app.listen(3000, '0.0.0.0', () => {

    console.log(
        'Server is running on port 3000'
    );

});