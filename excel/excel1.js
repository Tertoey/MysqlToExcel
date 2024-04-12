const XlsxPopulate = require('xlsx-populate');
const path = require('path');
const fs = require('fs');

async function writeToExcel(data) {
    const outputDir = path.join(__dirname, 'output');
    const fileName = `data_${new Date().toISOString().split('T')[0]}.xlsx`;
    const filePath = path.join(outputDir, fileName);

    try {
        // Check if the output directory exists, create it if not
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }

        let workbook;

        // Read existing workbook if it exists, otherwise create a new one
        try {
            workbook = await XlsxPopulate.fromFileAsync(filePath);
        } catch (readError) {
            workbook = await XlsxPopulate.fromBlankAsync();
            workbook.sheet(0).name('data');
        }

        const sheet = workbook.sheet('data');

        // Assuming data structure: { datetime, rssi, temp }
        sheet.column('A').style('numberFormat', 'yyyy-mm-dd hh:mm:ss');
        
        // Check if the sheet has any used cells
        const lastRowNumber = sheet.usedRange() ? sheet.usedRange().endCell().rowNumber() : 0;

        // If the sheet is empty, add headers
        if (lastRowNumber === 0) {
            Object.keys(data).forEach((key,index)=>{
                sheet.cell(1,index+1).value(key)
                sheet.cell(lastRowNumber+2,index+1).value(data[key])
            })
            // Set the alignment for the header
            sheet.row(1).style({ horizontalAlignment: 'center' });
            sheet.row(lastRowNumber + 2).style({ horizontalAlignment: 'left' });
        }else{
            // Add the new data to the worksheet
            Object.keys(data).forEach((key,index)=>{
                sheet.cell(1,index+1).value(key)
                sheet.cell(lastRowNumber+1,index+1).value(data[key])
            })
            // Set the alignment for the new data row
            sheet.row(lastRowNumber + 1).style({ horizontalAlignment: 'left' });
        }
        // Write the updated workbook back to the file
        await workbook.toFileAsync(filePath);

        console.log('Excel file updated:', filePath);
    } catch (error) {
        console.error('Error writing to Excel file:', error.message);
        throw error;
    }
}

module.exports = {
    writeToExcel,
};