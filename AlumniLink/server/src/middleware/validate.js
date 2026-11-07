// Small request validator used by routes. Rules return field messages instead of a schema library.
export const validate = (rules, source = 'body') => (req, res, next) => {
  const value = req[source] || {};
  const errors = typeof rules.safeParse === 'function'
    ? (rules.safeParse(value).success ? [] : rules.safeParse(value).error.errors)
    : rules(value);
  if (errors.length) {
    return res.status(400).json({ success: false, message: 'Please check the entered details', errors });
  }
  next();
};
export const required = (value) => String(value ?? '').trim().length > 0;
export const validEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || ''));
export const validUrlOrEmpty = (value) => !value || /^https?:\/\//i.test(value);
export const passwordErrors = (password) => {
 const errors=[]; if(String(password||'').length<8)errors.push({field:'password',message:'Password must be at least 8 characters'});
 if(!/[A-Za-z]/.test(password||'')||!/[0-9]/.test(password||''))errors.push({field:'password',message:'Password must include a letter and a number'}); return errors;
};
