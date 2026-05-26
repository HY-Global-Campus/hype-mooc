interface Config {
  JWT_SECRET: string;
  DB_URL: string;
  PORT: number;
  GCAI_URL: string;
  GCAI_TOKEN: string;
  OIDC_ISSUER_URL: string;
  OIDC_CLIENT_ID: string;
  OIDC_CLIENT_SECRET: string;
  NODE_ENV: string;
  DEV_AUTH_BYPASS: boolean;
}

const config: Config = {
  JWT_SECRET: process.env.JWT_SECRET!.trim(),
  DB_URL: process.env.DATABASE_URL!.trim(),
  PORT: Number(process.env.PORT) || 80,
  GCAI_URL: process.env.GCAI_URL!.trim(),
  GCAI_TOKEN: process.env.GCAI_TOKEN!.trim(),
  OIDC_ISSUER_URL: (process.env.OIDC_ISSUER_URL || 'https://courses.mooc.fi/api/v0/main-frontend/oauth').trim(),
  OIDC_CLIENT_ID: process.env.OIDC_CLIENT_ID!.trim(),
  OIDC_CLIENT_SECRET: process.env.OIDC_CLIENT_SECRET?.trim() || '',
  NODE_ENV: process.env.NODE_ENV || 'production',
  DEV_AUTH_BYPASS: process.env.DEV_AUTH_BYPASS === 'true',
};

export const isDevAuthBypassEnabled = (): boolean =>
  config.NODE_ENV === 'development' && config.DEV_AUTH_BYPASS;

export default config;
