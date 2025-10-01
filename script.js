// ================== DADOS & HELPERS ==================
const TURMAS = [
  "1MANUINTMANA","1A","1B","1A(NOTURNO)","1B(NOTURNO)",
  "2A","2COMÉINTCOMA","2A(NOTURNO)","2B(NOTURNO)",
  "3A","3B","3A(NOTURNO)","3B(NOTURNO)"
];
const VALID_TAGS = ["Matemática","Filosofia","Português","História","Geografia","Física","Química","Biologia","Inglês","Artes","Educação Física","Projeto de Vida"];
const GENERAL_RESOURCES = [
  { title: "teste", type: "vídeo", url: "https://youtu.be/dQw4w9WgXcQ" },
  { title: "Alagoas", type: "site", url: "https://example.com" }
];
const ADMIN_KEYS = ["4444"];
const SUBJECT_RESOURCES = {}; // (mantido vazio aqui; você já tem conteúdo hardcoded no menu lateral)

// storage helpers
const $ = id => document.getElementById(id);
function saveUsers(users){ localStorage.setItem("users", JSON.stringify(users)); }
function loadUsers(){ return JSON.parse(localStorage.getItem("users")) || []; }
function getLoggedInUsername(){ return localStorage.getItem("loggedInUser") || null; }
function setLoggedInUsername(u){ if(!u) localStorage.removeItem("loggedInUser"); else localStorage.setItem("loggedInUser", u); }
function clearLoggedInUsername(){ localStorage.removeItem("loggedInUser"); }

