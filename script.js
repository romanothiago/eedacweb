// ================== DADOS & HELPERS ==================
const TURMAS = [
  "1TécA","1TécB","2Téc","2A","2B",
  "3Téc","3A","1A(Noturno)","1B(Noturno)",
  "2A(Noturno)","3A(Noturno)","3B(NOTURNO)","EJA(NOTURNO)"
];
const OP_MATERIAS = ["Matemática","Filosofia","Português","História","Geografia","Física","Química","Biologia","Inglês","Artes","Educação Física","Projeto de Vida","Informática","Comércio"];

const VALID_TAGS = ["#J2711","#T1307","#V8233","#Q9028","#W3451","#E1155","#X5151","#C0962","#S6289","#F4267","#Y3451","#B7152","#D4713","#O5364"];

const GENERAL_RESOURCES = [
  { title: "teste", type: "vídeo", url: "https://youtu.be/dQw4w9WgXcQ" },
  { title: "Alagoas", type: "site", url: "https://example.com" },
  { title: "Thiago Lemos", type: "vídeo", url: "https://youtu.be/tEFU46jYVOI?si=_VpjgBBT-PwOTMfs" }
];
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
  
  const teacherAreaBtn = $("open-teacher-area");
const perfilModal = $("perfil-modal"); // Modal que já contém o formulário de upload

if (teacherAreaBtn) {
    teacherAreaBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (perfilModal) {
            perfilModal.style.display = "flex"; // Abre a modal de upload que você já tem
        }
        if ($("dropdownMenu")) $("dropdownMenu").style.display = "none";
    });
}

  
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



// =========== Modal de saida ==============

// 1. Elementos
const logoutTrigger = document.getElementById('logoutBtn'); // Link no dropdown
const logoutModal = document.getElementById('logout-modal'); // O modal
const closeX = document.getElementById('close-logout'); // O "X" de fechar
const btnCancelar = document.getElementById('btn-cancelar-logout');
const btnSairReal = document.getElementById('btn-confirmar-sair');

// 2. Abrir o modal ao clicar em "Sair" no dropdown
logoutTrigger.addEventListener('click', (e) => {
  e.preventDefault(); // Evita que a página recarregue
  logoutModal.style.display = 'flex'; // Exibe o modal
  
  // Opcional: Fecha o menu dropdown se ele estiver aberto
  document.getElementById('dropdownMenu').style.display = 'none';
});

// 3. Funções para fechar o modal
const fecharModalSair = () => {
  logoutModal.style.display = 'none';
};

closeX.onclick = fecharModalSair;
btnCancelar.onclick = fecharModalSair;

// Fechar se clicar fora da janelinha branca
window.addEventListener('click', (event) => {
  if (event.target == logoutModal) {
    fecharModalSair();
  }
});

// 4. AÇÃO REAL DE SAIR
  const logoutBtn = $("btn-confirmar-sair");
  if(logoutBtn) logoutBtn.addEventListener("click", e=> { e.preventDefault(); clearLoggedInUsername(); setLoggedInUserUI(null); if(dropdown) dropdown.style.display='none'; });
  
  
  
  // =========== PROFILE UI ===============
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

function updateProfileUI(){
    const username = getLoggedInUsername();
    const profileName = $("profile-name");
    const profilePhoto = $("profile-photo");
    const teacherAreaLink = $("open-teacher-area"); // Referência ao novo link

    if(!username){
        if(profileName) profileName.textContent = "Usuário";
        if(profilePhoto) profilePhoto.style.backgroundImage = "";
        if(teacherAreaLink) teacherAreaLink.style.display = "none";
        return;
    }

    const users = loadUsers();
    const user = users.find(u=>u.username===username);
    if(!user) return;

    if(profileName) profileName.textContent = user.username;
    if(profilePhoto) profilePhoto.style.backgroundImage = user.photo ? `url(${user.photo})` : "";

    // LÓGICA DE PERMISSÃO:
    if(teacherAreaLink) {
        if(user.userType === "professor" || user.userType === "administrador" || user.admin) {
            teacherAreaLink.style.display = "block";
        } else {
            teacherAreaLink.style.display = "none";
        }
    }
}


