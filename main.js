// ===============================
// IMPORTAR CLIENTE SUPABASE
// ===============================
import { supabase } from "./supabaseClient.js";

// ===============================
// ATUALIZAR KPIs
// ===============================
async function loadKPIs() {
  const { data, error } = await supabase
    .from("residuos")
    .select("quantidade");

  if (error) {
    console.error("Erro ao buscar KPIs:", error);
    return;
  }

  let total = data.reduce((sum, r) => sum + r.quantidade, 0);

  document.getElementById("kpi_total_residuos").innerText = total + " tons/mês";
}

// ===============================
// CARREGAR DADOS NA TABELA
// ===============================
async function loadTable() {
  const { data, error } = await supabase
    .from("residuos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao carregar registros:", error);
    return;
  }

  const tbody = document.getElementById("tabela-body");
  tbody.innerHTML = "";

  data.forEach(row => {
    tbody.innerHTML += `
      <tr>
        <td>${row.tipo}</td>
        <td>${row.quantidade} tons</td>
        <td>${row.tecnologia}</td>
        <td>${new Date(row.created_at).toLocaleDateString()}</td>
      </tr>
    `;
  });
}

// ===============================
// INSERIR NOVO REGISTRO
// ===============================
async function inserirRegistro() {
  const tipo = document.getElementById("tipo").value;
  const quantidade = parseFloat(document.getElementById("quantidade").value);
  const tecnologia = document.getElementById("tecnologia").value;

  const { error } = await supabase
    .from("residuos")
    .insert([{ tipo, quantidade, tecnologia }]);

  if (error) {
    alert("Erro ao registrar: " + error.message);
    return;
  }

  alert("Registro salvo com sucesso!");
  loadKPIs();
  loadTable();
}

// ===============================
// CRIAR GRÁFICO
// ===============================
async function loadChart() {
  const { data } = await supabase
    .from("residuos")
    .select("quantidade, created_at");

  const labels = data.map(r => new Date(r.created_at).toLocaleDateString());
  const quantities = data.map(r => r.quantidade);

  const ctx = document.getElementById("chart1").getContext("2d");

  new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Resíduos Gerados (tons)",
        data: quantities,
        borderWidth: 2
      }]
    }
  });
}

// ===============================
// INICIALIZAÇÃO
// ===============================
window.onload = function () {
  loadKPIs();
  loadTable();
  loadChart();

  document.getElementById("btnSalvar").onclick = inserirRegistro;
};
