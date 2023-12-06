document.addEventListener('DOMContentLoaded', function (){
    const novoItemButton = document.querySelector('.estoque-novo-item-button');
    const novoItemModal = document.querySelector('.modal_estoque_novo_item');
    const XcloseModal = document.getElementById('fecharModal');
    const ModalFundo = document.getElementById('modal_estoque_fundo');
    const modalCadastroItem = document.querySelector('.modal-estoque_cadastro');
    const estoqueDadosCompletos = document.querySelectorAll('.estoque-product-dados-completos-box');
    const estoqueLine = document.querySelectorAll('.estoque-table_box-unit');
    const nomeOrdenar = document.querySelector('[name="nome_ordenar"]');


    novoItemButton.addEventListener('click', () =>{        
        novoItemModal.style.display = 'flex';
    })

    XcloseModal.addEventListener('click', () => {    
        novoItemModal.style.display = 'none';
    });

    ModalFundo.addEventListener('click', (event) =>{    
        if(!modalCadastroItem.contains(event.target)){
            novoItemModal.style.display = 'none';
        }
    });

    estoqueLine.forEach(element => {
        element.addEventListener('click', (event) => {
            const index = Array.from(estoqueLine).indexOf(element);
            const dadosCompletosElement = estoqueDadosCompletos[index];
    
            // Verificar se o clique foi dentro do elemento 'estoque-product-dados-completos-box' ou em seus filhos
            if (!dadosCompletosElement.contains(event.target)) {
                // Clique fora do elemento, então toggle a classe no elemento correspondente
                dadosCompletosElement.classList.toggle('show-fullData');
            }
        });
    });
    
    // ---------------------------------------------------------------------------------------------

    // ORDENAR AS COLUNAS

    function ordenarElementos(array, nameSelector, comparar, ordenacaoAscendente) {
        let elements = Array.from(document.querySelectorAll(array));
    
        elements.sort((a, b) => {
            let valueA = a.querySelector(nameSelector).textContent.trim();
            let valueB = b.querySelector(nameSelector).textContent.trim();
    
            // Verifique se é uma data e formate-a adequadamente para a comparação
            if (nameSelector.includes('buydate') || nameSelector.includes('expiredate')) {
                valueA = valueA.split('/').reverse().join('-');
                valueB = valueB.split('/').reverse().join('-');
            }
    
            return ordenacaoAscendente ? comparar(valueA, valueB) : comparar(valueB, valueA);
        });
    
        let parent = document.querySelector('#estoque-tables_wrapper');
        parent.innerHTML = '';
        elements.forEach(element => {
            parent.appendChild(element);
        });
    }
    
    function criarFuncaoOrdenacao(nameSelector, comparar) {
        let ordenacaoAscendente = true;
    
        return () => {
            ordenarElementos('.estoque-table_box-unit', nameSelector, comparar, ordenacaoAscendente);
            ordenacaoAscendente = !ordenacaoAscendente;
        };
    }
    
    document.querySelector('[name="nome_ordenar"]').addEventListener('click', criarFuncaoOrdenacao('.estoque-product-name', (a, b) => a.localeCompare(b)));
    document.querySelector('[name="quantidade_ordenar"]').addEventListener('click', criarFuncaoOrdenacao('.estoque-product-quantity', (a, b) => parseInt(a) - parseInt(b)));
    document.querySelector('[name="categoria_ordenar"]').addEventListener('click', criarFuncaoOrdenacao('.estoque-product-category', (a, b) => a.localeCompare(b)));
    document.querySelector('[name="data_compra_ordenar"]').addEventListener('click', criarFuncaoOrdenacao('.estoque-product-buydate', (a, b) => new Date(a) - new Date(b)));
    document.querySelector('[name="validade_ordenar"]').addEventListener('click', criarFuncaoOrdenacao('.estoque-product-expiredate', (a, b) => new Date(a) - new Date(b)));
    document.querySelector('[name="observacao_ordenar"]').addEventListener('click', criarFuncaoOrdenacao('.estoque-product-obs', (a, b) => a.localeCompare(b)));
    document.querySelector('[name="valor_compra_ordenar"]').addEventListener('click', criarFuncaoOrdenacao('.estoque-product-buyprice',(a,b) => parseFloat(a) - parseFloat(b)));

    // ---------------------------------------------------------------------------------------------

    //ROTACIONANDO O ÍCONE DE ORDENAÇÃO

    var icons = document.querySelectorAll('.fi-sr-caret-up');
    icons.forEach(function(icon) {
      icon.addEventListener('click', function() {
        var parentElement = this.parentElement;
        if (parentElement.classList.contains('icone-rotacionado')) {
          parentElement.classList.remove('icone-rotacionado');
          parentElement.classList.add('icone-inicial');
        } else {
          parentElement.classList.add('icone-rotacionado');
          parentElement.classList.remove('icone-inicial');
        }
      });
    });

    // ---------------------------------------------------------------------------------------------


    // FILTROS

    // Primeiro, selecione o elemento de entrada e o select
    let searchInput = document.getElementById('searchInput');
    let select = document.querySelector('.form-select');

    // Crie um elemento para a mensagem de erro
    let errorMsg = document.createElement('p');
    errorMsg.textContent = 'Desculpe, não encontramos resultados para a sua pesquisa.';
    errorMsg.style.display = 'none';
    document.body.appendChild(errorMsg);

    // Em seguida, adicione um ouvinte de evento 'input' ao campo de entrada
    searchInput.addEventListener('input', function() {
        // Obtenha o valor do campo de entrada e do select
        let filter = searchInput.value.toUpperCase();
        let option = select.options[select.selectedIndex].value;

        // Selecione todos os elementos com a classe 'estoque-table_box-unit'
        let sections = document.querySelectorAll('.estoque-table_box-unit');

        // Variável para verificar se algum resultado foi encontrado
        let found = false;

        // Itere sobre cada elemento
        for (let i = 0; i < sections.length; i++) {
            // Obtenha o valor do campo relevante dentro da seção
            let value;
            switch(option) {
                case '1':
                    value = sections[i].querySelector('.estoque-product-name').textContent || sections[i].querySelector('.estoque-product-name').innerText;
                    break;
                case '2':
                    value = sections[i].querySelector('.estoque-product-quantity').textContent || sections[i].querySelector('.estoque-product-quantity').innerText;
                    break;
                case '3':
                    value = sections[i].querySelector('.estoque-product-category').textContent || sections[i].querySelector('.estoque-product-category').innerText;
                    break;
                case '4':
                    value = sections[i].querySelector('.estoque-product-buydate').textContent || sections[i].querySelector('.estoque-product-buydate').innerText;
                    break;
                case '5':
                    value = sections[i].querySelector('.estoque-product-expiredate').textContent || sections[i].querySelector('.estoque-product-expiredate').innerText;
                    break;
                case '6':
                    value = sections[i].querySelector('.estoque-product-buyprice').textContent || sections[i].querySelector('.estoque-product-buyprice').innerText;
                    break;
            }

            // Se o valor corresponder ao filtro, mostre o elemento, caso contrário, oculte-o
            if (value.toUpperCase().indexOf(filter) > -1) {
                sections[i].style.display = "";
                found = true;
            } else {
                sections[i].style.display = "none";
            }
        }

        // Se nenhum resultado foi encontrado, mostre a mensagem de erro
        if (!found) {
            // Adicione uma margem à esquerda à mensagem de erro
            errorMsg.style.marginLeft = '20px';
            errorMsg.style.display = 'block'; // ou qualquer valor de exibição desejado
        } else {
            errorMsg.style.display = 'none';
        }
    });


});



//ORDENAR NO INICIO POR VALIDADE

// Primeiro, obtenha todos os elementos que você deseja ordenar
let elements = Array.from(document.querySelectorAll('.estoque-table_box-unit'));

elements.sort((a, b) => {
    let dateA = a.querySelector('.estoque-product-expiredate').textContent.trim().split('/').reverse().join('-');
    let dateB = b.querySelector('.estoque-product-expiredate').textContent.trim().split('/').reverse().join('-');
    
    return new Date(dateA) - new Date(dateB);
});

// Agora, você pode anexar os elementos ordenados de volta ao DOM
let parent = document.querySelector('#estoque-tables_wrapper'); // Substitua '#estoque-tables_wrapper' pelo seletor do elemento pai
parent.innerHTML = ''; // Limpe o conteúdo atual
elements.forEach(element => {
    parent.appendChild(element);
});



  