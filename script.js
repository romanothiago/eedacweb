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

// ================== BOLETIM (modal com top azul + tabela abaixo; edição só para professores) ==================
function loadBoletinsLS(){
  return JSON.parse(localStorage.getItem("boletins_v1") || "{}");
}
function saveBoletinsLS(data){
  localStorage.setItem("boletins_v1", JSON.stringify(data));
}
function loadStudentNames(){
  return JSON.parse(localStorage.getItem("studentNames_v1") || "[]");
}
function saveStudentNames(list){
  localStorage.setItem("studentNames_v1", JSON.stringify(Array.from(new Set(list))));
}
function getAllStudentNames(){ return loadStudentNames(); }

function openBoletim(){
  // remove modal anterior, se existir
  const existing = document.getElementById("boletim-modal");
  if(existing) existing.remove();

  // determina se usuário é professor/admin (se não logado => considera aluno)
  const logged = getLoggedInUsername();
  const users = loadUsers();
  const currentUser = users.find(u => u.username === logged);
  const isProfessor = !!(currentUser && (currentUser.userType === "professor" || currentUser.admin));

  // cria modal
  const modal = document.createElement("div");
  modal.id = "boletim-modal";
  modal.className = "modal";
  modal.style.display = "block";

  modal.innerHTML = `
    <div class="modal-content" style="max-width:920px; width:95%; padding:0; border-radius:8px; overflow:hidden;">
      <!-- Top azul -->
      <div style="background:var(--blue); color:#fff; padding:12px 16px; display:flex; gap:12px; align-items:center; flex-wrap:wrap;">
        <div style="flex:1; min-width:220px;">
          <strong>Boletim</strong>
          <div style="font-size:12px; opacity:0.9;">${isProfessor ? "Modo: Professor — editar permitido" : "Modo: Aluno — somente leitura"}</div>
        </div>
        <div style="display:flex; gap:8px; align-items:center; flex:2; min-width:320px;">
          <select id="boletim-turma" style="flex:1; padding:8px; border-radius:6px; border:none;">
            <option value="">Turma</option>
            ${TURMAS.map(t => `<option value="${t}">${t}</option>`).join("")}
          </select>
          <select id="boletim-materia" style="flex:1; padding:8px; border-radius:6px; border:none;">
            <option value="">Matéria</option>
            ${VALID_TAGS.map(m => `<option value="${m}">${m}</option>`).join("")}
          </select>
          <select id="boletim-bimestre" style="width:150px; padding:8px; border-radius:6px; border:none;">
            <option value="">Bimestre</option>
            <option value="1º Bimestre">1º Bimestre</option>
            <option value="2º Bimestre">2º Bimestre</option>
            <option value="3º Bimestre">3º Bimestre</option>
            <option value="4º Bimestre">4º Bimestre</option>
          </select>
        </div>

        <div style="display:flex; gap:8px; align-items:center;">
          <button id="btn-load" style="padding:8px 10px; border-radius:6px; border:none; background:#fff; color:var(--blue); cursor:pointer;">Carregar</button>
          <button id="btn-new" style="padding:8px 10px; border-radius:6px; border:1px solid rgba(255,255,255,0.2); background:transparent; color:#fff; cursor:pointer;">Novo</button>
          <button id="close-boletim" class="close" title="Fechar" style="font-size:20px; color:#fff; margin-left:6px; background:transparent; border:none;">✕</button>
        </div>
      </div>

      <!-- Corpo: tabela de alunos -->
      <div style="background:var(--card); padding:14px; max-height:64vh; overflow:auto;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <h3 style="margin:0">Notas</h3>
          <div>
            <button id="add-row" style="margin-right:8px; padding:8px 10px; border-radius:6px; border:none; background:#e9eefc; color:var(--blue); cursor:pointer;">+ Adicionar aluno</button>
            <button id="save-boletim" style="padding:8px 12px; border-radius:6px; border:none; background:var(--brand); color:#fff; cursor:pointer;">Salvar</button>
          </div>
        </div>

        <datalist id="student-names"></datalist>

        <table id="boletim-table" style="width:100%; border-collapse:collapse;">
          <thead>
            <tr style="background:#f7f8fb;">
              <th style="text-align:left; padding:8px; border-bottom:1px solid #eee;">Aluno</th>
              <th style="width:140px; text-align:left; padding:8px; border-bottom:1px solid #eee;">Nota</th>
              <th style="width:80px; padding:8px; border-bottom:1px solid #eee;"></th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // refs
  const closeBtn = modal.querySelector("#close-boletim");
  const turmaSel = modal.querySelector("#boletim-turma");
  const materiaSel = modal.querySelector("#boletim-materia");
  const bimestreSel = modal.querySelector("#boletim-bimestre");
  const loadBtn = modal.querySelector("#btn-load");
  const newBtn = modal.querySelector("#btn-new");
  const addRowBtn = modal.querySelector("#add-row");
  const saveBtn = modal.querySelector("#save-boletim");
  const tableBody = modal.querySelector("#boletim-table tbody");
  const datalist = modal.querySelector("#student-names");

  // estado inicial de botões conforme permissão
  if(!isProfessor){
    addRowBtn.disabled = true;
    addRowBtn.style.opacity = "0.6";
    saveBtn.disabled = true;
    saveBtn.style.opacity = "0.6";
    saveBtn.title = "Somente professores podem salvar";
  }

  // popula datalist com nomes já existentes
  function refreshDatalist(){
    const names = getAllStudentNames();
    datalist.innerHTML = names.map(n => `<option value="${n}">`).join("");
  }
  refreshDatalist();

  // cria linha (editable = isProfessor)
  function createRow(name = "", nota = "", editable = isProfessor){
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td style="padding:8px; border-bottom:1px solid #f0f0f0;">
        <input list="student-names" class="input-aluno" style="width:100%; padding:6px; border-radius:6px; border:1px solid #ddd;" value="${name || ""}" ${editable ? "" : "readonly"} />
      </td>
      <td style="padding:8px; border-bottom:1px solid #f0f0f0;">
        <input type="number" min="0" max="10" step="0.1" class="input-nota" style="width:100%; padding:6px; border-radius:6px; border:1px solid #ddd;" value="${nota !== null ? nota : ""}" ${editable ? "" : "readonly"} />
      </td>
      <td style="padding:8px; border-bottom:1px solid #f0f0f0; text-align:center;">
        <button class="remove-row" style="background:transparent;border:none;color:#c00;cursor:pointer;" ${editable ? "" : "disabled"}>${editable ? "✕" : ""}</button>
      </td>
    `;
    const removeBtn = tr.querySelector(".remove-row");
    if(removeBtn){
      removeBtn.addEventListener("click", ()=> tr.remove());
    }
    // quando professor digita nome, atualiza lista local para sugerir depois
    if(editable){
      const nameInput = tr.querySelector(".input-aluno");
      nameInput.addEventListener("change", (e)=>{
        const val = (e.target.value || "").trim();
        if(val){
          const names = loadStudentNames();
          names.push(val);
          saveStudentNames(names);
          refreshDatalist();
        }
      });
    }
    tableBody.appendChild(tr);
    return tr;
  }

  // carrega tabela de storage
  function loadTableFromStorage(){
    tableBody.innerHTML = "";
    const turma = turmaSel.value, materia = materiaSel.value, bimestre = bimestreSel.value;
    if(!turma || !materia || !bimestre){
      // tabela vazia (visível apenas para consulta)
      createRow("", "", false); // apenas uma linha vazia visual
      return;
    }
    const data = loadBoletinsLS();
    if(data[turma] && data[turma][materia] && data[turma][materia][bimestre]){
      const entries = data[turma][materia][bimestre];
      Object.keys(entries).forEach(nome => {
        createRow(nome, entries[nome], isProfessor);
      });
    } else {
      // sem dados: uma linha vazia (se professor, editável)
      createRow("", "", isProfessor);
    }
  }

  // salvar tabela no storage (somente professor)
  function saveTableToStorage(){
    if(!isProfessor){ alert("Você não tem permissão para salvar boletins."); return; }
    const turma = turmaSel.value, materia = materiaSel.value, bimestre = bimestreSel.value;
    if(!turma || !materia || !bimestre){ alert("Selecione turma, matéria e bimestre antes de salvar."); return; }
    const rows = Array.from(tableBody.querySelectorAll("tr"));
    const data = loadBoletinsLS();
    if(!data[turma]) data[turma] = {};
    if(!data[turma][materia]) data[turma][materia] = {};
    if(!data[turma][materia][bimestre]) data[turma][materia][bimestre] = {};

    const namesForStorage = loadStudentNames();
    const target = {};
    rows.forEach(r=>{
      const name = (r.querySelector(".input-aluno").value || "").trim();
      const notaRaw = r.querySelector(".input-nota").value;
      if(!name) return; // ignora
      const nota = notaRaw === "" ? "" : Number(notaRaw);
      if(nota !== "" && (isNaN(nota) || nota < 0 || nota > 10)){ /* ignora valores inválidos */ return; }
      target[name] = nota;
      namesForStorage.push(name);
    });

    data[turma][materia][bimestre] = target;
    saveBoletinsLS(data);
    saveStudentNames(namesForStorage);
    refreshDatalist();
    alert("Boletim salvo localmente!");
  }

  // eventos
  closeBtn.addEventListener("click", ()=> modal.remove());
  modal.addEventListener("click", (e) => { if(e.target === modal) modal.remove(); });

  loadBtn.addEventListener("click", loadTableFromStorage);
  newBtn.addEventListener("click", ()=> { tableBody.innerHTML = ""; createRow("", "", isProfessor); });
  addRowBtn.addEventListener("click", ()=> createRow("", "", isProfessor));
  saveBtn.addEventListener("click", saveTableToStorage);

  // desabilita edição/remoção caso não seja professor (caso haja linhas já criadas)
  // (a função createRow já aplica readonly/disabled conforme isProfessor)
  // carregamento inicial
  createRow("", "", isProfessor);
  refreshDatalist();
}

