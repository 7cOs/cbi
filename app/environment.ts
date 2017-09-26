// defined at compile time by webpack's DefinePlugin
const ENV_VARS = process.env;

export class Environment {
  static isLocal(): boolean {
    return ENV_VARS.NODE_ENV === 'local';
  }

  static debugGoogleAnalytics(): boolean {
    return ENV_VARS.DEBUG_GOOGLE_ANALYTICS === 'true';
  }

  static getIQLink(): string {
    return ENV_VARS.IQ_LINK;
  }
}
