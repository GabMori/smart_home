import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { FaLightbulb, FaRegLightbulb, FaPowerOff, FaFan, FaAngleDoubleDown, FaAngleDoubleUp, FaWindowMaximize, FaWindowMinimize } from 'react-icons/fa';
import './style.css';

export default function Cozinha() {
    const socket = io('http://localhost:4000');

    interface EstadoInicial {
        luzOn: boolean,
        cortOn: boolean,
        ventOn: boolean,
        potenciaVent: number
    }

    interface EstadoLuz {
        luzOn: boolean
    }
    interface EstadoCort {
        cortOn: boolean
    }
    interface EstadoVent {
        ventOn: boolean,
        potenciaVent: number
    }

    const [estadoInicial, setEstadoInicial] = useState<EstadoInicial>({
        luzOn: false,
        cortOn: false,
        ventOn: false,
        potenciaVent: 1
    });

    const [estadoLuz, setEstadoLuz] = useState<EstadoLuz>({ luzOn: false });
    const [estadoCort, setEstadoCort] = useState<EstadoCort>({ cortOn: false });
    const [estadoVent, setEstadoVent] = useState<EstadoVent>({ ventOn: false, potenciaVent: 1 });


    useEffect(() => {
        socket.on('estadoInicialQuarto', (estadoInicial: EstadoInicial) => {
            setEstadoInicial(estadoInicial);
        });

        socket.on('ligarLuzQuarto', (novoEstado: EstadoLuz) => {
            setEstadoLuz(novoEstado);
        });

        socket.on('abrirCortinaQuarto', (novoEstado: EstadoCort) => {
            setEstadoCort(novoEstado);
        });

        socket.on('ligarVent', (estado: boolean) => {
            setEstadoVent(prev => ({ ...prev, ventOn: estado }));
        });

        socket.on('ajustarPotenciaVent', (potencia: number) => {
            setEstadoVent(prev => ({ ...prev, potenciaVent: potencia }));
        });
        return () => {
            socket.off('estadoInicialQuarto');
            socket.off('ligarLuzQuarto');
            socket.off('abrirCortinaQuarto');
            socket.off('ligarVent');
            socket.off('ajustarPotenciaVent');
        };
    }, []);

    const ligarLuz = () => {
        socket.emit('ligarLuzQuarto');
    }

    const abrirCort = () => {
        socket.emit('abrirCortinaQuarto');
    }

    const ligarVent = () => {
        socket.emit('ligarVent');
    }

    const ajustarPotencia = (potencia: number) => {
        socket.emit('ajustarPotenciaVent', potencia);
    }

    return (
        <div className='quarto'>
            <div className='dispositivo'>
                <p>Quarto - Luz</p>
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
                <p>Quarto - Cortina</p>
                {estadoCort.cortOn ? (
                    <FaWindowMaximize  size={60} color="purple" />  
                ) : (
                    <FaWindowMinimize size={60} color="brown" /> 
                )}<br/>
                <button onClick={abrirCort}>
                    {estadoCort.cortOn ? 'Fechar Cortina' : 'Abrir Cortina'}
                </button>
            </div>

            <div className='dispositivo'>
            <p>Quarto - Ventilador</p>
                {estadoVent.ventOn ? (
                    <FaFan size={60} color="blue" />  
                ) : (
                    <FaFan size={60} color="gray" /> 
                )}<br/>
                <button onClick={ligarVent}>
                    {estadoVent.ventOn ? 'Desligar Ventilador' : 'Ligar Ventilador'}
                </button>
                {estadoVent.ventOn && (
                    <div>
                        <p>Potência Atual: {estadoVent.potenciaVent}</p>
                        <button onClick={() => ajustarPotencia(1)}>1</button>
                        <button onClick={() => ajustarPotencia(2)}>2</button>
                        <button onClick={() => ajustarPotencia(3)}>3</button>
                    </div>
                )}
            </div>
        </div>
    )
}
