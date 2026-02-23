const stripe = Stripe("pk_test_51T0L7bRC7TjMtKfzfJHjSNHBV171Z8IWDxSWU4C84Z9IaaCVCKcca84zCQ3MbSrcvaZvgtNRPdn6NxyfS6EhHv68002oCKHgsd");

let experiences = [];
let educations = [];

const pName = document.getElementById("pName");
const pEmail = document.getElementById("pEmail");
const pPhone = document.getElementById("pPhone");
const pLocation = document.getElementById("pLocation");
const pAbout = document.getElementById("pAbout");
const pReference = document.getElementById("pReference");
const pSkills = document.getElementById("pSkills");
const pLanguage = document.getElementById("pLanguage");
const pExperience = document.getElementById("pExperience");
const pEducation = document.getElementById("pEducation");

const nameInput = document.getElementById("name");
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

function fitContentToPage() {
  const resume = document.getElementById('resume');
  if (!resume) return;

  let currentSize = parseFloat(resume.style.fontSize);
  if (isNaN(currentSize) || currentSize === 0) {
    currentSize = 16; 
  }
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

document.querySelectorAll("#name, #email, #phone, #location, #about, #refName, #refEmail, #refPhone")
  .forEach(input => {
    input.addEventListener("input", generatePreview);
  });

document.getElementById("imageUpload").addEventListener("change", function(e) {
  const reader = new FileReader();
  reader.onload = function() {
    document.getElementById("pImage").src = reader.result;
    fitContentToPage();
    saveResume();
  };
  reader.readAsDataURL(e.target.files[0]);
});

document.getElementById("skillsInput").addEventListener("keydown", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    addList("pSkills", e.target.value);
    e.target.value = "";
  }
});

document.getElementById("languageInput").addEventListener("keydown", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    addList("pLanguage", e.target.value);
    e.target.value = "";
  }
});

function addList(id, value) {
  if (!value.trim()) return;
  const li = document.createElement("li");
  li.textContent = value;
  document.getElementById(id).appendChild(li);
  fitContentToPage();
  saveResume();
}

function addExperience() {
  const exp = {
    title: expTitle.value,
    company: expCompany.value,
    start: expStart.value,
    end: expEnd.value,
    desc: expDesc.value
  };

  experiences.push(exp);
  renderExperiences();

  expTitle.value = "";
  expCompany.value = "";
  expStart.value = "";
  expEnd.value = "";
  expDesc.value = "";
}

function renderExperiences() {
  const container = document.getElementById("pExperience");
  container.innerHTML = "";

  experiences.forEach(exp => {
    const div = document.createElement("div");
    div.innerHTML = `
      <strong>${exp.title}</strong> (${exp.start} - ${exp.end})<br>
      ${exp.company}<br>
      ${exp.desc}<br><br>
    `;
    container.appendChild(div);
  });
  fitContentToPage();
  saveResume();
}

function addEducation() {
  const edu = {
    degree: eduDegree.value,
    institute: eduInstitute.value,
    start: eduStart.value,
    end: eduEnd.value
  };

  educations.push(edu);
  renderEducations();

  eduDegree.value = "";
  eduInstitute.value = "";
  eduStart.value = "";
  eduEnd.value = "";
}

function renderEducations() {
  const container = document.getElementById("pEducation");
  container.innerHTML = "";

  educations.forEach(edu => {
    const div = document.createElement("div");
    div.innerHTML = `
      <strong>${edu.degree}</strong> (${edu.start} - ${edu.end})<br>
      ${edu.institute}<br><br>
    `;
    container.appendChild(div);
  });
  fitContentToPage();
  saveResume();
}

function generatePreview() {
  const userName = nameInput.value || "Your Name";
  const userEmail = emailInput.value;
  const userPhone = phoneInput.value;
  const userLocation = locationInput.value;
  const userAbout = aboutInput.value;

  const refNameVal = refName.value;
  const refEmailVal = refEmail.value;
  const refPhoneVal = refPhone.value;

  pName.textContent = userName;
  pEmail.textContent = userEmail;
  pPhone.textContent = userPhone;
  pLocation.textContent = userLocation;
  pAbout.textContent = userAbout;

  pReference.innerHTML = `
    <strong>${refNameVal}</strong><br>
    ${refEmailVal}<br>
    ${refPhoneVal}
  `;

  fitContentToPage();
  saveResume();
}

function saveResume() {
  localStorage.setItem("resumeHTML", document.getElementById("resume").outerHTML);
}

async function startPayment() {
  generatePreview();

  if (!nameInput.value.trim()) {
    alert("Please build your resume first");
    return;
  }

  saveResume();

  try {
    const response = await fetch("http://localhost:4242/create-checkout-session", {
      method: "POST"
    });
    const session = await response.json();
    await stripe.redirectToCheckout({ sessionId: session.id });
  } catch (error) {
    console.error(error);
    alert("Payment server not running on port 4242");
  }
}

window.addEventListener('load', fitContentToPage);

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(fitContentToPage, 100);
});