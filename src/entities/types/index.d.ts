export {};

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    WidgetCheckout: any;
    fbq?: (
      command: 'init' | 'track' | string,
      eventOrId?: string,
      params?: Record<string, unknown>,
    ) => void;
    clarity?: (...args: unknown[]) => void;
  }
}