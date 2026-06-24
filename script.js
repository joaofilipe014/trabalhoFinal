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

  // Barra de progresso de rolagem
  function atualizarBarraProgresso() {
    const barra = selecionar('#progressBar');
    if (!barra) return;
    const alturaTotal = document.documentElement.scrollHeight - window.innerHeight;
    const percentual = alturaTotal > 0 ? (window.scrollY / alturaTotal) * 100 : 0;
    barra.style.width = `${percentual}%`;
  }

  // Botão de voltar ao topo
  function criarBotaoTopo() {
    const botao = document.createElement('button');
    botao.className = 'back-to-top';
    botao.type = 'button';
    botao.title = 'Voltar ao topo';
    botao.textContent = '↑';
    botao.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    document.body.appendChild(botao);
    return botao;
  }

  function atualizarBotaoTopo(botao) {
    if (window.scrollY > 220) {
      botao.classList.add('show');
    } else {
      botao.classList.remove('show');
    }
  }

  // Modal dos projetos
  const dadosProjetos = {
    adm: {
      title: 'ADM Manager',
      subtitle: 'Projeto full stack em desenvolvimento.',
      description: 'Sistema administrativo em construção para controle de membros, estoque e relatórios. O foco está em uma interface limpa e funcionalidades que facilitam a gestão de processos acadêmicos e administrativos.',
      highlights: [
        'Dashboard responsivo para visualização de indicadores.',
        'Módulos de cadastro e autenticação.',
        'Planejado com HTML, CSS, JavaScript e backend em Java.',
        'Organização pensando em usabilidade e futuro deploy.'
      ],
      technologies: ['HTML', 'CSS', 'JavaScript', 'Java', 'Spring Boot']
    },
    'js-exercises': {
      title: 'Exercícios JavaScript',
      subtitle: 'Prática de DOM, eventos e lógica.',
      description: 'Coleção de pequenos projetos que demonstram manipulação de DOM, validação de formulários e resolução de desafios de programação. Ideal para mostrar como conceitos básicos tornam-se ferramentas reais.',
      highlights: [
        'Validação de formulários e feedback ao usuário.',
        'Uso de eventos para interações dinâmicas.',
        'Componentes simples com estrutura clara e legível.',
        'Foco em código organizado e reutilizável.'
      ],
      technologies: ['HTML', 'CSS', 'JavaScript', 'Git']
    },
    'sql-exercises': {
      title: 'Exercícios SQL',
      subtitle: 'Modelo de dados e consultas.',
      description: 'Trabalhos de banco de dados com modelagem relacional, criação de tabelas e consultas SELECT para extrair informações relevantes. Esse projeto mostra entendimento de como dados são estruturados e consultados.',
      highlights: [
        'Criação de esquemas e tabelas relacionais.',
        'Consultas SQL para filtros e agregações.',
        'Aprendizado de boas práticas de organização de dados.',
        'Preparação para aplicações full stack.'
      ],
      technologies: ['SQL', 'Banco de Dados', 'Modelagem', 'Git']
    }
  };

  const listaProjetos = Object.keys(dadosProjetos);
  let projetoAtual = 0;

  function mostrarDetalhesProjeto(chave) {
    const modal = selecionar('#projectModal');
    const dados = dadosProjetos[chave];
    if (!modal || !dados) return;

    projetoAtual = listaProjetos.indexOf(chave);
    selecionar('#modalTitle').textContent = dados.title;
    selecionar('#modalSubtitle').textContent = dados.subtitle;

    const corpo = selecionar('#modalBody');
    corpo.innerHTML = `
      <p>${dados.description}</p>
      <ul class="modal-highlights">
        ${dados.highlights.map(item => `<li>• ${item}</li>`).join('')}
      </ul>
      <div class="modal-techs">
        ${dados.technologies.map(tech => `<span>${tech}</span>`).join('')}
      </div>
    `;

    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
  }

  function abrirModalProjeto(chave) {
    mostrarDetalhesProjeto(chave);
  }

  function fecharModalProjeto() {
    const modal = selecionar('#projectModal');

    if (!modal) return;

    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
  }

  function projetarAdjacente(direcao) {
    if (direcao === 'next') {
      projetoAtual = Math.min(projetoAtual + 1, listaProjetos.length - 1);
    } else {
      projetoAtual = Math.max(projetoAtual - 1, 0);
    }
    mostrarDetalhesProjeto(listaProjetos[projetoAtual]);
  }

  // Carrossel de cards da página Sobre
  let indiceCarrossel = 0;
  function atualizarCarrossel() {
    const faixa = selecionar('.carousel-track');
    const cartas = selecionar('.carousel-cards');
    if (!faixa || !cartas) return;

    const largura = faixa.offsetWidth;
    cartas.style.transform = `translateX(-${indiceCarrossel * largura}px)`;
  }
  function mudarCard(direcao) {
    const cartas = selecionarTodos('.carousel-card');
    if (!cartas.length) return;

    if (direcao === 'next') {
      indiceCarrossel = Math.min(indiceCarrossel + 1, cartas.length - 1);
    } else {
      indiceCarrossel = Math.max(indiceCarrossel - 1, 0);
    }

    atualizarCarrossel();
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

    // Botão de voltar ao topo
    const botaoTopo = criarBotaoTopo();
    atualizarBotaoTopo(botaoTopo);
    atualizarBarraProgresso();
    window.addEventListener('scroll', () => {
      atualizarBotaoTopo(botaoTopo);
      atualizarBarraProgresso();
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

    // Carrossel da página Sobre
    selecionarTodos('.carousel-btn').forEach(botao => {
      botao.addEventListener('click', function () {
        mudarCard(botao.dataset.direction);
      });
    });
    atualizarCarrossel();

    // Botões dos projetos
    selecionarTodos('.card .btn').forEach(botao => {

      botao.addEventListener('click', () => {
        abrirModalProjeto(botao.dataset.project);
      });
    });

    const botaoPrev = selecionar('#modalPrev');
    const botaoNext = selecionar('#modalNext');

    if (botaoPrev) {
      botaoPrev.addEventListener('click', () => projetarAdjacente('prev'));
    }
    if (botaoNext) {
      botaoNext.addEventListener('click', () => projetarAdjacente('next'));
    }

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
