import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UsuarioList = () => {
    const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {
        const fetchUsuarios = async () => {
            const response = await axios.get('http://localhost:8000/usuarios/');
            setUsuarios(response.data);
        };
        fetchUsuarios();
    }, []);

    return (
        <div>
            <h2>Lista de Usuários</h2>
            <ul>
                {usuarios.map(usuario => (
                    <li key={usuario.id}>
                        <h3>{usuario.nome}</h3>
                        <p>{usuario.email}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UsuarioList;