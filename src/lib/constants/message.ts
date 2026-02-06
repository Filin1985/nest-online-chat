const PASSWORD_RULE_MESSAGE =
  'Password must contain at least one letter, one number and one special character';

interface Messages {
  readonly PASSWORD_RULE_MESSAGE: string;
}

const MESSAGES: Messages = {
  PASSWORD_RULE_MESSAGE,
};

export default MESSAGES;
