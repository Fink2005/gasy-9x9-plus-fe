export type loginPayload = { address: string; signature: string; message: string };

export type loginResponse = { result: { accessToken: string; address: string } } | null;
