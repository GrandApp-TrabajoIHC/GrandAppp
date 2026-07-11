function isEmailValid(email) {

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isDniValid(dni) {
  //  8 dígitos 
  return /^\d{8}$/.test(dni.trim());
}

function isPhoneValid(phone) {
  
  const cleaned = phone.replace(/\s+/g, '');
  return /^(\+51)?9\d{8}$/.test(cleaned);
}

function isPasswordValid(pw) {
  
  return /^(?=.{8,}$)(?=.*[A-Za-z])(?=.*\d).*$/.test(pw);
}


function createErrorElement(message) {
  const el = document.createElement('div');
  el.className = 'validation-error';
  el.setAttribute('role', 'alert');
  el.style.color = '#b00020';
  el.style.fontSize = '13px';
  el.style.marginTop = '6px';
  el.textContent = message;
  return el;
}

function showError(input, message) {
  clearError(input);
  input.setAttribute('aria-invalid', 'true');
  const err = createErrorElement(message);
  err.dataset.validationFor = input.name || input.id || 'input';
  
  if (input.parentNode) {
    input.parentNode.appendChild(err);
  } else {
    input.insertAdjacentElement('afterend', err);
  }
}

function clearError(input) {
  input.removeAttribute('aria-invalid');
  const parent = input.parentNode;
  if (!parent) return;
  const existing = parent.querySelectorAll('.validation-error');
  existing.forEach(e => {
    if (e.dataset.validationFor === (input.name || input.id || 'input')) {
      e.remove();
    }
  });
}

function clearAllErrors(form) {
  const errors = form.querySelectorAll('.validation-error');
  errors.forEach(e => e.remove());
  const invalids = form.querySelectorAll('[aria-invalid="true"]');
  invalids.forEach(i => i.removeAttribute('aria-invalid'));
}

/* 
   Registro: validación
    */
function setupRegistroValidation() {
  const page = document.querySelector('#page-registro');
  
  const form = page ? page.querySelector('form') : document.querySelector('form[action="#"], form.card, form');
  if (!form) return;

  const inputNombre = form.querySelector('input[name="nombre"]');
  const inputDni = form.querySelector('input[name="dni"]');
  const inputTelefono = form.querySelector('input[name="telefono"]');
  const inputEmail = form.querySelector('input[name="email"]');
  const inputPassword = form.querySelector('input[name="password"]');
  const inputTerminos = form.querySelector('input[name="terminos"]');

  // Validación en tiempo real (blur / input)
  if (inputNombre) {
    inputNombre.addEventListener('blur', () => {
      clearError(inputNombre);
      if (!inputNombre.value.trim()) showError(inputNombre, 'El nombre completo es obligatorio.');
    });
  }

  if (inputDni) {
    inputDni.addEventListener('blur', () => {
      clearError(inputDni);
      if (!inputDni.value.trim()) showError(inputDni, 'El DNI es obligatorio.');
      else if (!isDniValid(inputDni.value)) showError(inputDni, 'El DNI debe tener 8 dígitos.');
    });
  }

  if (inputTelefono) {
    inputTelefono.addEventListener('blur', () => {
      clearError(inputTelefono);
      if (!inputTelefono.value.trim()) showError(inputTelefono, 'El teléfono es obligatorio.');
      else if (!isPhoneValid(inputTelefono.value)) showError(inputTelefono, 'Número inválido. Use +51 o 9XXXXXXXX.');
    });
  }

  if (inputEmail) {
    inputEmail.addEventListener('blur', () => {
      clearError(inputEmail);
      if (!inputEmail.value.trim()) showError(inputEmail, 'El correo es obligatorio.');
      else if (!isEmailValid(inputEmail.value)) showError(inputEmail, 'Correo electrónico inválido.');
    });
    // validación mientras escribe 
    inputEmail.addEventListener('input', () => {
      if (inputEmail.value && isEmailValid(inputEmail.value)) clearError(inputEmail);
    });
  }

  if (inputPassword) {
    inputPassword.addEventListener('blur', () => {
      clearError(inputPassword);
      if (!inputPassword.value) showError(inputPassword, 'La contraseña es obligatoria.');
      else if (!isPasswordValid(inputPassword.value)) showError(inputPassword, 'La contraseña debe tener mínimo 8 caracteres, incluir letras y números.');
    });
    inputPassword.addEventListener('input', () => {
      if (inputPassword.value && isPasswordValid(inputPassword.value)) clearError(inputPassword);
    });
  }

  // Submit
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearAllErrors(form);
    const errors = [];

    if (inputNombre && !inputNombre.value.trim()) {
      errors.push({ el: inputNombre, msg: 'El nombre completo es obligatorio.' });
    }

    if (inputDni) {
      if (!inputDni.value.trim()) errors.push({ el: inputDni, msg: 'El DNI es obligatorio.' });
      else if (!isDniValid(inputDni.value)) errors.push({ el: inputDni, msg: 'El DNI debe tener 8 dígitos.' });
    }

    if (inputTelefono) {
      if (!inputTelefono.value.trim()) errors.push({ el: inputTelefono, msg: 'El teléfono es obligatorio.' });
      else if (!isPhoneValid(inputTelefono.value)) errors.push({ el: inputTelefono, msg: 'Número inválido. Use +51 o 9XXXXXXXX.' });
    }

    if (inputEmail) {
      if (!inputEmail.value.trim()) errors.push({ el: inputEmail, msg: 'El correo es obligatorio.' });
      else if (!isEmailValid(inputEmail.value)) errors.push({ el: inputEmail, msg: 'Correo electrónico inválido.' });
    }

    if (inputPassword) {
      if (!inputPassword.value) errors.push({ el: inputPassword, msg: 'La contraseña es obligatoria.' });
      else if (!isPasswordValid(inputPassword.value)) errors.push({ el: inputPassword, msg: 'La contraseña debe tener mínimo 8 caracteres, incluir letras y números.' });
    }

    if (inputTerminos && !inputTerminos.checked) {
      // Mostrar error junto al checkbox
      errors.push({ el: inputTerminos, msg: 'Debes aceptar los términos y la política de privacidad.' });
    }

    if (errors.length) {
      // Mostrar errores y enfocar el primero
      errors.forEach(err => showError(err.el, err.msg));
      const first = errors[0].el;
      if (first.focus) first.focus();
      return;
    }

    
    form.querySelectorAll('input').forEach(i => {
      if (i.type !== 'checkbox') i.value = '';
      else i.checked = false;
    });
    alert('Cuenta creada correctamente (simulado).');
    window.location.href = 'page-login.html';
  });
}

