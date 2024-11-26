$(document).ready(function() {

    const nomeBonitoParaOTipo = (tipo) => {
        switch (tipo) {
            case 'PREINCUBADORA': return 'Pré-Incubadora'
            case 'INCUBADORA': return 'Incubadora'
            case 'ACELERADORA': return 'Aceleradora'
            default: return 'Not Found'
        }
    }

    const urlParams = new URLSearchParams(window.location.search);
    const tipo = urlParams.get('tipo')

    axios
        .get("http://127.0.0.1:8080/agente")
        .then((response) => {
            if (response.status === 200) {
                const lista = response.data.filter(agente => tipo == null || agente.tipo == tipo).sort((a,b) => a.id - b.id);
                for (const agente of lista) {
                    let linha = $("<tr/>");
                    linha.append($("<td/>").html(agente.nome));
                    linha.append($("<td/>").html(agente.descricao));
                    linha.append($("<td/>").html(nomeBonitoParaOTipo(agente.tipo)));
                    linha.append($("<td style=\"white-space: pre-line\"/>")
                        .html(`Telefone: ${agente.telefone}\n Email: ${agente.email}`));
                    linha.append($("<td style=\"white-space: pre-line\"/>").html(`Cidade: ${agente.cidade?.nome ?? ""} \nLogradouro: ${agente.logradouro} \nNumero: ${agente.numero} \nCep: ${agente.cep} \nBairro: ${agente.bairro} \nComplemento: ${agente.complemento?? "Nada consta."}`));
                    linha.attr('data-id', agente.id);
                    $(tabelaAgentes).append(linha);
                }
            }
        })
        .catch((err) => {
            alert(`Erro não Mapeado: ${err.message}`)
        });
});
