export function isEmpty(s: string | null | undefined): s is null | undefined {
  return (s?.length || 0) == 0;
}

export function isSame(obj1: any, obj2: any): boolean {
  const obj1Keys = Object.keys(obj1);
  const obj2Keys = Object.keys(obj2);

  return (
    obj1Keys.length === obj2Keys.length &&
    [...obj1Keys, ...obj2Keys].every((key) => obj1[key] === obj2[key])
  );
}
