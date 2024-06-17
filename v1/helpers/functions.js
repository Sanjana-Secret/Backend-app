import pool from "../../config/db.js"


export const incrementId = async(id)=>{

    if (typeof id !== 'string' || !/^[A-Za-z]+(\d+)$/.test(id)) {
        throw new Error('Invalid input format');
    }
    
    const [, prefix, number] = id.match(/^([A-Za-z]+)(\d+)$/);
    const incrementedNumber = String(Number(number) + 1).padStart(number.length, '0');
    console.log(`${prefix}${incrementedNumber}`);
    return `${prefix}${incrementedNumber}`;
      
}

export const createDynamicUpdateQuery = async(table, condition, req_data)=>{

    let updateQuery = 'UPDATE ' + table + ' SET ';
    let updateValues = [];

    Object.keys(req_data).forEach((key, index, array) => {
    updateQuery += `${key} = ?`;
    updateValues.push(req_data[key]);

    if (index < array.length - 1) {
        updateQuery += ', ';
    }
    });

    updateQuery += ' WHERE ';

    Object.keys(condition).forEach((key, index, array) => {
    updateQuery += `${key} = ?`;
    updateValues.push(condition[key]);

    if (index < array.length - 1) {
        updateQuery += ' AND ';
    }
    });
    return {updateQuery, updateValues};
}

export const getWorkingDaysCountPreviousMonth = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth(); // Current month index (0-based)

    // Get the first day of the previous month
    const firstDayOfPreviousMonth = new Date(year, month - 1, 1);

    // Get the last day of the previous month
    const lastDayOfPreviousMonth = new Date(year, month, 0);

    let count = 0;

    // Iterate through the days of the previous month
    for (let day = firstDayOfPreviousMonth.getDate(); day <= lastDayOfPreviousMonth.getDate(); day++) {
        const currentDate = new Date(year, month - 1, day);
        const currentDayOfWeek = currentDate.getDay(); // Day of the week index (0 for Sunday, 1 for Monday, ..., 6 for Saturday)
        
        // Check if the current day is a weekday (Monday to Friday)
        if (currentDayOfWeek >= 1 && currentDayOfWeek <= 5) {
            count++;
        }
    }

    return count;
}

export const getTokenSessionById = async(emp_id)=>{
        let query = `SELECT jwt_token FROM users WHERE emp_id = ?`
        return pool.query(query,[emp_id])
}