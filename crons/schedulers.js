// Schedule script execution every minute
import cron from "node-cron";
import pool from "../config/db.js";
import { generateUserWorksheetExcel, updateEntries, calculatePerformanceForEachEmployee, updateYearlyDataForEachEmployee } from "./cronFunctions.js";


export const runCronJobs = () => {

    cron.schedule('* * * * *', async () => {
        try {
            await updateEntries();
        } catch (error) {
            console.error('Error executing cron updateEntries:', error);
        }
    });

    cron.schedule('30 23 1 * *', async () => {
        try {
            await generateUserWorksheetExcel()
        } catch (error) {
            console.error('Error executing cron generateUserWorksheetExcel:', error);
        }
    });

    cron.schedule('30 17 * * *', async () => {
        try {
            const query_count = `SELECT COUNT(*) as count FROM worksheets`;
            const [rows] = await pool.query(query_count);
            const count = rows[0].count;
    
            if (count > 0) {
                const current_date = new Date();
                const deletion_date = new Date(current_date.setDate(current_date.getDate() - 35));
    
                const delete_query = `DELETE FROM worksheets WHERE date < ?`;
                await pool.query(delete_query, [deletion_date]);
                console.log('Deletion completed successfully.');
            } else {
                console.log('No entries found in worksheet. Skipping deletion.');
            }
        } catch (error) {
            console.error('Error executing cron deletion scheduler:', error);
        }
    });
    

    cron.schedule('40 22 1 * *', async () => {
        try {
            await calculatePerformanceForEachEmployee()
        } catch (error) {
            console.error('Error executing cron calculatePerformanceForEachEmployee:', error);
        }
    });

    cron.schedule('45 23 1 1 *', async () => {
        try {
            await updateYearlyDataForEachEmployee()
        } catch (error) {
            console.error('Error executing cron updateYearlyDataForEachEmployee:', error);
        }
    });
}