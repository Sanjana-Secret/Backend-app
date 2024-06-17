const userTeams = `
CREATE TABLE IF NOT EXISTS userTeams (
    _id int NOT NULL AUTO_INCREMENT,
    user_id varchar(255) NOT NULL,
    team_id int NOT NULL,
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (_id),
    FOREIGN KEY (user_id) REFERENCES users(emp_id) ON DELETE CASCADE,
    FOREIGN KEY (team_id) REFERENCES teams(_id) ON DELETE CASCADE
) AUTO_INCREMENT = 1111;
`
export default userTeams