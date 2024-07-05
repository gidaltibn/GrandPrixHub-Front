const API_BASE_URL = "http://127.0.0.1:5000";

document.addEventListener("DOMContentLoaded", function () {
  loadEquipes();
  loadPilotos();
  loadPistas();
  loadCorridas();
  loadResultados();

  document
    .getElementById("equipe-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      if (
        document.querySelector("#equipe-form button").innerText ===
        "Salvar Equipe"
      ) {
        addEquipe();
      } else {
        updateEquipe(document.getElementById("equipe-form").dataset.equipeId);
      }
    });

  document
    .getElementById("pista-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      if (
        document.querySelector("#pista-form button").innerText ===
        "Salvar Pista"
      ) {
        addPista();
      } else {
        updatePista(document.getElementById("pista-form").dataset.pistaId);
      }
    });

  document
    .getElementById("corrida-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      if (
        document.querySelector("#corrida-form button").innerText ===
        "Adicionar Corrida"
      ) {
        addCorrida();
      } else {
        console.log("update corrida");
        updateCorrida(
          document.getElementById("corrida-form").dataset.corridaId
        );
      }
    });

  document
    .getElementById("resultado-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      if (
        document.querySelector("#resultado-form button").innerText ===
        "Salvar Resultado"
      ) {
        addResultado();
      } else {
        updateResultado(
          document.getElementById("resultado-form").dataset.resultadoId
        );
      }
    });

  document
    .getElementById("piloto-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      const pilotoFormButton = document.querySelector("#piloto-form button");
      if (pilotoFormButton.innerText === "Salvar Piloto") {
        addPiloto();
      } else {
        const pilotoId =
          document.getElementById("piloto-form").dataset.pilotoId;
        updatePiloto(pilotoId);
      }
    });
});

function createActionButton(icon, onClickHandler) {
  const button = document.createElement("button");
  button.innerHTML = icon;
  button.addEventListener("click", onClickHandler);
  return button;
}

// Carregar todas as equipes
async function loadEquipes() {
  await fetch(`${API_BASE_URL}/equipes/`)
    .then((response) => response.json())
    .then((data) => {
      const list = document
        .getElementById("todas-equipes-table")
        .getElementsByTagName("tbody")[0];
      list.innerHTML = "";
      data.forEach((equipe) => {
        const row = list.insertRow();
        row.insertCell(0).innerText = equipe.id;
        row.insertCell(1).innerText = equipe.nome;
        const actionsCell = row.insertCell(2);

        // Adiciona a classe action-buttons à célula de ações
        actionsCell.classList.add("action-buttons");

        // Botão Editar
        const editButton = createActionButton("✏️", () => editEquipe(equipe));
        actionsCell.appendChild(editButton);

        // Botão Excluir
        const deleteButton = createActionButton("❌", () =>
          deleteEquipe(equipe.id)
        );
        actionsCell.appendChild(deleteButton);
      });
    });
}

// Adicionar uma nova equipe
function addEquipe() {
  const nome = document.getElementById("equipe-nome").value;
  const id = 0;

  fetch(`${API_BASE_URL}/equipes/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, nome }),
  })
    .then((response) => response.json())
    .then(() => {
      loadEquipes(); // Atualiza a tabela de todas as equipes
      document.getElementById("equipe-form").reset();
    });
}

// Editar uma equipe existente
function editEquipe(equipe) {
  document.getElementById("equipe-nome").value = equipe.nome;
  document.getElementById("equipe-form").dataset.equipeId = equipe.id;
  document.querySelector("#equipe-form button").innerText = "Atualizar Equipe";
}

// Atualizar uma equipe existente
async function updateEquipe(id) {
  const nome = document.getElementById("equipe-nome").value;
  await fetch(`${API_BASE_URL}/equipes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nome }),
  });
  loadEquipes();
  document.getElementById("equipe-form").reset();
  delete document.getElementById("equipe-form").dataset.equipeId;
  document.querySelector("#equipe-form button").innerText = "Adicionar Equipe";
}

