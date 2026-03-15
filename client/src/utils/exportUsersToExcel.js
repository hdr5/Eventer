import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export const exportUsersToExcel = (users) => {
  const worksheet = XLSX.utils.json_to_sheet(users.map(user => ({
    Name: user.name,
    Email: user.email,
    Role: user.role,
    CreatedAt: new Date(user.createdAt).toLocaleString(),
    UpdatedAt: new Date(user.updatedAt).toLocaleString()
  })));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const fileData = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(fileData, "users-report.xlsx");
};
