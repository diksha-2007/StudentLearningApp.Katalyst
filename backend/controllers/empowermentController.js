const EmpowermentResource = require("../models/EmpowermentResource");

// Preloaded verified starter resources (English & Marathi)
const DEFAULT_RESOURCES = [
  {
    type: "scheme",
    titleEn: "Rajarshi Chhatrapati Shahu Maharaj Shikshan Shulkh Shishyavrutti Yojna (EBC)",
    titleMr: "राजर्षी छत्रपती शाहू महाराज शिक्षण शुल्क शिष्यवृत्ती योजना (EBC)",
    descriptionEn: "50% tuition and exam fee reimbursement for Economically Backward Class (EBC) students pursuing Higher & Technical Education (Engineering, Medical, Diploma, Degree) in Maharashtra.",
    descriptionMr: "महाराष्ट्रातील उच्च व तंत्रशिक्षण (अभियांत्रिकी, पदविका, पदवी) घेणाऱ्या आर्थिकदृष्ट्या दुर्बल घटकातील (EBC) विद्यार्थ्यांना ५०% शैक्षणिक शुल्क प्रतिपूर्ती.",
    category: "Higher Education",
    badge: "Government Scheme",
    icon: "🏛️",
    benefitsEn: "50% tuition & exam fee waiver directly credited to college/student account.",
    benefitsMr: "५०% शैक्षणिक शुल्क आणि परीक्षा शुल्क थेट खात्यात किंवा महाविद्यालयास प्रतिपूर्ती.",
    eligibilityEn: [
      "Family annual income up to ₹8,00,000",
      "Maharashtra Domicile certificate required",
      "Admitted through CAP (Centralized Admission Process)",
      "Maximum 2 beneficiaries per family"
    ],
    eligibilityMr: [
      "कुटुंबाचे वार्षिक उत्पन्न ₹८,००,००० पर्यंत असणे आवश्यक",
      "महाराष्ट्र अधिवास (Domicile) प्रमाणपत्र आवश्यक",
      "CAP (केंद्रीभूत प्रवेश प्रक्रिया) द्वारे प्रवेश घेतलेला असावा",
      "एका कुटुंबातील जास्तीत जास्त २ अपत्यांना लाभ"
    ],
    documentsRequiredEn: ["Income Certificate (Tehsildar)", "Domicile Certificate", "CAP Allotment Letter", "Aadhaar Card", "Bank Passbook"],
    documentsRequiredMr: ["उत्पन्नाचा दाखला (तहसीलदार)", "अधिवास दाखला (Domicile)", "CAP प्रवेश वाटप पत्र", "आधार कार्ड", "बँक पासबुक"],
    applicationStepsEn: ["Register on MahaDBT Portal", "Select Directorate of Higher / Technical Education", "Upload verified documents", "Submit to college verification"],
    applicationStepsMr: ["MahaDBT पोर्टलवर नोंदणी करा", "उच्च व तंत्रशिक्षण संचालनालय निवडा", "आवश्यक कागदपत्रे अपलोड करा", "कॉलेज स्तरावर छाननीसाठी सबमिट करा"],
    officialUrl: "https://mahadbt.maharashtra.gov.in",
    portalName: "MahaDBT Portal",
    district: "All Maharashtra Districts",
  },
  {
    type: "scheme",
    titleEn: "Dr. Babasaheb Ambedkar Swadhar Yojana (Social Justice Dept)",
    titleMr: "डॉ. बाबासाहेब आंबेडकर स्वाधार योजना (समाज कल्याण विभाग)",
    descriptionEn: "Financial allowance of ₹51,000 to ₹60,000 per year for SC & Nav-Bouddha students studying in higher education who did not get admission to government hostels.",
    descriptionMr: "शासकीय वसतिगृहात प्रवेश न मिळालेल्या अनुसूचित जाती व नवबौद्ध विद्यार्थ्यांना भोजन, निवास व इतर शैक्षणिक खर्चासाठी वार्षिक ₹५१,००० ते ₹६०,००० थेट भत्ता.",
    category: "Hostel & Living Allowance",
    badge: "Living Allowance",
    icon: "🏠",
    benefitsEn: "₹51,000 to ₹60,000 per year directly to student bank account for food & accommodation.",
    benefitsMr: "भोजन, निवास आणि स्टेशनरी खर्चासाठी वार्षिक ₹५१,००० ते ₹६०,००० थेट बँक खात्यात जमा.",
    eligibilityEn: ["SC / Nav-Bouddha category", "Family annual income below ₹2,50,000", "Studying in recognized professional / non-professional college"],
    eligibilityMr: ["अनुसूचित जाती / नवबौद्ध संवर्ग", "कुटुंबाचे वार्षिक उत्पन्न ₹२,५०,००० पेक्षा कमी", "मान्यताप्राप्त महाविद्यालयात पदवी किंवा पदविका शिक्षण"],
    documentsRequiredEn: ["Caste Certificate & Validity", "Hostel Non-Admission certificate", "Rent Agreement / Proof", "College ID Card"],
    documentsRequiredMr: ["जात प्रमाणपत्र व वैधता (Validity)", "वसतिगृह प्रवेश न मिळाल्याचा दाखला", "भाडेकरार / वास्तव्याचा पुरावा", "कॉलेज ओळखपत्र"],
    applicationStepsEn: ["Download Swadhar Form from Social Welfare Department", "Attach verified college certificates", "Submit to Assistant Commissioner Social Welfare office"],
    applicationStepsMr: ["समाज कल्याण कार्यालयातून किंवा अधिकृत पोर्टलवरून अर्ज डाउनलोड करा", "कॉलेजची स्वाक्षरी घेऊन कागदपत्रे जोडा", "जिल्हा समाज कल्याण कार्यालयात जमा करा"],
    officialUrl: "https://sjsa.maharashtra.gov.in",
    portalName: "Social Justice Dept, Maharashtra",
    district: "All Maharashtra Districts",
  },
  {
    type: "scholarship",
    titleEn: "National Scholarship Portal (NSP) - Central Sector Scheme",
    titleMr: "राष्ट्रीय शिष्यवृत्ती पोर्टल (NSP) - केंद्रीय क्षेत्र शिष्यवृत्ती",
    descriptionEn: "Merit-cum-means financial assistance of ₹12,000/year for undergraduate and ₹20,000/year for postgraduate students scoring above 80th percentile in Class 12.",
    descriptionMr: "१२वी परीक्षेत ८० पर्सेंटाईलपेक्षा जास्त गुण मिळवणाऱ्या गुणवंत विद्यार्थ्यांना पदवीसाठी ₹१२,०००/वर्ष आणि पदव्युत्तर शिक्षणासाठी ₹२०,०००/वर्ष शिष्यवृत्ती.",
    category: "Merit Scholarship",
    badge: "Central Govt",
    icon: "🎓",
    benefitsEn: "₹12,000 per annum for 3-4 years of graduation + ₹20,000/yr in PG.",
    benefitsMr: "पदवीच्या ३ ते ४ वर्षांसाठी वार्षिक ₹१२,००० आणि पदव्युत्तरसाठी ₹२०,०००.",
    eligibilityEn: ["Above 80th percentile in 12th Board exam", "Regular full-time degree college student", "Family income under ₹4.5 Lakhs/yr"],
    eligibilityMr: ["१२वी बोर्ड परीक्षेत ८० पर्सेंटाईलपेक्षा अधिक गुण", "नियमित पदवी महाविद्यालयात प्रवेशित", "वार्षिक उत्पन्न ₹४.५ लाखांपेक्षा कमी"],
    documentsRequiredEn: ["12th Marksheet", "Income Certificate", "Bonafide Certificate from College", "Aadhaar Linked Bank Account"],
    documentsRequiredMr: ["१२वी गुणपत्रिका", "उत्पन्नाचा दाखला", "महाविद्यालयाचे बोनाफाईड प्रमाणपत्र", "आधार संलग्न बँक खाते"],
    applicationStepsEn: ["Apply online on scholarships.gov.in", "Institute verification by Nodal Officer", "Direct Benefit Transfer (DBT) payment"],
    applicationStepsMr: ["scholarships.gov.in वर ऑनलाइन नोंदणी करा", "कॉलेजच्या नोडल अधिकाऱ्याकडून छाननी करून घ्या", "थेट बँक खात्यात DBT द्वारे रक्कम जमा"],
    officialUrl: "https://scholarships.gov.in",
    portalName: "National Scholarship Portal",
    district: "All India / Maharashtra",
  },
  {
    type: "exam",
    titleEn: "MPSC (Maharashtra Public Service Commission) - Civil & Subordinate Services",
    titleMr: "MPSC (महाराष्ट्र लोकसेवा आयोग) - राज्यसेवा व दुय्यम सेवा स्पर्धा परीक्षा",
    descriptionEn: "Complete roadmap and syllabus for Deputy Collector, Tehsildar, DySP, PSI, STI, and ASO posts across Maharashtra Government.",
    descriptionMr: "उपजिल्हाधिकारी, तहसीलदार, उपअधीक्षक (DySP), PSI, STI, ASO पदांसाठी परीक्षा पद्धत, अभ्यासक्रम व तयारीची दिशा.",
    category: "Civil Services",
    badge: "State Govt Job",
    icon: "📝",
    benefitsEn: "Group A & Group B Gazetted Officer posts with high social impact and job security.",
    benefitsMr: "वर्ग १ व वर्ग २ ची राजपत्रित पदे, प्रशासकीय प्रतिष्ठा व कायमस्वरूपी शासकीय नोकरी.",
    eligibilityEn: ["Any Recognized Graduate Degree", "Age: 19 to 38 years (Relaxation for backward categories)", "Marathi language proficiency"],
    eligibilityMr: ["कोणत्याही शाखेतील पदवीधर (Graduation)", "वय: १९ ते ३८ वर्षे (मागासवर्गीयांसाठी सवलत)", "मराठी भाषेचे उत्तम ज्ञान"],
    documentsRequiredEn: ["Graduation Degree / Final Year Marksheet", "Domicile Certificate", "Non-Creamy Layer (if applicable)"],
    documentsRequiredMr: ["पदवी गुणपत्रिका व प्रमाणपत्र", "महाराष्ट्र अधिवास दाखला", "नॉन-क्रिमीलेअर (लागू असल्यास)"],
    applicationStepsEn: ["Create profile on mpsconline.gov.in", "Prelims Exam (GS + CSAT)", "Mains Exam (Descriptive/Objective)", "Interview"],
    applicationStepsMr: ["mpsconline.gov.in वर प्रोफाईल तयार करा", "पूर्व परीक्षा (GS + CSAT)", "मुख्य परीक्षा", "मुलाखत (राज्यसेवा)"],
    officialUrl: "https://mpsc.gov.in",
    portalName: "MPSC Online Portal",
    district: "All Maharashtra Districts",
  },
  {
    type: "form_guide",
    titleEn: "Step-by-Step Guide: Caste Validity Certificate (जात वैधता प्रमाणपत्र)",
    titleMr: "सविस्तर मार्गदर्शक: जात वैधता प्रमाणपत्र (Caste Validity Certificate)",
    descriptionEn: "How to apply for Scrutiny and get Caste Validity Certificate on CCVIS / Barti portal with zero errors.",
    descriptionMr: "CCVIS / बार्टी पोर्टलवर जात वैधता प्रमाणपत्रासाठी अचूक अर्ज करण्याची संपूर्ण सोपी पद्धत.",
    category: "Certificate Guide",
    badge: "Official Certificate",
    icon: "📄",
    benefitsEn: "Essential for engineering/medical admissions, scholarships, reserved category employment, and government benefits.",
    benefitsMr: "इंजिनिअरिंग/मेडिकल प्रवेश, शिष्यवृत्ती, शासकीय नोकऱ्या आणि आरक्षणाचा लाभ घेण्यासाठी अत्यावश्यक.",
    eligibilityEn: ["Candidate possessing valid Caste Certificate issued by Sub-Divisional Officer (SDO) in Maharashtra"],
    eligibilityMr: ["उपविभागीय अधिकारी (SDO) यांनी दिलेले अधिकृत जात प्रमाणपत्र असलेले विद्यार्थी"],
    documentsRequiredEn: [
      "Original Caste Certificate",
      "Form 16/16A from College Principal",
      "School Leaving Certificate of Applicant (mentioning caste)",
      "Father's / Grandfather's School Leaving Certificate or Pre-1967 revenue/birth records",
      "Affidavit on ₹100 Stamp Paper (Form 3 & Form 17)"
    ],
    documentsRequiredMr: [
      "मूळ जात प्रमाणपत्र",
      "महाविद्यालयीन प्राचार्यांचे फॉर्म १६/१६-अ शिफारस पत्र",
      "अर्जदाराचा शाळा सोडल्याचा दाखला (TC/LC - जातीचा स्पष्ट उल्लेख)",
      "वडील / आजोबांचा शाळा सोडल्याचा दाखला किंवा १९६७ पूर्वीचा महसुली/जन्म पुरावा",
      "₹१०० च्या स्टॅम्प पेपरवर प्रतिज्ञापत्र (Form 3 व Form 17)"
    ],
    applicationStepsEn: [
      "Visit ccvis.maharashtra.gov.in or barti.maharashtra.gov.in",
      "Fill online application with family genealogical tree (वंशावळ)",
      "Upload verified colored scanned documents",
      "Submit physical file with principal signature to District Caste Scrutiny Committee",
      "Track status online using application token"
    ],
    applicationStepsMr: [
      "ccvis.maharashtra.gov.in किंवा barti.maharashtra.gov.in वर जा",
      "ऑनलाइन अर्जात संपूर्ण वंशावळ (Family Tree) भरा",
      "सर्व कागदपत्रांच्या रंगीत स्कॅन प्रती अपलोड करा",
      "प्राचार्यांच्या सहीसह कागदपत्रांची फाईल जिल्हा जात पडताळणी समितीकडे जमा करा",
      "टोकन नंबरद्वारे अर्जाची सद्यस्थिती तपासा"
    ],
    officialUrl: "https://ccvis.maharashtra.gov.in",
    portalName: "Caste Certificate Scrutiny System",
    district: "All Maharashtra Districts",
  },
  {
    type: "digital_skill",
    titleEn: "Essential Digital Skills for Jobs: MS Office, Email & Cyber Safety",
    titleMr: "रोजगारासाठी आवश्यक डिजिटल कौशल्ये: MS Office, ईमेल व सायबर सुरक्षा",
    descriptionEn: "Master MS Excel, professional emailing, digital payment safety, online form submission, and resume creation on smartphone/laptop.",
    descriptionMr: "मोबाईल व लॅपटॉपवर MS Excel, व्यावसायिक ईमेल, डिजिटल पेमेंट सुरक्षा, ऑनलाइन फॉर्म भरणे आणि आकर्षक रेझ्युमे बनवणे शिका.",
    category: "Job Readiness",
    badge: "Free Skill Track",
    icon: "🧑‍💻",
    benefitsEn: "Qualify for back-office, data entry, tech support, virtual assistant, and administrative job roles.",
    benefitsMr: "डेटा एन्ट्री, बॅक-ऑफिस, प्रशासकीय सहाय्यक आणि तंत्रज्ञान सहाय्यक नोकऱ्यांसाठी तत्काळ पात्र व्हा.",
    eligibilityEn: ["Open to all 10th, 12th, and College students with mobile or computer access"],
    eligibilityMr: ["१०वी, १२वी आणि सर्व महाविद्यालयीन विद्यार्थ्यांसाठी विनामूल्य उपलब्ध"],
    documentsRequiredEn: ["Smartphone or Computer", "Internet Connection"],
    documentsRequiredMr: ["स्मार्टफोन किंवा संगणक", "इंटरनेट कनेक्शन"],
    applicationStepsEn: [
      "Practice spreadsheet formulas (SUM, AVERAGE, VLOOKUP, FILTER)",
      "Learn formal email drafting etiquette",
      "Practice OTP safety, 2FA, and phishing protection",
      "Build ATS-friendly resume using free Canva/Google Docs templates"
    ],
    applicationStepsMr: [
      "स्प्रेडशीट फॉर्म्युले (SUM, VLOOKUP, FILTER) चा सराव करा",
      "व्यावसायिक ईमेल लिहिण्याची पद्धत शिका",
      "OTP सुरक्षा, टू-फॅक्टर ऑथेंटिकेशन आणि सायबर फ्रॉड टाळणे शिका",
      "Google Docs किंवा Canva द्वारे आधुनिक रेझ्युमे तयार करा"
    ],
    officialUrl: "https://katalyst.io",
    portalName: "Katalyst Digital Literacy Track",
    district: "All Districts",
  },
  {
    type: "opportunity",
    titleEn: "Maharashtra State Skill Development Society (MSSDS) Free Training Centers",
    titleMr: "महाराष्ट्र राज्य कौशल्य विकास संस्था (MSSDS) मोफत प्रशिक्षण केंद्रे",
    descriptionEn: "Free employment-linked technical & IT training with government certification and job placement support in every district.",
    descriptionMr: "प्रत्येक जिल्ह्यातील तरुणांसाठी शासनातर्फे मोफत तांत्रिक, आयटी आणि कौशल्य प्रशिक्षण व नोकरीच्या संधी.",
    category: "Vocational & Tech Training",
    badge: "Free Govt Training",
    icon: "📍",
    benefitsEn: "100% Free Course + NSDC / Skill India Certificate + Placement Assistance.",
    benefitsMr: "१००% मोफत प्रशिक्षण + सरकारी प्रमाणपत्र + नोकरीसाठी थेट मार्गदर्शन.",
    eligibilityEn: ["Age 15 to 35 years", "Minimum 8th, 10th or 12th pass"],
    eligibilityMr: ["वय १५ ते ३५ वर्षे", "किमान ८वी, १०वी किंवा १२वी उत्तीर्ण"],
    documentsRequiredEn: ["Aadhaar Card", "Education Marksheet", "Passport Size Photo"],
    documentsRequiredMr: ["आधार कार्ड", "शैक्षणिक गुणपत्रिका", "पासपोर्ट फोटो"],
    applicationStepsEn: ["Visit mahaswayam.gov.in", "Search district training centers", "Enroll in your preferred sector"],
    applicationStepsMr: ["mahaswayam.gov.in पोर्टलवर नोंदणी करा", "आपल्या जिल्ह्यातील प्रशिक्षण केंद्र निवडा", "कोर्ससाठी नावनोंदणी करा"],
    officialUrl: "https://mahaswayam.gov.in",
    portalName: "MahaSwayam Portal",
    district: "Pune, Mumbai, Nagpur, Nashik, Aurangabad, Kolhapur, Solapur, Amravati, Nanded",
  }
];

