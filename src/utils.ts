export function removeDuplicates(array: string[]): string[] {
  return array.reduce((unique: string[], item: string) => {
    return unique.includes(item) ? unique : [...unique, item];
  }, []);
}
