const stripe = Stripe("pk_test_51T0L7bRC7TjMtKfzfJHjSNHBV171Z8IWDxSWU4C84Z9IaaCVCKcca84zCQ3MbSrcvaZvgtNRPdn6NxyfS6EhHv68002oCKHgsd");

let skillsArray = [];
let languageArray = [];
let experiences = [];
let educations = [];

/* ===========================
   PREVIEW ELEMENTS
=========================== */
const pName = document.getElementById("pName");
const pTagline = document.getElementById("pTagline");
const pAddress = document.getElementById("pAddress");
const pEmail = document.getElementById("pEmail");
const pPhone = document.getElementById("pPhone");
const pLocation = document.getElementById("pLocation");
const pAbout = document.getElementById("pAbout");
const pReference = document.getElementById("pReference");
const pSkills = document.getElementById("pSkills");
const pLanguage = document.getElementById("pLanguage");

/* ===========================
   INPUT ELEMENTS
=========================== */
const nameInput = document.getElementById("name");
const taglineInput = document.getElementById("tagline");
const addressInput = document.getElementById("address");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const locationInput = document.getElementById("location");
const aboutInput = document.getElementById("about");

const refName = document.getElementById("refName");
const refEmail = document.getElementById("refEmail");
const refPhone = document.getElementById("refPhone");

const expTitle = document.getElementById("expTitle");
const expCompany = document.getElementById("expCompany");
const expStart = document.getElementById("expStart");
const expEnd = document.getElementById("expEnd");
const expDesc = document.getElementById("expDesc");

const eduDegree = document.getElementById("eduDegree");
const eduInstitute = document.getElementById("eduInstitute");
const eduStart = document.getElementById("eduStart");
const eduEnd = document.getElementById("eduEnd");

const portfolioInput = document.getElementById("portfolioInput");
const portfolioSection = document.getElementById("portfolioSection");
const portfolioLink = document.getElementById("portfolioLink");

const skillInput = document.getElementById("skillInput");
const languageInput = document.getElementById("languageInput");
const titleDropdown = document.getElementById("titleDropdown");

/* ===========================
   AUTO FONT FIT
=========================== */
function fitContentToPage() {
  const resume = document.getElementById('resume');
  if (!resume) return;

  let currentSize = parseFloat(resume.style.fontSize);
  if (isNaN(currentSize) || currentSize === 0) 
   currentSize = 16;

  const minSize = 4;
  const maxAttempts = 30;
  let attempts = 0;

  resume.style.fontSize = currentSize + 'px';

  while (resume.scrollHeight > resume.clientHeight && currentSize > minSize && attempts < maxAttempts) {
    currentSize -= 0.3;
    resume.style.fontSize = currentSize + 'px';
    attempts++;
  }
}

/* ===========================
   LIVE PREVIEW
=========================== */
function generatePreview() {
  pName.textContent = nameInput.value || "Your Name";
  pTagline.textContent = taglineInput.value || "";
  pAddress.textContent = addressInput.value || "";
  pEmail.textContent = emailInput.value || "";
  pPhone.textContent = phoneInput.value || "";
  pLocation.textContent = locationInput.value || "";
  pAbout.textContent = aboutInput.value || "";

  pReference.innerHTML = `
    <strong>${refName.value || ""}</strong><br>
    ${refEmail.value || ""}<br>
    ${refPhone.value || ""}
  `;

  saveResume();
}

document.querySelectorAll(
  "#name, #tagline, #address, #email, #phone, #location, #about, #refName, #refEmail, #refPhone"
).forEach(input => {
  input.addEventListener("input", generatePreview);
});

/* ===========================
   INPUT LISTENERS
=========================== */
document.querySelectorAll(
  "#name, #tagline, #address, #email, #phone, #location, #about, #refName, #refEmail, #refPhone"
).forEach(input => {
  input.addEventListener("input", generatePreview);
});

