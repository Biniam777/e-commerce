const multiplyMoney = (amount, quantity) => {
  const [whole = '0', fraction = ''] = String(amount).split('.');
  const normalizedFraction = `${fraction}00`.slice(0, 2);
  const cents = BigInt(`${whole.replace(/\D/g, '') || '0'}${normalizedFraction}`);
  const result = cents * BigInt(quantity);
  const text = result.toString().padStart(3, '0');

  return `${text.slice(0, -2)}.${text.slice(-2)}`;
};

export { multiplyMoney };