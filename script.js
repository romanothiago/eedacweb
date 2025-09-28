// Recursos gerais para busca
const generalResources = [
  { title: "teste", type: "vídeo", url: "https://youtu.be/dQw4w9WgXcQ" },
  { title: "Alagoas", type: "site da web", url: "https://share.google/YDI8DfuO7rxyJNHb9" },
  { title: "Mídia", type: "perfil social", url: "https://www.instagram.com/eedac__" }
];

// Recursos por matéria
const subjectResources = {
  "Matemática": [
    {
      title: "Matemática 1",
      type: "video",
      url: "https://youtu.be/qd2Hx8o0c4s?si=sNRg2BEN1vLJogmr"
    },
    {
      title: "Matemática Escrita 1",
      type: "text",
      content: "A prova de que 1+1=2"
    }
  ],
  "Português": [
    {
      title: "filosofia 1",
      type: "video",
      url: "https://youtu.be/RJFEpfiVwIk?si=-1QG94Dh7-wKytte"
    },
    {
      title: "filosofia Escrita 2",
      type: "text",
      content: "O vídeo apresenta o tema 'liberdade' e se aprofunda no signifacado do termo."
    }
  ]
};

// ---------------------- FUNÇÕES ----------------------

// Renderizar recursos da busca
function renderResources(list) {
  const container = document.getElementById("resources-container");
  container.innerHTML = "";
  if (!Array.isArray(list) || list.length === 0) {
    container.innerHTML = "<p>Nenhum recurso encontrado.</p>";
    return;
  }
  list.forEach((resource) => {
    const div = document.createElement("div");
    div.className = "resource";
    div.innerHTML = `
      <h3>${resource.title}</h3>
      <p>Tipo: ${resource.type}</p>
      <p><a href="${resource.url}" target="_blank" rel="noopener noreferrer">Acessar</a></p>
    `;
    container.appendChild(div);
  });
}

// Buscar nos recursos gerais
function doSearch() {
  const term = document.getElementById("search-input").value.trim().toLowerCase();
  const filtered = generalResources.filter(r =>
    r.title.toLowerCase().includes(term) ||
    r.type.toLowerCase().includes(term)
  );
  renderResources(filtered);
}

// Eventos do formulário de busca
document.getElementById("search-form").addEventListener("submit", e => {
  e.preventDefault();
  doSearch();
});

// Cadastro de usuário
function registerUser(username, email, password) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  if (users.find(u => u.username === username)) {
    alert("Usuário já existe!");
    return;
  }
  users.push({ username, email, password });
  localStorage.setItem("users", JSON.stringify(users));
  alert("Usuário cadastrado!");
}

// Login de usuário
function loginUser(username, password) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const match = users.find(u => u.username === username && u.password === password);
  if (!match) {
    alert("Usuário ou senha inválidos!");
    return;
  }
  alert("Login efetuado com sucesso!");
}

// Eventos de cadastro e login
document.getElementById("register-button").addEventListener("click", () => {
  registerUser(
    document.getElementById("username").value,
    document.getElementById("email").value,
    document.getElementById("password").value
  );
});

document.getElementById("login-button").addEventListener("click", () => {
  loginUser(
    document.getElementById("username-login").value,
    document.getElementById("password-login").value
  );
});

// Exibir vídeos
function displayVideoLessons() {
  const videoList = document.getElementById("video-list");
  videoList.innerHTML = "";
  Object.keys(subjectResources).forEach(subject => {
    subjectResources[subject].forEach(r => {
      if (r.type === "video") {
        const li = document.createElement("li");
        li.innerHTML = `<h3>${r.title}</h3><p><a href="${r.url}" target="_blank">Assistir</a></p>`;
        videoList.appendChild(li);
      }
    });
  });
}

// Exibir conteúdos escritos
function displayWrittenContent() {
  const contentList = document.getElementById("content-list");
  contentList.innerHTML = "";
  Object.keys(subjectResources).forEach(subject => {
    subjectResources[subject].forEach(r => {
      if (r.type === "text") {
        const li = document.createElement("li");
        li.innerHTML = `<h3>${r.title}</h3><p>${r.content}</p>`;
        contentList.appendChild(li);
      }
    });
  });
}

// Carregar aulas e conteúdos escritos
displayVideoLessons();
displayWrittenContent();

let slideIndex = 0; // começa do zero

mostrarSlide(slideIndex); // chama a função logo no início

function mudarSlide(n) {
  mostrarSlide(slideIndex += n);
}

function mostrarSlide(n) {
  let slides = document.getElementsByClassName("slide");
  if (n >= slides.length) { slideIndex = 0; }
  if (n < 0) { slideIndex = slides.length - 1; }
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none"; // esconde tudo
  }
  slides[slideIndex].style.display = "block"; // mostra só o atual
}

mostrarSlide(slideIndex);
