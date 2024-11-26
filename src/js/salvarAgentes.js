document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const agenteId = urlParams.get('agenteId');

    if (agenteId) {
        document.getElementById('formTitle').textContent = "Atualizar Agente";
        carregarAgente(agenteId);
    }
});

const excluiAgente = (agenteId) => {
    axios
        .delete("http://127.0.0.1:8080/agente/" + agenteId)
        .then((response) => {
            if (response.status == 200) {
                alert("Agente excluido com sucesso!");
                window.location.href = `/main/admin/index.html`;
            } else {
                alert("Erro ao excluir o Agente.");
            }
        })
        .catch((err) => {
            alert(`Erro não Mapeado: ${err.message}`);
        });
}

const preencheCidadesNoSelect = (modal) => {
    const selectDeCidades = modal.querySelector("#cidade");
    while (selectDeCidades.firstChild) {
        selectDeCidades.removeChild(selectDeCidades.lastChild)
    };
    axios
        .get("http://127.0.0.1:8080/cidade")
        .then((response) => {
            if (response.status === 200) {
                const listaDeCidades = response.data;
                for (const cidade of listaDeCidades) {
                    let opcaoCidade = $("<option/>")[0];
                    opcaoCidade.value = cidade.id
                    opcaoCidade.id = cidade.id
                    opcaoCidade.append(cidade.nome)
                    selectDeCidades.append(opcaoCidade)
                }
            }
        })
        .catch((err) => {
            alert(`Erro não Mapeado: ${err.message}`);
        });
};

function cadastrarNovoAgente() {
    const modal = document.getElementById("modal");
    modal.style.display = "block";

    preencheCidadesNoSelect(modal);

    let inputs = modal.querySelectorAll("input, select")

    insertDadosDoAgenteNosInputs({}, inputs)

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
}

const insertDadosDoAgenteNosInputs = (agente, inputs) => {
    for (let input of inputs) {
        if (input.id == "cidade") {
            for (let opcao of input.childNodes) {
                if (opcao.id == agente.cidade.id) opcao.selected = true
            }
        } else if (input.id == "tipo") {
            for (let opcao of input.childNodes) {
                if (opcao.id == agente.tipo) opcao.selected = true
            }
        } else {
            input.value = agente[input.id] || ""
        }
    }
}

const preencheDadosDoAgente = (agenteId, modal) => {
    axios
    .get("http://127.0.0.1:8080/agente/" + agenteId)
    .then((response) => {
        if (response.status === 200) {
            const agente = response.data;
            let inputs = modal.querySelectorAll("input, select")
            insertDadosDoAgenteNosInputs(agente, inputs)
        }
    })
    .catch((err) => {
        alert(`Erro não Mapeado: ${err.message}`);
    });
}

function salvarAgente() {
    const agenteId = document.getElementById('id').value;
    const nome = document.getElementById('nome').value;
    const telefone = document.getElementById('telefone').value;
    const descricao = document.getElementById('descricao').value;
    const email = document.getElementById('email').value;
    const tipo = document.getElementById('tipo').value;
    const logradouro = document.getElementById('logradouro').value;
    const bairro = document.getElementById('bairro').value;
    const cep = document.getElementById('cep').value;
    const cidade = document.getElementById('cidade').value;
    const numero = document.getElementById('numero').value;

    const dataToSend = {
        nome: nome,
        telefone: telefone,
        descricao: descricao,
        email: email,
        tipo : tipo,
        logradouro : logradouro,
        bairro: bairro,
        cep: cep,
        id_cidade: cidade,
        numero: numero
    };

    if (agenteId) {
        axios.put(`http://127.0.0.1:8080/agente/${agenteId}`, dataToSend, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.status == 200) {
                alert("Agente atualizado com sucesso!");
                window.location.href = `/main/admin/index.html`;
            } else {
                alert("Erro ao atualizar o Agente.");
            }
        })
        .catch(error => {
            alert(`Erro ao atualizar o Agente: ${error.message}`);
        });
    } else {
        axios.post( `http://127.0.0.1:8080/agente`, dataToSend, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.status === 201) {
                alert("Agente criado com sucesso!");
                window.location.href = `/main/admin/index.html`;
            } else {
                alert("Erro ao criar o Agente.");
            }
        })
        .catch(error => {
            alert(`Erro ao criar o Agente: ${error.message}`);
        });
    }
}
const handlePhone = (event) => {
    let input = event.target
    input.value = phoneMask(input.value)
  }
  
  const phoneMask = (value) => {
    if (!value) return ""
    value = value.replace(/\D/g,'')
    value = value.replace(/(\d{2})(\d)/,"($1) $2")
    value = value.replace(/(\d)(\d{4})$/,"$1-$2")
    return value
  }