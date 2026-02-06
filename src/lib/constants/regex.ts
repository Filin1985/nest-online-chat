const PASSWORD_RULE: RegExp = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;

interface RegexRules {
  readonly PASSWORD_RULE: RegExp;
}

const REGEX: RegexRules = {
  PASSWORD_RULE,
};

export default REGEX;
