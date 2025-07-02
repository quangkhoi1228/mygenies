export function compareArrays(a: any[], b: any[]) {
  return (
    a.length === b.length && a.every((element, index) => element === b[index])
  );
}
