import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

// Estado inicial dos dispositivos
let dispositivosSala = {
    luzOn: false,
    tvOn: false,
    canaisTv: "",
    arOn: false,
    arTemp: 24  // Temperatura inicial do ar-condicionado
};

let dispositivosCozinha = {
    luzOn: false,
    gelaOn: false,
    temperatura: 0,
    fogaoOn: false,
    potenciaFogao: 1  // Potência inicial do fogão 
};

let dispositivosQuarto = {
    luzOn: false,
    cortOn: false,
    ventOn: false,
    potenciaVent: 1  // Potência inicial do ventilador 
};


// Eventos de conexão e controle de dispositivos
io.on('connection', (socket) => {
    console.log('Cliente conectado', socket.id);

    // Envia estado inicial dos dispositivos ao cliente que se conecta
    socket.emit('estadoInicialSala', dispositivosSala);
    socket.emit('estadoInicialCozinha', dispositivosCozinha);
    socket.emit('estadoInicialQuarto', dispositivosQuarto);

    // Eventos da Sala de Estar-----------------------------------------------------------------------
    socket.on('ligarLuzSala', () => {
        dispositivosSala.luzOn = !dispositivosSala.luzOn;
        io.emit('ligarLuzSala', dispositivosSala);
    });

    socket.on('ligarTvSala', () => {
        dispositivosSala.tvOn = !dispositivosSala.tvOn;
        io.emit('ligarTvSala', dispositivosSala);
    });

    socket.on('ligarArSala', () => {
        dispositivosSala.arOn = !dispositivosSala.arOn;
        io.emit('ligarArSala', dispositivosSala);
    });

    // Evento para mudar o canal da TV na sala
    socket.on('mudarCanalTv', (canal: string) => {
        dispositivosSala.canaisTv = canal;
        io.emit('atualizarCanalTv', canal);
    });

    // Evento para mudar a temperatura do ar-condicionado
    socket.on('mudarTemperaturaAr', (novaTemperatura: number) => {
        dispositivosSala.arTemp = novaTemperatura;
        io.emit('atualizarTemperaturaAr', novaTemperatura);
    });

    // Eventos da Cozinha-----------------------------------------------------------------------------
    socket.on('ligarLuzCozinha', () => {
        dispositivosCozinha.luzOn = !dispositivosCozinha.luzOn;
        io.emit('ligarLuzCozinha', dispositivosCozinha);
    });

    socket.on('ligarGelaCozinha', () => {
        dispositivosCozinha.gelaOn = !dispositivosCozinha.gelaOn;
        io.emit('ligarGelaCozinha', dispositivosCozinha);

        if (!dispositivosCozinha.gelaOn) {
            dispositivosCozinha.temperatura = 0;
            io.emit('atualizarTemperatura', dispositivosCozinha.temperatura);
        }
    });

    // Eventos para o fogão na cozinha
    socket.on('ligarFogao', () => {
        dispositivosCozinha.fogaoOn = !dispositivosCozinha.fogaoOn;
        io.emit('ligarFogao', dispositivosCozinha.fogaoOn);  // Emite o estado de ligado/desligado
    });

    socket.on('ajustarPotenciaFogao', (potencia: number) => {
        if (potencia >= 1 && potencia <= 5) {  // Garantir que a potência esteja entre 1 e 5
            dispositivosCozinha.potenciaFogao = potencia;
            io.emit('atualizarPotenciaFogao', potencia);  // Envia a nova potência para todos os clientes
        }
    });

    // Eventos Quarto---------------------------------------------------------------------------------
    socket.on('ligarLuzQuarto', () => {
        dispositivosQuarto.luzOn = !dispositivosQuarto.luzOn;
        io.emit('ligarLuzQuarto', dispositivosQuarto);
    });

    socket.on('abrirCortinaQuarto', () => {
        dispositivosQuarto.cortOn = !dispositivosQuarto.cortOn;
        io.emit('abrirCortinaQuarto', dispositivosQuarto);
    });

    // Ventilador
    socket.on('ligarVent', () => {
        dispositivosQuarto.ventOn = !dispositivosQuarto.ventOn;
        io.emit('ligarVent', dispositivosQuarto.ventOn);  // Emite o estado de ligado/desligado
    });

    socket.on('ajustarPotenciaVent', (potencia: number) => {
        if (potencia >= 1 && potencia <= 3) { 
            dispositivosQuarto.potenciaVent = potencia;
            io.emit('ajustarPotenciaVent', potencia); 
        }
    });
});

// Configuração do servidor
server.listen(4000, () => {
    console.log('Servidor rodando na porta 4000');
});
