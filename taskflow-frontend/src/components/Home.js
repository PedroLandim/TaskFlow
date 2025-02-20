import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Home.css';
import Baixar from '../baixar.png';

const Home = () => {
    const [tarefasPendentes, setTarefasPendentes] = useState([]); 

    const fetchTarefasPendentes = async () => {
        try {
            const response = await axios.get('https://taskflow-93vn.onrender.com/tarefas/');
            const tarefas = response.data;
            const pendentes = tarefas.filter(tarefa => tarefa.status === "Pendente");
            setTarefasPendentes(pendentes);
        } catch (error) {
            console.error("Erro ao buscar tarefas pendentes:", error);
        }
    };


    const iniciarTarefa = async (tarefaId) => {
        try {
            await axios.put(`https://taskflow-93vn.onrender.com/tarefas/${tarefaId}/`, { status: "Em Andamento" });

            setTarefasPendentes(tarefasPendentes.filter(tarefa => tarefa.id !== tarefaId));

        } catch (error) {
            console.error("Erro ao iniciar tarefa:", error.response || error.message);
        }
    };

    const exportarTarefas = async () => {
        try {
            const response = await axios.get('https://taskflow-93vn.onrender.com/tarefas/exportar-tarefas/', {
                responseType: 'blob',  // Tipo de resposta 'blob' para permitir o download do arquivo
            });
    
            // Criação da URL do arquivo blob
            const url = window.URL.createObjectURL(new Blob([response.data]));
    
            // Criação do link para download
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'tasks.json');  // Define o nome do arquivo para download
            document.body.appendChild(link);
            link.click();  // Simula o clique no link para iniciar o download
            document.body.removeChild(link);  // Remove o link da página após o clique
        } catch (error) {
            console.error("Erro ao exportar tarefas:", error);
        }
    };
    

    useEffect(() => {
        fetchTarefasPendentes();
    }, []);

    return (
        <div>
            <button onClick={exportarTarefas} className="export-button">
                <img src={Baixar} alt="Baixar" className="icon" />
            </button>
            <div className="home-container">
                <h1>Bem-vindo ao TaskFlow</h1>
                <p>Gerencie suas tarefas e usuários de forma eficiente.</p>
                <div className="home-buttons">
                    <Link to="/usuarios" className="home-button">Gerenciar Usuários</Link>
                    <Link to="/tarefas" className="home-button">Gerenciar Tarefas</Link>
                    <Link to="/lista-tarefas" className="home-button full-width">
                        Visualizar Tarefas em Andamento
                    </Link>
                </div>
            </div>

            {tarefasPendentes.length > 0 && (
                <div className="tarefas-pendentes-container">
                    <h2>Tarefas Pendentes</h2>
                    <ul className="tarefas-pendentes-list">
                        {tarefasPendentes.map(tarefa => (
                            <li key={tarefa.id} className="tarefa-item">
                                <h3>{tarefa.titulo}</h3>
                                <p>{tarefa.descricao}</p>
                                <p>Criador: <strong className="usuario-nome">{tarefa.usuario_nome}</strong></p>
                                <button
                                    className="iniciar-tarefa-button"
                                    onClick={() => iniciarTarefa(tarefa.id)}
                                >
                                    Iniciar Tarefa
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Home;