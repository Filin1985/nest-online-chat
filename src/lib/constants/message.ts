const PASSWORD_RULE_MESSAGE =
  'Password must contain at least one letter, one number and one special character';
const INVALID_EMAIL_OR_PASSWORD = 'Invalid email or password';

interface Messages {
  readonly PASSWORD_RULE_MESSAGE: string;
  readonly INVALID_EMAIL_OR_PASSWORD: string;
}

const MESSAGES: Messages = {
  PASSWORD_RULE_MESSAGE,
  INVALID_EMAIL_OR_PASSWORD,
};

export default MESSAGES;
