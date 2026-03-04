const menuToggle = document.querySelector(".menu-toggle");
const menuList = document.querySelector(".menu-list");
const menuLinks = document.querySelectorAll(".menu-link");
const themeToggle = document.querySelector(".theme-toggle");
const themeIcon = document.querySelector(".theme-icon");
const root = document.documentElement;

const form = document.querySelector("#contact-form");
const nomeInput = document.querySelector("#nome");
const emailInput = document.querySelector("#email");
const mensagemInput = document.querySelector("#mensagem");
const feedback = document.querySelector("#form-feedback");

function closeMenu() {
  menuList.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}

if (menuToggle && menuList) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuList.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  menuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 860) {
        closeMenu();
      }
    });
  });
}

// Atualiza o link ativo conforme a seção visível.
const sectionIds = ["sobre", "formacao", "portfolio", "contato"];
const sectionElements = sectionIds
  .map((id) => document.getElementById(id))
  .filter(Boolean);

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      menuLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${entry.target.id}`;
        link.classList.toggle("active", isActive);
      });
    });
  },
  {
    root: null,
    threshold: 0.5
  }
);

sectionElements.forEach((section) => sectionObserver.observe(section));

const savedTheme = localStorage.getItem("portfolio-theme");
if (savedTheme === "light" || savedTheme === "dark") {
  root.setAttribute("data-theme", savedTheme);
}

function updateThemeIcon(theme) {
  themeIcon.textContent = theme === "dark" ? "☾" : "☀";
}

updateThemeIcon(root.getAttribute("data-theme"));

themeToggle.addEventListener("click", () => {
  const current = root.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", next);
  localStorage.setItem("portfolio-theme", next);
  updateThemeIcon(next);
});

function setFieldError(input, message) {
  const field = input.closest(".field");
  const errorElement = field.querySelector(".field-error");

  field.classList.toggle("invalid", Boolean(message));
  errorElement.textContent = message;
}

function validateEmail(email) {
  // Regex simples e suficiente para validação de formato no contexto da atividade.
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return pattern.test(email);
}

function validateForm() {
  let isValid = true;

  const nome = nomeInput.value.trim();
  const email = emailInput.value.trim();
  const mensagem = mensagemInput.value.trim();

  if (!nome) {
    setFieldError(nomeInput, "Informe seu nome.");
    isValid = false;
  } else {
    setFieldError(nomeInput, "");
  }

  if (!email) {
    setFieldError(emailInput, "Informe seu e-mail.");
    isValid = false;
  } else if (!validateEmail(email)) {
    setFieldError(emailInput, "Digite um e-mail válido (ex.: usuario@dominio.com).");
    isValid = false;
  } else {
    setFieldError(emailInput, "");
  }

  if (!mensagem) {
    setFieldError(mensagemInput, "Escreva uma mensagem.");
    isValid = false;
  } else if (mensagem.length < 10) {
    setFieldError(mensagemInput, "A mensagem deve ter pelo menos 10 caracteres.");
    isValid = false;
  } else {
    setFieldError(mensagemInput, "");
  }

  return isValid;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  feedback.textContent = "";

  if (!validateForm()) {
    feedback.textContent = "Revise os campos destacados para enviar.";
    return;
  }

  form.reset();
  feedback.textContent = "Mensagem enviada com sucesso!";
  alert("Mensagem enviada com sucesso!");
});

// Revela elementos com animação suave quando entram na tela.
const revealElements = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.2 }
);

revealElements.forEach((element) => revealObserver.observe(element));
