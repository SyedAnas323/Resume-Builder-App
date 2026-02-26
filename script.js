const stripe = Stripe("pk_test_51T0L7bRC7TjMtKfzfJHjSNHBV171Z8IWDxSWU4C84Z9IaaCVCKcca84zCQ3MbSrcvaZvgtNRPdn6NxyfS6EhHv68002oCKHgsd");

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
const pExperience = document.getElementById("pExperience");
const pEducation = document.getElementById("pEducation");

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

const skillInput = document.getElementById("skillInput");
const languageInput = document.getElementById("languageInput");


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

  fitContentToPage();
  saveResume();
}

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

/* ===========================
   SKILLS & LANGUAGE
=========================== */
function addSkill() {
  addList("pSkills", skillInput.value);
  skillInput.value = "";
}

function addLanguage() {
  addList("pLanguage", languageInput.value);
  languageInput.value = "";
}

function addList(id, value) {
  if (!value.trim()) return;
  const li = document.createElement("li");
  li.textContent = value;
  document.getElementById(id).appendChild(li);
  fitContentToPage();
  saveResume();
}
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



