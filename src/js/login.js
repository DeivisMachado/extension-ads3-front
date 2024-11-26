async function login() {
    const email = document.getElementById('username').value;
    const senha = document.getElementById('password').value;

    axios.post("http://127.0.0.1:8080/login", { email, senha })
        .then((response) => {
            if (response.status === 200) {
                window.location.href = 'admin/index.html'
            }
        }).catch((err) => {
            document.getElementById('result').textContent = 'Usuario ou Senha Invalida!';
        })
}