import pool from "../config/db.js"
import XlsxPopulate from "xlsx-populate"
import fs from 'fs/promises';
import { getWorkingDaysCountPreviousMonth } from "../v1/helpers/functions.js"
import { getCategoryTotalPointsQuery, getUserPointsQuery, updateUserPerformanceQuery, updateUserPointsQuery, insertYearlyDataOfUsersPerformanceQuery} from "../v1/worksheets/models/performanceQuery.js"

export const updateEntries = async () => {
  try {
    // Check if there are any entries in the announcements table
    const checkSql = `SELECT COUNT(*) AS count FROM announcements`;
    const result = await pool.query(checkSql);
    const count = result[0][0].count;
    
    // If there are no entries, return early
    if (count === 0) {
      return;
    }
    const sql = `
    UPDATE announcements
    SET is_new = 0
    WHERE TIMESTAMPDIFF(MINUTE, created_at, NOW()) >= 1 AND is_new = 1
  `;
    return await pool.query(sql);
  } catch (err) {
    console.error("Error updating entries:", err);
    return;
  }
};

export const generateUserWorksheetExcel = async () => {
    try {
        const query = `
            SELECT *
            FROM worksheets
            WHERE date BETWEEN DATE_FORMAT(CURRENT_DATE() - INTERVAL 1 MONTH, '%Y-%m-01') AND LAST_DAY(CURRENT_DATE() - INTERVAL 1 MONTH);
        `;
        
        // Query MySQL to get data
        const [results, fields] = await pool.query(query);
        
        // Get the current month and year
        const current_date = new Date();
        const previous_month_date = new Date(current_date);
        previous_month_date.setMonth(previous_month_date.getMonth() - 1);
        const month = previous_month_date.toLocaleString('default', { month: 'long' });
        const year = previous_month_date.getFullYear();
        const folderPath = './excelFiles/';
        await fs.mkdir(folderPath, { recursive: true });
        // Create a new workbook
        const workbook = await XlsxPopulate.fromBlankAsync();

        // Get or create the sheet for the current month
        let sheet = workbook.sheet(`${month}_${year}`);
        if (!sheet) {
            sheet = workbook.addSheet(`${month}_${year}`);

            // Add column headers
            fields.forEach((field, index) => {
                sheet.cell(1, index + 1).value(field.name);
            });
        }

        // Add rows from MySQL results
        results.forEach((row, rowIndex) => {
            fields.forEach((field, columnIndex) => {
                sheet.cell(rowIndex + 2, columnIndex + 1).value(row[field.name]);
            });
        });
        // Save Excel file
        await workbook.toFileAsync(`${folderPath}worksheet_${year}.xlsx`);
        // Save Excel file to Google Drive
        // const buffer = await workbook.outputAsync();
        // await uploadFileToDrive(buffer, `worksheet_${year}.xlsx`);
        // console.log(`Excel file saved to Google Drive`);

        return `${folderPath}worksheet_${year}.xlsx`;
    } catch (error) {
        console.error("Error executing fetchUserDataForExcelQuery:", error);
        throw error;
    }
};

export const calculatePerformanceForEachEmployee = async () => {
  try {
      const date = new Date();
      const previous_month = date.getMonth() === 0 ? 11 : date.getMonth() - 1;
      const month_names = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'decm']

      // Get the name of the previous month
      const previous_month_name = month_names[previous_month];
      let number_of_working_days_previous_month = getWorkingDaysCountPreviousMonth()    

      let [category_points_can_be_earned_per_day] = await getCategoryTotalPointsQuery()
      let category_points_can_be_earned_per_month = category_points_can_be_earned_per_day[0].total_points * number_of_working_days_previous_month

      let [data] = await getUserPointsQuery()
     
      //Employee Performance Logic
      for(let i=0; i< data.length; i++){
          let emp_id = data[i].emp_id
          let earned_points = parseInt(data[i].total_earned_points)
          let monthly_performance = earned_points / category_points_can_be_earned_per_month
          monthly_performance = Math.round(monthly_performance)
          // Add Performance to user table
         await updateUserPerformanceQuery([monthly_performance, emp_id])
         await updateUserPointsQuery(previous_month_name, earned_points, emp_id)
      }

      return `Performance Updated successfully.`;
  } catch (error) {
    console.error("Error executing calculatePerformanceForEachEmployee:", error);
    throw error;
  }
};

export const updateYearlyDataForEachEmployee = async () => {
  try {

      const date = new Date();
      const current_year = date.getFullYear();
      const previous_year = current_year - 1;

      await insertYearlyDataOfUsersPerformanceQuery(previous_year)
      return `Performance Updated for Yearly successfully.`;
  } catch (error) {
    console.error("Error executing updateYearlyDataForEachEmployee:", error);
    throw error;
  }
};