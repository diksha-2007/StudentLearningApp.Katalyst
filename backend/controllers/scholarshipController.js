// Controller for Public and Private Scholarships

const scholarshipsData = [
  // ==================== PUBLIC / GOVERNMENT SCHOLARSHIPS ====================
  {
    id: "pub-01",
    title: "AICTE Pragati Scholarship for Girls (Degree & Diploma)",
    provider: "All India Council for Technical Education (AICTE), Govt. of India",
    type: "Public",
    category: "Women in STEM",
    educationLevel: "Undergraduate / Diploma",
    course: "B.Tech / B.E / Polytechnic Diploma in Technical Courses",
    amount: "₹50,000 per annum",
    amountNumeric: 50000,
    deadline: "2026-10-31",
    status: "Active",
    tags: ["Government", "Women in Tech", "AICTE", "Merit-cum-Means"],
    description: "Empowers young women pursuing technical degrees/diplomas in AICTE-approved institutions with financial grant of ₹50,000 every year towards tuition and college expenses.",
    eligibility: {
      gender: "Female",
      maxFamilyIncome: 800000,
      minPercentage: 60,
      allowedCourses: ["B.Tech", "B.E", "B.Arch", "B.Pharm", "Diploma"],
      criteriaList: [
        "Only female students admitted to the 1st year or 2nd year (via lateral entry) of degree/diploma programs.",
        "Must be enrolled in an AICTE approved college or university.",
        "Total family annual income must not exceed ₹8 Lakhs from all sources.",
        "Maximum two girl children per family are eligible.",
      ],
    },
    benefits: [
      "₹50,000 per annum for each year of study (up to 4 years for Degree, 3 years for Diploma).",
      "Direct Benefit Transfer (DBT) straight into the student's Aadhaar-seeded bank account.",
      "Continuation based on academic progression without backlogs.",
    ],
    documentsRequired: [
      "Class 10th & 12th Marksheets",
      "Admission letter issued by the Centralized Admission Authority",
      "Tuition fee receipt of the current academic year",
      "Annual Family Income Certificate issued by Competent Authority (Tehsildar/SDM)",
      "Aadhaar Card linked with active Bank Account",
      "Bonafide Certificate from Head of Institute",
    ],
    applicationProcess: [
      "Visit the National Scholarship Portal (NSP) or AICTE portal.",
      "Register using your Aadhaar number and fill in personal details.",
      "Select 'AICTE - Pragati Scholarship Scheme' under Schemes menu.",
      "Upload verified documents and submit the application for institute-level verification.",
    ],
    officialLink: "https://www.aicte-india.org/schemes/students-development-schemes/pragati",
    portalName: "National Scholarship Portal (NSP)",
  },
  {
    id: "pub-02",
    title: "Central Sector Scheme of Scholarships for College and University Students",
    provider: "Department of Higher Education, Ministry of Education, Govt. of India",
    type: "Public",
    category: "Merit-Based",
    educationLevel: "Undergraduate / Postgraduate",
    course: "Any Regular UG/PG Degree (Engineering, Medical, Commerce, Science, Arts)",
    amount: "₹12,000 to ₹20,000 per annum",
    amountNumeric: 20000,
    deadline: "2026-11-15",
    status: "Active",
    tags: ["Government", "Ministry of Education", "National", "Merit"],
    description: "Financial assistance to meritorious students from low-income families to meet day-to-day expenses while pursuing higher studies in college and universities.",
    eligibility: {
      gender: "All",
      maxFamilyIncome: 450000,
      minPercentage: 80,
      allowedCourses: ["B.Tech", "B.Sc", "B.Com", "B.A", "MBBS", "M.Tech", "M.Sc", "M.A"],
      criteriaList: [
        "Students scoring above 80th percentile in relevant stream in Class 12th board exams.",
        "Pursuing regular full-time degree courses in recognized colleges/universities.",
        "Gross family annual income must not exceed ₹4.50 Lakhs per annum.",
        "Student must not be receiving any other government scholarship.",
      ],
    },
    benefits: [
      "₹12,000 per annum at Graduation level for first 3 years.",
      "₹20,000 per annum at Post-Graduation level (4th and 5th year for professional courses).",
      "Disbursed directly via PFMS into Aadhaar linked account.",
    ],
    documentsRequired: [
      "Class 12th passing certificate & marksheet",
      "Valid Income Certificate",
      "Proof of admission in full-time college program",
      "Bank passbook copy with IFSC and account number",
      "Caste / Disability Certificate (if applicable)",
    ],
    applicationProcess: [
      "Register on NSP (scholarships.gov.in) with student basic profile.",
      "Enter Class 12 board roll number and year to verify percentile eligibility.",
      "Fill college details, upload documents, and submit.",
    ],
    officialLink: "https://scholarships.gov.in",
    portalName: "National Scholarship Portal (NSP)",
  },
  {
    id: "pub-03",
    title: "Prime Minister's Special Scholarship Scheme (PMSSS) for J&K and Ladakh",
    provider: "AICTE & Ministry of Education, Govt. of India",
    type: "Public",
    category: "Regional & Need-Based",
    educationLevel: "Undergraduate",
    course: "Engineering (B.Tech), General Degree, Medical (MBBS/BDS)",
    amount: "Full Tuition Fee + ₹1,00,000 per year Maintenance Allowance",
    amountNumeric: 250000,
    deadline: "2026-09-30",
    status: "Active",
    tags: ["Government", "Full Tuition", "Hostel Allowance", "AICTE"],
    description: "A prestigious scholarship scheme aimed at building youth capabilities and providing full financial support for students of J&K and Ladakh to study in premier institutes across India.",
    eligibility: {
      gender: "All",
      maxFamilyIncome: 800000,
      minPercentage: 60,
      allowedCourses: ["B.Tech", "B.E", "B.Sc", "B.Com", "MBBS", "B.Arch"],
      criteriaList: [
        "Domicile of UTs of Jammu & Kashmir and Ladakh.",
        "Passed 10+2 examination from JKBOSE or CBSE affiliated schools in J&K/Ladakh.",
        "Family income less than ₹8 Lakhs per annum.",
        "Admission secured through AICTE centralized counselling.",
      ],
    },
    benefits: [
      "100% academic tuition fee waiver paid directly to the institution (up to ₹1.25 Lakh for Engineering).",
      "₹1,00,000 annual maintenance allowance paid in 10 equal instalments directly to student account.",
    ],
    documentsRequired: [
      "Domicile Certificate of J&K or Ladakh",
      "Class 10th and 12th Marksheet",
      "Valid Income Certificate",
      "Category / PwD Certificate (if applicable)",
      "Aadhaar Card",
    ],
    applicationProcess: [
      "Online registration on the AICTE PMSSS portal.",
      "Document verification at designated Facilitation Centers in J&K/Ladakh.",
      "Choice filling of colleges & courses, followed by merit-based seat allotment.",
    ],
    officialLink: "https://www.aicte-jk-scholarship-gov.in",
    portalName: "AICTE PMSSS Portal",
  },
  {
    id: "pub-04",
    title: "ONGC Foundation Scholarship for Meritorious Students",
    provider: "Oil and Natural Gas Corporation (ONGC) Foundation, Govt. of India",
    type: "Public",
    category: "Merit-cum-Means",
    educationLevel: "Undergraduate / Postgraduate",
    course: "Engineering (B.Tech), MBBS, MBA, Master in Geophysics/Geology",
    amount: "₹48,000 per annum",
    amountNumeric: 48000,
    deadline: "2026-10-15",
    status: "Active",
    tags: ["PSU", "ONGC", "Engineering", "SC/ST/OBC/General"],
    description: "ONGC awards 4,000 scholarships annually across India to meritorious undergraduate and postgraduate students from economically disadvantaged backgrounds.",
    eligibility: {
      gender: "All",
      maxFamilyIncome: 200000,
      minPercentage: 60,
      allowedCourses: ["B.Tech", "MBBS", "MBA", "M.Sc Geology", "M.Sc Geophysics"],
      criteriaList: [
        "Student enrolled in 1st year of Engineering or MBBS (UG), or MBA/Geology (PG).",
        "Minimum 60% marks in 12th for UG courses, or 60% in graduation for PG.",
        "Gross annual family income from all sources must be less than ₹2,00,000.",
        "Age limit: Not more than 30 years as of application date.",
      ],
    },
    benefits: [
      "₹4,000 per month (₹48,000 per annum) disbursed annually.",
      "Zone-wise selection ensuring equal representation across North, South, East, West, and Central India.",
    ],
    documentsRequired: [
      "Class 12th / Graduation Marksheet",
      "Income Certificate in Hindi/English from competent revenue authority",
      "Admission proof from College with fee structure",
      "Copy of PAN Card & Aadhaar Card",
      "Bank account details (Cancelled cheque / passbook copy)",
    ],
    applicationProcess: [
      "Visit the ONGC Foundation scholarship portal.",
      "Register online and complete the application with academic and financial details.",
      "Upload scanned copies of required certificates and submit.",
    ],
    officialLink: "https://www.ongcscholar.org",
    portalName: "ONGC Scholar Portal",
  },
  {
    id: "pub-05",
    title: "AICTE Saksham Scholarship Scheme for Specially-Abled Students",
    provider: "AICTE, Ministry of Education, Govt. of India",
    type: "Public",
    category: "Specially-Abled / PwD",
    educationLevel: "Undergraduate / Diploma",
    course: "B.Tech / Technical Degrees / Diploma Programs",
    amount: "₹50,000 per annum",
    amountNumeric: 50000,
    deadline: "2026-10-31",
    status: "Active",
    tags: ["Government", "PwD", "AICTE", "Technical Education"],
    description: "Specially designed initiative to encourage and support specially-abled students with disability not less than 40% to pursue technical education.",
    eligibility: {
      gender: "All",
      maxFamilyIncome: 800000,
      minPercentage: 50,
      allowedCourses: ["B.Tech", "B.E", "Diploma", "B.Pharm"],
      criteriaList: [
        "Specially-abled students having disability of not less than 40%.",
        "Admitted to 1st year of degree/diploma or 2nd year through lateral entry in AICTE approved college.",
        "Family income limit: Less than ₹8 Lakhs per annum.",
      ],
    },
    benefits: [
      "₹50,000 per annum for every year of study towards college fee, books, equipment, and software.",
    ],
    documentsRequired: [
      "Disability Certificate issued by Competent Medical Authority (minimum 40% disability)",
      "Class 10th & 12th Marksheet",
      "Income Certificate",
      "College Admission & Fee receipt",
    ],
    applicationProcess: [
      "Apply via National Scholarship Portal (NSP).",
      "Select 'AICTE Saksham Scheme' under Ministry of Education / AICTE section.",
    ],
    officialLink: "https://scholarships.gov.in",
    portalName: "National Scholarship Portal",
  },

  // ==================== PRIVATE / CORPORATE CSR SCHOLARSHIPS ====================
  {
    id: "pvt-01",
    title: "Reliance Foundation Undergraduate & Postgraduate Scholarships",
    provider: "Reliance Foundation (Corporate CSR)",
    type: "Private",
    category: "Merit-cum-Means",
    educationLevel: "Undergraduate / Postgraduate",
    course: "All UG Streams (Engineering, Science, Commerce, Arts) & PG in AI/CS/Engg",
    amount: "Up to ₹2,00,000 (UG) & ₹6,00,000 (PG)",
    amountNumeric: 200000,
    deadline: "2026-10-20",
    status: "Active",
    tags: ["Corporate CSR", "High Value", "Merit", "Leadership Development"],
    description: "One of India's largest private scholarship initiatives, supporting 5,000 undergraduate and 100 postgraduate scholars with financial grants, mentorship workshops, and leadership training.",
    eligibility: {
      gender: "All",
      maxFamilyIncome: 1500000,
      minPercentage: 60,
      allowedCourses: ["B.Tech", "B.Sc", "B.Com", "B.A", "MBBS", "BBA", "M.Tech in CS/AI", "M.Sc"],
      criteriaList: [
        "First-year full-time undergraduate or postgraduate students in any recognized Indian college.",
        "Passed Standard 12th with a minimum of 60% marks.",
        "Household income preference up to ₹2.5 Lakhs (households up to ₹15 Lakhs can also apply).",
        "Mandatory participation in an online aptitude and general reasoning test.",
      ],
    },
    benefits: [
      "UG Scholars: Up to ₹2,00,000 over the duration of the degree course.",
      "PG Scholars: Up to ₹6,00,000 plus tech development workshops.",
      "Direct access to Reliance leadership talks, soft skill training, and alumni network.",
    ],
    documentsRequired: [
      "Class 10th & 12th Marksheet",
      "Current college Bonafide Certificate / Admission confirmation",
      "Family Income Proof (ITR / Salary Slip / Income Certificate from Tehsildar)",
      "Passport size photograph and ID proof",
    ],
    applicationProcess: [
      "Complete the online application form on the Reliance Foundation scholarship portal.",
      "Take the mandatory 60-minute online cognitive test.",
      "Shortlisted candidates undergo application review and final selection announcement.",
    ],
    officialLink: "https://www.scholarships.reliancefoundation.org",
    portalName: "Reliance Foundation Portal",
  },
  {
    id: "pvt-02",
    title: "Tata Trusts Means and Merit Scholarships for Higher Education",
    provider: "Tata Trusts (Sir Ratan Tata Trust & Allied Trusts)",
    type: "Private",
    category: "Merit-cum-Means",
    educationLevel: "Undergraduate / Postgraduate",
    course: "Engineering (B.Tech), Medical, Nursing, Healthcare & Sciences",
    amount: "30% to 80% Tuition Fee Coverage (up to ₹1,00,000/yr)",
    amountNumeric: 100000,
    deadline: "2026-11-30",
    status: "Active",
    tags: ["Tata Trusts", "Tuition Fee Grant", "Healthcare & Tech", "Merit-Means"],
    description: "Prestigious financial support by the Tata Trusts to assist talented students pursuing professional undergraduate and postgraduate studies across India.",
    eligibility: {
      gender: "All",
      maxFamilyIncome: 600000,
      minPercentage: 70,
      allowedCourses: ["B.Tech", "B.E", "MBBS", "B.Sc Nursing", "B.Pharm", "M.Tech"],
      criteriaList: [
        "Students currently studying in recognized institutes in India.",
        "Minimum 70% in Class 12 or minimum 6.5 CGPA in previous academic semesters.",
        "Annual family income should not exceed ₹6 Lakhs per annum.",
      ],
    },
    benefits: [
      "Direct subsidy towards college tuition fees ranging from 30% to 80%.",
      "Mentorship and skill-building sessions through Tata ecosystem partners.",
    ],
    documentsRequired: [
      "Academic marksheets for all previous semesters / 12th board",
      "Official Fee receipt of current academic year",
      "Income proof / Form 16 / Income certificate",
      "Cancelled cheque / Bank passbook of student",
    ],
    applicationProcess: [
      "Create profile on the Tata Trusts scholarship portal.",
      "Fill course, fee details, and family income details.",
      "Upload verified documents and submit before the application cut-off date.",
    ],
    officialLink: "https://www.tatatrusts.org/our-work/individual-grants-programme/education-grants",
    portalName: "Tata Trusts Education Portal",
  },
  {
    id: "pvt-03",
    title: "HDFC Bank Parivartan's ECSS Programme (Badhte Kadam)",
    provider: "HDFC Bank CSR (Parivartan)",
    type: "Private",
    category: "Need-Based / Crisis Support",
    educationLevel: "School / Undergraduate / Postgraduate",
    course: "General UG (BA/B.Com/B.Sc) & Professional UG (B.Tech/MBBS/BBA/Law)",
    amount: "₹30,000 to ₹75,000 per annum",
    amountNumeric: 75000,
    deadline: "2026-10-31",
    status: "Active",
    tags: ["HDFC Bank", "Parivartan", "Need-Based", "Crisis Relief"],
    description: "A flagship CSR initiative by HDFC Bank providing financial assistance to meritorious students facing financial hardships or personal crises to continue their education.",
    eligibility: {
      gender: "All",
      maxFamilyIncome: 250000,
      minPercentage: 55,
      allowedCourses: ["B.Tech", "B.Com", "B.Sc", "B.A", "BBA", "BCA", "MBBS"],
      criteriaList: [
        "Open for Indian students studying in classes 1 to 12, diploma, ITI, UG, or PG courses.",
        "Must have passed previous qualifying exam with at least 55% marks.",
        "Annual family income must be less than or equal to ₹2.5 Lakhs.",
        "Special preference given to students facing personal or family crisis.",
      ],
    },
    benefits: [
      "General UG courses: ₹30,000 to ₹50,000 per annum.",
      "Professional UG (Engineering/Medical): ₹75,000 per annum.",
      "Funds transferred directly via electronic bank transfer.",
    ],
    documentsRequired: [
      "Passport size photo & Govt ID proof (Aadhaar/Voter ID)",
      "Previous year marksheet",
      "Current year admission proof (Fee receipt / ID card)",
      "Income proof from Gram Panchayat / Tehsildar / Form 16",
    ],
    applicationProcess: [
      "Apply through Buddy4Study / HDFC Parivartan online application portal.",
      "Submit personal details, statement of financial crisis/need, and documents.",
      "Shortlisted candidates participate in telephonic verification interview.",
    ],
    officialLink: "https://www.hdfcbank.com/personal/about-us/corporate-social-responsibility/parivartan",
    portalName: "HDFC Parivartan & Buddy4Study",
  },
  {
    id: "pvt-04",
    title: "Google Generation Scholarship (APAC Region)",
    provider: "Google India & APAC",
    type: "Private",
    category: "Women in STEM",
    educationLevel: "Undergraduate",
    course: "Computer Science, Computer Engineering, or closely related Technical fields",
    amount: "$2,500 USD (approx. ₹2,08,000)",
    amountNumeric: 208000,
    deadline: "2026-12-15",
    status: "Active",
    tags: ["Google", "Women in Tech", "Global", "Coding & Leadership"],
    description: "Designed to help students pursuing computer science degrees excel in technology, become leaders in the field, and break barriers in diversity and inclusion.",
    eligibility: {
      gender: "Female",
      maxFamilyIncome: 2500000,
      minPercentage: 70,
      allowedCourses: ["B.Tech in CSE", "B.Tech in IT", "B.Tech in AI/ML", "BCA", "B.Sc Computer Science"],
      criteriaList: [
        "Currently enrolled as a 1st or 2nd-year undergraduate student at an accredited university in APAC.",
        "Studying Computer Science, Computer Engineering, or a closely related technical field.",
        "Demonstrate a strong academic record and passion for technology & community impact.",
        "Exhibit leadership skills and active participation in tech communities/hackathons.",
      ],
    },
    benefits: [
      "Direct financial grant of $2,500 USD (~₹2.08 Lakhs) for the academic year.",
      "Invitation to the exclusive Google Scholar Virtual Retreat.",
      "Direct mentorship and networking sessions with Google software engineers and leaders.",
    ],
    documentsRequired: [
      "Up-to-date Resume / CV highlighting coding projects and community involvement",
      "Official academic transcripts",
      "Two short essay responses answering diversity, problem-solving, and tech vision prompts",
      "Proof of university enrollment",
    ],
    applicationProcess: [
      "Submit application on Google Build Your Future scholarship website.",
      "Write concise, insightful essays detailing your passion for CS and diversity.",
      "Complete a 60-minute online coding / problem-solving assessment.",
    ],
    officialLink: "https://buildyourfuture.withgoogle.com/scholarships/generation-google-scholarship-apac",
    portalName: "Google Build Your Future",
  },
  {
    id: "pvt-05",
    title: "Adobe India Women-in-Technology Scholarship",
    provider: "Adobe Systems India",
    type: "Private",
    category: "Women in STEM",
    educationLevel: "Undergraduate / Postgraduate",
    course: "B.Tech / M.Tech / Dual Degree in Computer Science, Data Science, AI",
    amount: "100% Tuition Fee + ₹1,00,000 Opportunity Grant + Summer Internship",
    amountNumeric: 300000,
    deadline: "2026-11-20",
    status: "Active",
    tags: ["Adobe", "Women in Tech", "Summer Internship", "High Value"],
    description: "Strives to create gender balance in technology by mentoring, sponsoring, and offering paid research/engineering internships to talented female computing students.",
    eligibility: {
      gender: "Female",
      maxFamilyIncome: 3000000,
      minPercentage: 75,
      allowedCourses: ["B.Tech CSE", "B.Tech IT", "M.Tech CSE", "Dual Degree B.Tech/M.Tech"],
      criteriaList: [
        "Female student enrolled in formal degree program in CS/IT/Data Science in India.",
        "Must be in 3rd year of 4-year B.Tech, or 1st year of 2-year M.Tech.",
        "Outstanding academic performance with strong coding and algorithmic foundation.",
      ],
    },
    benefits: [
      "Full college tuition fee coverage for remaining duration of degree.",
      "Opportunity for a paid Summer Internship at Adobe India Engineering Labs.",
      "Mentorship from senior Adobe scientists and engineers.",
      "Sponsorship to attend the Grace Hopper Celebration India (GHCI) conference.",
    ],
    documentsRequired: [
      "Resume highlighting GitHub/GitLab repositories and technical achievements",
      "Official university transcripts",
      "One Letter of Recommendation from Professor or Project Mentor",
      "Application Essay answering technical vision questions",
    ],
    applicationProcess: [
      "Apply directly through the Adobe Careers & Diversity portal.",
      "Shortlisted candidates participate in technical interviews with Adobe engineers.",
    ],
    officialLink: "https://www.adobe.com/in/about-adobe/corporate-responsibility/diversity-inclusion/women-in-tech.html",
    portalName: "Adobe Research & Careers",
  },
  {
    id: "pvt-06",
    title: "Aditya Birla Group Scholarship Programme",
    provider: "Aditya Birla Centre for Community Initiatives",
    type: "Private",
    category: "Merit-Based",
    educationLevel: "Undergraduate / Postgraduate",
    course: "B.Tech (IITs, BITS Pilani), Management (IIMs, XLRI), Law (NLUs)",
    amount: "₹1,00,000 to ₹3,00,000 per annum",
    amountNumeric: 180000,
    deadline: "2026-09-15",
    status: "Active",
    tags: ["Aditya Birla", "IITs / IIMs / BITS", "Leadership", "Premier Institutes"],
    description: "Recognizes exceptional young leaders in top premier engineering, management, and law colleges in India, pairing financial support with networking alongside corporate leaders.",
    eligibility: {
      gender: "All",
      maxFamilyIncome: 5000000,
      minPercentage: 85,
      allowedCourses: ["B.Tech at IITs/BITS", "MBA at IIMs", "Law at NLUs"],
      criteriaList: [
        "Admitted to top premier institutes (IIT Bombay, Delhi, Madras, Kharagpur, Kanpur, Roorkee, BITS Pilani, etc.).",
        "Top 20 rankers in the institute's entrance exam category.",
        "Excellence in extracurricular activities and leadership potential.",
      ],
    },
    benefits: [
      "B.Tech students: ₹1,00,000 per annum (covers hostel & academic costs).",
      "MBA students: ₹3,00,000 per annum.",
      "Direct entry into Aditya Birla Leadership Programs and executive mentorship.",
    ],
    documentsRequired: [
      "JEE Advanced / CAT scorecard & rank proof",
      "Institute Admission Confirmation Letter",
      "Essays on leadership, ethics, and future vision",
      "Two academic references",
    ],
    applicationProcess: [
      "Applications submitted through the Dean/Office of Student Affairs at partner institutes.",
      "Written essay assessment followed by interview with a panel of luminaries and CXOs in Mumbai.",
    ],
    officialLink: "https://www.adityabirlascholars.net",
    portalName: "Aditya Birla Scholars",
  },
  {
    id: "pvt-07",
    title: "Infosys Foundation STEM Stars Scholarship",
    provider: "Infosys Foundation",
    type: "Private",
    category: "Women in STEM",
    educationLevel: "Undergraduate",
    course: "B.Tech / B.E in STEM streams (CSE, AI, ECE, Data Science, Mechanical)",
    amount: "Up to ₹1,00,000 per annum (100% of college fees)",
    amountNumeric: 100000,
    deadline: "2026-11-10",
    status: "Active",
    tags: ["Infosys", "Women in STEM", "CSR", "Tuition & Living"],
    description: "Financial assistance and career mentorship for female students from underprivileged backgrounds enrolled in undergraduate STEM degrees across NIRF-ranked institutions.",
    eligibility: {
      gender: "Female",
      maxFamilyIncome: 800000,
      minPercentage: 70,
      allowedCourses: ["B.Tech", "B.E", "B.Arch", "B.Sc Computer Science"],
      criteriaList: [
        "Female students admitted to 1st year of STEM courses in NIRF-ranked colleges.",
        "Annual family income must not exceed ₹8,00,000.",
        "Minimum 70% or 7.0 CGPA in previous qualifying exams without backlogs.",
      ],
    },
    benefits: [
      "Financial assistance up to ₹1,00,000 per annum covering tuition, books, and living expenses.",
      "Mentorship sessions with Infosys tech leaders and digital certification courses.",
    ],
    documentsRequired: [
      "Class 12th Marksheet",
      "College Admission Letter with NIRF rank proof",
      "Income Certificate issued by Tehsildar/Revenue Officer",
      "Bank details and Aadhaar Card",
    ],
    applicationProcess: [
      "Register and submit your application through the Infosys Foundation scholarship portal / Buddy4Study.",
      "Document verification followed by virtual interaction.",
    ],
    officialLink: "https://www.infosys.com/infosys-foundation.html",
    portalName: "Infosys Foundation Portal",
  },
  {
    id: "pvt-08",
    title: "Kotak Kanya Scholarship for Meritorious Girls",
    provider: "Kotak Education Foundation (Kotak Mahindra Group)",
    type: "Private",
    category: "Women in STEM",
    educationLevel: "Undergraduate",
    course: "Professional Graduation (Engineering, MBBS, Architecture, Design, Integrated LLB)",
    amount: "₹1,50,000 per annum",
    amountNumeric: 150000,
    deadline: "2026-10-31",
    status: "Active",
    tags: ["Kotak Foundation", "Women in Tech", "High Grant", "Mentorship"],
    description: "Financial assistance to meritorious girl students from economically weaker sections to pursue professional graduation courses from premier institutes in India.",
    eligibility: {
      gender: "Female",
      maxFamilyIncome: 600000,
      minPercentage: 85,
      allowedCourses: ["B.Tech", "B.E", "MBBS", "B.Arch", "B.Des", "Integrated LLB"],
      criteriaList: [
        "Meritorious girl students who scored 85% or more marks in 12th board examinations.",
        "Secured admission in 1st year of professional graduation in recognized institutions (NAAC/NIRF accredited).",
        "Annual family income must be ₹6,00,000 or less.",
        "Children of Kotak Mahindra Group & Buddy4Study employees are not eligible.",
      ],
    },
    benefits: [
      "₹1.5 Lakhs per year until the completion of professional degree.",
      "Holistic development through 1-on-1 mentorship, mental health workshops, and soft skills training.",
    ],
    documentsRequired: [
      "Class 12th Marksheet",
      "Current Academic Year College Fee Receipt",
      "Income Certificate issued by Government Authority",
      "Aadhaar Card of student and parents",
      "Bank Account details with passbook copy",
    ],
    applicationProcess: [
      "Apply online on Buddy4Study under Kotak Kanya Scholarship section.",
      "Complete 2-stage screening: Telephonic interview and document audit.",
    ],
    officialLink: "https://kotakeducation.org/kotak-kanya-scholarship",
    portalName: "Kotak Education Foundation",
  },
  {
    id: "pvt-09",
    title: "Santoor Women's Scholarship",
    provider: "Wipro Consumer Care and Wipro Cares",
    type: "Private",
    category: "Women in Higher Ed",
    educationLevel: "Undergraduate",
    course: "Any 3-year or 4-year Regular UG Degree (Science, Arts, Commerce, Tech)",
    amount: "₹24,000 per annum",
    amountNumeric: 24000,
    deadline: "2026-10-15",
    status: "Active",
    tags: ["Wipro Cares", "Santoor", "Women Empowerment", "Higher Education"],
    description: "Annual financial support by Wipro Cares to young women from underprivileged backgrounds who wish to pursue higher education after completing Class 12.",
    eligibility: {
      gender: "Female",
      maxFamilyIncome: 400000,
      minPercentage: 60,
      allowedCourses: ["B.Sc", "B.A", "B.Com", "B.Tech", "BCA", "BBA"],
      criteriaList: [
        "Passed Class 10 & 12 from government schools / inter colleges.",
        "Enrolled in 1st year of full-time undergraduate degree program.",
        "Resident of Andhra Pradesh, Karnataka, Telangana, or Chhattisgarh.",
      ],
    },
    benefits: [
      "₹24,000 per year until completion of degree course.",
      "Financial assistance for tuition fees, books, exam fees, and stationery.",
    ],
    documentsRequired: [
      "Class 10th & 12th Marksheet",
      "College ID card / Bonafide certificate",
      "Aadhaar Card",
      "Bank account details",
    ],
    applicationProcess: [
      "Apply via Santoor Scholarship portal or Buddy4Study.",
      "Submit government school certificate proof and admission receipt.",
    ],
    officialLink: "https://www.santoorscholarships.com",
    portalName: "Santoor Scholarships Portal",
  },
  {
    id: "pub-06",
    title: "Post-Matric Scholarship for Minorities & EWS",
    provider: "Ministry of Minority Affairs, Govt. of India",
    type: "Public",
    category: "Need-Based / Minority",
    educationLevel: "Undergraduate / Postgraduate",
    course: "Undergraduate, Postgraduate, M.Phil, Ph.D. in any recognized stream",
    amount: "Tuition Fee + ₹10,000/yr Maintenance Allowance",
    amountNumeric: 30000,
    deadline: "2026-11-30",
    status: "Active",
    tags: ["Government", "NSP", "Minority Affairs", "DBT"],
    description: "Financial assistance to meritorious students belonging to economically weaker minority communities to pursue higher education and enhance their employability.",
    eligibility: {
      gender: "All",
      maxFamilyIncome: 200000,
      minPercentage: 50,
      allowedCourses: ["B.Tech", "B.Sc", "B.Com", "B.A", "M.Tech", "M.Sc", "MBA", "MCA"],
      criteriaList: [
        "Students belonging to notified minority communities (Muslims, Christians, Sikhs, Buddhists, Jains, Parsis).",
        "Scored not less than 50% marks in the previous final examination.",
        "Annual income of parents/guardian from all sources not exceeding ₹2.00 Lakhs.",
      ],
    },
    benefits: [
      "Actual institutional tuition fees paid directly.",
      "Maintenance allowance of ₹1,000/month for hostellers and ₹570/month for day scholars.",
    ],
    documentsRequired: [
      "Self-declaration of minority community",
      "Income Certificate issued by designated State Authority",
      "Previous year academic marksheet",
      "Aadhaar seeded bank account passbook",
      "Fee receipt of current academic course",
    ],
    applicationProcess: [
      "Register on National Scholarship Portal (scholarships.gov.in).",
      "Fill online application under Ministry of Minority Affairs section and upload documents.",
    ],
    officialLink: "https://scholarships.gov.in",
    portalName: "National Scholarship Portal",
  },
];

