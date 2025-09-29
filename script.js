// ---------- CONFIGURAÇÕES ----------
const TURMAS = [
  "1A","1B","1A(NOTURNO)","1B(NOTURNO)",
  "2A","2B","2A(NOTURNO)","2B(NOTURNO)",
  "3A","3B","3A(NOTURNO)","3B(NOTURNO)"
];

const VALID_TAGS = [
  "Matemática","Filosofia","Português","História","Geografia",
  "Física","Química","Biologia","Inglês","Artes","Educação Física"
];

const GENERAL_RESOURCES = [
  { title: "teste", type: "vídeo", url: "https://youtu.be/dQw4w9WgXcQ" },
  { title: "Alagoas", type: "site da web", url: "https://share.google/YDI8DfuO7rxyJNHb9" },
  { title: "Mídia", type: "perfil social", url: "https://www.instagram.com/eedac__" }
];

const SUBJECT_RESOURCES = {
  "Matemática":[
    { title:"Matemática 1", type:"video", url:"https://youtu.be/qd2Hx8o0c4s" },
    { title:"Matemática Escrita 1", type:"text", content:"A prova de que 1+1=2" }
  ],
  "Filosofia":[
    { title:"Filosofia 1", type:"video", url:"https://youtu.be/RJFEpfiVwIk" },
    { title:"Filosofia Escrita 1", type:"text", content:"O vídeo apresenta o tema 'liberdade'." }
  ]
};

const ADMIN_KEYS = ["4444"];

// ---------- HELPERS ----------
const $ = id => document.getElementById(id);
function saveUsers(users){ localStorage.setItem("users", JSON.stringify(users)); }
function loadUsers(){ return JSON.parse(localStorage.getItem("users")) || []; }
function getLoggedInUsername(){ return localStorage.getItem("loggedInUser"); }
function setLoggedInUsername(u){ localStorage.setItem("loggedInUser", u); }
function clearLoggedInUsername(){ localStorage.removeItem("loggedInUser"); }

// ---------- SLIDESHOW ----------
let slideIndex = 0;
function mostrarSlide(n){
  const slides = document.getElementsByClassName("slide");
  if(!slides.length) return;
  if(n >= slides.length) slideIndex = 0;
  if(n < 0) slideIndex = slides.length-1;
  Array.from(slides).forEach(s=>s.style.display="none");
  slides[slideIndex].style.display="block";
}
function mudarSlide(n){ slideIndex+=n; mostrarSlide(slideIndex); }

// ---------- FOLDERS ----------
function renderFolders(){
  const mathFolder = $("math-folder");
  const philFolder = $("phil-folder");
  mathFolder.innerHTML=""; philFolder.innerHTML="";

  SUBJECT_RESOURCES["Matemática"].forEach(r=>{
    const li = document.createElement("li");
    li.innerHTML = r.type==="video"
      ? `<h4>${r.title}</h4><a href="${r.url}" target="_blank">▶ Assistir</a>`
      : `<h4>${r.title}</h4><p>${r.content}</p>`;
    mathFolder.appendChild(li);
  });

  SUBJECT_RESOURCES["Filosofia"].forEach(r=>{
    const li = document.createElement("li");
    li.innerHTML = r.type==="video"
      ? `<h4>${r.title}</h4><a href="${r.url}" target="_blank">▶ Assistir</a>`
      : `<h4>${r.title}</h4><p>${r.content}</p>`;
    philFolder.appendChild(li);
  });
}

// ---------- REGISTER / LOGIN ----------
function registerUser(username,email,password,userType,tagsArray,turmasArray){
  const users = loadUsers();
  if(!username||!email||!password){ alert("Preencha todos os campos."); return false; }
  if(users.some(u=>u.username===username)){ alert("Usuário já existe!"); return false; }

  if(userType==="professor"){
    if(!tagsArray.length){ alert("Informe pelo menos uma matéria."); return false; }
    const invalidTags = tagsArray.filter(t=>!VALID_TAGS.includes(t));
    if(invalidTags.length){ alert("Matérias inválidas: "+invalidTags.join(", ")); return false; }
    if(!turmasArray.length){ alert("Selecione pelo menos uma turma."); return false; }
  }

  const newUser = { username,email,password,userType,tags:tagsArray||[],turmas:turmasArray||[],boletins:{},photo:null,admin:false };
  users.push(newUser);
  saveUsers(users);
  setLoggedInUser(username);
  return true;
}

function loginUser(username,password){
  const users = loadUsers();
  const u = users.find(x=>x.username===username && x.password===password);
  if(!u){ alert("Usuário ou senha inválidos!"); return false; }
  setLoggedInUser(u.username);
  return true;
}

function setLoggedInUser(username){
  setLoggedInUsername(username);
  $("register-form").style.display="none";
  $("login-form").style.display="none";
  $("profile").style.display="flex";
  $("dropdownMenu").style.display="none";
  updateProfileUI();
}

