export function add(a, b) {
  console.log(`Add ${a} and ${b}`);
  return a + b;
}

export function max(list) {
  if (!Array.isArray(list)) {
    return list;
  }
  if (list.length === 0) return null;
  return list.reduce((acc, cur) => (acc > cur ? acc : cur), list[0]);
}

function privateFunc() {
  console.log('This is a secret!');
}
