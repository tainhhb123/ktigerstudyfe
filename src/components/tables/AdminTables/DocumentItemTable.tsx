import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../../ui/table";

interface Item {
  wordId: number;
  word: string;
  meaning: string;
  vocabImage?: string;
}

interface Props { listId: number; }

export default function DocumentItemTable({ listId }: Props) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get<Item[]>(`/api/document-items/list/${listId}`)
      .then((res) => setItems(res.data))
      .finally(() => setLoading(false));
  }, [listId]);

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableCell isHeader>Từ vựng</TableCell>
            <TableCell isHeader>Nghĩa</TableCell>
            <TableCell isHeader className="text-center">Ảnh</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading && (
            <TableRow><td colSpan={3} className="py-6 text-center">Đang tải…</td></TableRow>
          )}
          {!loading && items.length === 0 && (
            <TableRow><td colSpan={3} className="py-6 text-center">Không có từ nào</td></TableRow>
          )}
          {!loading && items.map((i) => (
            <TableRow key={i.wordId}>
              <TableCell>{i.word}</TableCell>
              <TableCell>{i.meaning}</TableCell>
              <TableCell className="text-center">
                {i.vocabImage
                  ? <img src={i.vocabImage} alt={i.word} className="h-6 w-6 cursor-pointer" onClick={() => window.open(i.vocabImage)} />
                  : "-"
                }
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