/* 
   Login: validación
    */
function setupLoginValidation() {
  const page = document.querySelector('#page-login');
  const form = page ? page.querySelector('form') : document.querySelector('form.login, form.card, form');
  if (!form) return;

  const inputEmail = form.querySelector('input[name="email"]') || form.querySelector('input[type="email"]');
  const inputPassword = form.querySelector('input[name="password"]') || form.querySelector('input[type="password"]');

  if (inputEmail) {
    inputEmail.addEventListener('blur', () => {
      clearError(inputEmail);
      if (!inputEmail.value.trim()) showError(inputEmail, 'El correo es obligatorio.');
      else if (!isEmailValid(inputEmail.value)) showError(inputEmail, 'Correo electrónico inválido.');
    });
  }

  if (inputPassword) {
    inputPassword.addEventListener('blur', () => {
      clearError(inputPassword);
      if (!inputPassword.value) showError(inputPassword, 'La contraseña es obligatoria.');
    });
  }

  
  const toggle = form.querySelector('.toggle-password');
  if (toggle && inputPassword) {
    toggle.style.cursor = 'pointer';
    toggle.addEventListener('click', () => {
      const type = inputPassword.getAttribute('type') === 'password' ? 'text' : 'password';
      inputPassword.setAttribute('type', type);
      toggle.setAttribute('aria-pressed', type === 'text' ? 'true' : 'false');
      toggle.textContent = type === 'text' ? 'Ocultar contraseña' : 'Mostrar contraseña';
    });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearAllErrors(form);
    const errors = [];

    if (inputEmail) {
      if (!inputEmail.value.trim()) errors.push({ el: inputEmail, msg: 'El correo es obligatorio.' });
      else if (!isEmailValid(inputEmail.value)) errors.push({ el: inputEmail, msg: 'Correo electrónico inválido.' });
    }

    if (inputPassword) {
      if (!inputPassword.value) errors.push({ el: inputPassword, msg: 'La contraseña es obligatoria.' });
    }

    if (errors.length) {
      errors.forEach(err => showError(err.el, err.msg));
      const first = errors[0].el;
      if (first.focus) first.focus();
      return;
    }

    
    alert('Inicio de sesión correcto (simulado).');
    form.querySelectorAll('input').forEach(i => {
      if (i.type !== 'checkbox') i.value = '';
      else i.checked = false;
    });
    window.location.href = 'page-panel.html';
  });
}

/* 
   Bienvenida: comportamiento
   */
function setupBienvenidaBehavior() {
  const page = document.querySelector('#page-bienvenida');
  const container = page ? page : document;
  
  const btnRegistro = container.querySelector('.btn-dark[href*="registro"], .btn[href*="registro"], a[href="registro.html"], a[href*="registro"]');
  const btnLogin = container.querySelector('.btn-light[href*="login"], .btn[href*="login"], a[href="login.html"], a[href*="login"]');

  
  [btnRegistro, btnLogin].forEach(btn => {
    if (!btn) return;
    btn.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        btn.click();
      }
    });
    btn.addEventListener('click', () => {
      btn.style.transform = 'translateY(0.5px)';
      setTimeout(() => btn.style.transform = '', 120);
    });
  });
}

/* 
   Inicialización al cargar
    */
document.addEventListener('DOMContentLoaded', function () {
  try {
    setupBienvenidaBehavior();
    setupRegistroValidation();
    setupLoginValidation();
  } catch (err) {
   
    console.error('Error inicializando validaciones:', err);
  }
});