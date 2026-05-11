export const createMockList = <T>(
  generator: (id: number) => T,
  count: number
): T[] => Array.from({ length: count }, (_, index) => generator(index + 1));

export const withNetworkDelay = <T>(
  data: T,
  delayMs: number = 500
): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), delayMs));

export const oneOf = <T>(items: T[]): T =>
  items[Math.floor(Math.random() * items.length)];

export const randomBoolean = (probability: number = 0.5): boolean =>
  Math.random() < probability;

export const randomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;
