interface Config {
  JWT_SECRET: string;
  DB_URL: string;
  PORT: number;
  GCAI_URL: string;
  GCAI_TOKEN: string;
  OIDC_CLIENT_ID: string;
  OIDC_CLIENT_SECRET: string;
}

const config: Config = {
  JWT_SECRET: process.env.JWT_SECRET!.trim(),
  DB_URL: process.env.DATABASE_URL!.trim(),
  PORT: Number(process.env.PORT) || 80,
  GCAI_URL: process.env.GCAI_URL!.trim(),
  GCAI_TOKEN: process.env.GCAI_TOKEN!.trim(),
  OIDC_CLIENT_ID: process.env.OIDC_CLIENT_ID!.trim(),
  OIDC_CLIENT_SECRET: process.env.OIDC_CLIENT_SECRET?.trim() || '',
};

export default config;
