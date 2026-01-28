

const btnAdicionarTarefa = document.querySelector('.app__button--add-task');
const formAdicionarTarefa = document.querySelector('.app__form-add-task');
const textarea = document.querySelector('.app__form-textarea');
const ulTarefas = document.querySelector('.app__section-task-list')
const paragrafoDescricaoTarefa = document.querySelector('.app__section-active-task-description')
let tarefaSelecionada = null;
let liTarefaSelecionada = null;

const btnRemoverConcluidas = document.querySelector('#btn-remover-concluidas')
const btnRemoverTodas = document.querySelector('#btn-remover-todas')

const btnCancelarTarefa = document.querySelector('.app__form-footer__button--cancel')

let tarefas = JSON.parse(localStorage.getItem('tarefas')) || []

function atualizarTarefas() {
    localStorage.setItem('tarefas', JSON.stringify(tarefas))
}

// Função para criar um elemento de tarefa na lista de tarefas 
// A função criarElementoTarefa recebe um objeto tarefa como parâmetro e cria um elemento de lista (li) que representa essa tarefa na interface do usuário.
// Dentro da função, são criados vários elementos HTML, como um ícone SVG, um parágrafo para a descrição da tarefa e um botão de edição.
function criarElementoTarefa(tarefa) {
    const li = document.createElement('li')
    li.classList.add('app__section-task-list-item')

    const svg = document.createElement('svg')
    svg.innerHTML = `
        <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
            <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
        </svg>
    `
    const paragrafo = document.createElement('p')
    paragrafo.textContent = tarefa.descricao
    paragrafo.classList.add('app__section-task-list-item-description')

    const botao = document.createElement('button')
    botao.classList.add('app_button-edit')
    botao.onclick = () => {
        const novaDescricao = prompt("Qual é o novo nome da tarefa?")
        if (novaDescricao) {
            paragrafo.textContent = novaDescricao
            tarefa.descricao = novaDescricao
            atualizarTarefas()
        } 
    }

    const imagemBotao = document.createElement('img')
    imagemBotao.setAttribute('src', './imagens/edit.png')
    botao.append(imagemBotao)
    // append adiciona um nó ao final da lista de filhos de um nó pai especificado.
    // Aqui, o botão é adicionado como filho do elemento li.
    li.append(svg)
    li.append(paragrafo)
    li.append(botao)

    // Se a tarefa estiver marcada como completa, adicionamos a classe 'app__section-task-list-item-complete' ao elemento li
    // e desabilitamos o botão de edição para impedir futuras alterações.
    if (tarefa.completa) {
        li.classList.add("app__section-task-list-item-complete")
        botao.setAttribute('disabled', 'disabled')
    } else {
        li.onclick = () => {
            // Aqui removemos a classe 'app__section-task-list-item-active' de todos os elementos que a possuem 
            // e adicionamos essa classe apenas ao elemento li que foi clicado.
            document.querySelectorAll('.app__section-task-list-item-active')
                .forEach(elemento => {
                    elemento.classList.remove('app__section-task-list-item-active')
                })
            // Se a tarefa clicada já estiver selecionada, desmarcamos a seleção 
            // e limpamos a descrição exibida na seção de tarefa ativa.
            if (tarefaSelecionada == tarefa) {
                paragrafoDescricaoTarefa.textContent = "";
                tarefaSelecionada = null;
                liTarefaSelecionada = null;
                return
            }
            // Caso contrário, marcamos a tarefa como selecionada e exibimos sua descrição na seção de tarefa ativa.
            // Isso permite que o usuário veja qual tarefa está atualmente ativa e sua descrição correspondente.
            tarefaSelecionada = tarefa
            liTarefaSelecionada = li
            paragrafoDescricaoTarefa.textContent = tarefa.descricao
            
            li.classList.add('app__section-task-list-item-active')
        }
    }

    return li

}

btnAdicionarTarefa.addEventListener('click', () => {
    // toggle alterna a presença de uma classe em um elemento. 
    // Se a classe estiver presente, ela será removida; se não estiver presente, ela será adicionada. 
    formAdicionarTarefa.classList.toggle('hidden')
});

