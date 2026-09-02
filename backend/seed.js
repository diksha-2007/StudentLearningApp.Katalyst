const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const Student = require("./models/Student");
const Mentor = require("./models/Mentor");
const Admin = require("./models/Admin");
const Training = require("./models/Training");
const Progress = require("./models/Progress");
const Notification = require("./models/Notification");
const Certificate = require("./models/Certificate");
const Meeting = require("./models/Meeting");

dotenv.config();

const seed = async () => {
  try {
    await connectDB();
    await Promise.all([
      Student.deleteMany(),
      Mentor.deleteMany(),
      Admin.deleteMany(),
      Training.deleteMany(),
      Progress.deleteMany(),
      Notification.deleteMany(),
      Certificate.deleteMany(),
      Meeting.deleteMany(),
    ]);

    const admin = await Admin.create({
      name: "System Admin",
      email: "admin@katalyst.io",
      password: "Admin@123",
    });

    const mentor1 = await Mentor.create({
      name: "Dr. Sarah Jenkins",
      email: "sarah@katalyst.io",
      password: "Mentor@123",
      expertise: ["Web Development", "React", "Career Coaching"],
      designation: "Senior Mentor",
      company: "Katalyst Labs",
      bio: "Guiding students to build scalable web apps and strong career roadmaps.",
    });

    const student1 = await Student.create({
      name: "Diksha Sharma",
      email: "diksha@katalyst.io",
      password: "Student@123",
      phone: "1234567890",
      bio: "Full Stack student learning modern web development.",
      skills: ["HTML", "CSS", "JavaScript"],
      assignedMentor: mentor1._id,
    });

    const training1 = await Training.create({
      title: "Web Development Masterclass",
      description: "Learn modern HTML, CSS, JavaScript and React in a project-based hands-on track.",
      category: "Web Development",
      level: "Beginner",
      duration: "6 weeks",
      thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
      instructor: "Dr. Sarah Jenkins",
      tags: ["web", "frontend", "react", "javascript"],
      videos: [
        { title: "HTML5 Crash Course for Beginners", url: "https://www.youtube.com/watch?v=pQN-pnXPaVg", duration: "15m", order: 1 },
        { title: "CSS3 Flexbox & Grid Masterclass", url: "https://www.youtube.com/watch?v=1Rs2ND1ryYc", duration: "25m", order: 2 },
        { title: "JavaScript Fundamentals & DOM Manipulation", url: "https://www.youtube.com/watch?v=W6NZfCO5SIk", duration: "30m", order: 3 },
        { title: "React Components, Hooks & State Management", url: "https://www.youtube.com/watch?v=CgkZ7MvWUAA", duration: "35m", order: 4 },
      ],
      quizzes: [
        { question: "What does HTML stand for?", options: ["Hypertext Markup Language", "Hyperlinks and Text Markup Language", "Home Tool Markup Language"], correctAnswer: 0, points: 10 },
        { question: "Which hook is used for side effects in React?", options: ["useState", "useEffect", "useMemo", "useRef"], correctAnswer: 1, points: 10 },
      ],
      assignments: [
        { title: "Build Portfolio Landing Page", description: "Create a fully responsive personal portfolio using modern CSS and React.", dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), maxScore: 100 },
      ],
      enrolledStudents: [{ studentId: student1._id, completedVideos: [0], quizScore: 10 }],
    });

    const training2 = await Training.create({
      title: "Data Science & Python Analytics",
      description: "Master Python, Pandas, NumPy, statistical modeling and Scikit-Learn for real-world data science.",
      category: "Data Science",
      level: "Intermediate",
      duration: "8 weeks",
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
      instructor: "Prof. Alex Rivera",
      tags: ["python", "data-science", "analytics", "pandas"],
      videos: [
        { title: "Python for Data Science - Full Course", url: "https://www.youtube.com/watch?v=LHBE6Q9XlzI", duration: "20m", order: 1 },
        { title: "Data Wrangling with Pandas & NumPy", url: "https://www.youtube.com/watch?v=vmEHCJofslg", duration: "25m", order: 2 },
        { title: "Exploratory Data Analysis with Matplotlib", url: "https://www.youtube.com/watch?v=UO98lJQ3QGI", duration: "20m", order: 3 },
        { title: "Machine Learning Models with Scikit-Learn", url: "https://www.youtube.com/watch?v=0B5eIE_1vpU", duration: "35m", order: 4 },
      ],
      quizzes: [
        { question: "Which library is primarily used for tabular data manipulation in Python?", options: ["NumPy", "Pandas", "Matplotlib", "Flask"], correctAnswer: 1, points: 10 },
      ],
      assignments: [
        { title: "Exploratory Data Analysis Report", description: "Analyze a customer churn dataset and generate visual insights.", dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), maxScore: 100 },
      ],
      enrolledStudents: [],
    });

    const training3 = await Training.create({
      title: "Data Structures & Algorithms (DSA) Mastery",
      description: "Crack technical coding interviews with comprehensive problem-solving patterns in Java & C++.",
      category: "DSA",
      level: "Intermediate",
      duration: "10 weeks",
      thumbnail: "https://images.unsplash.com/photo-1516116211227-bbc13c744ef5?auto=format&fit=crop&w=800&q=80",
      instructor: "Strivers Team",
      tags: ["dsa", "algorithms", "leetcode", "interview"],
      videos: [
        { title: "Big-O Time & Space Complexity Analysis", url: "https://www.youtube.com/watch?v=FPu9Uld7W-E", duration: "15m", order: 1 },
        { title: "Two Pointers & Sliding Window Patterns", url: "https://www.youtube.com/watch?v=mk_rB9n_m0I", duration: "25m", order: 2 },
        { title: "Binary Trees & Graph Traversals (BFS/DFS)", url: "https://www.youtube.com/watch?v=fAAZ23Et0Sk", duration: "30m", order: 3 },
        { title: "Dynamic Programming Made Easy", url: "https://www.youtube.com/watch?v=oBt53YbR9Kk", duration: "40m", order: 4 },
      ],
      quizzes: [
        { question: "What is the average time complexity of searching in a Balanced Binary Search Tree?", options: ["O(N)", "O(log N)", "O(1)", "O(N log N)"], correctAnswer: 1, points: 10 },
      ],
      assignments: [
        { title: "Solve Top 10 Blind 75 LeetCode Problems", description: "Implement solutions with optimal time & space complexity.", dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), maxScore: 100 },
      ],
      enrolledStudents: [],
    });

    const training4 = await Training.create({
      title: "Cloud Computing & DevOps with AWS & Docker",
      description: "Learn containerization, microservices architecture, AWS infrastructure and automated CI/CD pipelines.",
      category: "Cloud",
      level: "Advanced",
      duration: "7 weeks",
      thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
      instructor: "David Miller",
      tags: ["cloud", "aws", "docker", "devops"],
      videos: [
        { title: "Cloud Architecture & AWS Core Services", url: "https://www.youtube.com/watch?v=2LaAJq1lB1Q", duration: "20m", order: 1 },
        { title: "Docker Containers from Scratch", url: "https://www.youtube.com/watch?v=pg19Z8LL06w", duration: "30m", order: 2 },
        { title: "Deploying Web Apps to AWS EC2 & S3", url: "https://www.youtube.com/watch?v=Z3X2x40AO1E", duration: "25m", order: 3 },
        { title: "Automating CI/CD with GitHub Actions", url: "https://www.youtube.com/watch?v=R8_veQiYBjI", duration: "25m", order: 4 },
      ],
      quizzes: [
        { question: "Which AWS service is an object storage service?", options: ["EC2", "S3", "RDS", "Lambda"], correctAnswer: 1, points: 10 },
      ],
      assignments: [
        { title: "Dockerize a Full-Stack Web Application", description: "Write Dockerfiles and docker-compose.yml for backend & frontend.", dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), maxScore: 100 },
      ],
      enrolledStudents: [],
    });

    const training5 = await Training.create({
      title: "Applied Generative AI & LLM Engineering",
      description: "Build intelligent applications with OpenAI, Gemini, LangChain, embeddings and Vector Databases.",
      category: "AI/ML",
      level: "Advanced",
      duration: "6 weeks",
      thumbnail: "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80",
      instructor: "AI Research Guild",
      tags: ["ai", "generative-ai", "llm", "langchain"],
      videos: [
        { title: "Understanding LLMs & Generative AI", url: "https://www.youtube.com/watch?v=zjkBMFhNj_g", duration: "20m", order: 1 },
        { title: "Prompt Engineering & Few-Shot Learning", url: "https://www.youtube.com/watch?v=dOxUroR57xs", duration: "20m", order: 2 },
        { title: "Building RAG with Pinecone & LangChain", url: "https://www.youtube.com/watch?v=tcqEUSNCn8I", duration: "30m", order: 3 },
        { title: "Autonomous AI Agents Architecture", url: "https://www.youtube.com/watch?v=sal78ACtGTc", duration: "35m", order: 4 },
      ],
      quizzes: [
        { question: "What does RAG stand for in Generative AI?", options: ["Retrieval-Augmented Generation", "Random Attention Gradient", "Recursive Auto-tuning Guide"], correctAnswer: 0, points: 10 },
      ],
      assignments: [
        { title: "Build an AI Q&A Assistant on Custom PDFs", description: "Deploy a RAG chatbot using LangChain and Google Gemini.", dueDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000), maxScore: 100 },
      ],
      enrolledStudents: [],
    });

    const training6 = await Training.create({
      title: "Professional Soft Skills & Tech Interview Prep",
      description: "Sharpen communication, system design presentation, behavioral STAR stories and salary negotiations.",
      category: "Soft Skills",
      level: "Beginner",
      duration: "4 weeks",
      thumbnail: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
      instructor: "Sarah Jenkins & HR Leaders",
      tags: ["soft-skills", "resume", "interview", "career"],
      videos: [
        { title: "Crafting a High-Impact Tech Resume", url: "https://www.youtube.com/watch?v=yp693O87GmM", duration: "15m", order: 1 },
        { title: "Mastering Behavioral Interviews with STAR", url: "https://www.youtube.com/watch?v=uG3k0XGq5oU", duration: "20m", order: 2 },
        { title: "Effective Tech Communication & Leadership", url: "https://www.youtube.com/watch?v=2Tz8i8Ww62c", duration: "18m", order: 3 },
        { title: "Tech Salary Negotiation Masterclass", url: "https://www.youtube.com/watch?v=M5yGsmf4d4g", duration: "15m", order: 4 },
      ],
      quizzes: [
        { question: "In the STAR interview method, what does 'A' stand for?", options: ["Action", "Analysis", "Answer", "Assessment"], correctAnswer: 0, points: 10 },
      ],
      assignments: [
        { title: "Mock Interview Video Submission", description: "Record a 3-minute video response explaining your recent technical project.", dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), maxScore: 100 },
      ],
      enrolledStudents: [],
    });

    // Seed interactive meetings with valid Google Meet links
    await Meeting.create([
      {
        studentId: student1._id,
        mentorId: mentor1._id,
        topic: "Web Development Roadmap & Portfolio Review",
        agenda: "Review React project architecture, code styling, and career transition milestones.",
        scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        scheduledTime: "16:00",
        duration: 45,
        status: "accepted",
        meetLink: "https://meet.google.com/kat-web-session",
      },
      {
        studentId: student1._id,
        mentorId: mentor1._id,
        topic: "Mock Technical Interview & DSA Discussion",
        agenda: "Practice solving coding questions under time pressure.",
        scheduledDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        scheduledTime: "18:30",
        duration: 60,
        status: "accepted",
        meetLink: "https://meet.google.com/kat-dsa-interview",
      },
      {
        studentId: student1._id,
        mentorId: mentor1._id,
        topic: "Resume Polishing & Soft Skills Q&A",
        agenda: "Fine-tune resume bullet points and STAR method answers.",
        scheduledDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        scheduledTime: "15:00",
        duration: 30,
        status: "completed",
        meetLink: "https://meet.google.com/kat-resume-prep",
      },
    ]);

    await Progress.create({
      studentId: student1._id,
      trainingCompletion: 25,
      meetingsAttended: 1,
      totalMeetingsScheduled: 3,
      quizScores: [{ trainingId: training1._id, score: 10, maxScore: 10 }],
      assignmentsSubmitted: 1,
      attendanceRate: 85,
      overallScore: 78,
      placementReadiness: 72,
      hasResume: true,
    });

    await Notification.create({
      userId: student1._id,
      userRole: "student",
      title: "Welcome to Katalyst!",
      message: "Your student dashboard is ready. Start your first training now.",
      type: "system",
    });

    await Certificate.create({
      studentId: student1._id,
      trainingId: training1._id,
      studentName: student1.name,
      trainingTitle: training1.title,
    });

    console.log("✅ Seed data created successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Seed error:", error.message);
    process.exit(1);
  }
};

seed();