// @desc Get all scholarships with filtering & search
// @route GET /api/scholarships
const getScholarships = async (req, res) => {
  try {
    const { type, category, search, course, educationLevel } = req.query;

    let results = [...scholarshipsData];

    // Filter by type (Public vs Private)
    if (type && type.toLowerCase() !== "all") {
      results = results.filter(
        (s) => s.type.toLowerCase() === type.toLowerCase()
      );
    }

    // Filter by category
    if (category && category.toLowerCase() !== "all") {
      results = results.filter((s) => {
        const cat = s.category.toLowerCase();
        const queryCat = category.toLowerCase();
        if (queryCat === "women" || queryCat === "women in stem") {
          return cat.includes("women") || s.eligibility.gender === "Female";
        }
        if (queryCat === "merit") return cat.includes("merit");
        if (queryCat === "need" || queryCat === "means") return cat.includes("means") || cat.includes("need");
        if (queryCat === "pwd" || queryCat === "specially-abled") return cat.includes("abled") || cat.includes("pwd");
        return cat.includes(queryCat);
      });
    }

    // Filter by search query
    if (search) {
      const q = search.toLowerCase();
      results = results.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.provider.toLowerCase().includes(q) ||
          s.course.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    // Filter by course
    if (course && course.toLowerCase() !== "all") {
      const c = course.toLowerCase();
      results = results.filter(
        (s) =>
          s.course.toLowerCase().includes(c) ||
          s.eligibility.allowedCourses.some((ac) => ac.toLowerCase().includes(c))
      );
    }

    res.json({
      success: true,
      count: results.length,
      totalPublic: results.filter((s) => s.type === "Public").length,
      totalPrivate: results.filter((s) => s.type === "Private").length,
      scholarships: results,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch scholarships", error: error.message });
  }
};

// @desc Get single scholarship details
// @route GET /api/scholarships/:id
const getScholarshipById = async (req, res) => {
  try {
    const scholarship = scholarshipsData.find((s) => s.id === req.params.id);
    if (!scholarship) {
      return res.status(404).json({ success: false, message: "Scholarship not found" });
    }
    res.json({ success: true, scholarship });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc Interactive Eligibility Checker
// @route POST /api/scholarships/check-eligibility
const checkEligibility = async (req, res) => {
  try {
    const {
      annualIncome = 0,
      gender = "All",
      percentage = 0,
      course = "",
      isDisability = false,
      domicile = "",
    } = req.body;

    const income = Number(annualIncome) || 0;
    const marks = Number(percentage) || 0;

    const matches = scholarshipsData.map((s) => {
      let score = 100;
      const reasons = [];
      const flags = [];

      // 1. Gender check
      if (s.eligibility.gender === "Female" && gender.toLowerCase() !== "female") {
        score -= 70;
        flags.push("Only for female students");
      } else if (s.eligibility.gender === "Female" && gender.toLowerCase() === "female") {
        reasons.push("Meets gender criteria (Female only opportunity)");
      }

      // 2. Family Income check
      if (income > 0) {
        if (income <= s.eligibility.maxFamilyIncome) {
          reasons.push(`Family income (₹${income.toLocaleString("en-IN")}) is within the ceiling of ₹${s.eligibility.maxFamilyIncome.toLocaleString("en-IN")}`);
        } else {
          score -= 40;
          flags.push(`Family income exceeds the maximum limit of ₹${s.eligibility.maxFamilyIncome.toLocaleString("en-IN")}`);
        }
      }

      // 3. Academic Percentage check
      if (marks > 0) {
        if (marks >= s.eligibility.minPercentage) {
          reasons.push(`Academic score (${marks}%) meets the minimum required (${s.eligibility.minPercentage}%)`);
        } else {
          score -= 30;
          flags.push(`Academic score is below required minimum of ${s.eligibility.minPercentage}%`);
        }
      }

      // 4. Special categories
      if (s.category.includes("Specially-Abled") && !isDisability) {
        score -= 80;
        flags.push("Requires minimum 40% physical disability certification");
      }

      if (s.id === "pub-03") {
        const dom = (domicile || "").toLowerCase();
        if (!dom.includes("jammu") && !dom.includes("kashmir") && !dom.includes("ladakh") && !dom.includes("j&k")) {
          score -= 80;
          flags.push("Requires Domicile of J&K or Ladakh");
        } else {
          reasons.push("Meets J&K / Ladakh domicile requirement");
        }
      }

      const matchPercentage = Math.max(0, Math.min(100, score));
      let matchStatus = "High Probability";
      if (matchPercentage < 50) matchStatus = "Low Probability";
      else if (matchPercentage < 80) matchStatus = "Moderate Probability";

      return {
        ...s,
        matchPercentage,
        matchStatus,
        matchReasons: reasons,
        disqualificationReasons: flags,
        isEligible: matchPercentage >= 65,
      };
    });

    const eligibleList = matches
      .filter((m) => m.matchPercentage >= 50)
      .sort((a, b) => b.matchPercentage - a.matchPercentage);

    res.json({
      success: true,
      totalEvaluated: scholarshipsData.length,
      eligibleCount: eligibleList.length,
      results: eligibleList,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to evaluate eligibility", error: error.message });
  }
};

module.exports = {
  getScholarships,
  getScholarshipById,
  checkEligibility,
  scholarshipsData,
};
