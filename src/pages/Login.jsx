import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logoNav from '../img/logo-nav.webp';

export const Login = ({ onLoginSuccess }) => {
  const [credentials, setCredentials] = useState({ email: '', senha: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('Tentando fazer login com:', credentials);

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      };

      const dados = {
        email: credentials.email,
        senha: credentials.senha
      };

      console.log('Enviando requisição para o servidor:', dados);

      const response = await axios.post(
        "http://127.0.0.1:8080/login", 
        dados,
        config
      );
      
      console.log('Resposta do servidor:', response);

      if (response.status === 200) {
        console.log('Login bem sucedido!');
        onLoginSuccess();
        navigate('/');
      }
    } catch (err) {
      console.error('Erro durante o login:', err);
      setError(err.response?.data?.message || 'Usuário ou Senha Inválida!');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name === 'username' ? 'email' : 'senha']: value
    }));
  };

  return (
    <>
      <div className="background"></div>
      <div className="card">
        <img className="logo" src={logoNav} alt="Logo" />
        <h2>Login</h2>
        <form className="form" onSubmit={handleLogin}>
          <label>E-mail:</label>
          <input 
            type="email" 
            placeholder="exemple@exemple.com" 
            name="username"
            value={credentials.email}
            onChange={handleChange}
            required
          />
          
          <label>Senha:</label>
          <input 
            type="password" 
            placeholder="Senha" 
            name="password"
            value={credentials.senha}
            onChange={handleChange}
            required
          />
          
          <button type="submit">Login</button>
        </form>
        <footer>
          {error && <p style={{color: 'red'}}>{error}</p>}
        </footer>
      </div>
    </>
  );
}; 