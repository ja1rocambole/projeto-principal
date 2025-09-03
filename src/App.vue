<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// Vamos importar nosso SIMULADOR por enquanto
import { FakeSignalRConnection } from './services/fakeSignalR.js';

// Importação real que usaríamos em produção (agora comentada)
// import * as signalR from "@microsoft/signalr";

const statusProcessamento = ref("Aguardando conexão...");
const progresso = ref(0);
let connection = null; // Variável para guardar nossa conexão

onMounted(() => {
  // --- INÍCIO DA LÓGICA DE CONEXÃO ---

  // USANDO O SIMULADOR:
  connection = new FakeSignalRConnection();

  /* // QUANDO FOSSE PARA PRODUÇÃO, TROCARÍAMOS A LINHA ACIMA POR ESTAS:
  connection = new signalR.HubConnectionBuilder()
    .withUrl("https://api.da.empresa.com/meuHubDeProcessamento")
    .build();
  */

  // 2. OUVIR por um evento específico vindo do servidor
  // O nome do evento ('StatusAtualizado') deve ser o mesmo que o backend envia
  connection.on("StatusAtualizado", (novaMensagem, novoProgresso) => {
    console.log("Recebido do servidor:", { novaMensagem, novoProgresso });
    statusProcessamento.value = novaMensagem;
    progresso.value = novoProgresso;
  });

  // 3. INICIAR a conexão
  connection.start()
    .then(() => {
      statusProcessamento.value = "Conectado! Aguardando início do processamento...";
      
      // 4. INVOCAR um método no servidor para entrar no grupo
      connection.invoke("EntrarNoGrupoDoProcesso", "processo-id-123");
    })
    .catch(err => {
      console.error("Falha na conexão:", err);
      statusProcessamento.value = "Erro ao conectar.";
    });
});

// 5. LIMPEZA: É muito importante fechar a conexão quando o componente não for mais necessário
onUnmounted(() => {
  if (connection) {
    connection.stop();
  }
});
</script>

<template>
  <div class="container">
    <header>
      <h1>📡 Status do Processamento em Tempo Real</h1>
      <p>Este componente está "ouvindo" eventos de um servidor simulado.</p>
    </header>
    <main>
      <div class="status-card">
        <h2>Status Atual:</h2>
        <p class="status-message">{{ statusProcessamento }}</p>
        <div class="progress-bar-container">
          <div class="progress-bar" :style="{ width: progresso + '%' }"></div>
        </div>
        <p class="progress-text">{{ progresso }}%</p>
      </div>
    </main>
  </div>
</template>

<style scoped>
.container {
  font-family: sans-serif;
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  text-align: center;
  color: #333;
}
.status-card {
  background-color: #f0f0f0;
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
.status-message {
  font-size: 1.2em;
  font-weight: bold;
  min-height: 30px;
}
.progress-bar-container {
  width: 100%;
  background-color: #e0e0e0;
  border-radius: 4px;
  margin: 20px 0 10px;
}
.progress-bar {
  height: 20px;
  background-color: #42b983;
  border-radius: 4px;
  transition: width 0.5s ease-in-out;
}
.progress-text {
  font-weight: bold;
}
</style>