const ExcelJS = require('exceljs');
const path = require('path');

async function inspect() {
    const workbook = new ExcelJS.Workbook();
    const filePath = path.join(__dirname, 'public', 'anketa_soiskatelya.xlsx');

    try {
        await workbook.xlsx.readFile(filePath);
        const worksheet = workbook.worksheets[0];
        console.log(`Sheet Name: ${worksheet.name}`);

        // Let's print the first few rows to understand headers
        worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
            if (rowNumber <= 50) {
                const values = row.values.slice(1); // Row values are 1-indexed
                console.log(`Row ${rowNumber}: ${values.join(' | ')}`);
            }
        });
    } catch (error) {
        console.error('Error reading excel:', error);
    }
}

inspect();
