import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TarefaForm.css'; 

const TarefaForm = () => {
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [usuarioId, setUsuarioId] = useState('');
    const [usuarios, setUsuarios] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchUsuarios = async () => {
            const response = await axios.get('https://taskflow-93vn.onrender.com//usuarios/');
            setUsuarios(response.data);
        };
        fetchUsuarios();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://taskflow-93vn.onrender.com//tarefas/', {
                titulo,
                descricao,
                usuario_id: usuarioId
            });
            setSuccessMessage('Tarefa criada com sucesso!'); 
            setTimeout(() => {
                setSuccessMessage(''); 
            }, 2000);
            setTitulo('');
            setDescricao('');
            setUsuarioId('');
        } catch (error) {
            alert('Erro ao criar tarefa');
        }
    };

    return (
        <form className="tarefa-form" onSubmit={handleSubmit}>
            <button className="back-button" onClick={() => window.location.href = '/'}>◀ Voltar</button>
            <h2>Criar Tarefa</h2>
            {successMessage && <div className="success-message">{successMessage}</div>} 
            <input
                type="text"
                placeholder="Título"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Descrição"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                required
            />
            <select value={usuarioId} onChange={(e) => setUsuarioId(e.target.value)} required>
                <option value="">Selecione um usuário</option>
                {usuarios.map(usuario => (
                    <option key={usuario.id} value={usuario.id}>{usuario.nome}</option>
                ))}
            </select>
            <button className="register-button" type="submit">Criar Tarefa</button>
        </form>
    );
};

export default TarefaForm;