// Quando o formulário for enviado, a função de callback será executada e o evento de envio será passado como argumento 
// para a função de callback. 
// O método preventDefault() é usado para evitar o comportamento padrão do formulário, que é recarregar a página ao ser enviado. 
// Isso permite que você processe os dados do formulário usando JavaScript sem recarregar a página.
// Dentro da função de callback, um novo objeto tarefa é criado com a descrição obtida do valor do textarea. 
// Esse objeto é então adicionado ao array tarefas usando o método push(). 
// Finalmente, o array tarefas é convertido em uma string JSON usando JSON.stringify() e armazenado no localStorage com a chave 'tarefas'.
formAdicionarTarefa.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const tarefa = {
        descricao: textarea.value
    }
    tarefas.push(tarefa)
    // localStorage é uma forma de armazenar dados no navegador do usuário de forma persistente (no navegador) 
    // Ela armazena dados em pares chave-valor, onde ambos são strings.
    // JSON.stringify converte um objeto JavaScript em uma string JSON. Isso é útil para armazenar objetos complexos em localStorage, que só aceita strings. 
    const elementoTarefa = criarElementoTarefa(tarefa)
    ulTarefas.append(elementoTarefa)
    atualizarTarefas()
    textarea.value = ''
    formAdicionarTarefa.classList.add('hidden')
});

// Itera sobre o array tarefas e para cada tarefa, chama a função criarElementoTarefa para criar o elemento HTML correspondente.
// Em seguida, o elemento criado é adicionado à lista de tarefas (ulTarefas) usando o método append().
// entao, quando a página é carregada, todas as tarefas armazenadas no localStorage são exibidas na interface do usuário. 
tarefas.forEach(tarefa => {
    const elementoTarefa = criarElementoTarefa(tarefa)
    ulTarefas.append(elementoTarefa)
})

// Adiciona um evento de clique ao botão de cancelar tarefa
btnCancelarTarefa.onclick = function() {
    textarea.value = '';
    formAdicionarTarefa.classList.toggle('hidden')
}

// Adiciona um ouvinte de evento personalizado para o evento 'FocoFinalizado'
// Quando o evento 'FocoFinalizado' é disparado, a função de callback é executada.
document.addEventListener('FocoFinalizado', () => {
    // Verifica se há uma tarefa selecionada e um elemento de lista correspondente 
    // Se ambos existirem, a classe 'app__section-task-list-item-active' é removida do elemento de lista selecionado
    // e a classe 'app__section-task-list-item-complete' é adicionada a ele.
    // Além disso, o botão de edição dentro do elemento de lista é desabilitado, impedindo futuras edições.
    if (tarefaSelecionada && liTarefaSelecionada) {
        liTarefaSelecionada.classList.remove("app__section-task-list-item-active")
        liTarefaSelecionada.classList.add("app__section-task-list-item-complete")
        liTarefaSelecionada.querySelector('button').setAttribute('disabled', 'disabled')
        // Aqui atualizamos a propriedade completa da tarefa selecionada para true e chamamos a função atulizarTarefas()
        // para salvar essa alteração no localStorage.
        tarefaSelecionada.completa = true
        atualizarTarefas()
    }
})

// Função para remover tarefas
// A função removerTarefas recebe um parâmetro booleano somenteCompletas. 
// Se esse parâmetro for true, apenas as tarefas marcadas como completas serão removidas; caso contrário, todas as tarefas serão removidas.
const removerTarefas = (somenteCompletas) => {
    const seletor = somenteCompletas ? ".app__section-task-list-item-complete" : '.app__section-task-list-item'
    document.querySelectorAll(seletor).forEach(elemento => {
        elemento.remove()
    })
    // Atualiza o array tarefas removendo as tarefas conforme o parâmetro somenteCompletas 
    tarefas = somenteCompletas ? tarefas.filter(tarefa => !tarefa.completa) : []
    atualizarTarefas()
}

// Adiciona um evento de clique ao botão de remover tarefas concluídas
btnRemoverConcluidas.onclick = () => removerTarefas(true)
// Adiciona um evento de clique ao botão de remover todas as tarefas
btnRemoverTodas.onclick = () => removerTarefas(false)