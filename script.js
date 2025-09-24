// script.js
const resources = [
  { title: "Teste", type: "música", url: "https://youtu.be/dQw4w9WgXcQ?si=kLNgYzkWOz8Heggf" },
  { title: "Profissão", type: "documento", url: "https://organizacaotc.wordpress.com/wp-content/uploads/2014/04/cartilha-do-pedreiro1.pdf" },
  { title: "São Miguel", type: "pesquisa da wiki", url: "https://pt.m.wikipedia.org/wiki/Ficheiro:St._Stephen_the_Martyr_(Omaha),_chapel_window_2,_Archangel_Michael,_detail.jpg" },
  { title: "Cuscuz", type: "receita", url: "https://share.google/HvowqEZTKh62vWICp"
  }
];

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const resourcesContainer = document.getElementById("resources-container");

searchButton.addEventListener("click", (e) => {
  e.preventDefault();
  const searchTerm = searchInput.value.toLowerCase();
  const filteredResources = resources.filter((resource) => {
    return resource.title.toLowerCase().includes(searchTerm) || resource.type.toLowerCase().includes(searchTerm);
  });
  renderResources(filteredResources);
});

function renderResources(resources) {
  resourcesContainer.innerHTML = "";
  resources.forEach((resource) => {
    const resourceElement = document.createElement("div");
    resourceElement.innerHTML = `
      <h2>${resource.title}</h2>
      <p>Tipo: ${resource.type}</p>
      <p><a href="${resource.url}">Ver conteúdo</a></p>
    `;
    resourcesContainer.appendChild(resourceElement);
  });
}

// Função para cadastro de usuário
function registerUser(username, email, password) {
  const users = JSON.parse(localStorage.getItem("users")) || [];

  const existingUser = users.find((user) => user.username === username);
  if (existingUser) {
    alert("Usuário já existe!");
    return;
  }

  const newUser = { username, email, password };
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  alert("Usuário cadastrado com sucesso!");
}

// Função para login de usuário
function loginUser(username, password) {
  const users = JSON.parse(localStorage.getItem("users")) || [];

  const existingUser = users.find(
    (user) => user.username === username && user.password === password
  );

  if (!existingUser) {
    alert("Usuário ou senha inválidos!");
    return;
  }

  alert("Login efetuado com sucesso!");
}

// Eventos dos botões
document.getElementById("register-button").addEventListener("click", () => {
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  registerUser(username, email, password);
});

document.getElementById("login-button").addEventListener("click", () => {
  const username = document.getElementById("username-login").value;
  const password = document.getElementById("password-login").value;
  loginUser(username, password);
});
 
// Estrutura de dados para armazenar recursos educacionais
const resources = {
  "Matemática": [
    {
      title: "Vídeo Aula 1",
      type: "video",
      url: "https:                      
    },
    {
      title: "//example.com",
    },
    {
      title: "Conteúdo Escrito 1",
      type: "text",
      content: "Este é o conteúdo escrito da aula 1",
    },
  ],
  "Português": [
    {
      title: "Vídeo Aula 2",
      type: "video",
      url: "https://example.com/video2",
    },
    {
      title: "Conteúdo Escrito 2",
      type: "text",
      content: "Este é o conteúdo escrito da aula 2",
    },
  ],
};

// Função para exibir vídeo aulas
function displayVideoLessons() {
  const videoList = document.getElementById("video-list");
  videoList.innerHTML = "";
  Object.keys(resources).forEach((subject) => {
    resources[subject].forEach((resource) => {
      if (resource.type === "video") {
        const videoElement = document.createElement("li");
        videoElement.innerHTML = `
          <h3>${resource.title}</h3>
          <p><a href="${resource.url}">Assistir vídeo</a></p>
        `;
        videoList.appendChild(videoElement);
      }
    });
  });
}

// Função para exibir conteúdo escrito
function displayWrittenContent() {
  const contentList = document.getElementById("content-list");
  contentList.innerHTML = "";
  Object.keys(resources).forEach((subject) => {
    resources[subject].forEach((resource) => {
      if (resource.type === "text") {
        const contentElement = document.createElement("li");
        contentElement.innerHTML = `
          <h3>${resource.title}</h3>
          <p>${resource.content}</p>
        `;
        contentList.appendChild(contentElement);
      }
    });
  });
}

// Chame as funções para exibir vídeo aulas e conteúdo escrito
displayVideoLessons();
displayWrittenContent();
