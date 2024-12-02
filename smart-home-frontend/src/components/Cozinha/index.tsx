import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { FaLightbulb, FaRegLightbulb, FaPowerOff, FaFire } from 'react-icons/fa';
import './style.css';

export default function Cozinha() {
    const socket = io('http://localhost:4000');

    interface EstadoInicial {
        luzOn: boolean,
        gelaOn: boolean,
        temperatura: number,
        fogaoOn: boolean,
        potenciaFogao: number
    }

    interface EstadoLuz {
        luzOn: boolean
    }
    interface EstadoGela {
        gelaOn: boolean
    }
    interface EstadoFogao {
        fogaoOn: boolean,
        potenciaFogao: number
    }

    const [estadoInicial, setEstadoInicial] = useState<EstadoInicial>({
        luzOn: false,
        gelaOn: false,
        temperatura: 0,
        fogaoOn: false,
        potenciaFogao: 1
    });

    const [estadoLuz, setEstadoLuz] = useState<EstadoLuz>({ luzOn: false });
    const [estadoGela, setEstadoGela] = useState<EstadoGela>({ gelaOn: false });
    const [estadoFogao, setEstadoFogao] = useState<EstadoFogao>({ fogaoOn: false, potenciaFogao: 1 });
    const [temperatura, setTemperatura] = useState<number>(0);

    useEffect(() => {
        socket.on('estadoInicialCozinha', (estadoInicial: EstadoInicial) => {
            setEstadoInicial(estadoInicial);
        });

        socket.on('ligarLuzCozinha', (novoEstado: EstadoLuz) => {
            setEstadoLuz(novoEstado);
        });

        socket.on('ligarGelaCozinha', (novoEstado: EstadoGela) => {
            setEstadoGela(novoEstado);
        });

        socket.on('ligarFogao', (estado: boolean) => {
            setEstadoFogao(prev => ({ ...prev, fogaoOn: estado }));
        });

        socket.on('atualizarPotenciaFogao', (potencia: number) => {
            setEstadoFogao(prev => ({ ...prev, potenciaFogao: potencia }));
        });

        socket.on('atualizarTemperatura', (novaTemperatura: number) => {
            setTemperatura(novaTemperatura);
        });

        return () => {
            socket.off('estadoInicialCozinha');
            socket.off('ligarLuzCozinha');
            socket.off('ligarGelaCozinha');
            socket.off('ligarFogao');
            socket.off('atualizarPotenciaFogao');
            socket.off('atualizarTemperatura');
        };
    }, []);

    const ligarLuz = () => {
        socket.emit('ligarLuzCozinha');
    }

    const ligarGela = () => {
        socket.emit('ligarGelaCozinha');
    }

    const ligarFogao = () => {
        socket.emit('ligarFogao');
    }

    const ajustarPotencia = (potencia: number) => {
        socket.emit('ajustarPotenciaFogao', potencia);
    }

    return (
        <div className='cozinha'>
            <div className='dispositivo'>
                <p>Cozinha - Luz</p>
                {estadoLuz.luzOn ? (
                    <FaLightbulb size={60} color="yellow" />  
                ) : (
                    <FaRegLightbulb size={60} color="gray" /> 
                )}<br/>
                <button onClick={ligarLuz}>
                    {estadoLuz.luzOn ? 'Desligar Luz' : 'Ligar Luz'}
                </button>
            </div>

            <div className='dispositivo'>
                <p>Cozinha - Geladeira</p>
                {estadoGela.gelaOn ? (
                    <FaPowerOff size={60} color="blue" />  
                ) : (
                    <FaPowerOff size={60} color="gray" /> 
                )}<br/>
                <button onClick={ligarGela}>
                    {estadoGela.gelaOn ? 'Desligar Geladeira' : 'Ligar Geladeira'}
                </button>
                {estadoGela.gelaOn && (
                    <p style={{ color: temperatura >= 5 ? 'red' : 'black' }}>
                        Temperatura Interna: {temperatura}°C
                    </p>
                )}
            </div>

            <div className='dispositivo'>
            <p>Cozinha - Fogão Elétrico</p>
                {estadoFogao.fogaoOn ? (
                    <FaFire size={60} color="orange" />  
                ) : (
                    <FaFire size={60} color="gray" /> 
                )}<br/>
                <button onClick={ligarFogao}>
                    {estadoFogao.fogaoOn ? 'Desligar Fogão' : 'Ligar Fogão'}
                </button>
                {estadoFogao.fogaoOn && (
                    <div>
                        <p>Potência Atual: {estadoFogao.potenciaFogao}</p>
                        <button onClick={() => ajustarPotencia(1)}>1</button>
                        <button onClick={() => ajustarPotencia(2)}>2</button>
                        <button onClick={() => ajustarPotencia(3)}>3</button>
                        <button onClick={() => ajustarPotencia(4)}>4</button>
                        <button onClick={() => ajustarPotencia(5)}>5</button>
                    </div>
                )}
            </div>
        </div>
    )
}