/* ===========================
   IMAGE UPLOAD
=========================== */
document.getElementById("imageUpload").addEventListener("change", function(e) {
  const reader = new FileReader();
  reader.onload = function() {
    document.getElementById("pImage").src = reader.result;
    fitContentToPage();
    saveResume();
  };
  reader.readAsDataURL(e.target.files[0]);
});

// /* ===========================
//    EDITABLE SKILL & LANGUAGE SYSTEM
// =========================== */

function autoFillData(title) {
  const data = jobData[title];

  // Add only new skills (avoid duplicates)
  data.skills.forEach(skill => {
    if (!skillsArray.includes(skill)) skillsArray.push(skill);
  });

  // Add only new languages
  data.languages.forEach(lang => {
    if (!languageArray.includes(lang)) languageArray.push(lang);
  });

  // Update about section
  aboutInput.value = data.about;
  pAbout.textContent = data.about;

  // Render everything with buttons
  renderSkills();
  renderLanguage();
}

function renderSkills() {
  pSkills.innerHTML = "";

  skillsArray.forEach((skill, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${skill} 
      <span class="no-print">
        <button onclick="editSkill(${index})">✏</button>
        <button onclick="removeSkill(${index})">❌</button>
      </span>
    `;
    pSkills.appendChild(li);
  });

  saveResume();
}

function renderLanguage() {
  pLanguage.innerHTML = "";

  languageArray.forEach((lang, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${lang} 
      <span class="no-print">
        <button onclick="editLanguage(${index})">✏</button>
        <button onclick="removeLanguage(${index})">❌</button>
      </span>
    `;
    pLanguage.appendChild(li);
  });

  saveResume();
}


taglineInput.addEventListener("input", function() {
  const title = this.value.trim();

  if (jobData[title]) {
    autoFillData(title);
  } else {
    showTitleSuggestions(title);
  }
});

function showTitleSuggestions(text) {
  titleDropdown.innerHTML = '<option value="">Select Suggested Title</option>';
  const matches = Object.keys(jobData).filter(t => t.toLowerCase().includes(text.toLowerCase()));

  if (matches.length > 0) {
    titleDropdown.style.display = "block";
    matches.forEach(match => {
      const option = document.createElement("option");
      option.value = match;
      option.textContent = match;
      titleDropdown.appendChild(option);
    });
  } else {
    titleDropdown.style.display = "none";
  }
}

titleDropdown.addEventListener("change", function() {
  if (this.value) {
    taglineInput.value = this.value;
    autoFillData(this.value);
    this.style.display = "none";
  }
});

/* ===========================
   portfolio 
   =========================== */

portfolioInput.addEventListener("input", function() {
  const link = this.value.trim();

  if (link) {
    portfolioSection.style.display = "block"; // show section
    portfolioLink.href = link;
    portfolioLink.textContent = link;
  } else {
    portfolioSection.style.display = "none"; // hide section
    portfolioLink.href = "#";
    portfolioLink.textContent = "";
  }

  saveResume();
});

/* ===========================
   EXPERIENCE
=========================== */
function addExperience() {
  experiences.push({
    title: expTitle.value,
    company: expCompany.value,
    start: expStart.value,
    end: expEnd.value,
    desc: expDesc.value
  });

  renderExperiences();
  expTitle.value = expCompany.value = expStart.value = expEnd.value = expDesc.value = "";
}

function renderExperiences() {
  pExperience.innerHTML = "";
  experiences.forEach(exp => {
    const div = document.createElement("div");
    div.innerHTML = `
      <strong>${exp.title}</strong> (${exp.start} - ${exp.end})<br>
      ${exp.company}<br>
      ${exp.desc}<br><br>
    `;
    pExperience.appendChild(div);
  });
  fitContentToPage();
  saveResume();
}

/* ===========================
   EDUCATION
=========================== */
function addEducation() {
  educations.push({
    degree: eduDegree.value,
    institute: eduInstitute.value,
    start: eduStart.value,
    end: eduEnd.value
  });

  renderEducations();
  eduDegree.value = eduInstitute.value = eduStart.value = eduEnd.value = "";
}

