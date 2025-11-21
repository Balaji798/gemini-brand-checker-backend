export const diceCoefficient=(a, b) =>{
  a = a.toLowerCase();
  b = b.toLowerCase();

  const bigrams = (str) => {
    const arr = [];
    for (let i = 0; i < str.length - 1; i++) {
      arr.push(str.slice(i, i + 2));
    }
    return arr;
  };

  const A = bigrams(a);
  const B = bigrams(b);

  const intersection = A.filter((x) => B.includes(x)).length;
  return (2 * intersection) / (A.length + B.length);
}
