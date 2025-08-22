const axios = require('axios');

async function testarLogin() {
  try {
    const email = 'dgssantana@hotmail.com';    // coloque o email que você cadastrou
    const senha = '30Hash10#';               // coloque a senha correta

    const response = await axios.post('http://localhost:2998/auth/login', {
      email: email.toLowerCase(),
      senha
    });

    console.log('Login realizado com sucesso!');
    console.log('Dados retornados:', response.data);
  } catch (error) {
    if (error.response) {
      console.error('Erro na resposta da API:', error.response.data);
    } else {
      console.error('Erro na requisição:', error.message);
    }
  }
}

testarLogin();
