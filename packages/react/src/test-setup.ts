// jsdom has no CSS.escape; React Aria uses it to find elements by id.
globalThis.CSS ??= {} as typeof CSS;
CSS.escape ??= (value: string) =>
  value.replace(/[^\w-]/g, (char) => '\\' + char);