// Excluir uma equipe existente
async function deleteEquipe(id) {
  // Primeiro, obter todos os pilotos para verificar se algum está associado à equipe
  const response = await fetch(`${API_BASE_URL}/piloto/`);
  const pilotos = await response.json();

  // Filtrar os pilotos que pertencem à equipe a ser excluída
  const pilotosDaEquipe = pilotos.filter((piloto) => piloto.equipe_id === id);

  // Atualizar cada piloto para remover a associação com a equipe
  for (const piloto of pilotosDaEquipe) {
    await fetch(`${API_BASE_URL}/piloto/${piloto.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...piloto, equipe_id: 0 }),
    });
  }

  // Após atualizar todos os pilotos, excluir a equipe
  await fetch(`${API_BASE_URL}/equipes/${id}`, {
    method: "DELETE",
  });

  loadEquipes(); // Recarregar a lista de equipes
  loadPilotos(); // Recarregar a lista de pilotos para refletir as mudanças
}

// Obter uma equipe por ID
async function getEquipeById(id) {
  const response = await fetch(`${API_BASE_URL}/equipes/${id}`);
  return response.json();
}

// Carregar todos os pilotos
async function loadPilotos() {
  try {
    const response = await fetch(`${API_BASE_URL}/piloto/`);
    if (!response.ok) {
      throw new Error("Failed to fetch pilotos");
    }
    const data = await response.json();
    console.log("Data fetched from API:", data); // Log para verificar os dados recebidos
    const list = document
      .getElementById("pilotos-table")
      .getElementsByTagName("tbody")[0];
    list.innerHTML = "";

    for (const piloto of data) {
      let equipe = { nome: "sem equipe" };
      if (piloto.equipe_id !== 0) {
        equipe = await getEquipeById(piloto.equipe_id);
      }
      const row = list.insertRow();
      row.insertCell(0).innerText = piloto.id;
      row.insertCell(1).innerText = piloto.nome;
      row.insertCell(2).innerText = piloto.idade;
      row.insertCell(3).innerText = piloto.nacionalidade;
      row.insertCell(4).innerText = equipe.nome;
      const actionsCell = row.insertCell(5);
      actionsCell.classList.add("action-buttons");

      // Botão Editar
      const editButton = createActionButton("✏️", () => editPiloto(piloto));
      actionsCell.appendChild(editButton);

      // Botão Excluir
      const deleteButton = createActionButton("❌", () =>
        deletePiloto(piloto.id)
      );
      actionsCell.appendChild(deleteButton);
    }
  } catch (error) {
    console.error("Error loading pilotos:", error);
  }
}

// Obter um piloto por ID
async function getPilotoById(id) {
  const response = await fetch(`${API_BASE_URL}/piloto/${id}`);
  return response.json();
}

// Adicionar um novo piloto
function addPiloto() {
  const nome = document.getElementById("piloto-nome").value;
  const idade = document.getElementById("piloto-idade").value;
  const nacionalidade = document.getElementById("piloto-nacionalidade").value;
  const equipe_id = document.getElementById("piloto-equipe").value;
  const id = 0;

  fetch(`${API_BASE_URL}/piloto/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, nome, idade, nacionalidade, equipe_id }),
  })
    .then((response) => response.json())
    .then((data) => {
      loadPilotos();
      document.getElementById("piloto-form").reset();
    });
}

// Editar um piloto existente
function editPiloto(piloto) {
  document.getElementById("piloto-nome").value = piloto.nome;
  document.getElementById("piloto-idade").value = piloto.idade;
  document.getElementById("piloto-nacionalidade").value = piloto.nacionalidade;
  document.getElementById("piloto-equipe").value = piloto.equipe_id;
  document.getElementById("piloto-form").dataset.pilotoId = piloto.id;
  document.querySelector("#piloto-form button").innerText = "Atualizar Piloto";
}

// Atualizar um piloto existente
async function updatePiloto(id) {
  const nome = document.getElementById("piloto-nome").value;
  const idade = document.getElementById("piloto-idade").value;
  const nacionalidade = document.getElementById("piloto-nacionalidade").value;
  const equipe_id = document.getElementById("piloto-equipe").value;

  await fetch(`${API_BASE_URL}/piloto/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, nome, idade, nacionalidade, equipe_id }),
  });
  loadPilotos();
  pilotoForm.reset();
  document.getElementById("piloto-form").reset();
  document.getElementById("piloto-form").dataset.pilotoId = "";
  document.querySelector("#piloto-form button").innerText = "Adicionar Piloto";
}

// Excluir um piloto existente
async function deletePiloto(id) {
  await fetch(`${API_BASE_URL}/piloto/${id}`, {
    method: "DELETE",
  });
  loadPilotos();
}

// Carregar todas as pistas
async function loadPistas() {
  await fetch(`${API_BASE_URL}/pista/`)
    .then((response) => response.json())
    .then((data) => {
      const list = document
        .getElementById("pistas-table")
        .getElementsByTagName("tbody")[0];
      list.innerHTML = "";
      data.forEach((pista) => {
        const row = list.insertRow();
        row.insertCell(0).innerText = pista.id;
        row.insertCell(1).innerText = pista.nome;
        row.insertCell(2).innerText = pista.pais;
        const actionsCell = row.insertCell(3);

        // Botão Editar
        const editButton = createActionButton("✏️", () => editPista(pista));
        actionsCell.appendChild(editButton);

        // Botão Excluir
        const deleteButton = createActionButton("❌", () =>
          deletePista(pista.id)
        );
        actionsCell.appendChild(deleteButton);
      });
    });
}

// Adicionar uma nova pista
function addPista() {
  const nome = document.getElementById("pista-nome").value;
  const pais = document.getElementById("pista-pais").value;
  const id = 0;

  fetch(`${API_BASE_URL}/pista/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, nome, pais }),
  })
    .then((response) => response.json())
    .then((data) => {
      loadPistas();
      document.getElementById("pista-form").reset();
    });
}