function updateProfileUI(){
  const username = getLoggedInUsername();
  if(!username) return;
  const users = loadUsers();
  const user = users.find(u=>u.username===username);
  if(!user) return;

  $("profile-name").textContent = user.username;
  $("profile-photo").style.backgroundImage = user.photo ? `url(${user.photo})` : "";

  $("view-report").style.display = (user.userType==="aluno"||user.userType==="professor") ? "block" : "none";
  $("open-admin").style.display = (user.userType==="professor") ? "block" : "none";
}

function logoutUserUIActions(){
  clearLoggedInUsername();
  $("profile").style.display="none";
  $("dropdownMenu").style.display="none";
  $("register-form").style.display="block";
  $("login-form").style.display="block";
}

// ---------- ACCOUNT MODAL ----------
function renderAccountForm(){
  const username = getLoggedInUsername();
  const users = loadUsers();
  const user = users.find(u=>u.username===username);
  const turmasDiv = $("turmas-container");
  const materiasDiv = $("materias-container");
  turmasDiv.innerHTML=""; materiasDiv.innerHTML="";
  if(!user) return;

  if(user.userType==="aluno"){
    turmasDiv.innerHTML="<p>Selecione sua turma:</p>";
    TURMAS.forEach(t=>{
      const div=document.createElement("div");
      const radio=document.createElement("input");
      radio.type="radio"; radio.name="turma-aluno"; radio.value=t;
      if(user.turmas.includes(t)) radio.checked=true;
      const label=document.createElement("label");
      label.appendChild(radio); label.appendChild(document.createTextNode(" "+t));
      div.appendChild(label); turmasDiv.appendChild(div);
    });
  } else if(user.userType==="professor"){
    materiasDiv.innerHTML="<p>Matérias que ensina:</p>";
    user.tags.forEach(tag=>{
      const p=document.createElement("p");
      p.textContent=tag; materiasDiv.appendChild(p);
    });

    turmasDiv.innerHTML="<p>Turmas que ensina e notas:</p>";
    TURMAS.forEach(t=>{
      const row=document.createElement("div");
      const checkbox=document.createElement("input");
      checkbox.type="checkbox"; checkbox.name="turma-professor"; checkbox.value=t;
      if(user.turmas.includes(t)) checkbox.checked=true;
      const label=document.createElement("label");
      label.appendChild(checkbox); label.appendChild(document.createTextNode(" "+t));
      const notaInput=document.createElement("input");
      notaInput.type="text"; notaInput.placeholder="Nota/Observação";
      notaInput.dataset.turmaNota=t;
      if(user.boletins[t]) notaInput.value=user.boletins[t];
      row.appendChild(label); row.appendChild(notaInput);
      turmasDiv.appendChild(row);
    });
  }
}

// ---------- BOLETIM ----------
function openBoletim(){
  const username = getLoggedInUsername();
  const users = loadUsers();
  const user = users.find(u=>u.username===username);
  if(!user) return;

  let boletimHTML = "<h3>Boletim</h3><ul>";
  if(user.userType==="aluno"){
    const turma = user.turmas[0];
    users.forEach(u=>{
      if(u.userType==="aluno" && u.turmas.includes(turma)){
        for(const [disciplina,nota] of Object.entries(u.boletins||{})){
          boletimHTML += `<li>${u.username} - ${disciplina}: ${nota}</li>`;
        }
      }
    });
  } else if(user.userType==="professor"){
    const materias = user.tags||[];
    users.forEach(u=>{
      if(u.userType==="aluno"){
        for(const [disciplina,nota] of Object.entries(u.boletins||{})){
          if(materias.includes(disciplina)){
            boletimHTML += `<li>${u.username} - ${disciplina}: ${nota}</li>`;
          }
        }
      }
    });
  }
  boletimHTML+="</ul>";

  const reportModal=document.createElement("div");
  reportModal.className="modal"; reportModal.style.display="block";
  reportModal.innerHTML=`<div class="modal-content"><span class="close">&times;</span>${boletimHTML}</div>`;
  document.body.appendChild(reportModal);
  reportModal.querySelector(".close").onclick = ()=>reportModal.remove();
  reportModal.addEventListener("click", e=>{if(e.target===reportModal) reportModal.remove();});
}

// ---------- ADMIN ----------
function openAdminModal(){
  $("admin-modal").style.display="block";
}
function closeAdminModal(){
  $("admin-modal").style.display="none";
}
function verifyAdminKey(){
  const key = $("admin-key").value.trim();
  if(ADMIN_KEYS.includes(key)){
    $("upload-section").style.display="block";
    alert("Acesso concedido!");
  } else {
    alert("Cereal-key incorreta."); 
    $("upload-section").style.display="none";
  }
}
function uploadBoletinsAdmin(){
  const input = $("admin-boletins").value.trim();
  if(!input) return alert("Insira os dados do boletim!");
  const users = loadUsers();
  input.split("\n").forEach(l=>{
    const [turma,aluno,disciplina,nota] = l.split(";");
    const u = users.find(x=>x.username===aluno && x.userType==="aluno");
    if(u){
      if(!u.boletins) u.boletins={};
      u.boletins[disciplina]=nota;
      if(!u.turmas.includes(turma)) u.turmas.push(turma);
    }
  });
  saveUsers(users);
  closeAdminModal();
  alert("Boletins enviados com sucesso!");
}

