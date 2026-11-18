import * as v from 'valibot';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createEnv } from '../createEnv';

describe('createEnv', () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    originalEnv = { ...process.env };
    // createEnv validates lazily and skips validation when this is set
    delete process.env.SKIP_ENV_VALIDATION;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should correctly extract and validate environment variables', () => {
    process.env.TEST_VAR = 'value';

    const schema = {
      TEST_VAR: v.string(),
    };

    const env = createEnv(schema);
    expect(env.TEST_VAR).toBe('value');
  });

  it('should throw an error if process is not available', () => {
    const originalProcess = global.process;
    // @ts-ignore
    delete global.process;

    const schema = {
      TEST_VAR: v.string(),
    };

    expect(() => createEnv(schema)).toThrow(
      'process is not available. This function should run in a Node.js environment.'
    );

    global.process = originalProcess;
  });

  it('should throw an error if an environment variable is missing', () => {
    delete process.env.MISSING_VAR;

    const schema = {
      MISSING_VAR: v.string(),
    };

    const env = createEnv(schema);
    expect(() => env.MISSING_VAR).toThrow();
  });

  it('should throw an error if an environment variable does not match the schema', () => {
    process.env.NUMBER_VAR = 'not-a-number';

    const schema = {
      NUMBER_VAR: v.number(),
    };

    const env = createEnv(schema);
    expect(() => env.NUMBER_VAR).toThrow();
  });

  it('should not validate until a value is read', () => {
    delete process.env.MISSING_VAR;

    expect(() => createEnv({ MISSING_VAR: v.string() })).not.toThrow();
  });

  it('should skip validation when SKIP_ENV_VALIDATION is set', () => {
    process.env.SKIP_ENV_VALIDATION = '1';
    delete process.env.MISSING_VAR;

    const env = createEnv({ MISSING_VAR: v.string() });
    expect(env.MISSING_VAR).toBeUndefined();
  });
});
