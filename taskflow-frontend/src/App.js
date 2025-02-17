import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import UsuarioForm from './components/usuarioForm';
import TarefaForm from './components/TarefaForm';
import TarefaList from './components/TarefaList';
import UsuarioList from './components/UsuarioList';
import Home from './components/Home'; 

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} /> 
                <Route path="/usuarios" element={<UsuarioForm />} />
                <Route path="/tarefas" element={<TarefaForm />} />
                <Route path="/lista-tarefas" element={<TarefaList />} />
                <Route path="/lista-usuarios" element={<UsuarioList />} />
            </Routes>
        </Router>
    );
};

export default App;