async function handleRegister() {
    const role = document.getElementById('userRole').value;
    const key = document.getElementById('teacherKey').value;

    const response = await fetch('https://seu-servidor.com/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: role, key: key })
    });

    const result = await response.json();
    if (result.success) {
        alert("Conta criada com sucesso!");
    } else {
        alert("Chave inválida ou já utilizada.");
    }
}


// register form submit
const registerForm = $("register-form");
if (registerForm) {
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const username = ($("username-register") && $("username-register").value || "").trim();
    const email = ($("email-register") && $("email-register").value || "").trim();
    const password = ($("password-register") && $("password-register").value || "").trim();
    const userType = ($("user-type") && $("user-type").value) || "aluno";
    
    let tagsArray = [], turmasArray = [];

    if (userType === "professor") {
      const tagsStr = ($("professor-tags") && $("professor-tags").value || "").trim();
      
      // Transforma a string em array e remove espaços
      const inputTags = tagsStr ? tagsStr.split(",").map(s => s.trim()).filter(Boolean) : [];

      // VALIDAÇÃO: Filtra apenas as tags que existem no seu VALID_TAGS
      tagsArray = inputTags.filter(tag => VALID_TAGS.includes(tag));

      // Verifica se o professor inseriu alguma tag inválida ou se deixou vazio
      if (inputTags.length === 0) {
        alert("Por favor, insira ao menos uma matéria.");
        return;
      }

      if (tagsArray.length !== inputTags.length) {
        alert("Uma ou mais matérias inseridas são inválidas. Insira matérias de verdade!");
        return;
      }

      const checkedBoxes = document.querySelectorAll('input[name="turma-professor-register"]:checked');
      turmasArray = Array.from(checkedBoxes).map(cb => cb.value);
    }

    const fileInput = $("profilePicUpload");
    const photoFile = (fileInput && fileInput.files && fileInput.files[0]) ? fileInput.files[0] : null;

    // Se passou na validação das tags, prossegue com o registro
    if (registerUser({ username, email, password, userType, tagsArray, turmasArray, photoFile })) {
      alert("Cadastro realizado com sucesso!");
      if (authModal) authModal.style.display = "none";
    }
  });
}

  // profile dropdown toggle
  const profileBtn = $("profile");
  const dropdown = $("dropdownMenu");
  if(profileBtn){
    profileBtn.addEventListener("click", (e)=>{ e.stopPropagation(); if(!dropdown) return; dropdown.style.display = dropdown.style.display === "block" ? "none" : "block"; });
  }
  document.addEventListener("click", ()=> { if(dropdown) dropdown.style.display = "none"; });



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

// ================ BOLETIM ===============
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
            ${OP_MATERIAS.map(m => `<option value="${m}">${m}</option>`).join("")}
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

// --- CONFIGURAÇÕES ---
const SENHA_MESTRA = "1234"; 

// --- ELEMENTOS ---
const perfilModal = document.getElementById("perfil-modal");
const passwordModal = document.getElementById("password-modal");
const admModal = document.getElementById("adm-modal");

const btnAbrirProfessor = document.getElementById("uploadLessonBtn");
const btnAbrirSenha = document.getElementById("btn-abrir-adm"); // Abre a modal de senha
const btnConfirmarSenha = document.getElementById("btn-confirmar-senha");

const inputSenha = document.getElementById("input-senha-adm");
const textoErro = document.getElementById("erro-senha");

// Botões de fechar
const btnFecharPerfil = document.getElementById("close-perfil");
const btnFecharSenha = document.getElementById("close-password");
const btnFecharAdm = document.getElementById("close-adm");

// --- LÓGICA MODAL PROFESSOR ---
if (btnAbrirProfessor) {
  btnAbrirProfessor.addEventListener("click", (e) => {
    e.preventDefault();
    perfilModal.style.display = "flex";
  });
}

// --- LÓGICA DE ACESSO AO ADM ---

