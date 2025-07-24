'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function BoxTable() {
  const data = [
    { box: 'Box 1', f1: 9, connection: '9' },
    { box: 'Box 2', f1: 2, connection: '81' },
    { box: 'Box 3', f1: 15, connection: '729' },
    { box: 'Box 4', f1: 15, connection: '6.561' },
    { box: 'Box 5', f1: 2, connection: '59.049' },
    { box: 'Box 6', f1: 15, connection: '531.441' },
    { box: 'Box 7', f1: 2, connection: '4.782.969' },
    { box: 'Box 8', f1: 8, connection: '43.046.721' },
    { box: 'Box 9', f1: 2, connection: '387.420.489' },
  ];

  return (
    <div className="p-4 w-full box-table text-white">
      <h2 className="text-center text-shadow-custom text-[1.25rem] font-[700] mb-4">Thống kê số lượng</h2>
      <Table className="text-white">
        <TableHeader>
          <TableRow>
            <TableHead className="text-shadow-custom font-[700] text-[1rem] text-center">Mở khóa</TableHead>
            <TableHead className="text-shadow-custom font-[700] text-[1rem] text-center">F1 trực tiếp</TableHead>
            <TableHead className="text-shadow-custom font-[700] text-[1rem] text-center">Kết nối lan tỏa</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, idx) => (
            <TableRow key={idx} className="text-shadow-custom font-[700] text-[1rem]">
              <TableCell className="text-center">{row.box}</TableCell>
              <TableCell className="text-center">{row.f1}</TableCell>
              <TableCell className="text-center">{row.connection}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
