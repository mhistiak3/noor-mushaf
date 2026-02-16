export type ParaItem = {
  id: number;
  name: string;
  startPage: number;
};

const paraPageCounts = [21, ...Array.from({ length: 27 }, () => 20), 24, 25];

export const paraList: ParaItem[] = Array.from({ length: 30 }, (_, index) => {
  const id = index + 1;
  const startPage =
    1 + paraPageCounts.slice(0, index).reduce((sum, count) => sum + count, 0);
  return {
    id,
    name: `Para ${id}`,
    startPage,
  };
});
