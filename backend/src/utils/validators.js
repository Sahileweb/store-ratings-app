const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>_\-+=]).{8,16}$/;

function validateName(name) {
  if (typeof name !== 'string') return 'Name is required';
  const trimmed = name.trim();
  if (trimmed.length < 5|| trimmed.length > 60) {
    return 'Name must be between 5 and 60 characters';
  }
  return null;
}

function validateAddress(address) {
  if (typeof address !== 'string' || address.trim().length === 0) {
    return 'Address is required';
  }
  if (address.length > 400) {
    return 'Address must not exceed 400 characters';
  }
  return null;
}

function validateEmail(email) {
  if (typeof email !== 'string' || !EMAIL_REGEX.test(email)) {
    return 'A valid email address is required';
  }
  return null;
}

function validatePassword(password) {
  if (typeof password !== 'string' || !PASSWORD_REGEX.test(password)) {
    return 'Password must be 8-16 characters and include at least one uppercase letter and one special character';
  }
  return null;
}

function validateRating(rating) {
  const num = Number(rating);
  if (!Number.isInteger(num) || num < 1 || num > 5) {
    return 'Rating must be an integer between 1 and 5';
  }
  return null;
}

function validateSignupPayload(body) {
  const errors = {};
  const nameErr = validateName(body.name);
  const emailErr = validateEmail(body.email);
  const addressErr = validateAddress(body.address);
  const passwordErr = validatePassword(body.password);
  if (nameErr) errors.name = nameErr;
  if (emailErr) errors.email = emailErr;
  if (addressErr) errors.address = addressErr;
  if (passwordErr) errors.password = passwordErr;
  return errors;
}

module.exports = {
  validateName,
  validateAddress,
  validateEmail,
  validatePassword,
  validateRating,
  validateSignupPayload,
};