// 1. Clica no botão e abre a modal de SENHA
if (btnAbrirSenha) {
  btnAbrirSenha.addEventListener("click", () => {
    inputSenha.value = ""; // Limpa o campo
    textoErro.style.display = "none"; // Esconde erro anterior
    passwordModal.style.display = "flex";
    inputSenha.focus(); // Coloca o cursor no campo automaticamente
  });
}

// 2. Valida a senha ao clicar em "Entrar"
btnConfirmarSenha.addEventListener("click", () => {
  validarAcesso();
});

// 3. Permite apertar "Enter" no teclado para entrar
inputSenha.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    validarAcesso();
  }
});

function validarAcesso() {
  if (inputSenha.value === SENHA_MESTRA) {
    passwordModal.style.display = "none"; // Fecha a modal de senha
    admModal.style.display = "flex";      // Abre o Painel ADM
  } else {
    textoErro.style.display = "block";    // Mostra mensagem de erro
    inputSenha.value = "";
  }
}

// --- FECHAR MODAIS ---
if (btnFecharPerfil) btnFecharPerfil.onclick = () => perfilModal.style.display = "none";
if (btnFecharSenha) btnFecharSenha.onclick = () => passwordModal.style.display = "none";
if (btnFecharAdm) btnFecharAdm.onclick = () => admModal.style.display = "none";

// Fechar ao clicar fora de qualquer uma
window.onclick = (event) => {
  if (event.target == perfilModal) perfilModal.style.display = "none";
  if (event.target == passwordModal) passwordModal.style.display = "none";
  if (event.target == admModal) admModal.style.display = "none";
};


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
  // No seu script.js, substitua a parte do perfilModal por esta:
const uploadLessonBtn = document.getElementById("uploadLessonBtn");

if (uploadLessonBtn) {
  uploadLessonBtn.addEventListener("click", (e) => {
    e.preventDefault();
    
    const logged = getLoggedInUsername();
    const users = loadUsers();
    const currentUser = users.find(u => u.username === logged);

    if (currentUser && (currentUser.userType === "professor" || currentUser.admin)) {
      // Se for professor, abre a modal de envio
      document.getElementById("perfil-modal").style.display = "flex";
    } else {
      // Se for aluno, abre o menu lateral para ele escolher a matéria
      const sideMenu = document.getElementById("side-menu");
      sideMenu.classList.add("open");
      alert("Selecione a matéria no menu lateral para ver as aulas disponíveis.");
    }
  });
}

  // ================== INIT UI ==================
  const logged = getLoggedInUsername(); if(logged) setLoggedInUserUI(logged);
});

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('upload-form');


// 1. Localizar os elementos
const teacherAreaBtn = document.getElementById("open-teacher-area");
const modalProfessor = document.getElementById("perfil-modal");
const closeProfessor = document.getElementById("close-perfil");

// 2. Abrir a modal ao clicar em "Área dos Professores"
if (teacherAreaBtn) {
  teacherAreaBtn.addEventListener("click", (e) => {
    e.preventDefault();
    modalProfessor.style.display = "flex";
    document.getElementById("dropdownMenu").style.display = "none"; // Fecha o menu
  });
}

// 3. Fechar a modal
if (closeProfessor) {
  closeProfessor.onclick = () => modalProfessor.style.display = "none";
}

