import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import API from "../../api";
import {
  Landmark,
  GraduationCap,
  BookOpen,
  Compass,
  Sparkles,
  Laptop,
  Activity,
  Languages,
  Mic,
  MicOff,
  Volume2,
  Download,
  Search,
  ExternalLink,
  Flame,
  Award,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Send,
  HelpCircle,
  PlayCircle,
  ChevronRight,
  ShieldCheck,
  Building2,
  TrendingUp,
} from "lucide-react";

export default function EmpowermentHub() {
  const [lang, setLang] = useState("mr"); // "en" | "mr" | "hi"
  const [mainSection, setMainSection] = useState("gov_opps"); // gov_opps, scholarships, learning, career, ai_tutor, digital_skills, progress
  const [subSection, setSubSection] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // AI Voice Tutor State
  const [isListening, setIsListening] = useState(false);
  const [aiInputText, setAiInputText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([
    {
      q: "MahaDBT EBC स्कॉलरशिपसाठी उत्पन्न मर्यादा किती आहे?",
      a: "MahaDBT वरील राजर्षी शाहू महाराज EBC शिष्यवृत्तीसाठी कौटुंबिक वार्षिक उत्पन्न मर्यादा ₹८ लाख आहे. यामध्ये ५०% शैक्षणिक शुल्क व परीक्षा शुल्क प्रतिपूर्ती मिळते.",
      lang: "mr",
      time: "Just now",
    },
    {
      q: "MPSC Prelims Syllabus and Age limit?",
      a: "MPSC Rajyaseva requires any graduate degree. Age limit is 19 to 38 years (open) with 5 years relaxation for reserved categories. Prelims consists of GS Paper 1 and CSAT.",
      lang: "en",
      time: "2h ago",
    },
  ]);

  // Scholarship Eligibility Filter State
  const [filterCourse, setFilterCourse] = useState("all");
  const [filterIncome, setFilterIncome] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  // Gamification & Progress State
  const [userXp, setUserXp] = useState(480);
  const [streakDays, setStreakDays] = useState(6);
  const [quizScore, setQuizScore] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});

  // Reset subSection when mainSection changes
  useEffect(() => {
    setSubSection("all");
  }, [mainSection]);

  const t = (en, mr, hi) => {
    if (lang === "mr") return mr || en;
    if (lang === "hi") return hi || mr || en;
    return en;
  };

  // Web Speech Recognition for Voice Question
  const startVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(t("Speech recognition not supported in this browser.", "तुमच्या ब्राउझरमध्ये व्हॉईस इनपुट उपलब्ध नाही.", "आपके ब्राउज़र में वॉयस इनपुट उपलब्ध नहीं है।"));
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = lang === "mr" ? "mr-IN" : lang === "hi" ? "hi-IN" : "en-IN";
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setAiInputText(transcript);
      handleAiAsk(transcript);
    };

    recognition.start();
  };

  const handleAiAsk = (queryText) => {
    const query = (queryText || aiInputText).trim();
    if (!query) return;

    const qLower = query.toLowerCase();
    let ansEn = "";
    let ansMr = "";
    let ansHi = "";

    if (qLower.includes("ebc") || qLower.includes("scholarship") || qLower.includes("शिष्यवृत्ती") || qLower.includes("स्कॉलरशिप")) {
      ansEn = "For Maharashtra MahaDBT EBC scholarship, family annual income must be under ₹8 Lakhs. You get 50% tuition and exam fee waiver. Required: Domicile, Income certificate from Tehsildar, and CAP allotment letter.";
      ansMr = "MahaDBT EBC शिष्यवृत्तीसाठी कुटुंबाचे वार्षिक उत्पन्न ₹८ लाखांच्या आत असावे. ५०% शिक्षण व परीक्षा शुल्क माफ होते. आवश्यक: अधिवास दाखला, तहसीलदारांचा उत्पन्नाचा दाखला व CAP अलॉटमेंट लेटर.";
      ansHi = "महाराष्ट्र MahaDBT EBC स्कॉलरशिप के लिए पारिवारिक वार्षिक आय ₹8 लाख से कम होनी चाहिए। इसमें 50% ट्यूशन फीस वापस मिलती है। आवश्यक: डोमिसाइल, आय प्रमाण पत्र और CAP अलॉटमेंट लेटर।";
    } else if (qLower.includes("mpsc") || qLower.includes("स्पर्धा परीक्षा") || qLower.includes("combine") || qLower.includes("psi")) {
      ansEn = "MPSC conducts Rajyaseva (Class 1/2 officers like Dy. Collector, Tehsildar) and Combined Exam (PSI, STI, ASO). Any graduate degree holder aged 19-38 is eligible. Recommended starting point: State Board Books (Class 6-12) and MPSC PYQs.";
      ansMr = "MPSC राज्यसेवा (उपजिल्हाधिकारी, तहसीलदार) व संयुक्त परीक्षा (PSI, STI, ASO) घेते. कोणत्याही शाखेतील पदवीधर (वय १९ ते ३८) पात्र आहेत. अभ्यासाची सुरुवात ६वी ते १२वी स्टेट बोर्ड पुस्तके व मागील प्रश्नपत्रिकांमधून करा.";
      ansHi = "MPSC राज्यसेवा (डिप्टी कलेक्टर, तहसीलदार) और संयुक्त परीक्षा (PSI, STI, ASO) आयोजित करता है। 19-38 वर्ष के स्नातक उम्मीदवार पात्र हैं। तैयारी स्टेट बोर्ड किताबों और पिछले वर्षों के प्रश्नपत्रों से शुरू करें।";
    } else if (qLower.includes("caste") || qLower.includes("validity") || qLower.includes("जात वैधता")) {
      ansEn = "Caste Validity is applied on CCVIS or BARTI portal. Key proof required: Applicant school leaving certificate mentioning caste, and Father/Grandfather pre-1967 school or revenue record, along with Form 16 from College Principal.";
      ansMr = "जात वैधता (Caste Validity) साठी CCVIS किंवा बार्टी पोर्टलवर अर्ज करा. मुख्य पुरावा: अर्जदाराचा शाळा सोडल्याचा दाखला व वडील/आजोबांचा १९६७ पूर्वीचा शाळा किंवा महसुली पुरावा, सोबत कॉलेजचा फॉर्म १६.";
      ansHi = "जाति वैधता (Caste Validity) के लिए CCVIS या बार्टी पोर्टल पर आवेदन करें। आवश्यक प्रमाण: आवेदक का स्कूल लीविंग सर्टिफिकेट और पिता/दादाजी का 1967 से पहले का रिकॉर्ड और फॉर्म 16।";
    } else if (qLower.includes("excel") || qLower.includes("digital") || qLower.includes("coding")) {
      ansEn = "Top digital skills for jobs: MS Excel (VLOOKUP, SUMIFS, Pivot Tables), Professional Email writing, and Web Development (HTML/CSS/JavaScript/React). Start practicing in our Digital Skills track!";
      ansMr = "नोकरीसाठी महत्त्वाचे डिजिटल कौशल्ये: MS Excel (VLOOKUP, Pivot Tables), व्यावसायिक ईमेल आणि कोडिंग (HTML/CSS/React). आपल्या डिजिटल स्किल्स विभागातून आजच सराव सुरू करा!";
      ansHi = "नौकरी के लिए प्रमुख डिजिटल स्किल्स: MS Excel (VLOOKUP, Pivot Tables), प्रोफेशनल ईमेल और कोडिंग (HTML/CSS/React)। हमारे डिजिटल स्किल्स ट्रैक से आज ही अभ्यास शुरू करें!";
    } else {
      ansEn = `Here is comprehensive guidance regarding "${query}": Please review our curated Government Opportunities, Career Roadmaps, and Digital Skill modules in this Hub for detailed step-by-step help.`;
      ansMr = `"${query}" बाबत सविस्तर माहिती: या पोर्टलवरील शासकीय संधी, करिअर मार्गदर्शक आणि डिजिटल कौशल्य मॉड्यूल्स तपासून अचूक मार्गदर्शन मिळवा.`;
      ansHi = `"${query}" के संबंध में मार्गदर्शन: कृपया इस हब में उपलब्ध सरकारी अवसर, करियर रोडमैप और डिजिटल स्किल्स मॉड्यूल देखें।`;
    }

    const currentAnswer = lang === "mr" ? ansMr : lang === "hi" ? ansHi : ansEn;

    const newEntry = {
      q: query,
      a: currentAnswer,
      lang: lang,
      time: "Just now",
    };

    setConversationHistory([newEntry, ...conversationHistory]);
    setAiInputText("");
    speakText(currentAnswer);
  };

  const speakText = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === "mr" ? "mr-IN" : lang === "hi" ? "hi-IN" : "en-IN";
    utterance.rate = 0.95;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // 1. Government Opportunities Data
  const govOpportunitiesData = [
    {
      sub: "mpsc",
      titleEn: "MPSC Rajyaseva & Combined Examination (PSI / STI / ASO)",
      titleMr: "MPSC राज्यसेवा व दुय्यम सेवा संयुक्त परीक्षा (PSI / STI / ASO)",
      titleHi: "MPSC राज्यसेवा और संयुक्त परीक्षा (PSI / STI / ASO)",
      badge: "State Govt Gazetted",
      icon: "🏛️",
      eligibilityEn: "Any Degree Graduate (Age 19 - 38 yrs)",
      eligibilityMr: "कोणत्याही शाखेतील पदवीधर (वय १९ ते ३८ वर्षे)",
      eligibilityHi: "किसी भी विषय में स्नातक (आयु 19 - 38 वर्ष)",
      descEn: "Posts: Deputy Collector, Tehsildar, DySP, Police Sub-Inspector, Sales Tax Inspector, Section Officer.",
      descMr: "पदे: उपजिल्हाधिकारी, तहसीलदार, उपअधीक्षक (DySP), पोलीस उपनिरीक्षक (PSI), विक्रीकर निरीक्षक (STI), कक्ष अधिकारी.",
      descHi: "पद: डिप्टी कलेक्टर, तहसीलदार, डीवाईएसपी, पुलिस सब-इंस्पेक्टर, बिक्री कर निरीक्षक, अनुभाग अधिकारी।",
      officialUrl: "https://mpsc.gov.in",
      portal: "MPSC Official",
    },
    {
      sub: "upsc",
      titleEn: "UPSC Civil Services Examination (IAS / IPS / IFS)",
      titleMr: "UPSC केंद्रीय नागरी सेवा परीक्षा (IAS / IPS / IFS)",
      titleHi: "UPSC सिविल सेवा परीक्षा (IAS / IPS / IFS)",
      badge: "Central Govt Group A",
      icon: "🇮🇳",
      eligibilityEn: "Any Degree Graduate (Age 21 - 32 yrs, relaxation for OBC/SC/ST)",
      eligibilityMr: "कोणत्याही शाखेतील पदवीधर (वय २१ ते ३२ वर्षे, सवलत लागू)",
      eligibilityHi: "किसी भी विषय में स्नातक (आयु 21 - 32 वर्ष, आरक्षित वर्गों के लिए छूट)",
      descEn: "Indian Administrative Service, Police Service, Foreign Service, Revenue Service (IRS).",
      descMr: "भारतीय प्रशासकीय सेवा (IAS), पोलीस सेवा (IPS), परराष्ट्र सेवा (IFS), महसूल सेवा (IRS).",
      descHi: "भारतीय प्रशासनिक सेवा (IAS), भारतीय पुलिस सेवा (IPS), भारतीय विदेश सेवा (IFS)।",
      officialUrl: "https://upsc.gov.in",
      portal: "UPSC Official",
    },
    {
      sub: "ssc",
      titleEn: "Staff Selection Commission (SSC CGL / CHSL / MTS)",
      titleMr: "कर्मचारी निवड आयोग (SSC CGL / CHSL / MTS)",
      titleHi: "कर्मचारी चयन आयोग (SSC CGL / CHSL / MTS)",
      badge: "Central Ministries",
      icon: "🏢",
      eligibilityEn: "10th / 12th / Degree depending on post",
      eligibilityMr: "१०वी / १२वी / पदवी (पदानुसार पात्रता)",
      eligibilityHi: "10वीं / 12वीं / स्नातक (पदानुसार)",
      descEn: "Inspectors in Income Tax, Central Excise, CBI, Assistants in Central Ministries, Data Entry Operators.",
      descMr: "आयकर निरीक्षक, सेंट्रल एक्साईज, CBI इन्स्पेक्टर, केंद्रीय मंत्रालयातील सहाय्यक व डेटा एन्ट्री ऑपरेटर.",
      descHi: "आयकर निरीक्षक, सेंट्रल एक्साइज, सीबीआई, मंत्रालयों में सहायक व डाटा एंट्री ऑपरेटर।",
      officialUrl: "https://ssc.gov.in",
      portal: "SSC Portal",
    },
    {
      sub: "railway",
      titleEn: "Railway Recruitment Board (RRB NTPC / Group D / ALP / JE)",
      titleMr: "रेल्वे भरती मंडळ (RRB NTPC / ग्रुप D / लोको पायलट / JE)",
      titleHi: "रेलवे भर्ती बोर्ड (RRB NTPC / ग्रुप D / लोको पायलट / JE)",
      badge: "Indian Railways",
      icon: "🚆",
      eligibilityEn: "10th / ITI / Diploma / Degree",
      eligibilityMr: "१०वी / ITI / पॉलिटेक्निक डिप्लोमा / पदवी",
      eligibilityHi: "10वीं / ITI / डिप्लोमा / स्नातक",
      descEn: "Station Master, Goods Guard, Assistant Loco Pilot, Junior Engineer, Track Maintainer, Tech Staff.",
      descMr: "स्टेशन मास्टर, गुड्स गार्ड, असिस्टंट लोको पायलट, ज्युनियर इंजिनिअर, तांत्रिक कर्मचारी.",
      descHi: "स्टेशन मास्टर, गुड्स गार्ड, असिस्टेंट लोको पायलट, जूनियर इंजीनियर, रेलवे स्टाफ।",
      officialUrl: "https://indianrailways.gov.in",
      portal: "Railway Recruitment",
    },
    {
      sub: "police",
      titleEn: "Maharashtra Police Bharti (Constable, Driver, SRPF & Sub-Inspector)",
      titleMr: "महाराष्ट्र पोलीस भरती (पोलीस शिपाई, चालक, SRPF व उपनिरीक्षक)",
      titleHi: "महाराष्ट्र पुलिस भर्ती (कांस्टेबल, चालक, SRPF और उपनिरीक्षक)",
      badge: "State Police",
      icon: "👮",
      eligibilityEn: "12th Pass (Age 18 - 28 yrs, relaxation applies) + Physical standards",
      eligibilityMr: "१२वी उत्तीर्ण (वय १८ ते २८ वर्षे, मागासवर्गीयांसाठी सवलत) + शारीरिक चाचणी",
      eligibilityHi: "12वीं पास (आयु 18 - 28 वर्ष, आरक्षित वर्गों के लिए छूट) + शारीरिक मानक",
      descEn: "Physical test (50 marks) + Written Exam (100 marks) in Marathi language.",
      descMr: "शारीरिक चाचणी (५० गुण) + लेखी परीक्षा (१०० गुण) मराठी माध्यमातून.",
      descHi: "शारीरिक दक्षता परीक्षा (50 अंक) + लिखित परीक्षा (100 अंक)।",
      officialUrl: "https://mahapolice.gov.in",
      portal: "Maharashtra Police",
    },
    {
      sub: "banking",
      titleEn: "Banking Exams (IBPS PO / Clerk, SBI PO / Clerk, RBI Assistant)",
      titleMr: "बँक भरती परीक्षा (IBPS PO / लिपिक, SBI, RBI सहाय्यक)",
      titleHi: "बैंकिंग परीक्षाएं (IBPS PO / क्लर्क, SBI PO, RBI असिस्टेंट)",
      badge: "Public Sector Banks",
      icon: "🏦",
      eligibilityEn: "Any Degree Graduate (Age 20 - 30 yrs)",
      eligibilityMr: "कोणत्याही शाखेतील पदवीधर (वय २० ते ३० वर्षे)",
      eligibilityHi: "किसी भी विषय में स्नातक (आयु 20 - 30 वर्ष)",
      descEn: "Probationary Officers and Clerks in Nationalized Banks. Selection via Prelims, Mains & Interview.",
      descMr: "राष्ट्रीयीकृत बँकांमध्ये प्रोबेशनरी ऑफिसर व लिपिक पदे. पूर्व, मुख्य व मुलाखत द्वारे निवड.",
      descHi: "सार्वजनिक बैंकों में प्रोबेशनरी ऑफिसर और क्लर्क पद। प्रीलिम्स, मेन्स और इंटरव्यू द्वारा चयन।",
      officialUrl: "https://ibps.in",
      portal: "IBPS Portal",
    },
    {
      sub: "state_jobs",
      titleEn: "Maharashtra State Government Jobs (Talathi, ZP, Vanrakshak, Nagar Parishad)",
      titleMr: "महाराष्ट्र राज्य शासन सरळसेवा भरती (तलाठी, जिल्हा परिषद, वनरक्षक, नगरपरिषद)",
      titleHi: "महाराष्ट्र राज्य सरकारी नौकरियां (तलाठी, जिला परिषद, वनरक्षक, नगर परिषद)",
      badge: "Direct Recruitment (सरळसेवा)",
      icon: "📜",
      eligibilityEn: "10th / 12th / Degree according to department",
      eligibilityMr: "१०वी / १२वी / पदवी (विभागीय पदानुसार)",
      eligibilityHi: "10वीं / 12वीं / स्नातक (पदानुसार)",
      descEn: "Revenue Department Talathi, Zilla Parishad Health & Admin staff, Forest Guard, Municipal Clerks.",
      descMr: "महसूल विभाग तलाठी, जिल्हा परिषद आरोग्य व प्रशासन सेवक, वनरक्षक, लेखापाल.",
      descHi: "राजस्व विभाग तलाठी, जिला परिषद स्वास्थ्य व प्रशासनिक कर्मी, वनरक्षक।",
      officialUrl: "https://mahabhumi.gov.in",
      portal: "MahaBhumi / ZP Portal",
    },
  ];

  // 2. Scholarships Data
  const scholarshipsData = [
    {
      titleEn: "Rajarshi Chhatrapati Shahu Maharaj Shikshan Shulkh Shishyavrutti Yojna (EBC)",
      titleMr: "राजर्षी छत्रपती शाहू महाराज शिक्षण शुल्क शिष्यवृत्ती योजना (EBC)",
      titleHi: "राजर्षि छत्रपति शाहू महाराज शिक्षण शुल्क छात्रवृत्ति योजना (EBC)",
      benefit: "50% Tuition & Exam Fee Waiver",
      income: "< 8 Lakhs",
      category: "Open / EBC / SEBC",
      course: "Engineering, Diploma, Degree, Medical",
      deadline: "Annual / MahaDBT Open",
      officialUrl: "https://mahadbt.maharashtra.gov.in",
    },
    {
      titleEn: "Dr. Babasaheb Ambedkar Swadhar Yojana (Hostel Allowance)",
      titleMr: "डॉ. बाबासाहेब आंबेडकर स्वाधार योजना (वसतिगृह भत्ता)",
      titleHi: "डॉ. बाबासाहेब आंबेडकर स्वाधार योजना (छात्रावास भत्ता)",
      benefit: "₹51,000 to ₹60,000 per year directly to bank",
      income: "< 2.5 Lakhs",
      category: "SC / Nav-Bouddha",
      course: "Higher Education / Professional",
      deadline: "Ongoing / Social Justice Dept",
      officialUrl: "https://sjsa.maharashtra.gov.in",
    },
    {
      titleEn: "National Scholarship Portal (NSP) - Central Sector Scheme",
      titleMr: "राष्ट्रीय शिष्यवृत्ती पोर्टल (NSP) - केंद्रीय गुणवत्ता शिष्यवृत्ती",
      titleHi: "राष्ट्रीय छात्रवृत्ति पोर्टल (NSP) - केंद्रीय क्षेत्र छात्रवृत्ति",
      benefit: "₹12,000/yr (UG) & ₹20,000/yr (PG)",
      income: "< 4.5 Lakhs",
      category: "All Categories (Above 80% in 12th)",
      course: "Regular Degree Students",
      deadline: "National Portal Annual",
      officialUrl: "https://scholarships.gov.in",
    },
    {
      titleEn: "Post-Matric Scholarship for VJNT / OBC / SBC Students",
      titleMr: "VJNT / OBC / SBC प्रवर्गातील विद्यार्थ्यांसाठी मॅट्रिकोत्तर शिष्यवृत्ती",
      titleHi: "VJNT / OBC / SBC छात्रों के लिए पोस्ट-मैट्रिक छात्रवृत्ति",
      benefit: "100% / 50% Tuition Fee + Maintenance Allowance",
      income: "< 1.5 Lakhs to 8 Lakhs",
      category: "OBC / VJNT / SBC",
      course: "11th, 12th, ITI, Diploma, Graduation",
      deadline: "MahaDBT Portal",
      officialUrl: "https://mahadbt.maharashtra.gov.in",
    },
  ];

  // 3. Career Pathways Data
  const careerData = [
    {
      sub: "after_10th",
      titleEn: "Options After 10th Standard (SSC)",
      titleMr: "१०वी नंतरचे सर्वोत्तम करिअर पर्याय",
      titleHi: "10वीं के बाद प्रमुख करियर विकल्प",
      paths: [
        { nameEn: "Polytechnic Diploma (3 Years)", nameMr: "पॉलिटेक्निक डिप्लोमा (३ वर्षे - CS, Mech, Civil)", nameHi: "पॉलिटेक्निक डिप्लोमा (3 वर्ष)", descEn: "Direct entry to 2nd year B.Tech or Junior Engineer job." },
        { nameEn: "ITI Technical Trades (1-2 Years)", nameMr: "ITI तांत्रिक कोर्सेस (Electrician, Fitter, COPA)", nameHi: "ITI तकनीकी ट्रेड्स (1-2 वर्ष)", descEn: "Fast-track technical employment in railways & industries." },
        { nameEn: "11th & 12th Science (PCM / PCB)", nameMr: "११वी - १२वी सायन्स (इंजिनिअरिंग / मेडिकल / NDA)", nameHi: "11वीं-12वीं विज्ञान (इंजीनियरिंग / मेडिकल / NDA)", descEn: "Gateway to JEE, MHT-CET, NEET, NDA Defense careers." },
        { nameEn: "11th & 12th Commerce / Arts", nameMr: "११वी - १२वी कॉमर्स किंवा आर्ट्स (CA, Law, MPSC)", nameHi: "11वीं-12वीं कॉमर्स / आर्ट्स (CA, Law, UPSC)", descEn: "Gateway to CA, CS, Banking, Law (CLAT), Civil Services." },
      ],
    },
    {
      sub: "after_12th",
      titleEn: "Options After 12th Standard (HSC)",
      titleMr: "१२वी नंतरचे प्रमुख करिअर पर्याय",
      titleHi: "12वीं के बाद प्रमुख करियर विकल्प",
      paths: [
        { nameEn: "Engineering (B.Tech / BE - 4 Years)", nameMr: "अभियांत्रिकी पदवी (B.Tech / BE)", nameHi: "इंजीनियरिंग (B.Tech / BE)", descEn: "Computer, IT, AI/Data Science, Electronics, Mechanical." },
        { nameEn: "Medical & Healthcare (MBBS, BDS, BAMS, Nursing)", nameMr: "वैद्यकीय शिक्षण (MBBS, BDS, BAMS, BHMS, नर्सिंग)", nameHi: "मेडिकल एवं नर्सिंग (MBBS, BDS, BAMS, नर्सिंग)", descEn: "Through NEET UG entrance examination." },
        { nameEn: "Degree in Pure Sciences / Commerce / Arts", nameMr: "पारंपरिक पदवी (B.Sc, B.Com, BA, BCA, BBA)", nameHi: "पारंपरिक स्नातक (B.Sc, B.Com, BA, BCA, BBA)", descEn: "Foundation for MBA, MCA, Banking & Govt Competitive exams." },
        { nameEn: "Defense Services (NDA / Airforce / Navy)", nameMr: "संरक्षण दल (NDA परीक्षा - आर्मी, नेव्ही, एअरफोर्स)", nameHi: "रक्षा सेवाएं (NDA - थल सेना, नौसेना, वायु सेना)", descEn: "Commissioned Officer in Armed Forces at age 19." },
      ],
    },
    {
      sub: "diploma",
      titleEn: "Diploma to Degree & PSU Jobs",
      titleMr: "पॉलिटेक्निक डिप्लोमा नंतरचे मार्ग",
      titleHi: "पॉलिटेक्निक डिप्लोमा के बाद के विकल्प",
      paths: [
        { nameEn: "Direct Second Year B.Tech (Lateral Entry)", nameMr: "थेट द्वितीय वर्ष इंजिनिअरिंग प्रवेश (DSE B.Tech)", nameHi: "सीधे द्वितीय वर्ष B.Tech प्रवेश", descEn: "Complete engineering degree without repeating 1st year." },
        { nameEn: "Junior Engineer in MSEB / Mahatransco / PWD", nameMr: "महावितरण / PWD मध्ये कनिष्ठ अभियंता (JE)", nameHi: "महावितरण / पीडब्ल्यूडी में कनिष्ठ अभियंता", descEn: "Special recruitment for polytechnic diploma holders." },
        { nameEn: "PSU Jobs (DRDO, ISRO, BHEL, Indian Railway JE)", nameMr: "केंद्रीय उपक्रम व रेल्वे तांत्रिक पदे", nameHi: "पीएसयू और रेलवे तकनीकी पद", descEn: "Direct technician and supervisory exams." },
      ],
    },
    {
      sub: "engineering",
      titleEn: "Engineering Pathways (Tech, Product & Gate)",
      titleMr: "इंजिनिअरिंग मधील उच्च पगाराचे करिअर",
      titleHi: "इंजीनियरिंग में उच्च वेतन करियर",
      paths: [
        { nameEn: "Software Engineer / Full Stack Developer", nameMr: "सॉफ्टवेअर डेव्हलपर (React, Node, Java, Python)", nameHi: "सॉफ्टवेयर डेवलपर (फुल स्टैक)", descEn: "Starting salary: ₹4.5L to ₹20L+ in product companies." },
        { nameEn: "Data Scientist & AI/ML Specialist", nameMr: "डेटा सायंटिस्ट व कृत्रिम बुद्धिमत्ता (AI) तज्ञ", nameHi: "डेटा साइंटिस्ट और एआई विशेषज्ञ", descEn: "High demand across global analytics & finance tech." },
        { nameEn: "GATE Exam for M.Tech in IITs / PSU Jobs (ONGC, IOCL)", nameMr: "GATE परीक्षा (IIT मधून M.Tech किंवा महारत्न PSU)", nameHi: "GATE परीक्षा (IIT M.Tech या PSU नौकरियां)", descEn: "Lucrative government engineer & research positions." },
      ],
    },
    {
      sub: "gov_jobs",
      titleEn: "Direct Entry Government Careers",
      titleMr: "थेट शासकीय नोकरीचे प्रवेश मार्ग",
      titleHi: "सरकारी नौकरी के सीधे प्रवेश मार्ग",
      paths: [
        { nameEn: "Civil Services (UPSC IAS / MPSC Dy. Collector)", nameMr: "नागरी सेवा (IAS, IPS, उपजिल्हाधिकारी, तहसीलदार)", nameHi: "सिविल सेवा (IAS, IPS, डिप्टी कलेक्टर)", descEn: "Highest prestige and administrative executive authority." },
        { nameEn: "Uniformed Services (Police Sub-Inspector / Defense)", nameMr: "वर्दीधारी सेवा (पोलीस उपनिरीक्षक / सैन्यदल अधिकारी)", nameHi: "वर्दीधारी सेवाएं (पुलिस उपनिरीक्षक / सेना)", descEn: "Leadership, duty and high social respect." },
        { nameEn: "Banking & Financial Public Sector (SBI PO, RBI)", nameMr: "बँकिंग क्षेत्र (SBI PO, बँक अधिकारी)", nameHi: "बैंकिंग क्षेत्र (SBI PO, बैंक अधिकारी)", descEn: "Fast promotions, loans benefits, and stable career." },
      ],
    },
  ];

  // 4. Digital Skills Modules
  const digitalSkillsData = [
    {
      sub: "computer_basics",
      titleEn: "Computer Basics & Operating System Mastery",
      titleMr: "संगणक मूलभूत ज्ञान (Computer Basics & Windows)",
      titleHi: "कंप्यूटर बेसिक्स और ऑपरेटिंग सिस्टम",
      icon: "💻",
      points: [
        "Keyboard shortcuts (Ctrl+C, Ctrl+V, Win+D, Alt+Tab)",
        "Folder organization & file formats (PDF, DOCX, ZIP, JPG)",
        "Managing storage, flash drives & cloud backup (Google Drive)",
      ],
    },
    {
      sub: "excel",
      titleEn: "MS Excel & Google Sheets for Office Jobs",
      titleMr: "MS Excel व स्प्रेडशीट फॉर्म्युले (ऑफिस नोकरीसाठी)",
      titleHi: "MS Excel और स्प्रेडशीट्स फॉर्मूले",
      icon: "📊",
      points: [
        "Formulas: =SUM(), =AVERAGE(), =COUNTIF(), =IF()",
        "Lookup Mastery: =VLOOKUP(), =XLOOKUP() & Data Validation",
        "Pivot Tables, Charts and Filter sorting for data reports",
      ],
    },
    {
      sub: "email",
      titleEn: "Professional Email Etiquette & Communication",
      titleMr: "व्यावसायिक ईमेल लेखन व शिष्टाचार",
      titleHi: "प्रोफेशनल ईमेल राइटिंग और शिष्टाचार",
      icon: "✉️",
      points: [
        "Crafting clear Subject lines and respectful salutations",
        "Attaching PDFs & resumes properly without errors",
        "CC, BCC differences and professional follow-up guidelines",
      ],
    },
    {
      sub: "online_forms",
      titleEn: "Online Government Form & Certificate Filling",
      titleMr: "ऑनलाइन शासकीय फॉर्म व दाखले अर्ज करणे",
      titleHi: "ऑनलाइन सरकारी फॉर्म और प्रमाण पत्र आवेदन",
      icon: "📝",
      points: [
        "Compressing photo & signature to < 50KB using free tools",
        "Entering family genealogy (वंशावळ) in Caste Validity accurately",
        "NetBanking / UPI payment verification and downloading final receipt",
      ],
    },
    {
      sub: "cyber_safety",
      titleEn: "Cyber Safety, OTP Protection & Anti-Fraud",
      titleMr: "सायबर सुरक्षा, OTP गोपनीयता व फसवणूक प्रतिबंध",
      titleHi: "साइबर सुरक्षा, ओटीपी सुरक्षा और फ्रॉड से बचाव",
      icon: "🛡️",
      points: [
        "Never share OTP or banking passwords with anyone over call",
        "Identifying fake scholarship links & phishing WhatsApp messages",
        "Enabling Two-Factor Authentication (2FA) on Google & WhatsApp",
      ],
    },
  ];

  // Practice Quiz
  const mockQuiz = [
    {
      q: t(
        "What is the maximum annual income limit for MahaDBT EBC Scholarship?",
        "MahaDBT राजर्षी शाहू महाराज EBC शिष्यवृत्तीसाठी कमाल वार्षिक उत्पन्न मर्यादा किती आहे?",
        "MahaDBT EBC स्कॉलरशिप के लिए अधिकतम वार्षिक आय सीमा क्या है?"
      ),
      opts: [t("₹2.5 Lakhs", "₹२.५ लाख", "₹2.5 लाख"), t("₹8.0 Lakhs", "₹८.० लाख", "₹8.0 लाख"), t("₹12.0 Lakhs", "₹१२.० लाख", "₹12.0 लाख"), t("No Limit", "मर्यादा नाही", "कोई सीमा नहीं")],
      ans: 1,
    },
    {
      q: t(
        "Which document is mandatory proof of Maharashtra residence?",
        "महाराष्ट्रात वास्तव्याचा पुरावा म्हणून कोणते प्रमाणपत्र अनिवार्य आहे?",
        "महाराष्ट्र में निवास के प्रमाण के रूप में कौन सा प्रमाण पत्र अनिवार्य है?"
      ),
      opts: [t("Ration Card", "रेशन कार्ड", "राशन कार्ड"), t("Domicile Certificate", "अधिवास दाखला (Domicile)", "डोमिसाइल सर्टिफिकेट"), t("Electricity Bill", "लाईट बिल", "बिजली बिल"), t("PAN Card", "पॅन कार्ड", "पैन कार्ड")],
      ans: 1,
    },
    {
      q: t(
        "In MS Excel, which formula is used to search for a value in the leftmost column?",
        "MS Excel मध्ये डाव्या कॉलममधील व्हॅल्यू शोधण्यासाठी कोणता फॉर्म्युला वापरतात?",
        "MS Excel में वैल्यू सर्च करने के लिए कौन सा फॉर्मूला इस्तेमाल किया जाता है?"
      ),
      opts: ["=SUM()", "=VLOOKUP()", "=TODAY()", "=PRINT()"],
      ans: 1,
    },
  ];

  const handleQuizSubmit = () => {
    let score = 0;
    mockQuiz.forEach((item, idx) => {
      if (quizAnswers[idx] === item.ans) score += 1;
    });
    setQuizScore(score);
    setUserXp((prev) => prev + score * 50);
  };

  return (
    <DashboardLayout
      title={t("🌟 Student Empowerment & Opportunities Hub", "🌟 विद्यार्थी सक्षमीकरण, शासकीय संधी व करिअर केंद्र", "🌟 छात्र सशक्तिकरण, सरकारी अवसर और करियर केंद्र")}
      actions={
        <div className="flex items-center gap-2">
          {/* Trilingual Switcher */}
          <div className="flex rounded-xl border border-slate-700 bg-slate-900/80 p-1 shadow-md">
            <button
              onClick={() => setLang("en")}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${lang === "en" ? "bg-katalyst-500 text-white shadow" : "text-slate-400 hover:text-white"}`}
            >
              EN 🇬🇧
            </button>
            <button
              onClick={() => setLang("mr")}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${lang === "mr" ? "bg-emerald-600 text-white shadow" : "text-slate-400 hover:text-white"}`}
            >
              मराठी 🇮🇳
            </button>
            <button
              onClick={() => setLang("hi")}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${lang === "hi" ? "bg-amber-600 text-white shadow" : "text-slate-400 hover:text-white"}`}
            >
              हिंदी 🇮🇳
            </button>
          </div>
        </div>
      }
    >
      {/* 8 Pillar Master Category Tabs */}
      <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
        {[
          { id: "gov_opps", label: t("🏛️ Govt Opportunities", "🏛️ शासकीय संधी (MPSC/UPSC)", "🏛️ सरकारी अवसर"), icon: Landmark },
          { id: "scholarships", label: t("🎓 Scholarships", "🎓 शिष्यवृत्ती (MahaDBT)", "🎓 स्कॉलरशिप"), icon: GraduationCap },
          { id: "career", label: t("💼 Career Guide", "💼 करिअर दिशा (10th/12th)", "💼 करियर गाइड"), icon: Compass },
          { id: "learning", label: t("📚 Learning & PDFs", "📚 अभ्यास साहित्य व PDFs", "📚 शिक्षण एवं PDFs"), icon: BookOpen },
          { id: "ai_tutor", label: t("🎤 AI Voice Tutor", "🎤 AI व्हॉईस ट्यूटर", "🎤 AI वॉयस ट्यूटर"), icon: Sparkles },
          { id: "digital_skills", label: t("🧑‍💻 Digital Skills", "🧑‍💻 डिजिटल कौशल्ये", "🧑‍💻 डिजिटल स्किल्स"), icon: Laptop },
          { id: "progress", label: t("📈 My Progress", "📈 माझी प्रगती व XP", "📈 मेरी प्रगति"), icon: Activity },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = mainSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setMainSection(tab.id)}
              className={`flex items-center gap-2 rounded-xl p-3 text-xs sm:text-sm font-bold transition-all ${
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg ring-2 ring-blue-400/40"
                  : "border border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:bg-slate-900"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 1. GOVERNMENT OPPORTUNITIES PILLAR */}
      {/* ========================================================================= */}
      {mainSection === "gov_opps" && (
        <div className="space-y-6">
          {/* Sub Navigation */}
          <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
            {[
              { id: "all", label: t("All Exams", "सर्व परीक्षा", "सभी परीक्षाएं") },
              { id: "mpsc", label: "MPSC (राज्यसेवा/संयुक्त)" },
              { id: "upsc", label: "UPSC (IAS/IPS)" },
              { id: "ssc", label: "SSC (CGL/CHSL)" },
              { id: "railway", label: t("Railway (RRB)", "रेल्वे भरती", "रेलवे भर्ती") },
              { id: "police", label: t("Police Bharti", "पोलीस भरती", "पुलिस भर्ती") },
              { id: "banking", label: t("Banking (IBPS/SBI)", "बँक भरती", "बैंक भर्ती") },
              { id: "state_jobs", label: t("State Govt (Talathi/ZP)", "सरळसेवा (तलाठी/ZP)", "राज्य नौकरी (तलाठी)") },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setSubSection(st.id)}
                className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-all ${
                  subSection === st.id ? "bg-emerald-600 text-white shadow-md" : "border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {govOpportunitiesData
              .filter((item) => subSection === "all" || item.sub === subSection)
              .map((item, idx) => (
                <div key={idx} className="glass-card p-5 rounded-2xl flex flex-col justify-between hover:border-blue-500/50 transition-all shadow-lg">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{item.icon}</span>
                        <span className="badge !bg-blue-500/15 !text-blue-400 text-[11px] font-semibold">{item.badge}</span>
                      </div>
                      <span className="text-xs text-slate-400 font-mono">🏛️ {item.portal}</span>
                    </div>

                    <h4 className="font-bold text-base text-white mt-3">
                      {lang === "mr" ? item.titleMr : lang === "hi" ? item.titleHi : item.titleEn}
                    </h4>

                    <div className="mt-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                      <p className="text-slate-400 font-semibold">{t("Eligibility:", "पात्रता:", "योग्यता:")}</p>
                      <p className="text-emerald-300 font-medium mt-0.5">
                        {lang === "mr" ? item.eligibilityMr : lang === "hi" ? item.eligibilityHi : item.eligibilityEn}
                      </p>
                    </div>

                    <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                      {lang === "mr" ? item.descMr : lang === "hi" ? item.descHi : item.descEn}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">{t("Syllabus & Details Available", "अभ्यासक्रम व माहिती उपलब्ध", "पाठ्यक्रम उपलब्ध")}</span>
                    <a
                      href={item.officialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-primary !py-1.5 !px-3.5 text-xs flex items-center gap-1.5"
                    >
                      <span>{t("Official Portal", "अधिकृत संकेतस्थळ", "आधिकारिक पोर्टल")}</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. SCHOLARSHIPS PILLAR */}
      {/* ========================================================================= */}
      {mainSection === "scholarships" && (
        <div className="space-y-6">
          {/* Sub Navigation */}
          <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
            {[
              { id: "all", label: t("All Scholarships", "सर्व शिष्यवृत्ती", "सभी छात्रवृत्तियां") },
              { id: "checker", label: t("Eligibility Checker", "पात्रता तपासक (Calculator)", "पात्रता कैलकुलेटर") },
              { id: "guide", label: t("Application Guide", "अर्ज मार्गदर्शिका", "आवेदन गाइड") },
              { id: "deadlines", label: t("Deadline Alerts", "अंतिम मुदत सूचना", "अंतिम तिथि अलर्ट") },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setSubSection(st.id)}
                className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-all ${
                  subSection === st.id ? "bg-emerald-600 text-white shadow-md" : "border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          {/* Eligibility Checker Sub-Section */}
          {subSection === "checker" && (
            <div className="glass-card p-6 border border-emerald-500/30 bg-emerald-950/20 rounded-2xl space-y-4">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                <span>{t("Instant Scholarship Eligibility Matcher", "झटपट शिष्यवृत्ती पात्रता शोधक", "तुरंत छात्रवृत्ति पात्रता जांचें")}</span>
              </h3>
              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300">{t("Your Course / Level", "तुमचा कोर्स / शिक्षण", "आपका कोर्स")}</label>
                  <select value={filterCourse} onChange={(e) => setFilterCourse(e.target.value)} className="input-field mt-1 text-xs">
                    <option value="all">{t("All Courses", "सर्व कोर्सेस", "सभी कोर्स")}</option>
                    <option value="eng">{t("Engineering / Diploma", "इंजिनिअरिंग / डिप्लोमा", "इंजीनियरिंग / डिप्लोमा")}</option>
                    <option value="degree">{t("B.Sc / B.Com / BA", "पदवी (B.Sc/B.Com/BA)", "स्नातक डिग्री")}</option>
                    <option value="medical">{t("Medical / Nursing", "वैद्यकीय / नर्सिंग", "मेडिकल / नर्सिंग")}</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300">{t("Family Annual Income", "कुटुंबाचे वार्षिक उत्पन्न", "पारिवारिक वार्षिक आय")}</label>
                  <select value={filterIncome} onChange={(e) => setFilterIncome(e.target.value)} className="input-field mt-1 text-xs">
                    <option value="all">{t("Any Income", "कोणतीही मर्यादा", "कोई भी सीमा")}</option>
                    <option value="2.5">{"<"} ₹2,50,000 / {t("yr", "वर्ष", "वर्ष")}</option>
                    <option value="8">{"<"} ₹8,00,000 / {t("yr (EBC Limit)", "वर्ष (EBC मर्यादा)", "वर्ष")}</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300">{t("Category", "संवर्ग (Category)", "संवर्ग")}</label>
                  <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="input-field mt-1 text-xs">
                    <option value="all">{t("All Categories", "सर्व प्रवर्ग", "सभी वर्ग")}</option>
                    <option value="open">Open / EBC</option>
                    <option value="obc">OBC / VJNT / SBC</option>
                    <option value="sc">SC / ST</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* List of Scholarships */}
          <div className="grid gap-4 sm:grid-cols-2">
            {scholarshipsData.map((sch, idx) => (
              <div key={idx} className="glass-card p-5 rounded-2xl flex flex-col justify-between border border-slate-800 hover:border-slate-600 transition-all">
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <span className="badge !bg-emerald-500/15 !text-emerald-400 text-xs font-bold">
                      {sch.category}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">📅 {sch.deadline}</span>
                  </div>

                  <h4 className="font-bold text-base text-white mt-2.5">
                    {lang === "mr" ? sch.titleMr : lang === "hi" ? sch.titleHi : sch.titleEn}
                  </h4>

                  <div className="mt-3 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
                    <span className="font-bold">{t("Benefit: ", "लाभ: ", "लाभ: ")}</span>
                    <span>{sch.benefit}</span>
                  </div>

                  <div className="mt-3 text-xs space-y-1 text-slate-300">
                    <p><span className="text-slate-400 font-semibold">{t("Income Limit: ", "उत्पन्न मर्यादा: ", "आय सीमा: ")}</span>{sch.income}</p>
                    <p><span className="text-slate-400 font-semibold">{t("Eligible Courses: ", "पात्र कोर्सेस: ", "पात्र कोर्स: ")}</span>{sch.course}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
                  <a
                    href={sch.officialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary !py-1.5 !px-3.5 text-xs flex items-center gap-1.5"
                  >
                    <span>{t("Apply on MahaDBT / Portal", "MahaDBT वर अर्ज करा", "पोर्टल पर आवेदन करें")}</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. CAREER GUIDE PILLAR */}
      {/* ========================================================================= */}
      {mainSection === "career" && (
        <div className="space-y-6">
          {/* Sub Navigation */}
          <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
            {[
              { id: "all", label: t("All Pathways", "सर्व करिअर मार्ग", "सभी रास्ते") },
              { id: "after_10th", label: t("After 10th", "१०वी नंतर", "10वीं के बाद") },
              { id: "after_12th", label: t("After 12th", "१२वी नंतर", "12वीं के बाद") },
              { id: "diploma", label: t("Diploma Path", "डिप्लोमा नंतर", "डिप्लोमा के बाद") },
              { id: "engineering", label: t("Engineering / Tech", "इंजिनिअरिंग व टेक", "इंजीनियरिंग") },
              { id: "gov_jobs", label: t("Govt Jobs Path", "शासकीय नोकरी", "सरकारी नौकरी") },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setSubSection(st.id)}
                className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-all ${
                  subSection === st.id ? "bg-emerald-600 text-white shadow-md" : "border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {careerData
              .filter((c) => subSection === "all" || c.sub === subSection)
              .map((item, idx) => (
                <div key={idx} className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
                  <h4 className="font-bold text-base text-katalyst-400 flex items-center gap-2">
                    <Compass className="h-5 w-5" />
                    <span>{lang === "mr" ? item.titleMr : lang === "hi" ? item.titleHi : item.titleEn}</span>
                  </h4>

                  <div className="space-y-3">
                    {item.paths.map((p, pidx) => (
                      <div key={pidx} className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/50 space-y-1">
                        <p className="font-bold text-xs sm:text-sm text-white">
                          {lang === "mr" ? p.nameMr : lang === "hi" ? p.nameHi : p.nameEn}
                        </p>
                        <p className="text-xs text-slate-300 leading-relaxed">{p.descEn}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. LEARNING & OFFLINE DOSSIERS PILLAR */}
      {/* ========================================================================= */}
      {mainSection === "learning" && (
        <div className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { titleEn: "MahaDBT & Schemes Complete Blueprint (PDF)", titleMr: "MahaDBT व शासकीय योजना संपूर्ण मार्गदर्शिका (PDF)", titleHi: "MahaDBT और योजना संपूर्ण गाइड (PDF)", size: "2.4 MB" },
              { titleEn: "MPSC / UPSC 90-Day Strategy & Booklist (PDF)", titleMr: "MPSC व स्पर्धा परीक्षा ९० दिवसांचे नियोजन (PDF)", titleHi: "MPSC/UPSC 90 दिवसीय रणनीति (PDF)", size: "3.2 MB" },
              { titleEn: "Essential Excel Formulas & Shortcuts Dossier", titleMr: "MS Excel ५०+ फॉर्म्युले व शॉर्टकट संचिका", titleHi: "MS Excel 50+ फॉर्मूला शीट", size: "1.9 MB" },
              { titleEn: "Caste Validity & Certificate Pre-1967 Proofs Dossier", titleMr: "जात पडताळणी व १९६७ पूर्वीचे पुरावे संचिका", titleHi: "जाति वैधता और 1967 प्रमाण गाइड", size: "2.8 MB" },
            ].map((pdf, idx) => (
              <div key={idx} className="glass-card p-5 rounded-2xl flex flex-col justify-between border border-slate-800 hover:border-slate-600 transition-all">
                <div>
                  <div className="flex justify-between items-center">
                    <span className="badge !bg-emerald-500/15 !text-emerald-400 text-xs">PDF Dossier</span>
                    <span className="text-xs text-slate-400 font-mono">{pdf.size}</span>
                  </div>
                  <h4 className="font-bold text-sm sm:text-base text-white mt-3">
                    {lang === "mr" ? pdf.titleMr : lang === "hi" ? pdf.titleHi : pdf.titleEn}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1">
                    {t("Download and read offline without internet access.", "इंटरनेट नसतानाही मोबाईल किंवा लॅपटॉपवर वाचण्यासाठी सेव्ह करा.", "बिना इंटरनेट ऑफलाइन पढ़ने के लिए डाउनलोड करें।")}
                  </p>
                </div>

                <button
                  onClick={() => alert(t(`Downloading: ${pdf.titleEn}`, `डाउनलोड सुरू झाले: ${pdf.titleMr}`, `डाउनलोड शुरू: ${pdf.titleHi}`))}
                  className="btn-primary !py-2 text-xs mt-4 flex items-center justify-center gap-2 w-full"
                >
                  <Download className="h-4 w-4" />
                  <span>{t("Download Offline PDF", "ऑफलाइन PDF डाऊनलोड करा", "डाउनलोड ऑफलाइन PDF")}</span>
                </button>
              </div>
            ))}
          </div>

          <div className="glass-card p-6 border border-slate-800 rounded-2xl">
            <h4 className="font-bold text-base text-white mb-2">
              {t("📹 Course Video Playlists", "📹 व्हिडिओ लेक्चर्स व कोर्सेस", "📹 कोर्स वीडियो लेक्चर्स")}
            </h4>
            <p className="text-xs text-slate-300 mb-4">
              {t("Looking for our full Udemy-style course video playlists? Access our interactive lecture player directly.", "संपूर्ण व्हिडिओ लेक्चर्स व प्लेलिस्ट पाहण्यासाठी कोर्स प्लेअर उघडा.", "पूरे वीडियो लेक्चर्स के लिए कोर्स प्लेयर खोलें।")}
            </p>
            <Link to="/student/trainings" className="btn-secondary !py-2 !px-4 text-xs inline-flex items-center gap-2">
              <span>▶</span>
              <span>{t("Open Video Courses & Playlists", "कोर्स व्हिडिओ प्लेलिस्ट उघडा", "कोर्स वीडियो प्लेलिस्ट खोलें")}</span>
            </Link>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. AI VOICE TUTOR PILLAR */}
      {/* ========================================================================= */}
      {mainSection === "ai_tutor" && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="glass-card p-6 border border-blue-500/40 bg-gradient-to-br from-slate-900 via-blue-950/20 to-slate-900 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="font-bold text-lg text-white">
                  {t("AI Voice & Text Tutor (मराठी • English • हिंदी)", "एआय व्हॉईस व टेक्स्ट ट्यूटर (मराठी • English • हिंदी)", "AI वॉयस एवं टेक्स्ट ट्यूटर")}
                </h3>
              </div>
              {isSpeaking && (
                <button onClick={stopSpeaking} className="btn-secondary !py-1 !px-2 text-xs !text-red-400">
                  ■ {t("Stop Audio", "आवाज बंद करा", "आवाज बंद करें")}
                </button>
              )}
            </div>

            <p className="text-xs text-slate-300">
              {t(
                "Ask any question regarding MahaDBT, MPSC syllabus, caste validity, or coding by voice or text.",
                "शिष्यवृत्ती, MPSC, जात वैधता किंवा कोडिंग बाबत कोणताही प्रश्न माईक द्वारे किंवा टाईप करून विचारा.",
                "स्कॉलरशिप, MPSC, जाति प्रमाण पत्र या कोडिंग से जुड़ा कोई भी सवाल बोलकर या लिखकर पूछें।"
              )}
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                value={aiInputText}
                onChange={(e) => setAiInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAiAsk()}
                placeholder={t("Type your question here (e.g. MPSC age limit)...", "येथे प्रश्न टाईप करा (उदा. EBC स्कॉलरशिप माहिती)...", "अपना सवाल यहां लिखें...")}
                className="input-field text-xs sm:text-sm"
              />
              <button
                onClick={startVoiceInput}
                className={`btn-secondary !px-3.5 flex items-center gap-1.5 ${isListening ? "!bg-red-600 !text-white animate-pulse" : ""}`}
                title="Speak Voice Question"
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4 text-emerald-400" />}
              </button>
              <button onClick={() => handleAiAsk()} className="btn-primary !px-4">
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Conversation History */}
          <div className="space-y-4">
            <h4 className="font-bold text-sm text-slate-400">
              {t("Previous Questions & Answers", "मागील प्रश्न व उत्तरे", "पिछले प्रश्न और उत्तर")}
            </h4>
            {conversationHistory.map((item, idx) => (
              <div key={idx} className="glass-card p-4 rounded-xl border border-slate-800 space-y-2">
                <p className="font-bold text-xs sm:text-sm text-white flex items-center gap-2">
                  <span>🗣️</span>
                  <span>{item.q}</span>
                </p>
                <p className="text-xs text-emerald-300 leading-relaxed pl-6 border-l-2 border-emerald-500/40">
                  {item.a}
                </p>
                <div className="flex justify-end pt-1">
                  <button onClick={() => speakText(item.a)} className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1">
                    <Volume2 className="h-3.5 w-3.5 text-katalyst-400" />
                    <span>{t("Listen Audio", "ऑडिओ ऐका", "ऑडियो सुनें")}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. DIGITAL SKILLS PILLAR */}
      {/* ========================================================================= */}
      {mainSection === "digital_skills" && (
        <div className="space-y-6">
          <div className="grid gap-5 md:grid-cols-2">
            {digitalSkillsData.map((skill, idx) => (
              <div key={idx} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{skill.icon}</span>
                  <h4 className="font-bold text-sm sm:text-base text-white">
                    {lang === "mr" ? skill.titleMr : lang === "hi" ? skill.titleHi : skill.titleEn}
                  </h4>
                </div>

                <ul className="space-y-1.5 text-xs text-slate-300 pt-2">
                  {skill.points.map((pt, pidx) => (
                    <li key={pidx} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. PROGRESS, BADGES & PRACTICE QUIZ PILLAR */}
      {/* ========================================================================= */}
      {mainSection === "progress" && (
        <div className="space-y-6">
          {/* Progress Cards */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="glass-card p-5 border-l-4 border-l-amber-500 rounded-2xl">
              <p className="text-xs text-slate-400">{t("Total Learning XP", "एकूण मिळालेले XP गुण", "कुल XP पॉइंट्स")}</p>
              <p className="text-2xl font-bold text-white mt-1">{userXp} XP</p>
              <p className="text-[11px] text-emerald-400 mt-1 font-semibold">{t("Level 4 • Explorer", "पातळी ४ • प्रगत", "लेवल 4")}</p>
            </div>
            <div className="glass-card p-5 border-l-4 border-l-emerald-500 rounded-2xl">
              <p className="text-xs text-slate-400">{t("Daily Streak", "दैनिक सातत्य", "डेली स्ट्रीक")}</p>
              <p className="text-2xl font-bold text-white mt-1">{streakDays} {t("Days 🔥", "दिवस 🔥", "दिन 🔥")}</p>
              <p className="text-[11px] text-slate-400 mt-1">{t("Keep learning daily!", "सातत्य कायम ठेवा!", "रोज सीखते रहें!")}</p>
            </div>
            <div className="glass-card p-5 border-l-4 border-l-purple-500 rounded-2xl">
              <p className="text-xs text-slate-400">{t("Weak Topics Radar", "सुधारणा आवश्यक विषय", "कमजोर विषय रडार")}</p>
              <p className="text-xs font-semibold text-purple-300 mt-1.5">{t("• Excel VLOOKUP Formulas", "• MS Excel फॉर्म्युले सराव", "• एक्सेल फॉर्मूला")}</p>
              <p className="text-xs font-semibold text-purple-300">{t("• MPSC CSAT Reasoning", "• MPSC CSAT बुद्धिमत्ता", "• रीजनिंग")}</p>
            </div>
          </div>

          {/* Interactive Practice Quiz */}
          <div className="glass-card p-6 border border-slate-800 rounded-2xl space-y-4 max-w-2xl mx-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h4 className="font-bold text-base text-white">
                {t("🧪 3-Minute Knowledge Check Quiz", "🧪 ३ मिनिटांची सामान्य ज्ञान व योजना चाचणी", "🧪 3 मिनट नॉलेज चेक टेस्ट")}
              </h4>
              {quizScore !== null && (
                <span className="badge !bg-emerald-500/20 !text-emerald-400 font-bold">
                  Score: {quizScore} / {mockQuiz.length}
                </span>
              )}
            </div>

            <div className="space-y-4">
              {mockQuiz.map((qItem, qIdx) => (
                <div key={qIdx} className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/40 space-y-2 text-xs">
                  <p className="font-semibold text-white">{qIdx + 1}. {qItem.q}</p>
                  <div className="space-y-1.5">
                    {qItem.opts.map((opt, oIdx) => (
                      <label key={oIdx} className="flex items-center gap-2 p-2 rounded-lg border border-slate-800 hover:border-slate-600 cursor-pointer">
                        <input
                          type="radio"
                          name={`quiz_${qIdx}`}
                          checked={quizAnswers[qIdx] === oIdx}
                          onChange={() => setQuizAnswers({ ...quizAnswers, [qIdx]: oIdx })}
                        />
                        <span className="text-slate-200">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              <button onClick={handleQuizSubmit} className="btn-primary w-full !py-2 text-xs font-bold">
                {t("Submit Quiz & Earn 50 XP 🏆", "चाचणी सबमिट करा व गुण मिळवा 🏆", "सबमिट टेस्ट एवं 50 XP पाएं 🏆")}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
