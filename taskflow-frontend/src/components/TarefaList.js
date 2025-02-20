import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TarefaList.css'; 

const TarefaList = () => {
    const [tarefasEmAndamento, setTarefasEmAndamento] = useState([]);
    const [filtroUsuario, setFiltroUsuario] = useState('');


    const fetchTarefasEmAndamento = async () => {
        try {
            const response = await axios.get('https://taskflow-93vn.onrender.com//tarefas/');
            const tarefas = response.data;
            const emAndamento = tarefas.filter(tarefa => tarefa.status === "Em Andamento");
            setTarefasEmAndamento(emAndamento);
        } catch (error) {
            console.error("Erro ao buscar tarefas em andamento:", error);
        }
    };


    const concluirTarefa = async (tarefaId) => {
        try {
            await axios.put(`https://taskflow-93vn.onrender.com//tarefas/${tarefaId}/`, { status: "Concluído" });
            setTarefasEmAndamento(tarefasEmAndamento.filter(tarefa => tarefa.id !== tarefaId));
        } catch (error) {
            console.error("Erro ao concluir tarefa:", error.response || error.message);
        }
    };


    useEffect(() => {
        fetchTarefasEmAndamento();
    }, []);

    return (
        <div className="tarefa-list-container">
            <button className="back-button" onClick={() => window.history.back()}>◀ Voltar</button>
            <h2>Tarefas em Andamento</h2>


            <div className="filtro-section">
                <input
                    type="text"
                    placeholder="Filtrar por nome do usuário"
                    value={filtroUsuario}
                    onChange={(e) => setFiltroUsuario(e.target.value)}
                />
            </div>


            <ul>
                {tarefasEmAndamento.length > 0 ? (
                    tarefasEmAndamento
                        .filter(tarefa => {
                            return (
                                filtroUsuario === '' || 
                                (tarefa.usuario_nome && tarefa.usuario_nome.toLowerCase().includes(filtroUsuario.toLowerCase()))
                            );
                        })
                        .map(tarefa => (
                            <li key={tarefa.id}>
                                <h3>{tarefa.titulo}</h3>
                                <p>{tarefa.descricao}</p>
                                <p>Status: 
                                    <strong className="status-andamento">
                                        {tarefa.status}
                                    </strong>
                                </p>
                                <p>Responsável: <strong>{tarefa.usuario_nome || 'Desconhecido'}</strong></p>
                                <button onClick={() => concluirTarefa(tarefa.id)}>
                                    Marcar como Concluída
                                </button>
                            </li>
                        ))
                ) : (
                    <p>Nenhuma tarefa em andamento encontrada para o filtro especificado.</p>
                )}
            </ul>
        </div>
    );
};

export default TarefaList;