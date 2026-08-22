const Student = require("../models/Student");
const Training = require("../models/Training");
const Progress = require("../models/Progress");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Helper to initialize Gemini model
const getGeminiModel = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.startsWith("your_") || apiKey.includes("change_in_production")) {
    return null;
  }
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    return genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  } catch (error) {
    console.error("⚠️ Failed to initialize Google Generative AI:", error.message);
    return null;
  }
};

// Helper to clean JSON response from Gemini
const cleanJSONResponse = (text) => {
  // Remove markdown block tags if present
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
  }
  return JSON.parse(cleaned);
};

// @desc Analyze student resume
// @route POST /api/ai/resume-analyze
const analyzeResume = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: "Resume content is required" });

    // Try Gemini first
    const model = getGeminiModel();
    if (model) {
      try {
        const prompt = `Analyze the following resume content and output a valid JSON object.
Do NOT wrap the response in markdown blocks (e.g. do not use \`\`\`json). The JSON object must contain exactly these keys:
1. "strengths": An array of strings highlighting the key technical and soft skill strengths.
2. "improvementAreas": An array of strings listing gaps or areas where the resume or experience can be enhanced.
3. "actionItems": An array of actionable steps for the student to improve their placement readiness.

Resume Content:
${content}`;

        const result = await model.generateContent(prompt);
        const parsed = cleanJSONResponse(result.response.text());
        return res.json({
          strengths: parsed.strengths || [],
          improvementAreas: parsed.improvementAreas || [],
          actionItems: parsed.actionItems || [],
        });
      } catch (err) {
        console.error("⚠️ Gemini resume analysis failed, falling back to rule-based:", err.message);
      }
    }

    // Fallback rule-based analysis
    const strengths = [];
    const areas = [];
    const recommendations = [];

    if (/react|javascript|frontend|html|css/i.test(content)) strengths.push("Frontend development expertise");
    if (/node|express|backend|api/i.test(content)) strengths.push("Backend and API development experience");
    if (/data|sql|mongodb|database/i.test(content)) strengths.push("Data management and database skills");
    if (/design|ui|ux/i.test(content)) strengths.push("UI/UX and product design awareness");
    if (!/project/i.test(content)) areas.push("Add project work or portfolio examples");
    if (!/github|github\.com/i.test(content)) areas.push("Include GitHub or code repository links");
    if (!/lead|team|mentor/i.test(content)) areas.push("Mention collaboration, leadership, or mentorship activities");

    if (/intern|junior|entry/i.test(content)) recommendations.push("Apply to junior and internship roles for faster placement.");
    if (!strengths.length) strengths.push("Strong foundational skills are visible.");
    if (!areas.length) areas.push("Highlight measurable impact and completed projects.");

    res.json({
      strengths,
      improvementAreas: areas,
      actionItems: [
        "Update resume with specific project accomplishments.",
        "Add portfolio or GitHub links.",
        "Share results and metrics for each learning milestone.",
      ].concat(recommendations),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Generate career roadmap
// @route POST /api/ai/career-roadmap
const careerRoadmap = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).select("name skills assignedMentor");
    const progress = await Progress.findOne({ studentId: req.user.id });
    const enrolledTrainings = await Training.find({ "enrolledStudents.studentId": req.user.id }).select("title category level");

    // Try Gemini first
    const model = getGeminiModel();
    if (model) {
      try {
        const prompt = `Generate a customized career roadmap for student "${student.name}".
Skills: ${JSON.stringify(student.skills || [])}
Enrolled Courses: ${JSON.stringify(enrolledTrainings.map(t => t.title))}
Placement Readiness: ${progress?.placementReadiness || 0}%

Output a valid JSON array of objects representing roadmap milestones.
Do NOT wrap the response in markdown blocks (e.g. do not use \`\`\`json). Each object must have exactly these keys:
1. "title": A short title for the milestone.
2. "description": A brief actionable description of what the student needs to do.
3. "daysFromNow": An integer representing how many days from today this milestone should ideally be completed.

Return at least 3 milestones.`;

        const result = await model.generateContent(prompt);
        const parsed = cleanJSONResponse(result.response.text());
        const roadmap = parsed.map(step => ({
          title: step.title,
          description: step.description,
          dueDate: new Date(Date.now() + (step.daysFromNow || 14) * 24 * 60 * 60 * 1000),
        }));

        return res.json({
          student: student.name,
          skills: student.skills,
          currentMentor: student.assignedMentor || null,
          trainings: enrolledTrainings,
          roadmap,
        });
      } catch (err) {
        console.error("⚠️ Gemini roadmap generation failed, falling back:", err.message);
      }
    }

    // Fallback roadmap
    const roadmap = [
      {
        title: "Strengthen foundational skills",
        description: "Complete active trainings and finish remaining video modules.",
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Book mentor reviews",
        description: "Schedule at least two mentoring sessions focused on projects and resume readiness.",
        dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Build a portfolio project",
        description: "Create one end-to-end project using current learning topics and publish it on GitHub.",
        dueDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
      },
    ];

    if (progress && progress.placementReadiness < 60) {
      roadmap.push({
        title: "Raise placement readiness",
        description: "Focus on quizzes, mentor feedback, and resume improvements to reach 70+ readiness.",
        dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      });
    }

    res.json({
      student: student.name,
      skills: student.skills,
      currentMentor: student.assignedMentor || null,
      trainings: enrolledTrainings,
      roadmap,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Scholarship recommendations
// @route POST /api/ai/scholarships
const scholarshipRecommendations = async (req, res) => {
  try {
    const { interests = [] } = req.body;

    // Try Gemini first
    const model = getGeminiModel();
    if (model) {
      try {
        const prompt = `Recommend targeted scholarships for a student with interests: ${JSON.stringify(interests)}.
Output a valid JSON array of objects representing recommended scholarships.
Do NOT wrap the response in markdown blocks (e.g. do not use \`\`\`json). Each object must have exactly these keys:
1. "name": The name of the scholarship.
2. "description": A description of the scholarship, eligibility requirements, and value.
3. "category": The scholarship category (e.g. Technology, Diversity, AI/ML, General).

Return at least 3 recommendations.`;

        const result = await model.generateContent(prompt);
        const parsed = cleanJSONResponse(result.response.text());
        return res.json({ recommendations: parsed });
      } catch (err) {
        console.error("⚠️ Gemini scholarship search failed, falling back:", err.message);
      }
    }

    // Fallback scholarship logic
    const recommendations = [
      {
        name: "Future Leaders Scholarship",
        description: "Designed for students building strong full-stack portfolios.",
        category: "Technology",
      },
      {
        name: "Women in Tech Assistance",
        description: "Support for female learners focusing on coding and mentorship.",
        category: "Diversity",
      },
      {
        name: "AI Learning Grant",
        description: "For students preparing for machine learning or data science pathways.",
        category: "AI/ML",
      },
    ];

    const filtered = interests.length
      ? recommendations.filter((r) =>
          interests.some((interest) => r.category.toLowerCase().includes(interest.toLowerCase()))
        )
      : recommendations;

    res.json({ recommendations: filtered.length ? filtered : recommendations });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc AI Assistant Chatbot
// @route POST /api/ai/chatbot
const assistantChat = async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ message: "Question is required" });

    // Try Gemini first
    const model = getGeminiModel();
    if (model) {
      try {
        const prompt = `You are "Katalyst AI", a helpful, friendly, and smart career and learning assistant on the Katalyst Student-Mentor Learning Platform.
Provide a concise, encouraging, and actionable answer to the student's question under 120 words.

Student Question: "${question}"`;

        const result = await model.generateContent(prompt);
        return res.json({ answer: result.response.text().trim() });
      } catch (err) {
        console.error("⚠️ Gemini chatbot failed, falling back:", err.message);
      }
    }

    // Fallback chatbot answer
    const answer = `Hi there! I am Katalyst AI (fallback mode).
To help with your query: "${question}" — we recommend scheduling a session with your assigned mentor, finishing active learning modules, or uploading your resume in your profile for a readiness analysis!`;
    res.json({ answer });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { analyzeResume, careerRoadmap, scholarshipRecommendations, assistantChat };
