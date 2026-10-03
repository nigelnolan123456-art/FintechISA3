// Mobile menu
const menuBtn = document.getElementById("menu-btn");
const menu = document.getElementById("menu");
if (menuBtn && menu) {
  menuBtn.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open);
  });
}

// Tidio's public install key enables the site-wide chat widget.
const tidioPublicKey = "kqpiwhwkcrt9gwrwedpdiwvfnurvclsb";
if (/^[a-z0-9]+$/i.test(tidioPublicKey)) {
  const tidioScript = document.createElement("script");
  tidioScript.src = "https://code.tidio.co/" + tidioPublicKey + ".js";
  tidioScript.async = true;
  document.body.append(tidioScript);
}

const sampleBalance = "₹48,250";
document.querySelectorAll("[data-balance-toggle]").forEach((button) => {
  button.addEventListener("click", () => {
    const balance = document.getElementById(button.getAttribute("aria-controls"));
    if (!balance) return;

    const visible = button.getAttribute("aria-pressed") !== "true";
    balance.textContent = visible ? sampleBalance : "₹•••••";
    button.setAttribute("aria-pressed", String(visible));
    button.textContent = visible ? (button.dataset.balanceHideLabel || "Hide balance") : (button.dataset.balanceShowLabel || "Show balance");
  });
});

// Demo account-linking flow. A real connection requires a secure banking provider.
const accountForm = document.getElementById("account-connect-form");
const accountList = document.getElementById("account-list");
const emptyAccounts = document.getElementById("empty-accounts");
const accountMessage = document.getElementById("account-message");
if (accountForm && accountList && emptyAccounts && accountMessage) {
  const linkedAccounts = new Set();

  const updateEmptyState = () => {
    emptyAccounts.hidden = linkedAccounts.size > 0;
  };

  accountForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const provider = document.getElementById("account-provider");
    const accountType = document.getElementById("account-type");
    const consent = document.getElementById("account-consent");
    if (!provider || !accountType || !consent) return;
    if (!consent.checked) {
      accountMessage.textContent = "Please authorize read-only access to continue.";
      return;
    }

    const accountName = provider.value + " · " + accountType.value;
    if (linkedAccounts.has(accountName)) {
      accountMessage.textContent = "That demo account is already connected.";
      return;
    }

    linkedAccounts.add(accountName);
    const item = document.createElement("li");
    item.className = "account-item";
    const details = document.createElement("div");
    const name = document.createElement("strong");
    name.textContent = accountName;
    const status = document.createElement("span");
    status.textContent = "Demo account · Read-only access";
    details.append(name, status);

    const disconnectButton = document.createElement("button");
    disconnectButton.className = "disconnect-btn";
    disconnectButton.type = "button";
    disconnectButton.textContent = "Disconnect";
    disconnectButton.setAttribute("aria-label", "Disconnect " + accountName);
    disconnectButton.addEventListener("click", () => {
      linkedAccounts.delete(accountName);
      item.remove();
      updateEmptyState();
      accountMessage.textContent = accountName + " disconnected.";
    });

    item.append(details, disconnectButton);
    accountList.append(item);
    updateEmptyState();
    accountMessage.textContent = accountName + " connected in demo mode with read-only access.";
    accountForm.reset();
  });
}

const inr = (n) => "₹" + Math.round(n).toLocaleString("en-IN");
const demoBalanceInput = document.getElementById("demo-account-balance");
const calcBalanceToggles = document.querySelectorAll("[data-calc-balance-toggle]");
const maskedBalance = "₹•••••";
const getNumber = (id) => {
  const input = document.getElementById(id);
  return input instanceof HTMLInputElement ? input.valueAsNumber : Number.NaN;
};

const updateDemoBalances = () => {
  const validBalance = demoBalanceInput && Number.isFinite(demoBalanceInput.valueAsNumber) && demoBalanceInput.valueAsNumber >= 0;
  const balanceText = validBalance ? inr(demoBalanceInput.valueAsNumber) : maskedBalance;
  document.querySelectorAll("[data-demo-balance]").forEach((button) => {
    const output = document.getElementById(button.dataset.demoBalance);
    if (!output) return;
    output.dataset.balanceValue = balanceText;
    output.textContent = button.getAttribute("aria-pressed") === "true" ? balanceText : maskedBalance;
  });
};

calcBalanceToggles.forEach((button) => {
  button.addEventListener("click", () => {
    const output = document.getElementById(button.dataset.demoBalance);
    if (!output) return;
    const visible = button.getAttribute("aria-pressed") !== "true";
    output.textContent = visible ? output.dataset.balanceValue || maskedBalance : maskedBalance;
    button.setAttribute("aria-pressed", String(visible));
    button.textContent = visible ? button.dataset.hideLabel || "Hide" : button.dataset.showLabel || "Show";
  });
});

if (demoBalanceInput) {
  updateDemoBalances();
  demoBalanceInput.addEventListener("input", updateDemoBalances);
}

// EMI calculator: EMI = P * r * (1+r)^n / ((1+r)^n - 1)
const emiBtn = document.getElementById("emi-btn");
const calculateEmi = () => {
  const P = getNumber("emi-amount");
  const annual = getNumber("emi-rate");
  const years = getNumber("emi-years");
  const out = document.getElementById("emi-result");
  if (!out) return;
  if (!(P > 0) || !(annual >= 0) || !(years > 0)) {
    out.innerHTML = '<span class="error">Enter a loan amount, interest rate and number of years.</span>';
    return;
  }
  const n = years * 12;
  const r = annual / 12 / 100;
  const emi = r === 0 ? P / n : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const total = emi * n;
  out.innerHTML =
    "Monthly EMI: <strong>" + inr(emi) + "</strong> · Total interest: " +
    inr(total - P) + " · Total payment: " + inr(total);
};
if (emiBtn) {
  emiBtn.addEventListener("click", calculateEmi);
  ["emi-amount", "emi-rate", "emi-years"].forEach((id) => {
    document.getElementById(id)?.addEventListener("input", calculateEmi);
  });
}

// Savings calculator: FV = M * ((1+r)^n - 1) / r
const savBtn = document.getElementById("sav-btn");
const calculateSavings = () => {
  const M = getNumber("sav-monthly");
  const annual = getNumber("sav-rate");
  const years = getNumber("sav-years");
  const out = document.getElementById("sav-result");
  if (!out) return;
  if (!(M > 0) || !(annual >= 0) || !(years > 0)) {
    out.innerHTML = '<span class="error">Enter a monthly amount, expected return and number of years.</span>';
    return;
  }
  const n = years * 12;
  const r = annual / 12 / 100;
  const fv = r === 0 ? M * n : (M * (Math.pow(1 + r, n) - 1)) / r;
  out.innerHTML =
    "You could have <strong>" + inr(fv) + "</strong> · You put in " +
    inr(M * n) + " and earn about " + inr(fv - M * n) + " in returns.";
};
if (savBtn) {
  savBtn.addEventListener("click", calculateSavings);
  ["sav-monthly", "sav-rate", "sav-years"].forEach((id) => {
    document.getElementById(id)?.addEventListener("input", calculateSavings);
  });
}

calculateEmi();
calculateSavings();

// Contact form (demo only – nothing is sent anywhere)
const form = document.getElementById("contact-form");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const msg = document.getElementById("form-msg");
    if (msg) {
      msg.style.display = "block";
      msg.textContent = "Message sent. This is a demo form, so nothing was actually submitted.";
    }
    form.reset();
  });
}