// Obter uma pista por ID
async function getPistaById(id) {
  const response = await fetch(`${API_BASE_URL}/pista/${id}`);
  return response.json();
}

// Editar uma pista existente
function editPista(pista) {
  document.getElementById("pista-nome").value = pista.nome;
  document.getElementById("pista-pais").value = pista.pais;
  document.getElementById("pista-form").dataset.pistaId = pista.id;
  document.querySelector("#pista-form button").innerText = "Atualizar Pista";

  const pistaForm = document.getElementById("pista-form");
  const pistaId = pistaForm.dataset.pistaId;

  pistaForm.addEventListener("submit", function (e) {
    e.preventDefault();
    if (pistaId) {
      updatePista(pistaId);
    } else {
      addPista();
    }
  });
}

// Atualizar uma pista existente
async function updatePista(id) {
  const nome = document.getElementById("pista-nome").value;
  const pais = document.getElementById("pista-pais").value;

  await fetch(`${API_BASE_URL}/pista/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, nome, pais }),
  });
  loadPistas();
  pistaForm.reset();
  document.getElementById("pista-form").reset();
  document.getElementById("pista-form").dataset.pistaId = "";
  document.querySelector("#pista-form button").innerText = "Adicionar Pista";
}

// Excluir uma pista existente
async function deletePista(id) {
  const corridas = await fetch(`${API_BASE_URL}/corrida/`)
    .then((response) => response.json())
    .then((data) => data.filter((corrida) => corrida.pista_id === id));

  if (corridas.length > 0) {
    alert(
      "Existem corridas associadas a esta pista. Primeiro remova as corridas ou mude a pista associada."
    );
    return;
  }

  await fetch(`${API_BASE_URL}/pista/${id}`, {
    method: "DELETE",
  });
  loadPistas();
}

// Carregar todas as corridas
async function loadCorridas() {
  const response = await fetch(`${API_BASE_URL}/corrida/`);
  const data = await response.json();
  const list = document
    .getElementById("corridas-table")
    .getElementsByTagName("tbody")[0];
  list.innerHTML = "";

  for (const corrida of data) {
    const pista = await getPistaById(corrida.pista_id);
    const row = list.insertRow();
    row.insertCell(0).innerText = corrida.id;
    row.insertCell(1).innerText = corrida.nome;
    row.insertCell(2).innerText = convertDate(corrida.data_corrida);
    row.insertCell(3).innerText = pista.nome;

    const actionsCell = row.insertCell(4);
    actionsCell.classList.add("action-buttons");
    const editButton = createActionButton("✏️", () => editCorrida(corrida));
    actionsCell.appendChild(editButton);

    const deleteButton = createActionButton("❌", () =>
      deleteCorrida(corrida.id)
    );
    actionsCell.appendChild(deleteButton);
  }
}

// Obter uma corrida por ID
async function getCorridaById(id) {
  const response = await fetch(`${API_BASE_URL}/corrida/${id}`);
  return response.json();
}

// Adicionar uma nova corrida
function addCorrida() {
  const nome = document.getElementById("corrida-nome").value;
  const data_corrida = document.getElementById("corrida-data").value;
  const pista_id = document.getElementById("corrida-pista").value;
  const id = 0;

  fetch(`${API_BASE_URL}/corrida/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, nome, data_corrida, pista_id }),
  })
    .then((response) => response.json())
    .then((data) => {
      loadCorridas();
      document.getElementById("corrida-form").reset();
    });
}

// Editar uma corrida existente
function editCorrida(corrida) {
  document.getElementById("corrida-nome").value = corrida.nome;
  document.getElementById("corrida-data").value = corrida.data_corrida;
  document.getElementById("corrida-pista").value = corrida.pista_id;
  document.getElementById("corrida-form").dataset.corridaId = corrida.id;
  document.querySelector("#corrida-form button").innerText =
    "Atualizar Corrida";
}

