import React, { useState } from 'react';
import axios from 'axios';
import './usuarioForm.css';

const UsuarioForm = () => {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [successMessage, setSuccessMessage] = useState(''); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://taskflow-93vn.onrender.com/usuarios/', { nome, email });
            setSuccessMessage('Usuário cadastrado com sucesso!'); 

           
            setTimeout(() => {
                setSuccessMessage(''); 
            }, 2000);

            setNome('');
            setEmail('');
        } catch (error) {
            alert('Erro ao cadastrar usuário');
        }
    };

    return (
        <div>
            <form className="usuario-form" onSubmit={handleSubmit}>
                <button className="back-button" onClick={() => window.location.href = '/'}>◀ Voltar</button>
                <h2>Cadastrar Usuário</h2>
                <input
                    id="nome"
                    type="text"
                    placeholder="Nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                />
                <input
                    id="email"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button className="register-button" type="submit">Cadastrar</button>

                {successMessage && (
                    <div className="success-message">
                        {successMessage}
                    </div>
                )}
            </form>
        </div>
    );
};

export default UsuarioForm;