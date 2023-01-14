export function convertToDecimalOdds(odds: number) {
  const stake = 100;
  const payout =
    Number(
      odds > 0
        ? Number(stake * (Math.abs(odds) / 100))
        : Number(stake / (Math.abs(odds) / 100)),
    ) + stake;
  return Number((payout / stake).toFixed(2));
}
