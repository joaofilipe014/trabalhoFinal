// script.js — funcionalidades: tema, menu responsivo, modal e validação de formulário

(function () {

  // Retorna o primeiro elemento encontrado
  function selecionar(seletor, contexto = document) {
    return contexto.querySelector(seletor);
  }

  // Retorna todos os elementos encontrados
  function selecionarTodos(seletor, contexto = document) {
    return Array.from(contexto.querySelectorAll(seletor));
  }

  // Tema claro/escuro
  function alternarTema() {
    const temaClaroAtivo =
      document.documentElement.classList.toggle('light');

    localStorage.setItem(
      'themeLight',
      temaClaroAtivo ? '1' : '0'
    );
    atualizarBotaoTema();
  }

  function atualizarBotaoTema() {
    const botoesTema = selecionarTodos('.theme-toggle');

    botoesTema.forEach(botao => {
      botao.textContent =
        document.documentElement.classList.contains('light')
          ? '🌞'
          : '🌙';
    });
  }

  // Carrega o tema salvo anteriormente
  (function inicializarTema() {
    const temaSalvo = localStorage.getItem('themeLight');

    if (temaSalvo === '1') {
      document.documentElement.classList.add('light');
    }
    atualizarBotaoTema();
  })();

  // Menu responsivo
  function alternarMenu(idMenu) {
    const menu = selecionar(idMenu);

    if (!menu) return;

    menu.classList.toggle('open');

    if (menu.classList.contains('open')) {
      menu.style.display = 'block';
    } else {
      menu.style.display = '';
    }
  }

  // Exibe mensagens temporárias para o usuário
  function mostrarMensagem(texto, tempo = 3000) {
    const mensagem = document.createElement('div');

    mensagem.className = 'toast';
    mensagem.textContent = texto;

    Object.assign(mensagem.style, {
      position: 'fixed',
      right: '1rem',
      bottom: '1rem',
      background: 'var(--accent)',
      color: '#022',
      padding: '0.6rem 0.9rem',
      borderRadius: '8px',
      boxShadow: '0 6px 18px rgba(0,0,0,0.3)'
    });

    document.body.appendChild(mensagem);

    setTimeout(() => {
      mensagem.style.opacity = '0';

      setTimeout(() => {
        mensagem.remove();
      }, 300);

    }, tempo);
  }

  // Modal dos projetos
  function abrirModalProjeto(titulo, descricao) {
    const modal = selecionar('#projectModal');

    if (!modal) return;
    selecionar('#modalTitle').textContent = titulo;
    selecionar('#modalBody').textContent = descricao;

    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
  }

  function fecharModalProjeto() {
    const modal = selecionar('#projectModal');

    if (!modal) return;

    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
  }
  // Validação do formulário

  function validarFormulario(formulario) {
    const nome = formulario.name.value.trim();
    const email = formulario.email.value.trim();
    const mensagem = formulario.message.value.trim();

    if (nome.length < 2) {
      return 'Por favor insira um nome válido.';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Por favor insira um e-mail válido.';
    }

    if (mensagem.length < 6) {
      return 'A mensagem deve ter ao menos 6 caracteres.';
    }
    return '';
  }

  // Executa quando a página termina de carregar
  document.addEventListener('DOMContentLoaded', function () {

    // Botões de troca de tema
    selecionarTodos('.theme-toggle').forEach(botao => {
      botao.addEventListener('click', alternarTema);
    });

    // Botões do menu responsivo
    selecionarTodos('.nav-toggle').forEach(botao => {

      botao.addEventListener('click', () => {

        const menuMaisProximo =
          botao.parentElement.querySelector('.nav');

        if (menuMaisProximo) {
          alternarMenu('#' + menuMaisProximo.id);
        }
      });
    });

    // Botões dos projetos
    selecionarTodos('.card .btn').forEach(botao => {

      botao.addEventListener('click', () => {

        const projeto = botao.dataset.project;

        if (projeto === 'adm') {

          abrirModalProjeto(
            'ADM Manager',
            'Projeto full-stack em desenvolvimento. Tecnologias: HTML, CSS, JavaScript e backend com Java.'
          );

        } else if (projeto === 'js-exercises') {

          abrirModalProjeto(
            'Exercícios JavaScript',
            'Conjunto de exercícios que demonstram manipulação do DOM, eventos e lógica em JavaScript.'
          );
        } else if (projeto === 'sql-exercises') {

          abrirModalProjeto(
            'Exercícios SQL',
            'Consultas, modelagem e scripts SQL realizados durante os estudos de Banco de Dados.'
          );
        }
      });
    });

    // Fechamento do modal
    const botaoFecharModal = selecionar('#modalClose');

    if (botaoFecharModal) {
      botaoFecharModal.addEventListener(
        'click',
        fecharModalProjeto
      );
    }
    const modalProjeto = selecionar('#projectModal');

    if (modalProjeto) {
      modalProjeto.addEventListener('click', function (evento) {

        if (evento.target === this) {
          fecharModalProjeto();
        }
      });
    }

    // Envio do formulário
    const formularioContato = selecionar('#contactForm');
    if (formularioContato) {

      formularioContato.addEventListener('submit', function (evento) {

        evento.preventDefault();

        const erro = validarFormulario(formularioContato);
        const feedback = selecionar('#formFeedback');

        if (erro) {
          feedback.textContent = erro;
          feedback.style.color = 'var(--accent)';
          return;
        }

        feedback.textContent = 'Enviando mensagem...';

        setTimeout(() => {

          feedback.textContent =
            'Mensagem enviada com sucesso. Obrigado!';

          formularioContato.reset();

          mostrarMensagem(
            'Mensagem enviada com sucesso'
          );
        }, 900);
      });
    }

    // Fecha o modal ao pressionar ESC
    document.addEventListener('keydown', function (evento) {

      if (evento.key === 'Escape') {
        fecharModalProjeto();
      }
    });
  });
})();