// Fechar se clicar fora da modal
window.addEventListener("click", (e) => {
  if (e.target === modalProfessor) modalProfessor.style.display = "none";
});



    // 1. FUNÇÃO PARA SALVAR
    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Impede a página de recarregar

        const url = document.getElementById('linkAula1').value;
        const materia = document.getElementById('upload-subject').value;
        const ano = document.getElementById('upload-year').value;

        if (!url || !materia || !ano) {
            alert("Preencha todos os campos!");
            return;
        }

        // Salva no navegador
        const chave = `aula_${materia}_${ano}`;
        localStorage.setItem(chave, url);

        // Aplica na tela
        vincularLink(materia, ano, url);
        alert(`Link de ${materia} (${ano}) salvo!`);
    });

    // 2. FUNÇÃO QUE ENCONTRA O BOTÃO CERTO
    function vincularLink(materia, ano, url) {
        // Seleciona todos os blocos de matéria
        const blocosMateria = document.querySelectorAll('.subject');

        blocosMateria.forEach(bloco => {
            const tituloMateria = bloco.querySelector('.subject-toggle').innerText.trim();

            // Se o título do bloco for igual à matéria selecionada
            if (tituloMateria === materia) {
                const botoesAno = bloco.querySelectorAll('.year-toggle');

                botoesAno.forEach(btnAno => {
                    // Se o texto do botão for igual ao ano selecionado
                    if (btnAno.innerText.trim() === ano) {
                        // Pega a div de conteúdo que vem logo depois do botão do ano
                        const content = btnAno.nextElementSibling;
                        const linkFinal = content.querySelector('.material-link');

                        if (linkFinal) {
                            linkFinal.href = url;
                            linkFinal.classList.add('link-ativo'); // Opcional: para você estilizar no CSS
                            console.log(`Sucesso: Link inserido em ${materia} - ${ano}`);
                        }
                    }
                });
            }
        });
    }

    // 3. CARREGAR AO ABRIR A PÁGINA
    function carregarLinks() {
        const materias = ["Matemática", "Português", "Física", "Química", "Biologia", "História", "Geografia", "Inglês", "Artes", "Educação Física", "Filosofia", "Sociologia", "Projeto de Vida","Informática","Comércio"];
        const anos = ["1º Ano", "2º Ano", "3º Ano"];

        materias.forEach(m => {
            anos.forEach(a => {
                const linkSalvo = localStorage.getItem(`aula_${m}_${a}`);
                if (linkSalvo) {
                    vincularLink(m, a, linkSalvo);
                }
            });
        });
    }

    carregarLinks();
});


// ================== LÓGICA DAS PASTAS PRINCIPAIS ==================
document.querySelectorAll('.main-folder-btn').forEach(button => {
  button.addEventListener('click', () => {
    const parent = button.parentElement;
    const content = button.nextElementSibling;
    
    // Alterna a classe no botão (para girar a seta no CSS)
    button.classList.toggle('active');
    
    // Mostra ou esconde o conteúdo
    if (content.style.display === 'block') {
      content.style.display = 'none';
    } else {
      content.style.display = 'block';
    }
  });
});



// 1. Elementos da Modal Principal
const configBtn = document.getElementById('configBtn');
const settingsModal = document.getElementById('settings-modal');
const settingsClose = document.getElementById('settings-close');

// 2. Elementos da Sub-Modal de Foto
const modalPhoto = document.getElementById('cfg-modal-photo');
const btnTriggerPhoto = document.getElementById('cfg-trigger-photo');
const btnClosePhoto = document.getElementById('cfg-photo-close');
const fileInput = document.getElementById('profilePicUpload');
const previewCircle = document.getElementById('cfg-preview-circle');
const btnConfirmPhoto = document.getElementById('cfg-confirm-photo');
const profilePhotoOriginal = document.getElementById('profile-photo'); // Sua bolinha no topo

// --- abertura e fechamento ---

// Abrir a Modal Principal
configBtn.addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('dropdownMenu').style.display = 'none'; // Fecha o dropdown
  settingsModal.style.display = 'flex';
});

// Fechar a Modal Principal
settingsClose.addEventListener('click', () => {
  settingsModal.style.display = 'none';
});

// --- Modal troca de foto ---

// Ir da modal principal para a de foto
btnTriggerPhoto.addEventListener('click', () => {
  settingsModal.style.display = 'none';
  modalPhoto.style.display = 'flex';
});

// Fechar a modal de foto e voltar para a principal
btnClosePhoto.addEventListener('click', () => {
  modalPhoto.style.display = 'none';
  settingsModal.style.display = 'flex';
});

// Preview em tempo real ao selecionar arquivo
fileInput.addEventListener('change', function() {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      previewCircle.style.backgroundImage = `url(${e.target.result})`;
      previewCircle.style.backgroundSize = 'cover';
      previewCircle.style.backgroundPosition = 'center';
    }
    reader.readAsDataURL(file);
  }
});