// ================== MENU LATERAL (toggle + accordion) ==================
document.addEventListener("DOMContentLoaded", () => {

  const menuToggle = $("menu-toggle");
  const sideMenu = $("side-menu");

  // abrir/fechar menu lateral
  if(menuToggle && sideMenu){
    menuToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      sideMenu.classList.toggle("open");
      // accessibility
      const open = sideMenu.classList.contains("open");
      sideMenu.setAttribute("aria-hidden", !open);
    });
  }

  // click fora fecha menu
  document.addEventListener("click", (e) => {
    const sideMenuEl = $("side-menu");
    const menuBtn = $("menu-toggle");
    if(!sideMenuEl) return;
    if(sideMenuEl.classList.contains("open")){
      if(!sideMenuEl.contains(e.target) && menuBtn && !menuBtn.contains(e.target)){
        sideMenuEl.classList.remove("open");
        sideMenuEl.setAttribute("aria-hidden", "true");
      }
    }
  });

  // accordion matérias
  const subjectToggles = document.querySelectorAll(".subject-toggle");
  subjectToggles.forEach(btn => {
    btn.addEventListener("click", () => {
      const content = btn.nextElementSibling;
      if(!content) return;
      content.classList.toggle("active");
      btn.classList.toggle("rotated");
    });
  });

  // accordion anos
  const yearToggles = document.querySelectorAll(".year-toggle");
  yearToggles.forEach(btn => {
    btn.addEventListener("click", () => {
      const content = btn.nextElementSibling;
      if(!content) return;
      content.classList.toggle("active");
      btn.classList.toggle("rotated");
    });
  });

  // ================== SLIDESHOW ==================
  let slideIndex = 0;
  let slideTimer = null;
  function showSlidesAuto(){
    const slides = document.getElementsByClassName("slide");
    if(!slides.length) return;
    Array.from(slides).forEach(s => s.style.display = "none");
    slideIndex = (slideIndex + 1) % slides.length;
    slides[slideIndex].style.display = "block";
  }
  function startSlideshow(){ showSlidesAuto(); slideTimer = setInterval(showSlidesAuto, 3000); }
  function stopSlideshow(){ if(slideTimer) clearInterval(slideTimer); }
  startSlideshow();

  const prevBtn = $("prev-slide"), nextBtn = $("next-slide");
  if(prevBtn) prevBtn.addEventListener("click", ()=> { stopSlideshow(); slideIndex = (slideIndex-1+10)%10; showSlidesAuto(); startSlideshow(); });
  if(nextBtn) nextBtn.addEventListener("click", ()=> { stopSlideshow(); showSlidesAuto(); startSlideshow(); });

  // ================== SEARCH ==================
  const searchInput = $("search-input");
  const searchResults = $("search-results");
  if(searchInput && searchResults){
    let debounce = null;
    searchInput.addEventListener("input", () => {
      if(debounce) clearTimeout(debounce);
      debounce = setTimeout(()=> {
        const q = (searchInput.value||"").toLowerCase().trim();
        searchResults.innerHTML = "";
        if(!q){ searchResults.style.display = "none"; return; }
        const results = [];
        GENERAL_RESOURCES.forEach(r => { if(r.title.toLowerCase().includes(q)) results.push(r); });
        if(results.length){
          searchResults.style.display = "block";
          results.forEach(r => {
            const li = document.createElement("li");
            li.innerHTML = `<a href="${r.url}" target="_blank" rel="noopener">${r.title} (${r.type})</a>`;
            searchResults.appendChild(li);
          });
        } else {
          searchResults.style.display = "block";
          const li = document.createElement("li");
          li.textContent = "Nenhum resultado encontrado.";
          searchResults.appendChild(li);
        }
      }, 200);
    });
  }

  // fechar resultados clicando fora
  document.addEventListener("click", (e)=>{
    const sr = $("search-results");
    const si = $("search-input");
    if(sr && si && !si.contains(e.target) && !sr.contains(e.target)){
      sr.style.display = "none";
    }
  });

  // ================== AUTH: abrir modal login/register ==================
  const openAuthBtn = $("register-btn");
  const authModal = $("auth-modal");
  const closeAuth = $("close-auth-modal");
  const loginPanel = $("login-panel");
  const registerPanel = $("register-panel");

  if(openAuthBtn && authModal){
    openAuthBtn.addEventListener("click", ()=> {
      if(loginPanel) loginPanel.style.display = "block";
      if(registerPanel) registerPanel.style.display = "none";
      authModal.style.display = "block";
    });
  }
  if(closeAuth) closeAuth.addEventListener("click", ()=> authModal.style.display = "none");
  window.addEventListener("click", (e)=> { if(e.target === authModal) authModal.style.display = "none"; });

  // alternar panels
  const showRegister = $("show-register"), showLogin = $("show-login");
  if(showRegister) showRegister.addEventListener("click", (e)=>{ e.preventDefault(); if(loginPanel) loginPanel.style.display="none"; if(registerPanel) registerPanel.style.display="block"; });
  if(showLogin) showLogin.addEventListener("click", (e)=>{ e.preventDefault(); if(loginPanel) loginPanel.style.display="block"; if(registerPanel) registerPanel.style.display="none"; });

  // mostrar campos professor no register
  const userTypeSel = $("user-type");
  if(userTypeSel){
    userTypeSel.addEventListener("change", ()=>{
      const val = userTypeSel.value;
      const tagsCont = $("professor-tags-container");
      const turmasCont = $("professor-turmas-container");
      if(tagsCont) tagsCont.style.display = val==="professor" ? "block" : "none";
      if(turmasCont) turmasCont.style.display = val==="professor" ? "block" : "none";
      if(val === "professor"){
        const container = $("professor-turmas");
        container.innerHTML = "";
        TURMAS.forEach(t=>{
          const div = document.createElement("div");
          const checkbox = document.createElement("input");
          checkbox.type="checkbox"; checkbox.name="turma-professor-register"; checkbox.value=t;
          const label = document.createElement("label");
          label.appendChild(checkbox); label.appendChild(document.createTextNode(" " + t));
          div.appendChild(label); container.appendChild(div);
        });
      }
    });
  }

  // ================== REGISTER / LOGIN handlers ==================
  function registerUser({ username, email, password, userType="aluno", tagsArray=[], turmasArray=[], photoFile=null }){
    const users = loadUsers();
    if(!username || !email || !password){ alert("Preencha todos os campos."); return false; }
    if(users.some(u=>u.username===username)){ alert("Usuário já existe!"); return false; }
    let photo = null;
    if(photoFile) try{ photo = URL.createObjectURL(photoFile); }catch(e){ photo=null; }

    const newUser = { username, email, password, userType, tags: tagsArray||[], turmas: turmasArray||[], boletins:{}, photo, admin:false };
    users.push(newUser); saveUsers(users); setLoggedInUsername(username); setLoggedInUserUI(username);
    return true;
  }

  function loginUser(username, password){
    const users = loadUsers();
    const u = users.find(x => x.username === username && x.password === password);
    if(!u){ alert("Usuário ou senha inválidos!"); return false; }
    setLoggedInUsername(u.username); setLoggedInUserUI(u.username); return true;
  }

  // register form submit
  const registerForm = $("register-form");
  if(registerForm){
    registerForm.addEventListener("submit", (e)=>{
      e.preventDefault();
      const username = ($("username-register") && $("username-register").value || "").trim();
      const email = ($("email-register") && $("email-register").value || "").trim();
      const password = ($("password-register") && $("password-register").value || "").trim();
      const userType = ($("user-type") && $("user-type").value) || "aluno";
      let tagsArray = [], turmasArray = [];
      if(userType==="professor"){
        const tagsStr = ($("professor-tags") && $("professor-tags").value || "").trim();
        tagsArray = tagsStr ? tagsStr.split(",").map(s=>s.trim()).filter(Boolean) : [];
        const checkedBoxes = document.querySelectorAll('input[name="turma-professor-register"]:checked');
        turmasArray = Array.from(checkedBoxes).map(cb=>cb.value);
      }
      const fileInput = $("profilePicUpload");
      const photoFile = (fileInput && fileInput.files && fileInput.files[0]) ? fileInput.files[0] : null;
      if(registerUser({ username, email, password, userType, tagsArray, turmasArray, photoFile })){
        alert("Cadastro realizado com sucesso!");
        if(authModal) authModal.style.display = "none";
      }
    });
  }

  // login form submit
  const loginForm = $("login-form");
  if(loginForm){
    loginForm.addEventListener("submit", (e)=>{
      e.preventDefault();
      const username = ($("username-login") && $("username-login").value || "").trim();
      const password = ($("password-login") && $("password-login").value || "").trim();
      if(loginUser(username, password)){
        if(authModal) authModal.style.display = "none";
      }
    });
  }

  // ================== PROFILE UI ==================
  function setLoggedInUserUI(username){
    const profileEl = $("profile");
    const registerBtn = $("register-btn");
    if(profileEl) profileEl.style.display = username ? "flex" : "none";
    if(registerBtn) registerBtn.style.display = username ? "none" : "inline-block";
    updateProfileUI();
  }

  function updateProfileUI(){
    const username = getLoggedInUsername();
    const profileName = $("profile-name");
    const profilePhoto = $("profile-photo");
    if(!username){
      if(profileName) profileName.textContent = "Usuário";
      if(profilePhoto) profilePhoto.style.backgroundImage = "";
      return;
    }
    const users = loadUsers();
    const user = users.find(u=>u.username===username);
    if(!user) return;
    if(profileName) profileName.textContent = user.username;
    if(profilePhoto) profilePhoto.style.backgroundImage = user.photo ? `url(${user.photo})` : "";
    const openAdminLink = $("open-admin");
    if(openAdminLink) openAdminLink.style.display = (user.userType === "professor" || user.admin) ? "block" : "none";
  }

  // profile dropdown toggle
  const profileBtn = $("profile");
  const dropdown = $("dropdownMenu");
  if(profileBtn){
    profileBtn.addEventListener("click", (e)=>{ e.stopPropagation(); if(!dropdown) return; dropdown.style.display = dropdown.style.display === "block" ? "none" : "block"; });
  }
  document.addEventListener("click", ()=> { if(dropdown) dropdown.style.display = "none"; });

  // logout
  const logoutBtn = $("logoutBtn");
  if(logoutBtn) logoutBtn.addEventListener("click", e=> { e.preventDefault(); clearLoggedInUsername(); setLoggedInUserUI(null); if(dropdown) dropdown.style.display='none'; });

  // ================== ACCOUNT (minha conta) ==================
  function renderAccountForm(){
    const username = getLoggedInUsername();
    const users = loadUsers();
    const user = users.find(u=>u.username===username);
    const turmasDiv = $("turmas-container");
    const materiasDiv = $("materias-container");
    if(!turmasDiv || !materiasDiv) return;
    turmasDiv.innerHTML = ""; materiasDiv.innerHTML = "";
    if(!user) return;
    if(user.userType === "aluno"){
      materiasDiv.innerHTML = `<p>Tipo: Aluno</p>`;
      turmasDiv.innerHTML = "<p>Selecione sua turma:</p>";
      TURMAS.forEach(t=>{
        const div = document.createElement("div");
        const radio = document.createElement("input");
        radio.type="radio"; radio.name="turma-aluno"; radio.value=t;
        if(user.turmas && user.turmas.includes(t)) radio.checked = true;
        const label = document.createElement("label"); label.appendChild(radio); label.appendChild(document.createTextNode(" " + t));
        div.appendChild(label); turmasDiv.appendChild(div);
      });
    } else if(user.userType === "professor"){
      materiasDiv.innerHTML = "<p>Matérias que ensina:</p>";
      const ul = document.createElement("ul");
      (user.tags || []).forEach(tag=>{ const li=document.createElement("li"); li.textContent=tag; ul.appendChild(li); });
      materiasDiv.appendChild(ul);

      turmasDiv.innerHTML = "<p>Turmas que ensina e notas rápidas:</p>";
      TURMAS.forEach(t=>{
        const row=document.createElement("div");
        const checkbox=document.createElement("input"); checkbox.type="checkbox"; checkbox.name="turma-professor"; checkbox.value=t;
        if(user.turmas && user.turmas.includes(t)) checkbox.checked=true;
        const label=document.createElement("label"); label.appendChild(checkbox); label.appendChild(document.createTextNode(" " + t));
        const notaInput=document.createElement("input"); notaInput.type="text"; notaInput.placeholder="Nota/Observação"; notaInput.dataset.turmaNota = t;
        if(user.boletins && user.boletins[t]) notaInput.value = user.boletins[t];
        row.appendChild(label); row.appendChild(notaInput); turmasDiv.appendChild(row);
      });
    }
  }

  function saveAccountChanges(){
    const username = getLoggedInUsername();
    if(!username){ alert("Nenhum usuário logado!"); return; }
    const users = loadUsers();
    const idx = users.findIndex(u=>u.username===username);
    if(idx === -1) return;
    const user = users[idx];
    if(user.userType === "aluno"){
      const checked = document.querySelector('input[name="turma-aluno"]:checked');
      user.turmas = checked ? [checked.value] : [];
    } else if(user.userType === "professor"){
      const checkedBoxes = document.querySelectorAll('input[name="turma-professor"]:checked');
      user.turmas = Array.from(checkedBoxes).map(cb=>cb.value);
      const notaInputs = Array.from(document.querySelectorAll('input[data-turma-nota]'));
      notaInputs.forEach(inp => {
        const t = inp.dataset.turmaNota;
        if(!user.boletins) user.boletins = {};
        if(inp.value && inp.value.trim()) user.boletins[t] = inp.value.trim();
      });
    }
    users[idx] = user; saveUsers(users); updateProfileUI(); alert("Alterações salvas!"); const acc = $("account-modal"); if(acc) acc.style.display='none';
  }

  const openAccount = $("open-account"), accountModal = $("account-modal"), closeAccount = $("close-account-modal");
  if(openAccount) openAccount.addEventListener("click", (e)=>{ e.preventDefault(); if(accountModal) accountModal.style.display='block'; renderAccountForm(); if(dropdown) dropdown.style.display='none'; });
  if(closeAccount) closeAccount.addEventListener("click", ()=>{ if(accountModal) accountModal.style.display='none'; });
  if($("save-account-button")) $("save-account-button").addEventListener("click", saveAccountChanges);
  window.addEventListener("click", (e)=> { if(e.target === accountModal) accountModal.style.display = "none"; });

  // ================== BOLETIM ==================
  function openBoletim(){
    const username = getLoggedInUsername();
    if(!username) return;
    const users = loadUsers();
    const current = users.find(u=>u.username===username);
    if(!current) return;
    let html = "<h3>Boletim</h3><ul>";
    if(current.userType === "aluno"){
      const turma = (current.turmas && current.turmas[0]) || null;
      users.forEach(u=>{
        if(u.userType==="aluno" && u.turmas && turma && u.turmas.includes(turma)){
          for(const [disc,nota] of Object.entries(u.boletins||{})){
            html += `<li>${u.username} - ${disc}: ${nota}</li>`;
          }
        }
      });
    } else if(current.userType==="professor"){
      const materias = current.tags || [];
      users.forEach(u=>{
        if(u.userType==="aluno"){
          for(const [disc,nota] of Object.entries(u.boletins||{})){
            if(materias.includes(disc)) html += `<li>${u.username} - ${disc}: ${nota}</li>`;
          }
        }
      });
    }
    html += "</ul>";
    const reportModal = document.createElement("div"); reportModal.className="modal"; reportModal.style.display="block";
    reportModal.innerHTML = `<div class="modal-content"><span class="close">&times;</span>${html}</div>`;
    document.body.appendChild(reportModal);
    reportModal.querySelector(".close").onclick = ()=> reportModal.remove();
    reportModal.addEventListener("click", e => { if(e.target === reportModal) reportModal.remove(); });
  }
  const viewReport = $("view-report");
  if(viewReport) viewReport.addEventListener("click", (e)=>{ e.preventDefault(); openBoletim(); if(dropdown) dropdown.style.display='none'; });

  // ================== ADMIN ==================
  function openAdminModal(){ const m = $("admin-modal"); if(m) m.style.display = "block"; }
  function closeAdminModal(){ const m = $("admin-modal"); if(m) m.style.display = "none"; }
  function verifyAdminKey(){
    const key = ($("admin-key") && $("admin-key").value || "").trim();
    if(ADMIN_KEYS.includes(key)){ const up = $("upload-section"); if(up) up.style.display = "block"; alert("Acesso concedido!"); } else { const up = $("upload-section"); if(up) up.style.display = "none"; alert("Cereal-key incorreta."); }
  }
  function uploadBoletinsAdmin(){
    const input = ($("admin-boletins") && $("admin-boletins").value || "").trim();
    if(!input) return alert("Insira os dados do boletim!");
    const users = loadUsers();
    input.split("\n").forEach(l=>{
      const parts = l.split(";");
      if(parts.length < 4) return;
      const turma = parts[0].trim(), aluno = parts[1].trim(), disciplina = parts[2].trim(), nota = parts[3].trim();
      const u = users.find(x=>x.username===aluno && x.userType==="aluno");
      if(u){ if(!u.boletins) u.boletins = {}; u.boletins[disciplina] = nota; if(!u.turmas.includes(turma)) u.turmas.push(turma); }
    });
    saveUsers(users); closeAdminModal(); alert("Boletins enviados com sucesso!");
  }

  const openAdmin = $("open-admin"), closeAdmin = $("close-admin-modal"), verifyBtn = $("verify-admin"), uploadBtn = $("upload-boletins");
  if(openAdmin) openAdmin.addEventListener("click", (e)=>{ e.preventDefault(); openAdminModal(); if(dropdown) dropdown.style.display='none'; });
  if(closeAdmin) closeAdmin.addEventListener("click", closeAdminModal);
  if(verifyBtn) verifyBtn.addEventListener("click", verifyAdminKey);
  if(uploadBtn) uploadBtn.addEventListener("click", uploadBoletinsAdmin);
  window.addEventListener("click", (e)=> { if(e.target === $("admin-modal")) $("admin-modal").style.display = 'none'; });

  // ================== INIT UI ==================
  const logged = getLoggedInUsername(); if(logged) setLoggedInUserUI(logged);
});


const mainFolderButtons = document.querySelectorAll('.main-folder-btn');

mainFolderButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    btn.classList.toggle('active');
    const content = btn.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
});
