import * as v from 'valibot';

function createEnv<T extends v.ObjectEntries>(envSchema: T) {
  if (typeof process === 'undefined') {
    throw new Error('process is not available. This function should run in a Node.js environment.');
  }

  type EnvType = v.InferOutput<v.ObjectSchema<T, undefined>>;
  let validated: EnvType | null = null;

  function validate(): EnvType {
    if (validated) return validated;
    if (process.env.SKIP_ENV_VALIDATION) {
      validated = {} as EnvType;
      return validated;
    }
    type EnvKeys = keyof typeof envSchema;
    const envObj = Object.keys(envSchema).reduce(
      (acc, key) => {
        if (key in process.env) {
          acc[key as EnvKeys] = process.env[key];
        }
        return acc;
      },
      {} as Partial<Record<EnvKeys, string>>,
    );
    validated = v.parse(v.object(envSchema), envObj);
    return validated;
  }

  return new Proxy({} as EnvType, {
    get(_, key) {
      return validate()[key as keyof EnvType];
    },
  });
}

export { createEnv };