// Confirmar a foto e atualizar a bolinha original
btnConfirmPhoto.addEventListener('click', () => {
  if (previewCircle.style.backgroundImage) {
    // Atualiza a bolinha original
    profilePhotoOriginal.style.backgroundImage = previewCircle.style.backgroundImage;
    profilePhotoOriginal.style.backgroundSize = 'cover';
    
    alert("Foto de perfil atualizada com sucesso!");
    
    // volta pra principal
    modalPhoto.style.display = 'none';
    settingsModal.style.display = 'flex';
  } else {
    alert("Por favor, selecione uma imagem.");
  }
});

// --- out click ---

window.addEventListener('click', (e) => {
  // Se clicar fora da modal principal
  if (e.target === settingsModal) {
    settingsModal.style.display = 'none';
  }
  // Se clicar fora da modal de foto
  else if (e.target === modalPhoto) {
    modalPhoto.style.display = 'none';
    settingsModal.style.display = 'flex';
  }
});


//========= Tema claro e escuro ===========

const themeBtn = document.getElementById('cfg-toggle-theme');
const htmlElement = document.documentElement;

// Função para aplicar o tema
function applyTheme(theme) {
  htmlElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

// 1. Detectar preferência do Navegador ou Escolha Salva
const savedTheme = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)');

if (savedTheme) {
  applyTheme(savedTheme);
} else if (systemPrefersDark.matches) {
  applyTheme('dark');
}

// 2. Ouvir mudanças no tema do Navegador em tempo real
systemPrefersDark.addEventListener('change', (e) => {
  if (!localStorage.getItem('theme')) { // Só muda se o usuário não escolheu manualmente
    applyTheme(e.matches ? 'dark' : 'light');
  }
});

// 3. Alternar tema ao clicar no botão
themeBtn.addEventListener('click', () => {
  const currentTheme = htmlElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
});


// --- NOVAS MODAIS: SENHA E ATESTADO ---

const modalPass = document.getElementById('cfg-modal-pass');
const modalJustify = document.getElementById('cfg-modal-justify');

// Seleção dos botões na modal de configurações (pela ordem/texto se não tiverem ID)
const btnTriggerPass = document.getElementById('set-pass') || document.querySelectorAll('.cfg-item-btn')[3];
const btnTriggerJustify = document.getElementById('set-medical') || document.querySelectorAll('.cfg-item-btn')[1];

// Abrir Modal Senha
btnTriggerPass.addEventListener('click', () => {
    settingsModal.style.display = 'none';
    modalPass.style.display = 'flex';
});

// Abrir Modal Atestado
btnTriggerJustify.addEventListener('click', () => {
    settingsModal.style.display = 'none';
    modalJustify.style.display = 'flex';
});

// Fechar Modal Senha
document.getElementById('cfg-pass-close').addEventListener('click', () => {
    modalPass.style.display = 'none';
    settingsModal.style.display = 'flex';
});

// Fechar Modal Atestado
document.getElementById('cfg-justify-close').addEventListener('click', () => {
    modalJustify.style.display = 'none';
    settingsModal.style.display = 'flex';
});

// Atualização do clique fora para incluir as novas modais
window.addEventListener('click', (e) => {
    if (e.target === modalPass) {
        modalPass.style.display = "none";
        settingsModal.style.display = "flex";
    }
    if (e.target === modalJustify) {
        modalJustify.style.display = "none";
        settingsModal.style.display = "flex";
    }
});




