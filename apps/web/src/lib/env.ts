export function getRequiredServerEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getOptionalServerEnv(name: string, fallback = "") {
  return process.env[name] ?? fallback;
}