function renderEducations() {
  pEducation.innerHTML = "";
  educations.forEach(edu => {
    const div = document.createElement("div");
    div.innerHTML = `
      <strong>${edu.degree}</strong> (${edu.start} - ${edu.end})<br>
      ${edu.institute}<br><br>
    `;
    pEducation.appendChild(div);
  });
  fitContentToPage();
  saveResume();
}

/* ===========================
   SAVE TO LOCAL STORAGE
=========================== */
function saveResume() {
  localStorage.setItem("resumeHTML", document.getElementById("resume").outerHTML);
}

/* ===========================
   STRIPE PAYMENT
=========================== */
async function startPayment() {
  generatePreview();

  if (!nameInput.value.trim()) {
    alert("Please build your resume first");
    return;
  }

  try {
    const response = await fetch("/api/create-checkout-session", { method: "POST" });
    const session = await response.json();
    await stripe.redirectToCheckout({ sessionId: session.id });
  } catch (error) {
    console.error(error);
    alert("Payment server not running properly");
  }
}

/* ===========================
   AUTO RESIZE
=========================== */
window.addEventListener('load', fitContentToPage);

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(fitContentToPage, 100);
});

// /* ==============================
//    50+ JOB TITLE DATABASE
// ============================== */
const jobData = {
"Full Stack Developer": {
  skills:["HTML","CSS","JavaScript","React","Node.js","MongoDB"],
  languages:["English","Urdu"],
  about:"Full Stack Developer experienced in building scalable web applications.\nSkilled in both frontend and backend development.\nCreates responsive user interfaces with modern frameworks.\nDesigns secure APIs and manages databases efficiently.\nPassionate about delivering complete end-to-end solutions."
},

"Frontend Developer": {
  skills:["HTML","CSS","JavaScript","React","Bootstrap"],
  languages:["English"],
  about:"Creative Frontend Developer building responsive UI.\nTransforms designs into interactive web experiences.\nFocuses on performance and accessibility standards.\nWrites clean and maintainable code.\nDedicated to enhancing user engagement."
},

"Backend Developer": {
  skills:["Node.js","Express","MongoDB","SQL","API Development"],
  languages:["English"],
  about:"Backend Developer focused on server architecture.\nBuilds secure and scalable RESTful APIs.\nManages databases and server-side logic.\nOptimizes application performance.\nEnsures smooth data flow between systems."
},

"UI/UX Designer": {
  skills:["Figma","Adobe XD","Wireframing","Prototyping"],
  languages:["English"],
  about:"UI/UX Designer crafting intuitive interfaces.\nCreates wireframes and interactive prototypes.\nFocuses on user-centered design principles.\nConducts research to improve usability.\nDelivers visually appealing digital experiences."
},

"Graphic Designer": {
  skills:["Photoshop","Illustrator","Branding","Typography"],
  languages:["English"],
  about:"Creative Graphic Designer with branding expertise.\nDesigns compelling visual identities.\nWorks on marketing and promotional materials.\nStrong understanding of typography and color theory.\nBrings ideas to life through creative visuals."
},

"Mobile App Developer": {
  skills:["Flutter","React Native","Android","iOS"],
  languages:["English"],
  about:"Mobile Developer building cross-platform apps.\nDevelops high-performance Android and iOS applications.\nEnsures smooth UI and user experience.\nIntegrates APIs and third-party services.\nFocuses on clean architecture and scalability."
},

"Software Engineer": {
  skills:["OOP","Data Structures","Algorithms","Git"],
  languages:["English"],
  about:"Software Engineer solving complex problems.\nApplies strong object-oriented principles.\nDesigns efficient algorithms and data structures.\nCollaborates in agile development teams.\nBuilds reliable and maintainable software systems."
},

"Data Analyst": {
  skills:["Excel","SQL","Power BI","Python"],
  languages:["English"],
  about:"Data Analyst interpreting business insights.\nCollects and cleans large datasets.\nCreates dashboards and reports for stakeholders.\nIdentifies trends and performance metrics.\nSupports data-driven decision making."
},

"Data Scientist": {
  skills:["Python","Machine Learning","Pandas","TensorFlow"],
  languages:["English"],
  about:"Data Scientist building predictive models.\nAnalyzes complex datasets using advanced techniques.\nDevelops machine learning algorithms.\nVisualizes insights for business strategy.\nContinuously experiments to improve model accuracy."
},

"DevOps Engineer": {
  skills:["Docker","Kubernetes","CI/CD","AWS"],
  languages:["English"],
  about:"DevOps Engineer optimizing deployment pipelines.\nAutomates build and release processes.\nManages containerized applications.\nEnsures system reliability and scalability.\nBridges development and operations teams effectively."
},

"Cloud Engineer": {
  skills:["AWS","Azure","GCP","Cloud Architecture","Networking"],
  languages:["English"],
  about:"Cloud Engineer designing scalable cloud solutions.\nExperienced in deployment and infrastructure automation.\nFocuses on reliability and performance.\nEnsures secure cloud environments."
},

"Cybersecurity Analyst": {
  skills:["Network Security","SIEM","Ethical Hacking","Risk Assessment"],
  languages:["English"],
  about:"Cybersecurity Analyst protecting digital assets.\nMonitors threats and vulnerabilities.\nImplements security best practices.\nEnsures data integrity and compliance."
},

"AI Engineer": {
  skills:["Python","Deep Learning","NLP","TensorFlow"],
  languages:["English"],
  about:"AI Engineer building intelligent systems.\nWorks on automation and predictive models.\nOptimizes algorithms for accuracy.\nTransforms data into smart solutions."
},

"Game Developer": {
  skills:["Unity","C#","Game Physics","3D Modeling"],
  languages:["English"],
  about:"Game Developer creating immersive experiences.\nBuilds interactive gameplay mechanics.\nOptimizes performance across platforms.\nPassionate about storytelling through games."
},

"Blockchain Developer": {
  skills:["Solidity","Ethereum","Smart Contracts","Web3"],
  languages:["English"],
  about:"Blockchain Developer building decentralized apps.\nDevelops secure smart contracts.\nFocuses on transparency and trust.\nExplores innovative crypto solutions."
},

"Product Manager": {
  skills:["Agile","Roadmapping","User Research","Strategy"],
  languages:["English"],
  about:"Product Manager leading product vision.\nBridges business and tech teams.\nDefines strategy and roadmap.\nDrives user-focused innovation."
},

"Digital Marketer": {
  skills:["SEO","SEM","Social Media","Analytics"],
  languages:["English"],
  about:"Digital Marketer growing online presence.\nCreates data-driven campaigns.\nOptimizes conversions and reach.\nBuilds strong brand awareness."
},

"Content Writer": {
  skills:["Copywriting","SEO Writing","Editing","Research"],
  languages:["English"],
  about:"Content Writer crafting engaging stories.\nProduces SEO-friendly content.\nAdapts tone for audiences.\nDelivers clear brand messaging."
},

"HR Manager": {
  skills:["Recruitment","Employee Relations","Payroll","Compliance"],
  languages:["English"],
  about:"HR Manager managing workforce operations.\nLeads hiring and engagement.\nEnsures policy compliance.\nBuilds positive work culture."
},

"Business Analyst": {
  skills:["Requirement Analysis","SQL","Process Modeling","Reporting"],
  languages:["English"],
  about:"Business Analyst bridging gaps.\nAnalyzes processes and data.\nIdentifies growth opportunities.\nImproves operational efficiency."
},

"QA Engineer": {
  skills:["Manual Testing","Automation","Selenium","Bug Tracking"],
  languages:["English"],
  about:"QA Engineer ensuring software quality.\nDesigns test strategies.\nIdentifies bugs and risks.\nDelivers stable applications."
},

"Network Engineer": {
  skills:["Routing","Switching","Firewalls","TCP/IP"],
  languages:["English"],
  about:"Network Engineer managing infrastructure.\nConfigures secure networks.\nMonitors connectivity performance.\nEnsures system uptime."
},

"System Administrator": {
  skills:["Linux","Windows Server","Virtualization","Monitoring"],
  languages:["English"],
  about:"System Administrator maintaining IT systems.\nHandles server management.\nEnsures backups and security.\nSupports daily operations."
},

"AR/VR Developer": {
  skills:["Unity","ARKit","VR Design","3D Rendering"],
  languages:["English"],
  about:"AR/VR Developer building immersive apps.\nDesigns virtual environments.\nEnhances interactive simulations.\nExplores future tech experiences."
},

"Database Administrator": {
  skills:["MySQL","PostgreSQL","Performance Tuning","Backup"],
  languages:["English"],
  about:"Database Administrator managing data systems.\nOptimizes database performance.\nEnsures security and backups.\nMaintains data reliability."
},

"Technical Writer": {
  skills:["Documentation","API Docs","Research","Editing"],
  languages:["English"],
  about:"Technical Writer simplifying complexity.\nCreates clear documentation.\nTranslates tech for users.\nImproves knowledge sharing."
},

"IT Support Specialist": {
  skills:["Troubleshooting","Helpdesk","Hardware","Software Support"],
  languages:["English"],
  about:"IT Support Specialist solving issues.\nProvides technical assistance.\nMaintains system functionality.\nEnhances user productivity."
},

"Machine Learning Engineer": {
  skills:["Python","Scikit-learn","Model Deployment","Data Processing"],
  languages:["English"],
  about:"ML Engineer building predictive systems.\nDesigns and trains models.\nOptimizes performance.\nDeploys scalable AI solutions."
},

"SEO Specialist": {
  skills:["Keyword Research","On-Page SEO","Backlinks","Analytics"],
  languages:["English"],
  about:"SEO Specialist boosting rankings.\nOptimizes site structure.\nImproves traffic quality.\nDrives organic growth."
},

"UI Developer": {
  skills:["HTML","CSS","JavaScript","Responsive Design"],
  languages:["English"],
  about:"UI Developer creating polished interfaces.\nImplements pixel-perfect designs.\nFocuses on usability.\nEnhances user interaction."
}
};

