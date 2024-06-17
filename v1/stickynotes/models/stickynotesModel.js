const temporaryNotesTable = `
CREATE TABLE IF NOT EXISTS temporaryNotes (
    _id INT AUTO_INCREMENT PRIMARY KEY,
    emp_id varchar(255) NOT NULL,
    note varchar(250)
  )`;

export default temporaryNotesTable;
