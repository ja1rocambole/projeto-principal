// src/services/fakeSignalR.js

// Este é o nosso "servidor de mentirinha"
export class FakeSignalRConnection {
  constructor() {
    // Armazena as funções que estão "ouvindo" os eventos
    this.listeners = {};
    this.intervalId = null;
  }

  // Simula o método .on() do SignalR
  on(eventName, callback) {
    this.listeners[eventName] = callback;
  }

  // Simula o método .start()
  start() {
    console.log("[FakeSignalR] Conexão iniciada.");
    
    // Começa a simular o envio de mensagens do servidor após 2 segundos
    this.simulateServerMessages();
    
    // Retorna uma Promise resolvida, igual ao SignalR real
    return Promise.resolve();
  }

  // Simula o método .invoke()
  invoke(methodName, ...args) {
    console.log(`[FakeSignalR] Cliente invocou o método '${methodName}' com os argumentos:`, args);
    return Promise.resolve();
  }

  // Simula o método .stop()
  stop() {
    console.log("[FakeSignalR] Conexão encerrada.");
    clearInterval(this.intervalId);
  }

  // Lógica do nosso servidor falso
  simulateServerMessages() {
    let progresso = 0;
    const mensagens = [
      "Iniciando processamento...",
      "Validando dados...",
      "Processando lote 1/3...",
      "Processando lote 2/3...",
      "Processando lote 3/3...",
      "Finalizando...",
      "Concluído com sucesso!"
    ];

    this.intervalId = setInterval(() => {
      // Pega a mensagem atual e o progresso
      const mensagemAtual = mensagens.shift() || "Concluído com sucesso!";
      progresso = Math.min(progresso + 15 + Math.random() * 10, 100);

      // Se existir uma função ouvindo o evento "StatusAtualizado", chame-a
      if (this.listeners["StatusAtualizado"]) {
        this.listeners["StatusAtualizado"](mensagemAtual, Math.round(progresso));
      }

      // Para o intervalo se as mensagens acabaram
      if (mensagens.length === 0) {
        clearInterval(this.intervalId);
      }
    }, 2000); // Envia uma nova mensagem a cada 2 segundos
  }
}