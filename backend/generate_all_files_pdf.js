const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const frontendDir = path.join(rootDir, "frontend");
const backendDir = path.join(rootDir, "backend");

// Folders to ignore
const IGNORE_DIRS = new Set([
  "node_modules",
  ".git",
  "dist",
  "build",
  ".vscode",
  "android",
  "uploads",
  "StudentLearningApp_CURRENT_BACKUP",
  "assets"
]);

const ALLOWED_EXTS = new Set([
  ".js",
  ".jsx",
  ".json",
  ".css",
  ".html",
  ".md",
  ".yml",
  ".yaml",
  ".example"
]);

function getFilesRecursively(dir, baseDir = dir) {
  let results = [];
  try {
    const list = fs.readdirSync(dir);
    for (const file of list) {
      const fullPath = path.join(dir, file);
      const relPath = path.relative(baseDir, fullPath).replace(/\\/g, "/");
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        if (!IGNORE_DIRS.has(file)) {
          results = results.concat(getFilesRecursively(fullPath, baseDir));
        }
      } else {
        const ext = path.extname(file);
        const isEnv = file.startsWith(".env");
        const isDockerfile = file === "Dockerfile";

        if (ALLOWED_EXTS.has(ext) || isEnv || isDockerfile) {
          if (!file.endsWith("package-lock.json") && !file.endsWith(".log") && !file.endsWith(".exe") && file !== "a.exe") {
            results.push({
              fullPath,
              relPath,
              size: stat.size,
              name: file,
              category: relPath.startsWith("backend") ? "Backend" : relPath.startsWith("frontend") ? "Frontend" : "Root Config"
            });
          }
        }
      }
    }
  } catch (err) {
    console.error("Error reading dir:", err.message);
  }
  return results;
}

