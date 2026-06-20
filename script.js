// script.js — funcionalidades: tema, menu responsivo, modal e validação de formulário
(function(){
  // Helpers
  function qs(sel, ctx=document){ return ctx.querySelector(sel) }
  function qsa(sel, ctx=document){ return Array.from(ctx.querySelectorAll(sel)) }

  // Tema (claro/escuro) - armazena em localStorage
  function toggleTheme(){
    const isLight = document.documentElement.classList.toggle('light')
    localStorage.setItem('themeLight', isLight ? '1' : '0')
    updateThemeButton()
  }
  function updateThemeButton(){
    const btns = qsa('.theme-toggle')
    btns.forEach(b => b.textContent = document.documentElement.classList.contains('light') ? '🌞' : '🌙')
  }
  // Inicializa tema salvo
  (function initTheme(){
    const saved = localStorage.getItem('themeLight')
    if(saved === '1') document.documentElement.classList.add('light')
    updateThemeButton()
  })()

  // Menu responsivo
  function toggleNav(navId, toggleBtn){
    const nav = qs(navId)
    if(!nav) return
    nav.classList.toggle('open')
    if(nav.classList.contains('open')) nav.style.display = 'block'
    else nav.style.display = ''
  }

  // Mensagens para usuário
  function showMessage(text, timeout=3000){
    const div = document.createElement('div')
    div.className = 'toast'
    div.textContent = text
    Object.assign(div.style,{position:'fixed',right:'1rem',bottom:'1rem',background:'var(--accent)',color:'#022',padding:'0.6rem 0.9rem',borderRadius:'8px',boxShadow:'0 6px 18px rgba(0,0,0,0.3)'})
    document.body.appendChild(div)
    setTimeout(()=>{div.style.opacity='0';setTimeout(()=>div.remove(),300)}, timeout)
  }

  // Modal de projetos
  function openProjectModal(title, body){
    const modal = qs('#projectModal')
    if(!modal) return
    qs('#modalTitle').textContent = title
    qs('#modalBody').textContent = body
    modal.classList.add('show')
    modal.setAttribute('aria-hidden','false')
  }
  function closeProjectModal(){
    const modal = qs('#projectModal')
    if(!modal) return
    modal.classList.remove('show')
    modal.setAttribute('aria-hidden','true')
  }

  // Validação básica do formulário de contato
  function validateForm(form){
    const name = form.name.value.trim()
    const email = form.email.value.trim()
    const message = form.message.value.trim()
    if(name.length < 2) return 'Por favor insira um nome válido.'
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Por favor insira um e-mail válido.'
    if(message.length < 6) return 'A mensagem deve ter ao menos 6 caracteres.'
    return ''
  }

  // Eventos DOMContentLoaded
  document.addEventListener('DOMContentLoaded', function(){
    // theme toggles
    qsa('.theme-toggle').forEach(btn => btn.addEventListener('click', toggleTheme))

    // nav toggles (vários por página)
    qsa('.nav-toggle').forEach((btn, i) => {
      const nav = btn.nextElementSibling || '#mainNav'
      btn.addEventListener('click', ()=>{
        // find closest nav on the page
        const nearestNav = btn.parentElement.querySelector('.nav')
        if(nearestNav) toggleNav('#' + nearestNav.id, btn)
        else toggleNav(nav, btn)
      })
    })

    // Projects modal
    qsa('.card .btn').forEach(b => {
      b.addEventListener('click', (e)=>{
        const key = b.dataset.project
        if(key === 'adm') openProjectModal('ADM Manager', 'Projeto full-stack em desenvolvimento. Tecnologias: HTML, CSS, JavaScript, backend com Java (em estudo).')
        else if(key === 'js-exercises') openProjectModal('Exercícios JavaScript', 'Conjunto de exercícios que demonstram manipulação do DOM, eventos e lógica em JavaScript.')
        else if(key === 'sql-exercises') openProjectModal('Exercícios SQL', 'Consultas, modelagem e scripts SQL realizados em disciplina de Banco de Dados.')
      })
    })

    qs('#modalClose') && qs('#modalClose').addEventListener('click', closeProjectModal)
    qs('#projectModal') && qs('#projectModal').addEventListener('click', function(e){ if(e.target === this) closeProjectModal() })

    // Form submit
    const form = qs('#contactForm')
    if(form){
      form.addEventListener('submit', function(e){
        e.preventDefault()
        const err = validateForm(form)
        const feedback = qs('#formFeedback')
        if(err){
          feedback.textContent = err
          feedback.style.color = 'var(--accent)'
          return
        }
        // Simula envio
        feedback.textContent = 'Enviando mensagem...'
        setTimeout(()=>{
          feedback.textContent = 'Mensagem enviada com sucesso. Obrigado!'
          form.reset()
          showMessage('Mensagem enviada com sucesso')
        }, 900)
      })
    }

    // Small accessibility: close modal on ESC
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeProjectModal() })
  })

  // Expose some functions for testing/debugging (not strictly necessary)
  window.portfolio = {toggleTheme, openProjectModal, closeProjectModal, showMessage}

})();
