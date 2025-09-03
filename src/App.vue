<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const precoBitcoin = ref("Conectando...");
const ultimaAtualizacao = ref(null);
let socket = null; // Variável para guardar nossa conexão WebSocket

onMounted(() => {
  // TODO: A lógica de conexão entrará aqui:
  // 1. CRIAR A CONEXÃO WEBSOCKET
  // Este é o endereço do feed público da Binance para o par Bitcoin/Real
  const wsUrl = "wss://stream.binance.com:9443/ws/btcbrl@trade"

  // A mágica acontece aqui: criamos um novo objeto WebSocket
  socket = new WebSocket(wsUrl)

  // 2. DEFINIR O QUE ACONTECE QUANDO A CONEXÃO É ABERTA
  socket.onopen = () => {
    console.log("Conexão WebSocket aberta com a Binance!")
    precoBitcoin.value = "Aguardando primeira atualização...";
  }

  // 3. DEFINIR O QUE ACONTECE QUANDO UMA MENSAGEM CHEGA
  // Esta função será chamada dezenas de vezes por minuto!
  socket.onmessage = (event) => {
    // A mensagem vem como uma string JSON, então precisamos convertê-la para um objeto
    const data = JSON.parse(event.data)

    // Formatamos o preço para a moeda brasileira
    const precoFormatado = parseFloat(data.p).toLocaleString('pt-BR', {
      style: 'currency', currency: 'BRL'
    })

    // Atualizamos nossas variáveis reativas, e o Vue cuida do resto
    precoBitcoin.value = precoFormatado;
    ultimaAtualizacao.value = new Date().toLocaleTimeString();
  }

  socket.onclose = () => {
    console.log("Conexão WebSocket fechada.");
    precoBitcoin.value = "Desconectado.";
  };

  socket.onerror = (error) => {
    console.error("Error no WebSocket:", error);
    precoBitcoin.value = "Erro na conexão.";
  }
});


onUnmounted(() => {
  // TODO: A lógica para fechar a conexão entrará aqui
  if (socket) {
    socket.close()
  }
});
</script>

<template>
  <div class="container">
    <header>
      <h1>🔴 Preço do Bitcoin em Tempo Real (via WebSocket)</h1>
      <p>Conectado diretamente ao feed da Binance.</p>
    </header>
    <main>
      <div class="price-card">
        <h2>BTC / BRL</h2>
        <p class="price">{{ precoBitcoin }}</p>
        <p class="timestamp" v-if="ultimaAtualizacao">
          Última atualização: {{ ultimaAtualizacao }}
        </p>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* (O mesmo CSS do exemplo anterior pode ser usado aqui, se quiser) */
.container {
  font-family: sans-serif;
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  text-align: center;
}

.price-card {
  background-color: #f0f0f0;
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.price {
  font-size: 2.5em;
  font-weight: bold;
  margin: 10px 0;
  color: #e85d04;
}

.timestamp {
  font-size: 0.9em;
  color: #666;
}
</style>