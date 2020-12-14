export class TreemapData {
  name: string;
  value?: number;
  children: TreemapEntry[];
}

export class TreemapEntry {
  name: string;
  value: number;
}
