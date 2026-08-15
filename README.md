# Classroom PDF Share

An offline LAN-based web application for sharing PDF resources in a classroom or computer laboratory environment.

## Overview

Classroom PDF Share is a lightweight web application developed using **Node.js** and **Express.js** to allow teachers to upload PDF resources and students to access those resources through a web browser.

The application is designed for use over a **local network**, so active Internet connectivity is not required for communication between the server and connected client devices.

A single computer acts as the server and hosts the PDF resources locally. Teachers can upload PDF files through the Teacher Dashboard, while students can access the available PDFs through the Student Portal.

## Problem

In computer laboratory environments, distributing the same PDF manuals or experiment resources to multiple systems can be inconvenient when Internet access is restricted or unavailable.

This project provides a simple local web-based approach for making PDF resources available to multiple devices connected to the same network.

## Features

* Teacher PDF upload through a web interface
* PDF file type validation
* Local PDF storage
* Separate Teacher and Student interfaces
* Browser-based PDF access
* Local network operation
* No database required
* No active Internet connection required for local communication
* Lightweight Node.js and Express.js server

## How It Works

```text
                    Local Network
                         │
                         │
                ┌────────▼────────┐
                │   Server PC     │
                │ Node.js/Express │
                └────────┬────────┘
                         │
              ┌──────────┴──────────┐
              │                     │
       /teacher                 /student
              │                     │
        Teacher Dashboard      Student Portal
              │                     │
              ▼                     ▼
        Upload PDF             View PDFs
              │
              ▼
          pdfs/ folder
```

The server stores uploaded PDF files in the local `pdfs` directory and serves them through the `/pdfs` route.

## Application Routes

| Route              | Purpose                 |
| ------------------ | ----------------------- |
| `/teacher`         | Teacher Dashboard       |
| `/student`         | Student Portal          |
| `/upload`          | Handles PDF upload      |
| `/pdfs/<filename>` | Serves stored PDF files |

## Technologies Used

### Backend

* **Node.js** — JavaScript runtime environment
* **Express.js** — Web application framework
* **Multer** — Handles multipart/form-data and PDF file uploads

### Frontend

* HTML
* CSS
* JavaScript generated through server-side HTML responses

### Storage

* Local file system
* PDF files are stored inside the `pdfs/` directory

## Requirements

Before running the project, install:

* Node.js
* npm
* A modern web browser
* A local network connection for multi-device testing

## Installation

### 1. Clone the repository

```bash
git clone <REPOSITORY_URL>
```

### 2. Open the project directory

```bash
cd Classroom-PDF-Share-Deployment
```

### 3. Install dependencies

```bash
npm install
```

This installs the dependencies specified in `package.json`.

## Running the Server

Start the server using:

```bash
node server.js
```

When the server starts successfully, the terminal displays:

```text
Server is running on port 3000
```

The server listens on:

```text
0.0.0.0:3000
```

This allows the application to accept connections through the server computer's network interfaces.

## Accessing the Application

### On the Server Computer

Open a browser and visit:

```text
http://localhost:3000/teacher
```

for the Teacher Dashboard.

For the Student Portal:

```text
http://localhost:3000/student
```

### From Another Device on the Same LAN

Find the server computer's local IPv4 address.

On Windows:

```bash
ipconfig
```

Then access the appropriate route using:

```text
http://<SERVER-IP>:3000/teacher
```

or:

```text
http://<SERVER-IP>:3000/student
```

Example:

```text
http://192.168.1.10:3000/student
```

The IP address shown above is only an example. Use the actual IPv4 address assigned to the server computer.

## Teacher Workflow

1. Open the Teacher Dashboard.
2. Select a PDF file.
3. Click **Upload PDF**.
4. The PDF is stored in the local `pdfs` directory.
5. The available PDF list is updated.
6. The uploaded PDF can be opened from the dashboard.

## Student Workflow

1. Open the Student Portal.
2. View the list of available PDF resources.
3. Select **Open PDF** for the required resource.
4. The PDF is served from the local server.

## Offline LAN Operation

The application is designed to operate without active Internet connectivity.

For local operation:

```text
Server PC
    │
    │ Local Network
    │
 ┌──┴───────────────┐
 │                  │
Client PC 1      Client PC 2
```

The server and client devices only need to be able to communicate over the same local network.

**Important:** No claim is made here about permanent deployment on a specific institutional laboratory network. Institutional LAN testing is treated separately from local prototype testing.

## Project Structure

```text
Classroom-PDF-Share-Deployment/
│
├── pdfs/
│   └── .gitkeep
│
├── public/
│   └── style.css
│
├── .gitignore
├── package.json
├── package-lock.json
├── server.js
├── start-server.bat
└── README.md
```

## Testing

The project has been tested in a local network environment with Internet/mobile data disabled.

The test verified local client-server communication and access to the hosted PDF resources without active Internet connectivity.

Further testing on an institutional computer-laboratory LAN may be performed subject to the required permission.

## Limitations

* No user authentication is currently implemented.
* Teacher and student access are separated through URL routes rather than login credentials.
* PDF files are stored locally on the server computer.
* The application currently focuses on PDF resources.
* The system has not yet been permanently deployed in an institutional laboratory environment.
* Multi-device testing on a specific institutional LAN remains subject to network configuration and permission.

## Future Enhancements

Possible future improvements include:

* Teacher authentication
* Student authentication
* Database integration
* PDF deletion and management
* Search and filtering of resources
* Resource categorization by subject or experiment
* Improved access control
* Deployment on an institutional LAN
* Activity and access monitoring

## Author

**TATAPUDI ANIRUDH KARTHIK**

B.Tech — Computer Science and Engineering
Rayalaseema University College of Engineering


