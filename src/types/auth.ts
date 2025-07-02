export type loginPayload = { address: string; signature: string; message: string };

export type loginResponse = { result: loginPayload } | null;
