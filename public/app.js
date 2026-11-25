// const form = document.querySelector('#postits-form');
// const formStatus = document.querySelector('#form-status');
// const postitsStatus = document.querySelector('#postits-status');
// const postitsItems = document.querySelector('#postits-items');
const template = document.querySelector('#postit-item-template');
const submitButton = form.querySelector('button[type="submit"]');
const fields = [...form.querySelectorAll('input, textarea')];

function validateField(field) {
  if (field.type === 'text' || field.tagName === 'TEXTAREA') {
    field.setCustomValidity(field.validity.valueMissing || field.value.trim() ? '' : 'Enter a value that is not just whitespace.');
  }
  const valid = field.checkValidity();
  document.getElementById(`${field.id}-error`).textContent = valid ? '' : field.validationMessage;
  if (valid) field.removeAttribute('aria-invalid');
  else field.setAttribute('aria-invalid', 'true');
  return valid;
}

for (const field of fields) {
  field.addEventListener('input', () => validateField(field));
  field.addEventListener('blur', () => validateField(field));
}

async function loadItems() {
  postitsStatus.textContent = 'Loading experiences…';
  try {
    const response = await fetch('/api/postits');
    if (!response.ok) throw new Error('Unable to hear you... Please try again later.');
    const items = await response.json();
    const fragment = document.createDocumentFragment();
    for (const item of items) {
      const node = template.content.cloneNode(true);
      // node.querySelector('.job-title').textContent = item.job_title;
      // node.querySelector('.employer').textContent = item.employer;
      // node.querySelector('.dates').textContent = `${item.start_year} – ${item.end_year ?? 'Present'}`;
      node.querySelector('.accomplishment').textContent = item.accomplishment;
      fragment.append(node);
    }
    postitsItems.replaceChildren(fragment);
    postitsStatus.textContent = items.length ? '' : 'No experiences yet. Add the first one above.';
    return true;
  } catch {
    postitsStatus.textContent = 'Unable to load experiences. Please refresh the page to try again.';
    return false;
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  formStatus.textContent = '';
  const validity = fields.map(validateField);
  if (validity.includes(false)) {
    fields[validity.indexOf(false)].focus();
    return;
  }

  const data = Object.fromEntries(new FormData(form));
  if (!data.end_year) delete data.end_year;
  submitButton.disabled = true;
  formStatus.textContent = 'Saving experience…';
  try {
    const response = await fetch('/api/postits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body.error || 'Unable to save the experience. Please try again.');
    }
    form.reset();
    formStatus.textContent = 'Experience saved.';
    if (!await loadItems()) formStatus.textContent = 'nothing here...';
  } catch (error) {
    formStatus.textContent = error.message || 'Unable to save the experience. Please try again.';
  } finally {
    submitButton.disabled = false;
  }
});

loadItems();
