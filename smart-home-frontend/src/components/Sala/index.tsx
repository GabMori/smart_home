import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import './style.css';
import { FaTv, FaSnowflake, FaLightbulb, FaRegLightbulb, FaWind } from 'react-icons/fa';

export default function Sala() {
    const socket = io('http://localhost:4000');

    interface EstadoInicial {
        luzOn: boolean,
        tvOn: boolean,
        canaisTv: string,
        arTemp: number,
        arOn: boolean
    }

    interface EstadoLuz {
        luzOn: boolean,
    }

    interface EstadoTv {
        tvOn: boolean
    }

    interface EstadoAr {
        arOn: boolean,
        arTemp: number
    }

    const [estadoInicial, setEstadoInicial] = useState<EstadoInicial>({
        luzOn: false,
        tvOn: false,
        canaisTv: "",
        arTemp: 24,
        arOn: false
    });

    const [estadoLuz, setEstadoLuz] = useState<EstadoLuz>({ luzOn: false });
    const [estadoTv, setEstadoTv] = useState<EstadoTv>({ tvOn: false });
    const [estadoAr, setEstadoAr] = useState<EstadoAr>({ arOn: false, arTemp: 24 });
    const [canalAtual, setCanalAtual] = useState<string>("");

    useEffect(() => {
        socket.on('estadoInicialSala', (estadoInicial: EstadoInicial) => {
            setEstadoInicial(estadoInicial);
            setEstadoLuz({ luzOn: estadoInicial.luzOn });
            setEstadoTv({ tvOn: estadoInicial.tvOn });
            setEstadoAr({ arOn: estadoInicial.arOn, arTemp: estadoInicial.arTemp });
            setCanalAtual(estadoInicial.canaisTv);
        });

        socket.on('ligarLuzSala', (novoEstado: EstadoLuz) => {
            setEstadoLuz(novoEstado);
        });

        socket.on('ligarTvSala', (novoEstado: EstadoTv) => {
            setEstadoTv(novoEstado);
        });

        socket.on('ligarArSala', (novoEstado: EstadoAr) => {
            setEstadoAr(novoEstado);
        });

        socket.on('atualizarCanalTv', (canal: string) => {
            setCanalAtual(canal);
        });

        socket.on('atualizarTemperaturaAr', (novaTemp: number) => {
            setEstadoAr((prev) => ({ ...prev, arTemp: novaTemp }));
        });

        return () => {
            socket.off('estadoInicialSala');
            socket.off('ligarLuzSala');
            socket.off('ligarTvSala');
            socket.off('ligarArSala');
            socket.off('atualizarCanalTv');
            socket.off('atualizarTemperaturaAr');
        }
    }, []);

    const ligarLuz = () => {
        socket.emit('ligarLuzSala');
    };

    const ligarTv = () => {
        socket.emit('ligarTvSala');
    };

    const ligarAr = () => {
        socket.emit('ligarArSala');
    };

    const mudarCanal = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const novoCanal = event.target.value;
        setCanalAtual(novoCanal);
        socket.emit('mudarCanalTv', novoCanal);
    };

    const mudarTemperaturaAr = (event: React.ChangeEvent<HTMLInputElement>) => {
        const novaTemperatura = Number(event.target.value);
        setEstadoAr((prev) => ({ ...prev, arTemp: novaTemperatura }));
        socket.emit('mudarTemperaturaAr', novaTemperatura);
    };

    return (
        <div className='container'>
            <div className='sala-de-estar'>
                <div className='dispositivo'>
                    <p>Sala de Estar - Luz</p>
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
                    <p>Sala de Estar - TV</p>
                    {estadoTv.tvOn ? (
                        <FaTv size={60} color="green" />
                    ) : (
                        <FaTv size={60} color="gray" />
                    )}<br />
                    <button onClick={ligarTv}>
                        {estadoTv.tvOn ? 'Desligar TV' : 'Ligar TV'}
                    </button>
                    <label>Canal:</label>
                    <select
                        name="canal"
                        id="canal"
                        value={canalAtual}
                        onChange={mudarCanal}
                        disabled={!estadoTv.tvOn}
                    >
                        <option value="Max">Max</option>
                        <option value="Disney+">Disney+</option>
                        <option value="Crunchyroll">Crunchyroll</option>
                        <option value="Netflix">Netflix</option>
                    </select>
                </div>

                <div className='dispositivo'>
                    <p>Sala de Estar - AR Condicionado</p>
                    {estadoAr.arOn ? (
                        <FaWind size={60} color="lightblue" />
                    ) : (
                        <FaWind size={60} color="gray" />
                    )}
                    <button onClick={ligarAr}>
                        {estadoAr.arOn ? 'Desligar Ar' : 'Ligar Ar'}
                    </button>
                    <label>Temperatura:</label>
                    <input
                        type="number"
                        value={estadoAr.arTemp}
                        onChange={mudarTemperaturaAr}
                        disabled={!estadoAr.arOn}
                    />
                </div>
            </div>
        </div>
    )
}