document.addEventListener('DOMContentLoaded', () => {
    const btnAbrirSenha = document.getElementById('btn-abrir-adm');
    const modalSenha = document.getElementById('modal-senha');
    const modalAdm = document.getElementById('modal-adm-principal');
    
    const inputSenha = document.getElementById('input-senha-adm');
    const btnValidar = document.getElementById('btn-validar-senha');
    const erroMsg = document.getElementById('erro-senha');

    const SENHA_MESTRA = "supimpa"; // Defina sua senha aqui

    // Abrir modal de senha
    btnAbrirSenha.onclick = () => {
        modalSenha.style.display = 'block';
        inputSenha.focus();
    };

    // Validar Senha
    btnValidar.onclick = () => {
        if (inputSenha.value === SENHA_MESTRA) {
            modalSenha.style.display = 'none'; // Fecha senha
            modalAdm.style.display = 'block';   // Abre painel
            inputSenha.value = '';             // Limpa campo
        } else {
            erroMsg.style.display = 'block';
            inputSenha.style.borderColor = 'red';
        }
    };

    // Fechar ao clicar no (X)
    document.getElementById('close-senha').onclick = () => modalSenha.style.display = 'none';
    document.getElementById('close-adm').onclick = () => modalAdm.style.display = 'none';

    // Fechar ao clicar fora da modal
    window.onclick = (event) => {
        if (event.target == modalSenha) modalSenha.style.display = 'none';
        if (event.target == modalAdm) modalAdm.style.display = 'none';
    };
});

//Acesso a informações

const btn = document.getElementById("btnAbrirModal");
const modal = document.getElementById("modalUsuarios");
const span = document.getElementsByClassName("close")[0];
const listaContainer = document.getElementById("listaUsuarios");

btn.onclick = function() {
    // 1. Puxar dados do localStorage
    const dadosRaw = localStorage.getItem('usuarios');
    const usuarios = dadosRaw ? JSON.parse(dadosRaw) : [];

    // 2. Ordenar por ordem alfabética (Nome)
    usuarios.sort((a, b) => a.nome.localeCompare(b.nome));

    // 3. Limpar lista anterior e renderizar
    listaContainer.innerHTML = "";

    if (usuarios.length === 0) {
        listaContainer.innerHTML = "<p>Nenhum usuário encontrado.</p>";
    } else {
        usuarios.forEach(user => {
            const div = document.createElement("div");
            div.className = "usuario-item";
            div.innerHTML = `
                <p><span class="nome-label">Nome:</span> ${user.nome}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Telefone:</strong> ${user.telefone}</p>
            `;
            listaContainer.appendChild(div);
        });
    }

    modal.style.display = "block";
}

// Fechar ao clicar no 'X'
span.addEventListener('click', () => {
    modal.style.display = "none";
});

// Fechar ao clicar fora da modal
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});


// =============================== ChatBot Lógica =====================================


const jb_faq = {
  "Como faço a matrícula?": "A matrícula pode ser realizada na secretaria da escola com os documentos necessários.",
  "Quais documentos preciso?": "RG, CPF, comprovante de residência, certidão de nascimento e histórico escolar.",
  "Como vejo minhas notas?": "As notas podem ser consultadas clicando na sua foto de perfil e em seguida em *Boletim*. Insira seu nome, matéria e bimestre desejado e, por fim, clique em *Carregar*",
  "Qual é o horário das aulas?": "Os horários estão disponíveis na cortiça em frente à direção.",
  "Como justificar minha ausência?": "Você pode entrar em contato com a direção e levar seu atestado até o diretor(a) lá presente. Em breve, você poderá enviar seu atestado por aqui, espere e verá!"
  // +Perguntas
};

function jb_alternarChat() {
  const modal = document.getElementById("jbChatModal");
  const isAberto = modal.style.display === "flex";

  if (isAberto) {
    modal.style.display = "none";
  } else {
    modal.style.display = "flex";
    jb_inicializar(); // Garante que o conteúdo apareça ao abrir
  }
}

function jb_inicializar() {
  const body = document.getElementById("jbChatBody");
  
  // Mensagem inicial da Júlia
  body.innerHTML = `
    <div class="jb-msg jb-msg-bot">
      <strong>Júlia:</strong><br>
      Olá, sou Júlia e vou tirar suas dúvidas. O que precisa saber hoje?
    </div>
  `;

  // Cria o container de botões
  const containerBotoes = document.createElement("div");
  containerBotoes.className = "jb-options-container";
  containerBotoes.id = "jbOpcoesAtivas";

  // Insere os botões de perguntas
  Object.keys(jb_faq).forEach(pergunta => {
    const btn = document.createElement("button");
    btn.className = "jb-btn-question";
    btn.innerText = pergunta;
    btn.onclick = () => jb_responder(pergunta);
    containerBotoes.appendChild(btn);
  });

  body.appendChild(containerBotoes);
  body.scrollTop = body.scrollHeight;
}

