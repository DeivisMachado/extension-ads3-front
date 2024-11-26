$(document).ready(function () {

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
                    linha.append(
                        $('<td style="white-space: pre-line"/>').html(
                            `Telefone: ${agente.telefone}\n Email: ${agente.email}`
                        )
                    );
                    linha.append(
                        $('<td style="white-space: pre-line"/>').html(
                            `Cidade: ${
                                agente.cidade?.nome ?? ""
                            } \nLogradouro: ${agente.logradouro} \nNumero: ${
                                agente.numero
                            } \nCep: ${agente.cep} \nBairro: ${
                                agente.bairro
                            } \nComplemento: ${agente.complemento}`
                        )
                    );
                    linha.append(
                        $("<td>").html(
                            "<i class='fa-solid fa-xmark' style='color: #fd0d0d;'></i><i class='fa-solid fa-pen-to-square' style='color: #3dff6e; margin-left: 10px;'></i>"
                        )
                    );
                    linha.attr("data-id", agente.id);
                    linha.attr("data-nome", agente.nome);
                    $(tabelaAgentes).append(linha);
                }
            }
        })
        .catch((err) => {
            alert(`Erro não Mapeado: ${err.message}`);
        });

    // Adicionar evento de clique nas linhas da tabela
    $(document).on("click", "#tabelaAgentes tr", function (event) {
        const agenteId = $(this).data("id");

        

        // Verificar se o ícone de edição foi clicado
        if ($(event.target).hasClass("fa-pen-to-square")) {
            // window.location.href = `/main/admin/atualizado/atualizar.html?agenteId=${agenteId}`;
            const modal = document.getElementById("modal");

            preencheCidadesNoSelect(modal);

            preencheDadosDoAgente(agenteId, modal)

            window.onclick = function (event) {
                if (event.target == modal) {
                    modal.style.display = "none";
                }
            };

            modal.style.display = "block";
        }

        if ($(event.target).hasClass("fa-xmark")) {
            const modal = document.getElementById("modalExcluirAgente");

            const elementoDeInformacao = document.getElementById("informacao-agente-excluir");

            elementoDeInformacao.textContent = $(this).data("nome");

            const botaoConfirma = document.getElementById("confirma-excluisao");

            botaoConfirma.onclick = () => {excluiAgente(agenteId)}

            window.onclick = function (event) {
                if (event.target == modal) {
                    modal.style.display = "none";
                }
            };

            modal.style.display = "block";
        }

        // else if (agenteId) {
        //     window.location.href = `/produtos/registro/movimentacao.html?agenteId=${agenteId}`;
        // }
    });
});