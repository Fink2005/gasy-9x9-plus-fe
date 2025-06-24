// Use type safe message keys with `next-intl`
type Messages = typeof import('../locales/en.json');

// eslint-disable-next-line
declare interface IntlMessages extends Messages {}

declare global {
  interface Window {
    safepal?: {
      connect: () => Promise<void>;
      getAccount: () => Promise<{
        toString: () => string;
      }>;
    };
  }
}

export { };