function generateCompletePDF(outputPath) {
  console.log(`Starting PDF compilation to: ${outputPath}...`);

  const doc = new PDFDocument({
    margin: 40,
    size: "A4",
    bufferPages: true,
  });

  const stream = fs.createWriteStream(outputPath);
  doc.pipe(stream);

  // Styling Palette
  const primaryColor = "#db2777";    // Tailwind pink-600
  const secondaryColor = "#4f46e5";  // Tailwind indigo-600
  const darkBg = "#0f172a";          // Slate 900
  const textColor = "#1e293b";        // Slate 800
  const mutedText = "#64748b";        // Slate 500
  const borderLight = "#e2e8f0";      // Slate 200

  function drawHeaderBanner(title, subtitle) {
    doc.rect(0, 0, 595, 110).fill(darkBg);
    doc
      .fillColor("#ffffff")
      .fontSize(22)
      .font("Helvetica-Bold")
      .text("KATALYST", 40, 28, { continued: true })
      .fillColor(primaryColor)
      .text(".", { continued: false });

    doc
      .fillColor("#e2e8f0")
      .fontSize(11)
      .font("Helvetica")
      .text(title, 40, 58);

    doc
      .fillColor("#94a3b8")
      .fontSize(8.5)
      .text(`Generated: ${new Date().toLocaleDateString()} | ${subtitle}`, 40, 78);

    doc.y = 130;
  }

  function addSectionHeading(title) {
    if (doc.y > 680) doc.addPage();
    doc.moveDown(0.5);
    doc
      .fillColor(primaryColor)
      .fontSize(14)
      .font("Helvetica-Bold")
      .text(title)
      .moveDown(0.2);

    doc
      .strokeColor(primaryColor)
      .lineWidth(1.5)
      .moveTo(40, doc.y)
      .lineTo(555, doc.y)
      .stroke()
      .moveDown(0.5);
  }

  function addSubHeading(title) {
    if (doc.y > 700) doc.addPage();
    doc
      .fillColor(secondaryColor)
      .fontSize(11)
      .font("Helvetica-Bold")
      .text(title)
      .moveDown(0.3);
  }

  // --- COVER / TITLE PAGE ---
  doc.rect(0, 0, 595, 842).fill(darkBg);

  doc
    .fillColor("#ffffff")
    .fontSize(36)
    .font("Helvetica-Bold")
    .text("KATALYST", 50, 180, { continued: true })
    .fillColor(primaryColor)
    .text(".", { continued: false });

  doc
    .fillColor("#f472b6")
    .fontSize(18)
    .font("Helvetica-Bold")
    .text("Full-Stack Learning & Mentorship Platform", 50, 235);

  doc
    .fillColor("#cbd5e1")
    .fontSize(12)
    .font("Helvetica")
    .text("Complete Source Code, System Architecture & File Documentation", 50, 265, { width: 495 });

  doc
    .strokeColor(primaryColor)
    .lineWidth(2)
    .moveTo(50, 310)
    .lineTo(545, 310)
    .stroke();

  // Cover stats box
  const allFiles = getFilesRecursively(rootDir, rootDir);
  const backendFiles = allFiles.filter(f => f.category === "Backend");
  const frontendFiles = allFiles.filter(f => f.category === "Frontend");

  doc
    .rect(50, 340, 495, 140)
    .fillAndStroke("#1e293b", "#334155");

  doc
    .fillColor("#ffffff")
    .fontSize(11)
    .font("Helvetica-Bold")
    .text("PROJECT SUMMARY METRICS", 70, 360);

  const metrics = [
    ["Platform Version:", "2.0.0 (Production Architecture)", "Backend Framework:", "Node.js 20+ / Express.js 5"],
    ["Frontend Stack:", "React 19, Vite, Tailwind CSS", "Database:", "MongoDB Atlas (Mongoose ORM)"],
    ["Total Source Files:", `${allFiles.length} files included`, "Security:", "JWT Authentication & RBAC"],
    ["Frontend Files:", `${frontendFiles.length} modules & views`, "Backend Files:", `${backendFiles.length} controllers, routes, models`]
  ];

  let mY = 385;
  metrics.forEach(m => {
    doc.font("Helvetica-Bold").fontSize(9).fillColor("#94a3b8").text(m[0], 70, mY, { width: 110 });
    doc.font("Helvetica").fontSize(9).fillColor("#f8fafc").text(m[1], 180, mY, { width: 140 });
    doc.font("Helvetica-Bold").fontSize(9).fillColor("#94a3b8").text(m[2], 330, mY, { width: 100 });
    doc.font("Helvetica").fontSize(9).fillColor("#f8fafc").text(m[3], 430, mY, { width: 110 });
    mY += 20;
  });

  doc
    .fillColor("#94a3b8")
    .fontSize(9.5)
    .font("Helvetica")
    .text(`Compiled on: ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`, 50, 720)
    .text("Confidential & Proprietary - Katalyst Development Team", 50, 735);

  // --- PAGE 2: TABLE OF CONTENTS & EXECUTIVE SUMMARY ---
  doc.addPage();
  drawHeaderBanner("Executive Summary & Table of Contents", "System Overview");

  addSectionHeading("1. Executive Summary");
  doc
    .fillColor(textColor)
    .fontSize(9.5)
    .font("Helvetica")
    .text(
      "Katalyst is a full-stack educational and mentorship platform engineered to connect students with professional mentors while facilitating structured technical training and career acceleration. The application features three distinct role-based portals (Student, Mentor, Admin), comprehensive training tracks with video lessons and quizzes, 1-on-1 meeting scheduling with Google Meet links, real-time notification drawers, AI-assisted career roadmaps, and resume evaluation.",
      { align: "justify", lineGap: 3 }
    )
    .moveDown(1);

  addSectionHeading("2. Document Table of Contents");

  const tocItems = [
    ["Section 1", "Executive Summary & System Architecture", "High-level overview & system design"],
    ["Section 2", "Technology Stack & Layer Mapping", "Frontend, backend, database, and auth stack"],
    ["Section 3", "Complete File Directory Inventory", "All project files categorized with paths & sizes"],
    ["Section 4", "Backend Architecture & Data Models", "Mongoose schemas, controllers, and REST routes"],
    ["Section 5", "Frontend Architecture & Portal Pages", "React components, state contexts, and routes"],
    ["Section 6", "API Reference & Access Control Matrix", "All REST endpoints, request/response models"],
    ["Section 7", "Complete Source Code Listings", "Full file contents and implementations"]
  ];

  let tocY = doc.y;
  doc.rect(40, tocY, 515, 20).fill("#f1f5f9");
  doc.font("Helvetica-Bold").fontSize(9).fillColor(darkBg);
  doc.text("Section", 50, tocY + 5, { width: 80 });
  doc.text("Topic", 130, tocY + 5, { width: 200 });
  doc.text("Coverage", 330, tocY + 5, { width: 215 });

  tocY += 20;
  doc.font("Helvetica").fontSize(8.5);
  tocItems.forEach((item, idx) => {
    const bg = idx % 2 === 0 ? "#ffffff" : "#f8fafc";
    doc.rect(40, tocY, 515, 18).fill(bg);
    doc.fillColor(primaryColor).font("Helvetica-Bold").text(item[0], 50, tocY + 4, { width: 80 });
    doc.fillColor(darkBg).font("Helvetica-Bold").text(item[1], 130, tocY + 4, { width: 200 });
    doc.fillColor(mutedText).font("Helvetica").text(item[2], 330, tocY + 4, { width: 215 });
    tocY += 18;
  });

  doc.y = tocY + 15;

  // --- PAGE 3: TECH STACK ARCHITECTURE ---
  doc.addPage();
  drawHeaderBanner("Technology Stack & Architecture", "Architecture Blueprint");

  addSectionHeading("3. Architecture & Technology Stack");

  const techStackDetails = [
    ["Frontend Core", "React 19.0.0 + Vite 8.2.0", "Fast modular SPA client with lightning HMR"],
    ["Styling Framework", "Tailwind CSS 3.4 + PostCSS", "Custom theme tokens, glassmorphism UI, Dark mode"],
    ["Routing & Nav", "React Router v7", "Declarative browser routing & protected role routes"],
    ["State Management", "React Context (Auth & Theme)", "Global authentication persistence & theme switches"],
    ["Data Visualization", "Recharts 2.15", "Interactive progress rings & readiness index charts"],
    ["Icons & UI", "Lucide React 1.31", "Feather-style SVG icon system across all portals"],
    ["Backend Runtime", "Node.js 20+ / Express 5.2", "Non-blocking RESTful API & middleware pipeline"],
    ["Database Store", "MongoDB Atlas / Mongoose 9.9", "Schema validation, indexing, and object relations"],
    ["Authentication", "JWT (jsonwebtoken 9.0) + bcryptjs", "Stateless bearer token authorization & password hashing"],
    ["AI Services", "Google Generative AI (Gemini 1.5)", "Resume analysis, personalized roadmaps & chat"],
    ["File Handling", "Multer Middleware", "Local disk storage for student PDF resumes"],
    ["Containerization", "Docker & Docker Compose", "Multi-stage build Dockerfiles for full-stack isolation"]
  ];

  let tsY = doc.y;
  doc.rect(40, tsY, 515, 20).fill("#fce7f3");
  doc.font("Helvetica-Bold").fontSize(9).fillColor(darkBg);
  doc.text("Layer", 50, tsY + 5, { width: 110 });
  doc.text("Technology", 160, tsY + 5, { width: 170 });
  doc.text("Role & Purpose", 330, tsY + 5, { width: 215 });

  tsY += 20;
  doc.font("Helvetica").fontSize(8);
  techStackDetails.forEach((row, idx) => {
    const bg = idx % 2 === 0 ? "#ffffff" : "#fdf2f8";
    doc.rect(40, tsY, 515, 17).fill(bg);
    doc.fillColor(primaryColor).font("Helvetica-Bold").text(row[0], 50, tsY + 4, { width: 110 });
    doc.fillColor(darkBg).font("Helvetica").text(row[1], 160, tsY + 4, { width: 170 });
    doc.fillColor(mutedText).font("Helvetica").text(row[2], 330, tsY + 4, { width: 215 });
    tsY += 17;
  });

  doc.y = tsY + 20;

  // --- COMPLETE DIRECTORY INVENTORY TABLE ---
  addSectionHeading("4. Complete File Inventory List");
  doc
    .fillColor(mutedText)
    .fontSize(8.5)
    .font("Helvetica")
    .text(`Total registered source and configuration files in this build: ${allFiles.length}`)
    .moveDown(0.5);

  let fileTableY = doc.y;
  doc.rect(40, fileTableY, 515, 18).fill("#f1f5f9");
  doc.font("Helvetica-Bold").fontSize(8.5).fillColor(darkBg);
  doc.text("Category", 48, fileTableY + 4, { width: 75 });
  doc.text("Relative File Path", 125, fileTableY + 4, { width: 310 });
  doc.text("Size", 445, fileTableY + 4, { width: 100, align: "right" });

  fileTableY += 18;
  doc.font("Helvetica").fontSize(7.5);

  allFiles.forEach((f, idx) => {
    if (fileTableY > 750) {
      doc.addPage();
      drawHeaderBanner("Complete File Inventory List (Cont.)", "File Inventory");
      fileTableY = doc.y;
      doc.rect(40, fileTableY, 515, 18).fill("#f1f5f9");
      doc.font("Helvetica-Bold").fontSize(8.5).fillColor(darkBg);
      doc.text("Category", 48, fileTableY + 4, { width: 75 });
      doc.text("Relative File Path", 125, fileTableY + 4, { width: 310 });
      doc.text("Size", 445, fileTableY + 4, { width: 100, align: "right" });
      fileTableY += 18;
      doc.font("Helvetica").fontSize(7.5);
    }

    const bg = idx % 2 === 0 ? "#ffffff" : "#f8fafc";
    doc.rect(40, fileTableY, 515, 15).fill(bg);

    const catColor = f.category === "Backend" ? secondaryColor : f.category === "Frontend" ? primaryColor : "#0d9488";
    doc.fillColor(catColor).font("Helvetica-Bold").text(f.category, 48, fileTableY + 3, { width: 75 });
    doc.fillColor(darkBg).font("Helvetica").text(f.relPath, 125, fileTableY + 3, { width: 310 });
    doc.fillColor(mutedText).text(`${(f.size / 1024).toFixed(1)} KB`, 445, fileTableY + 3, { width: 100, align: "right" });

    fileTableY += 15;
  });

  doc.y = fileTableY + 20;

  // --- SECTION 5: BACKEND DATA MODELS & SCHEMAS ---
  doc.addPage();
  drawHeaderBanner("Backend Data Models & Architecture", "Database Design");

  addSectionHeading("5. Database Models & Schema Specifications");

  const modelsSummary = [
    {
      name: "Student (models/Student.js)",
      fields: "name, email, password, role ('student'), bio, skills (Array), resumeUrl, assignedMentor (ObjectId ref 'Mentor'), targetRole, year, college",
      desc: "Stores learner profiles, credentials, skills matrix, resume links, and assigned mentor association."
    },
    {
      name: "Mentor (models/Mentor.js)",
      fields: "name, email, password, role ('mentor'), company, designation, expertise (Array), bio, assignedStudents (Array ref 'Student'), maxMentees, availability",
      desc: "Maintains industry professional mentor records, company background, mentee limits, and assigned learners."
    },
    {
      name: "Admin (models/Admin.js)",
      fields: "name, email, password, role ('admin'), permissions (Array), department, activeStatus",
      desc: "Superuser entity with full platform permissions to manage courses, assign mentors, and generate analytics."
    },
    {
      name: "Training (models/Training.js)",
      fields: "title, description, category, level, duration, thumbnail, modules (Array of {title, videos: [{title, youtubeUrl, duration, quiz}]}), enrolledStudents",
      desc: "Course catalog containing structured learning modules, video lessons, quiz assessments, and completion tracking."
    },
    {
      name: "Meeting (models/Meeting.js)",
      fields: "studentId, mentorId, title, agenda, scheduledDate, startTime, endTime, status ('pending'|'approved'|'rejected'|'completed'), meetLink, mentorNotes",
      desc: "1-on-1 mentor meeting requests, schedule slots, Google Meet links, mentor acceptance status, and post-session notes."
    },
    {
      name: "Progress (models/Progress.js)",
      fields: "studentId, trainingId, completedVideos (Array), quizScores (Array), placementReadiness (0-100), overallScore, certificateIssued (Boolean)",
      desc: "Tracks video lesson completions, quiz results, placement readiness formula index, and certificate milestones."
    },
    {
      name: "Notification (models/Notification.js)",
      fields: "recipientId, senderId, title, message, type ('meeting'|'course'|'system'), isRead, actionUrl, createdAt",
      desc: "In-app notifications delivering meeting approvals, course updates, feedback, and reminders to users."
    }
  ];

  modelsSummary.forEach(m => {
    if (doc.y > 660) {
      doc.addPage();
      drawHeaderBanner("Backend Data Models & Architecture (Cont.)", "Database Design");
    }
    addSubHeading(m.name);
    doc
      .rect(40, doc.y, 515, 45)
      .fillAndStroke("#f8fafc", borderLight);

    doc
      .fillColor(darkBg)
      .fontSize(8)
      .font("Helvetica-Bold")
      .text("Schema Fields:", 48, doc.y - 40)
      .font("Helvetica")
      .text(m.fields, 125, doc.y - 40, { width: 420 });

    doc
      .font("Helvetica-Bold")
      .text("Description:", 48, doc.y - 20)
      .font("Helvetica")
      .fillColor(mutedText)
      .text(m.desc, 125, doc.y - 20, { width: 420 });

    doc.y += 10;
  });

  // --- SECTION 6: API REFERENCE & ACCESS MATRIX ---
  doc.addPage();
  drawHeaderBanner("RESTful API Routes & Access Matrix", "API Endpoints");

  addSectionHeading("6. API Endpoints Reference");

  const fullApiList = [
    ["POST", "/api/auth/register", "Public", "Student registration with bcrypt hashing"],
    ["POST", "/api/auth/login", "Public", "Unified login for student, mentor, admin (JWT)"],
    ["GET", "/api/auth/me", "Auth", "Get active profile based on JWT token"],
    ["GET", "/api/students/profile", "Student", "Get current student profile & mentor details"],
    ["PUT", "/api/students/profile", "Student", "Update student bio, skills, and target role"],
    ["POST", "/api/students/resume", "Student", "Upload student resume PDF via Multer"],
    ["GET", "/api/trainings", "Public/Auth", "List all available trainings and courses"],
    ["GET", "/api/trainings/:id", "Auth", "Get course modules, lessons, and student progress"],
    ["POST", "/api/trainings/:id/enroll", "Student", "Enroll in a training track"],
    ["POST", "/api/trainings/:id/complete-video", "Student", "Mark video lesson completed & update progress"],
    ["POST", "/api/trainings/:id/submit-quiz", "Student", "Submit quiz responses & calculate score"],
    ["GET", "/api/meetings/student", "Student", "Get all meetings booked by student"],
    ["POST", "/api/meetings", "Student", "Book a new meeting with assigned mentor"],
    ["GET", "/api/meetings/mentor", "Mentor", "Get all meeting requests assigned to mentor"],
    ["PUT", "/api/meetings/:id/status", "Mentor", "Approve/Reject meeting and supply Meet link"],
    ["GET", "/api/notifications", "Auth", "Fetch user notifications list"],
    ["PUT", "/api/notifications/:id/read", "Auth", "Mark notification as read"],
    ["POST", "/api/ai/resume-analyze", "Student", "AI resume strength & improvement analysis"],
    ["POST", "/api/ai/career-roadmap", "Student", "AI personalized milestone career roadmap"],
    ["POST", "/api/ai/chatbot", "Auth", "AI chatbot assistant for student guidance"],
    ["GET", "/api/admin/stats", "Admin", "Fetch system-wide metrics, counts & analytics"],
    ["GET", "/api/admin/users", "Admin", "List and manage all registered users"]
  ];

  let apiY = doc.y;
  doc.rect(40, apiY, 515, 18).fill("#fce7f3");
  doc.font("Helvetica-Bold").fontSize(8.5).fillColor(darkBg);
  doc.text("Method", 48, apiY + 4, { width: 50 });
  doc.text("Endpoint Route", 100, apiY + 4, { width: 175 });
  doc.text("Role", 280, apiY + 4, { width: 70 });
  doc.text("Description", 355, apiY + 4, { width: 195 });

  apiY += 18;
  doc.font("Helvetica").fontSize(7.5);

  fullApiList.forEach((row, idx) => {
    if (apiY > 760) {
      doc.addPage();
      drawHeaderBanner("RESTful API Routes & Access Matrix (Cont.)", "API Endpoints");
      apiY = doc.y;
      doc.rect(40, apiY, 515, 18).fill("#fce7f3");
      doc.font("Helvetica-Bold").fontSize(8.5).fillColor(darkBg);
      doc.text("Method", 48, apiY + 4, { width: 50 });
      doc.text("Endpoint Route", 100, apiY + 4, { width: 175 });
      doc.text("Role", 280, apiY + 4, { width: 70 });
      doc.text("Description", 355, apiY + 4, { width: 195 });
      apiY += 18;
      doc.font("Helvetica").fontSize(7.5);
    }

    const bg = idx % 2 === 0 ? "#ffffff" : "#fdf2f8";
    doc.rect(40, apiY, 515, 15).fill(bg);

    const mColor = row[0] === "POST" ? "#0284c7" : row[0] === "GET" ? "#16a34a" : "#d97706";
    doc.fillColor(mColor).font("Helvetica-Bold").text(row[0], 48, apiY + 3, { width: 50 });
    doc.fillColor(darkBg).font("Helvetica").text(row[1], 100, apiY + 3, { width: 175 });
    doc.fillColor(primaryColor).font("Helvetica-Bold").text(row[2], 280, apiY + 3, { width: 70 });
    doc.fillColor(mutedText).font("Helvetica").text(row[3], 355, apiY + 3, { width: 195 });
    apiY += 15;
  });

  doc.y = apiY + 20;

  // --- SECTION 7: SOURCE CODE OF ALL FILES ---
  doc.addPage();
  drawHeaderBanner("Complete Source Code Listings", "Full Project Files");

  addSectionHeading("7. Complete Project Source Code");
  doc
    .fillColor(mutedText)
    .fontSize(8.5)
    .font("Helvetica")
    .text("The following sections contain the complete, verbatim source code for each file in the project organized by subsystem.")
    .moveDown(1);

  // Print all files with code
  allFiles.forEach((fileObj, fIdx) => {
    let content = "";
    try {
      content = fs.readFileSync(fileObj.fullPath, "utf-8");
    } catch (e) {
      content = `// Error reading file: ${e.message}`;
    }

    // New file header
    if (doc.y > 640) {
      doc.addPage();
      drawHeaderBanner("Source Code: " + fileObj.relPath, fileObj.category);
    }

    doc.moveDown(0.5);
    doc
      .rect(40, doc.y, 515, 24)
      .fill(darkBg);

    doc
      .fillColor("#ffffff")
      .fontSize(9.5)
      .font("Helvetica-Bold")
      .text(`File ${fIdx + 1} of ${allFiles.length}:  ${fileObj.relPath}`, 50, doc.y - 18, { continued: true })
      .fillColor("#94a3b8")
      .fontSize(8)
      .text(`  (${(fileObj.size / 1024).toFixed(1)} KB)`, { continued: false });

    doc.moveDown(0.6);

    // Print file lines
    const lines = content.split(/\r?\n/);
    doc.font("Courier").fontSize(7).fillColor("#1e293b");

    for (let i = 0; i < lines.length; i++) {
      if (doc.y > 770) {
        doc.addPage();
        drawHeaderBanner("Source Code: " + fileObj.relPath + " (Cont.)", fileObj.category);
        doc.font("Courier").fontSize(7).fillColor("#1e293b");
      }

      const lineNum = String(i + 1).padStart(4, " ");
      const lineText = lines[i];
      // Draw background for code line
      const lineBg = i % 2 === 0 ? "#ffffff" : "#f8fafc";
      doc.rect(40, doc.y, 515, 9.5).fill(lineBg);

      doc
        .fillColor("#94a3b8")
        .text(lineNum + " | ", 42, doc.y + 1, { continued: true })
        .fillColor("#0f172a")
        .text(lineText.substring(0, 110), { continued: false });

      doc.y += 0.5;
    }

    doc.moveDown(0.8);
  });

  // --- FOOTERS & NUMBERING ON ALL PAGES ---
  const range = doc.bufferedPageRange();
  for (let i = 0; i < range.start + range.count; i++) {
    doc.switchToPage(i);

    // Skip cover page footer
    if (i === 0) continue;

    doc
      .strokeColor(borderLight)
      .lineWidth(0.5)
      .moveTo(40, 805)
      .lineTo(555, 805)
      .stroke();

    doc
      .fillColor("#94a3b8")
      .fontSize(8)
      .font("Helvetica")
      .text("KATALYST - Full-Stack Student Learning & Mentorship Platform", 40, 812, { continued: true })
      .text(`Page ${i + 1} of ${range.count}`, { align: "right" });
  }

  doc.end();

  stream.on("finish", () => {
    console.log(`✅ Complete PDF compiled successfully: ${outputPath} (${range.count} pages)`);
  });
}

// Target Paths
const projectPdfPath = path.join(rootDir, "Student_Learning_App_Complete_Documentation.pdf");
const standardPdfPath = path.join(rootDir, "Student_Learning_App_Documentation.pdf");

generateCompletePDF(projectPdfPath);
generateCompletePDF(standardPdfPath);