function jb_responder(pergunta) {
  const body = document.getElementById("jbChatBody");
  
  // Remove botões antigos para não poluir
  const antigo = document.getElementById("jbOpcoesAtivas");
  if (antigo) antigo.remove();

  // Adiciona pergunta do usuário
  body.innerHTML += `
    <div class="jb-msg jb-msg-user">
      ${pergunta}
    </div>
  `;

  // Adiciona resposta da Júlia (Simulando um pequeno delay para parecer natural)
  setTimeout(() => {
    body.innerHTML += `
      <div class="jb-msg jb-msg-bot">
        <strong>Júlia:</strong><br>
        ${jb_faq[pergunta]}
      </div>
    `;
    
    // Reapresenta as opções para nova dúvida
    jb_mostrarOpcoesNovamente();
    body.scrollTop = body.scrollHeight;
  }, 300);
}

function jb_mostrarOpcoesNovamente() {
  const body = document.getElementById("jbChatBody");
  const container = document.createElement("div");
  container.className = "jb-options-container";
  container.id = "jbOpcoesAtivas";

  Object.keys(jb_faq).forEach(pergunta => {
    const btn = document.createElement("button");
    btn.className = "jb-btn-question";
    btn.innerText = pergunta;
    btn.onclick = () => jb_responder(pergunta);
    container.appendChild(btn);
  });

  body.appendChild(container);
  body.scrollTop = body.scrollHeight;
}

 

// ================== SISTEMA DE SIMULADOS ==================

// Funções auxiliares para persistência dos simulados
function loadSimulados() {
    return JSON.parse(localStorage.getItem("sistema_simulados") || "{}");
}

function saveSimulados(simulados) {
    localStorage.setItem("sistema_simulados", JSON.stringify(simulados));
}

// Popular o select de turmas da modal usando a sua constante global TURMAS
function popularSelectTurmas() {
    const selectTurma = document.getElementById('simulado-turma');
    if (!selectTurma || selectTurma.options.length > 1) return; // Evita duplicar
    
    if (typeof TURMAS !== 'undefined') {
        TURMAS.forEach(t => {
            const opt = document.createElement('option');
            opt.value = t;
            opt.textContent = t;
            selectTurma.appendChild(opt);
        });
    }
}

// Vinculação do botão da barra de navegação/menu
const linkSimulados = document.getElementById('simulados');
const simuladoModal = document.getElementById('simulado-modal');
const btnAcaoSimulado = document.getElementById('btn-acao-simulado');
const containerQuestoes = document.getElementById('questoes-container');

if (linkSimulados) {
    linkSimulados.addEventListener('click', (e) => {
        e.preventDefault();
        if (simuladoModal) {
            simuladoModal.style.display = 'flex';
            popularSelectTurmas();
            // Reseta a modal ao abrir
            containerQuestoes.innerHTML = "";
            btnAcaoSimulado.textContent = "Carregar Simulado";
        }
        if (typeof dropdown !== 'undefined' && dropdown) dropdown.style.display = 'none';
    });
}

if (document.getElementById('simulado-close')) {
    document.getElementById('simulado-close').addEventListener('click', () => {
        if (simuladoModal) simuladoModal.style.display = 'none';
    });
}

