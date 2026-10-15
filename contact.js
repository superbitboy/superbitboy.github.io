'use strict';

const contactForm = document.querySelector('#contact-form');
const feedback = document.querySelector('#form-feedback');
const submitButton = contactForm.querySelector('button[type="submit"]');

function showError(message) {
  feedback.replaceChildren(document.createTextNode(message + ' '));
  const emailLink = document.createElement('a');
  emailLink.href = 'mailto:superbitboy85@gmail.com';
  emailLink.textContent = 'Email Super Bit Boy directly';
  feedback.append(emailLink, document.createTextNode('.'));
  feedback.hidden = false;
  feedback.focus();
}

contactForm.addEventListener('submit', async event => {
  // Older browsers retain the normal HTML POST and email-field Reply-To fallback.
  if (!window.fetch || !window.AbortController) return;
  event.preventDefault();
  if (!contactForm.reportValidity()) return;
  if (contactForm.elements.namedItem('_honey').value) return;

  feedback.hidden = true;
  submitButton.disabled = true;
  submitButton.textContent = 'Sending your message…';
  contactForm.setAttribute('aria-busy', 'true');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);

  try {
    const fields = Object.fromEntries(new FormData(contactForm));
    fields.email = fields.email.trim();
    fields._replyto = fields.email;
    const response = await fetch(contactForm.action.replace('formsubmit.co/', 'formsubmit.co/ajax/'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(fields),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error('Submission was not accepted');
    const result = await response.json();
    if (/activat|confirm.*email|check.*email/i.test(result.message || '')) {
      showError('The contact form is still being set up, so your message has not been delivered.');
      return;
    }
    if (String(result.success).toLowerCase() !== 'true') throw new Error('Submission was not confirmed');
    window.location.assign('thanks.html');
  } catch {
    showError('We couldn’t confirm your message was sent. Your text is still here. Please try again, or');
  } finally {
    clearTimeout(timeout);
    submitButton.disabled = false;
    submitButton.replaceChildren(document.createTextNode('Send message '));
    const arrow = document.createElement('span');
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = '↗';
    submitButton.append(arrow);
    contactForm.removeAttribute('aria-busy');
  }
});

document.querySelector('#year').textContent = String(new Date().getFullYear());
