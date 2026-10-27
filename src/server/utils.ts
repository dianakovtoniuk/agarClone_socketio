/** A random, not-too-dark and not-too-bright rgb() color, e.g. "rgb(112,243,59)". */
export const getRandomColor = (): string => {
  const channel = () => Math.floor(Math.random() * 200 + 50);
  return `rgb(${channel()},${channel()},${channel()})`;
};