// Ação Principal: Carregar / Salvar / Corrigir
if (btnAcaoSimulado) {
    btnAcaoSimulado.addEventListener('click', () => {
        const username = getLoggedInUsername();
        const users = loadUsers();
        const user = users.find(u => u.username === username);

        if (!user) {
            alert("Você precisa estar logado para acessar os simulados!");
            return;
        }

        const materia = document.getElementById('simulado-materia').value;
        const turma = document.getElementById('simulado-turma').value;

        if (!materia || !turma) {
            alert("Por favor, selecione a matéria e a turma.");
            return;
        }

        // Chave única para identificar este simulado específico
        const chaveSimulado = `${materia}_${turma}`;
        const todosSimulados = loadSimulados();

        if (btnAcaoSimulado.textContent === "Carregar Simulado") {
            renderizarQuestoesForm(user.userType, todosSimulados[chaveSimulado]);
        } else if (user.userType === "professor") {
            salvarDadosSimulado(chaveSimulado, todosSimulados);
        } else if (user.userType === "aluno") {
            checarResultadoAluno(todosSimulados[chaveSimulado]);
        }
    });
}

// Renderiza a interface baseado em quem está acessando
function renderizarQuestoesForm(userType, simuladoExistente) {
    containerQuestoes.innerHTML = '';

    for (let i = 1; i <= 5; i++) {
        const div = document.createElement('div');
        div.style.marginBottom = "15px";
        
        // Dados recuperados ou em branco
        const perguntaSalva = simuladoExistente ? simuladoExistente[`q${i}`] : "";
        const respostaSalva = simuladoExistente ? simuladoExistente[`r${i}`] : "";

        if (userType === "professor") {
            div.innerHTML = `
                <p style="margin:5px 0 2px 0;"><strong>Questão ${i}:</strong></p>
                <textarea class="simulado-input pergunta-input" data-questao="${i}" placeholder="Digite o enunciado da questão..." style="width:100%; min-height:40px;">${perguntaSalva}</textarea>
                <input type="text" class="simulado-input resposta-input" data-resposta="${i}" placeholder="Gabarito / Resposta Certa" style="width:100%;" value="${respostaSalva}">
            `;
            btnAcaoSimulado.textContent = "Salvar Conteúdo";
        } else if (userType === "aluno") {
            if (!simuladoExistente) {
                containerQuestoes.innerHTML = `<p style="color:red; text-align:center; padding:10px;">Nenhum simulado foi cadastrado para esta matéria e turma ainda.</p>`;
                return;
            }
            div.innerHTML = `
                <p style="margin:5px 0 2px 0;"><strong>Questão ${i}:</strong> ${perguntaSalva}</p>
                <input type="text" class="simulado-input aluno-resposta-input" data-aluno-resp="${i}" placeholder="Sua resposta aqui..." style="width:100%;">
            `;
            btnAcaoSimulado.textContent = "Checar Resultado";
        }
        containerQuestoes.appendChild(div);
    }
}

// Salva o que o professor digitou
function salvarDadosSimulado(chaveSimulado, todosSimulados) {
    const novosDados = {};
    
    for (let i = 1; i <= 5; i++) {
        const pInput = document.querySelector(`.pergunta-input[data-questao="${i}"]`);
        const rInput = document.querySelector(`.resposta-input[data-resposta="${i}"]`);
        
        novosDados[`q${i}`] = pInput ? pInput.value.trim() : "";
        novosDados[`r${i}`] = rInput ? rInput.value.trim() : "";
    }

    todosSimulados[chaveSimulado] = novosDados;
    saveSimulados(todosSimulados);
    
    alert("Simulado gravado e atualizado para os alunos desta turma!");
    if (simuladoModal) simuladoModal.style.display = 'none';
}

// Valida as respostas do aluno contra o gabarito
function checarResultadoAluno(simuladoExistente) {
    if (!simuladoExistente) return;
    
    let acertos = 0;
    
    for (let i = 1; i <= 5; i++) {
        const alunoInput = document.querySelector(`.aluno-resposta-input[data-aluno-resp="${i}"]`);
        const respostaAluno = alunoInput ? alunoInput.value.trim().toLowerCase() : "";
        const respostaCorreta = simuladoExistente[`r${i}`].trim().toLowerCase();

        if (respostaAluno !== "" && respostaAluno === respostaCorreta) {
            acertos++;
        }
    }
    
    alert(`Fim do simulado!\nVocê acertou ${acertos} de 5 questões.`);
    if (simuladoModal) simuladoModal.style.display = 'none';
}