// substitui evento antigo (se existir)
const viewReport = $("view-report");
if(viewReport) viewReport.addEventListener("click", (e)=>{ e.preventDefault(); openBoletim(); if(dropdown) dropdown.style.display = 'none'; });


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

// ================== UPLOAD FORM (dentro da modal de perfil) ==================
  function renderUploadForm(){
    const username = getLoggedInUsername();
    const users = loadUsers();
    const user = users.find(u => u.username === username);

    // Só mostra para professores ou admins
    if (!user || (user.userType !== "professor" && !user.admin)) return;

    const accountModal = $("account-modal");
    if (!accountModal) return;

    // Evita duplicação se o formulário já existir
    if (accountModal.querySelector("#upload-form")) return;

    const uploadSection = document.createElement("section");
    uploadSection.innerHTML = `
      <hr style="margin:16px 0; border:none; border-top:1px solid #ccc;">
      <h3 style="margin-bottom:8px;">Envio de Materiais</h3>
      <form id="upload-form" style="display:flex; flex-direction:column; gap:8px;">
        <label for="upload-subject">Matéria:</label>
        <select id="upload-subject" required>
          <option value="">Selecione...</option>
          ${VALID_TAGS.map(m => `<option>${m}</option>`).join("")}
        </select>

        <label for="upload-year">Ano:</label>
        <select id="upload-year" required>
          <option value="">Selecione...</option>
          <option>1º Ano</option>
          <option>2º Ano</option>
          <option>3º Ano</option>
        </select>

        <label for="pdf-upload">Arquivo PDF:</label>
        <input type="file" id="pdf-upload" accept="application/pdf" />

        <label for="video-upload">Vídeo Aula (MP4):</label>
        <input type="file" id="video-upload" accept="video/mp4" />

        <button type="submit" style="margin-top:8px;">Enviar</button>
      </form>
    `;
    accountModal.querySelector(".modal-content").appendChild(uploadSection);

    // Lógica simples de envio
    const uploadForm = $("upload-form");
    uploadForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const subject = $("upload-subject").value;
      const year = $("upload-year").value;
      const pdf = $("pdf-upload").files[0];
      const video = $("video-upload").files[0];
      if (!subject || !year) return alert("Preencha todos os campos.");

      let msg = `Arquivo(s) enviados:\nMatéria: ${subject}\nAno: ${year}\n`;
      if (pdf) msg += `- PDF: ${pdf.name}\n`;
      if (video) msg += `- Vídeo: ${video.name}\n`;
      alert(msg);
      uploadForm.reset();
    });
  }

  // adiciona o formulário quando abrir o modal de conta
  const openAccountBtn = $("open-account");
  if (openAccountBtn) {
    openAccountBtn.addEventListener("click", () => {
      setTimeout(renderUploadForm, 300); // pequeno delay para o modal renderizar antes
    });
  }

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