// Atualizar uma corrida existente
async function updateCorrida(id) {
  const nome = document.getElementById("corrida-nome").value;
  const data_corrida = document.getElementById("corrida-data").value;
  const pista_id = document.getElementById("corrida-pista").value;

  await fetch(`${API_BASE_URL}/corrida/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nome, data_corrida, pista_id }),
  });
  loadCorridas();
  document.getElementById("corrida-form").reset();
  delete document.getElementById("corrida-form").dataset.corridaId;
  document.querySelector("#corrida-form button").innerText =
    "Adicionar Corrida";
}

// Excluir uma corrida existente
async function deleteCorrida(id) {
  const response = await fetch(`${API_BASE_URL}/resultado/`);
  const resultados = await response.json();

  const hasResultados = resultados.some(
    (resultado) => resultado.corrida_id === id
  );

  if (hasResultados) {
    alert(
      "Não é possível excluir a corrida, pois há resultados associados a ela."
    );
    return;
  }

  await fetch(`${API_BASE_URL}/corrida/${id}`, {
    method: "DELETE",
  });
  loadCorridas();
}

// Converter a data para o formato DD/MM/YYYY
function convertDate(date) {
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}

// Carregar todos os resultados
async function loadResultados() {
  const response = await fetch(`${API_BASE_URL}/resultado/`);
  const data = await response.json();
  const list = document
    .getElementById("resultados-table")
    .getElementsByTagName("tbody")[0];
  list.innerHTML = "";

  for (const resultado of data) {
    const corrida = await getCorridaById(resultado.corrida_id);
    const primeiro = await getPilotoById(resultado.primeiro_lugar_id);
    const segundo = await getPilotoById(resultado.segundo_lugar_id);
    const terceiro = await getPilotoById(resultado.terceiro_lugar_id);
    const row = list.insertRow();
    row.insertCell(0).innerText = resultado.id;
    row.insertCell(1).innerText = corrida.nome;
    row.insertCell(2).innerText = primeiro.nome;
    row.insertCell(3).innerText = segundo.nome;
    row.insertCell(4).innerText = terceiro.nome;
    const actionsCell = row.insertCell(5);

    // Botão Editar
    const editButton = createActionButton("✏️", () => editResultado(resultado));
    actionsCell.appendChild(editButton);

    // Botão Excluir
    const deleteButton = createActionButton("❌", () =>
      deleteResultado(resultado.id)
    );
    actionsCell.appendChild(deleteButton);
  }
}

// Adicionar um novo resultado
function addResultado() {
  const corrida_id = document.getElementById("resultado-corrida").value;
  const primeiro_lugar_id = document.getElementById("resultado-primeiro").value;
  const segundo_lugar_id = document.getElementById("resultado-segundo").value;
  const terceiro_lugar_id = document.getElementById("resultado-terceiro").value;
  const id = 0;

  fetch(`${API_BASE_URL}/resultado/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id,
      corrida_id,
      primeiro_lugar_id,
      segundo_lugar_id,
      terceiro_lugar_id,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      loadResultados();
      document.getElementById("resultado-form").reset();
    });
}

// Editar um resultado existente
function editResultado(resultado) {
  document.getElementById("resultado-corrida").value = resultado.corrida_id;
  document.getElementById("resultado-primeiro").value =
    resultado.primeiro_lugar_id;
  document.getElementById("resultado-segundo").value =
    resultado.segundo_lugar_id;
  document.getElementById("resultado-terceiro").value =
    resultado.terceiro_lugar_id;
  document.getElementById("resultado-form").dataset.resultadoId = resultado.id;
  document.querySelector("#resultado-form button").innerText =
    "Atualizar Resultado";
}

// Atualizar um resultado existente
async function updateResultado(id) {
  const corrida_id = document.getElementById("resultado-corrida").value;
  const primeiro_lugar_id = document.getElementById("resultado-primeiro").value;
  const segundo_lugar_id = document.getElementById("resultado-segundo").value;
  const terceiro_lugar_id = document.getElementById("resultado-terceiro").value;

  await fetch(`${API_BASE_URL}/resultado/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      corrida_id,
      primeiro_lugar_id,
      segundo_lugar_id,
      terceiro_lugar_id,
    }),
  });
  loadResultados();
  document.getElementById("resultado-form").reset();
  document
    .getElementById("resultado-form")
    .removeAttribute("data-resultado-id");
  document.querySelector("#resultado-form button").innerText =
    "Salvar Resultado";
}

// Excluir um resultado existente
async function deleteResultado(id) {
  await fetch(`${API_BASE_URL}/resultado/${id}`, {
    method: "DELETE",
  });
  loadResultados();
}