// @desc Get all empowerment resources with optional type, category, or search filters
// @route GET /api/empowerment
const getAllResources = async (req, res) => {
  try {
    const { type, category, district, search } = req.query;
    let count = await EmpowermentResource.countDocuments();
    if (count === 0) {
      await EmpowermentResource.insertMany(DEFAULT_RESOURCES);
    }

    const filter = {};
    if (type && type !== "all") filter.type = type;
    if (category && category !== "all") filter.category = category;
    if (district && district !== "all") {
      filter.$or = [
        { district: { $regex: district, $options: "i" } },
        { district: { $regex: "All", $options: "i" } },
      ];
    }
    if (search) {
      filter.$or = [
        { titleEn: { $regex: search, $options: "i" } },
        { titleMr: { $regex: search, $options: "i" } },
        { descriptionEn: { $regex: search, $options: "i" } },
        { descriptionMr: { $regex: search, $options: "i" } },
      ];
    }

    const resources = await EmpowermentResource.find(filter).sort({ createdAt: -1 });
    res.json({ resources, count: resources.length });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Get single resource by ID
// @route GET /api/empowerment/:id
const getResourceById = async (req, res) => {
  try {
    const resource = await EmpowermentResource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: "Resource not found" });
    res.json({ resource });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Create new resource (Admin)
// @route POST /api/empowerment
const createResource = async (req, res) => {
  try {
    const resource = await EmpowermentResource.create(req.body);
    res.status(201).json({ message: "Resource added successfully", resource });
  } catch (error) {
    res.status(500).json({ message: "Failed to create resource", error: error.message });
  }
};

// @desc Update resource (Admin)
// @route PUT /api/empowerment/:id
const updateResource = async (req, res) => {
  try {
    const resource = await EmpowermentResource.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!resource) return res.status(404).json({ message: "Resource not found" });
    res.json({ message: "Resource updated successfully", resource });
  } catch (error) {
    res.status(500).json({ message: "Failed to update resource", error: error.message });
  }
};

// @desc Delete resource (Admin)
// @route DELETE /api/empowerment/:id
const deleteResource = async (req, res) => {
  try {
    const resource = await EmpowermentResource.findByIdAndDelete(req.params.id);
    if (!resource) return res.status(404).json({ message: "Resource not found" });
    res.json({ message: "Resource deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete resource", error: error.message });
  }
};

module.exports = {
  getAllResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
};