// /* ==============================
//    AUTO SYSTEM
// ============================== */

taglineInput.addEventListener("input", function() {
  const title = this.value.trim();

  if (jobData[title]) {
    autoFillData(title);
  } else {
    showTitleSuggestions(title);
  }
});

function autoFillData(title){
  const data = jobData[title];

  pSkills.innerHTML="";
  pLanguage.innerHTML="";

  data.skills.forEach(skill=>{
    const li=document.createElement("li");
    li.textContent=skill;
    pSkills.appendChild(li);
  });

  data.languages.forEach(lang=>{
    const li=document.createElement("li");
    li.textContent=lang;
    pLanguage.appendChild(li);
  });

  aboutInput.value=data.about;
  pAbout.textContent=data.about;

  generatePreview();
}

function showTitleSuggestions(text){
  titleDropdown.innerHTML='<option value="">Select Suggested Title</option>';
  const matches=Object.keys(jobData).filter(t=>t.toLowerCase().includes(text.toLowerCase()));

  if(matches.length>0){
    titleDropdown.style.display="block";
    matches.forEach(match=>{
      const option=document.createElement("option");
      option.value=match;
      option.textContent=match;
      titleDropdown.appendChild(option);
    });
  }else{
    titleDropdown.style.display="none";
  }
}

titleDropdown.addEventListener("change",function(){
  if(this.value){
    taglineInput.value=this.value;
    autoFillData(this.value);
    this.style.display="none";
  }
});

// /* ===========================
//    SAVE
// =========================== */
function saveResume() {
  localStorage.setItem("resumeHTML", document.getElementById("resume").outerHTML);
}
