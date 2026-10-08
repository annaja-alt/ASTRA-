const tabs = [...document.querySelectorAll('[role="tab"]')];
let registering = false;
function setMode(register) {
  registering = register;
  tabs.forEach((tab, index) => {
    const active = index === Number(register);
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
  });
  document.querySelector('#auth-panel').setAttribute('aria-labelledby', register ? 'register-tab' : 'login-tab');
  document.querySelector('#name-field').hidden = !register;
  document.querySelector('#name').required = register;
  document.querySelector('#password').autocomplete = register ? 'new-password' : 'current-password';
  document.querySelector('#auth-title').textContent = register ? 'Comece sua jornada.' : 'Bem-vinda de volta.';
  document.querySelector('#auth-subtitle').textContent = register ? 'Encontre clareza na sua rotina acadêmica.' : 'Continue sua jornada acadêmica.';
  document.querySelector('#submit-label').textContent = register ? 'Cadastrar' : 'Entrar';
  document.querySelector('#forgot-password').hidden = register;
  document.querySelector('#footer-label').textContent = register ? 'Já tem uma conta?' : 'Não tem uma conta?';
  document.querySelector('#switch-auth').textContent = register ? 'Entrar' : 'Criar uma conta';
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => setMode(Boolean(index)));
  tab.addEventListener('keydown', event => {
    if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? 1 : 1 - index;
      setMode(Boolean(next)); tabs[next].focus();
    }
  });
});
document.querySelector('#switch-auth').addEventListener('click', () => setMode(!registering));
setMode(new URLSearchParams(location.search).get('modo') === 'cadastro');
// Somente demonstração: não envia nem armazena e-mail/senha.
document.querySelector('#auth-panel').addEventListener('submit', event => {
  event.preventDefault();
  if (event.currentTarget.reportValidity()) {
    event.currentTarget.reset();
    location.href = 'dashboard.html';
  }
});
const recovery = document.querySelector('#recovery-dialog');
document.querySelector('#forgot-password').addEventListener('click', () => recovery.showModal());
recovery.querySelector('.dialog-close').addEventListener('click', () => recovery.close());
document.querySelector('#close-recovery').addEventListener('click', () => recovery.close());