// ---------- SEARCH ----------
function setupSearch(){
  const searchInput=$("search-input");
  const searchResults=$("search-results");
  searchResults.style.display="none";
  searchInput.addEventListener("input",()=>{
    const query=searchInput.value.toLowerCase();
    searchResults.innerHTML="";
    if(!query){ searchResults.style.display="none"; return; }
    const filtered=GENERAL_RESOURCES.filter(r=>r.title.toLowerCase().includes(query));
    if(filtered.length){
      searchResults.style.display="block";
      filtered.forEach(item=>{
        const li=document.createElement("li");
        li.innerHTML=`<a href="${item.url}" target="_blank">${item.title} (${item.type})</a>`;
        searchResults.appendChild(li);
      });
    } else {
      searchResults.style.display="block";
      const li=document.createElement("li"); li.textContent="Nenhum resultado encontrado."; searchResults.appendChild(li);
    }
  });
}

// ---------- INICIALIZAÇÃO ----------
document.addEventListener("DOMContentLoaded",()=>{
  mostrarSlide(slideIndex);
  renderFolders();

  document.querySelectorAll(".folder-btn").forEach(btn=>{
    btn.addEventListener("click",()=>{
      const content = btn.nextElementSibling;
      content.style.display = content.style.display==="block" ? "none" : "block";
    });
  });

  const logged = getLoggedInUsername();
  if(logged) setLoggedInUser(logged);

  setupSearch();

  // ---------- DROPDOWN ----------
  const profile = $("profile");
  const dropdown = $("dropdownMenu");
  if(profile){
    profile.addEventListener("click",()=>{dropdown.style.display = dropdown.style.display==="block"?"none":"block";});
  }
  document.addEventListener("click",(e)=>{if(!profile.contains(e.target)&&!dropdown.contains(e.target)) dropdown.style.display="none";});

  // ---------- LOGOUT ----------
  $("logoutBtn").addEventListener("click",(e)=>{e.preventDefault(); logoutUserUIActions();});

  // ---------- LOGIN / REGISTER ----------
  $("register-button").addEventListener("click",()=>{
    const username = $("username").value.trim();
    const email = $("email").value.trim();
    const password = $("password").value.trim();
    const userType = $("user-type").value;
    let tagsArray=[], turmasArray=[];

    if(userType==="professor"){
      const tagsStr = $("professor-tags").value.trim();
      tagsArray = tagsStr ? tagsStr.split(",").map(t=>t.trim()) : [];
      const checkedBoxes = document.querySelectorAll('input[name="turma-professor"]:checked');
      turmasArray = Array.from(checkedBoxes).map(cb=>cb.value);
    }

    if(registerUser(username,email,password,userType,tagsArray,turmasArray)){
      alert("Cadastro realizado com sucesso!");
      $("auth-modal").style.display="none";
    }
  });

  $("login-button").addEventListener("click",()=>{
    const username = $("username-login").value.trim();
    const password = $("password-login").value.trim();
    if(loginUser(username,password)) $("auth-modal").style.display="none";
  });

  // ---------- MODAIS ----------
  $("open-modal").addEventListener("click",()=>{$("auth-modal").style.display="block";});
  $("close-modal").addEventListener("click",()=>{$("auth-modal").style.display="none";});
  window.addEventListener("click",(e)=>{if(e.target===$("auth-modal")) $("auth-modal").style.display="none";});

  $("open-account").addEventListener("click",(e)=>{
    e.preventDefault();
    $("account-modal").style.display="block";
    renderAccountForm();
    $("dropdownMenu").style.display="none";
  });
  $("close-account-modal").addEventListener("click",()=>{$("account-modal").style.display="none";});
  window.addEventListener("click",(e)=>{if(e.target===$("account-modal")) $("account-modal").style.display="none";});

  $("view-report").addEventListener("click", e=>{ e.preventDefault(); openBoletim(); });

  $("open-admin").addEventListener("click", e=>{ e.preventDefault(); openAdminModal(); });
  $("close-admin-modal").addEventListener("click", closeAdminModal);
  $("verify-admin").addEventListener("click", verifyAdminKey);
  $("upload-boletins").addEventListener("click", uploadBoletinsAdmin);

  // ---------- SHOW PROFESSOR FIELDS ----------
  $("user-type").addEventListener("change",()=>{
    const val = $("user-type").value;
    $("professor-tags-container").style.display = val==="professor"?"block":"none";
    $("professor-turmas-container").style.display = val==="professor"?"block":"none";

    if(val==="professor"){
      const container = $("professor-turmas");
      container.innerHTML="";
      TURMAS.forEach(t=>{
        const div=document.createElement("div");
        const checkbox=document.createElement("input");
        checkbox.type="checkbox"; checkbox.name="turma-professor"; checkbox.value=t;
        const label=document.createElement("label");
        label.appendChild(checkbox); label.appendChild(document.createTextNode(" "+t));
        div.appendChild(label); container.appendChild(div);
      });
    }
  });
});
