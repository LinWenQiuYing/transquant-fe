import { DataType, UUID } from "@transquant/utils";
import { useRef } from "react";

export default function useDataSource<T>(data?: T[]): DataType<T>[] {
  const dataSource = useRef<T[]>([]);
  if (!data) return [];

  dataSource.current = data.map((item) => ({
    key: UUID(),
    ...item,
  }));

  return dataSource.current as DataType<T>[];
}
