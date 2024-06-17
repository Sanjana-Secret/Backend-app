import { body, query, check, param } from 'express-validator';

export const crAnnVal = [
    body('event_type').notEmpty().withMessage('event_type cannot be empty.').isString().withMessage("event_type must be a string."),
    body('priority').notEmpty().withMessage('priority cannot be empty.').isString().withMessage("priority must be a string."),
    body('from_date').notEmpty().withMessage('from_date cannot be empty.').isDate().withMessage("from_date must be a date."), 
    body('to_date').notEmpty().withMessage('to_date cannot be empty.').isDate().withMessage("to_date must be a date."),
    body('title').notEmpty().withMessage('title cannot be empty.').isString().withMessage("title must be a string."),
    body('description').notEmpty().withMessage('description cannot be empty.').isString().withMessage("description must be a string."),
    body('image_data').optional().notEmpty().withMessage('image_data cannot be empty.').isURL().withMessage('Invalid URL format'),
]

export const upAnnVal = [
    body('priority').optional().notEmpty().withMessage('priority cannot be empty.').isString().withMessage("priority must be a string."),
    body('to_date').notEmpty().withMessage('to_date cannot be empty.').isDate().withMessage("to_date must be a date."),
    body('from_date').notEmpty().withMessage('from_date cannot be empty.').isDate().withMessage("from_date must be a date.")
]
export const delAnnVal = [
    param('id').notEmpty().withMessage('id cannot be empty.').isInt().withMessage("id must be an integer."),
]

export const allAppVal = [
    body('emp_id').notEmpty().withMessage('emp_id cannot be empty.').isAlphanumeric().withMessage('emp_id must be alphanumeric.'),
    body('foreign_id').notEmpty().withMessage('foreign_id cannot be empty.').isAlphanumeric().withMessage('foreign_id must be alphanumeric.'),
    body('status').notEmpty().withMessage('status cannot be empty.').isString().withMessage("status must be a string."),
    body('item').notEmpty().withMessage('item cannot be empty.').isString().withMessage("item must be a string."),
    body('request_type').notEmpty().withMessage('request_type cannot be empty.').isString().withMessage("request_type must be a string."),
]

export const crAssVal = [
    body('asset_type').notEmpty().withMessage('asset_type cannot be empty.').isString().withMessage("asset_type must be a string."),
    body('item').notEmpty().withMessage('item cannot be empty.').isString().withMessage("item must be a string."),
    body('purchase_date').notEmpty().withMessage('purchase_date cannot be empty.').isDate().withMessage("purchase_date must be a date."),
    body('warranty_period').notEmpty().withMessage('warranty_period cannot be empty.').isInt().withMessage("warranty_period must be an integer."),
    body('price').notEmpty().withMessage('price cannot be empty.').isInt().withMessage("price must be an integer."),
    body('model_number').notEmpty().withMessage('model_number cannot be empty.').isAlphanumeric().withMessage('model_number must be alphanumeric.'),
    body('item_description').optional().notEmpty().withMessage('item_description cannot be empty.').isString().withMessage("item_description must be a string."),
    body('image_url').optional().notEmpty().withMessage('image_url cannot be empty.').isString().withMessage("image_url must be a string."),
]
export const assReqVal = [
    body('asset_type').notEmpty().withMessage('asset_type cannot be empty.').isString().withMessage("asset_type must be a string."),
    body('emp_id').notEmpty().withMessage('emp_id cannot be empty.').isAlphanumeric().withMessage('emp_id must be alphanumeric.'),
    body('item').notEmpty().withMessage('item cannot be empty.').isString().withMessage("item must be a string."),
    body('primary_purpose').notEmpty().withMessage('primary_purpose cannot be empty.').isString().withMessage("primary_purpose must be a string."),
    body('requirement_type').notEmpty().withMessage('requirement_type cannot be empty.').isString().withMessage("requirement_type must be a string."),
    body('request_type').notEmpty().withMessage('request_type cannot be empty.').isString().withMessage("request_type must be a string."),
    body('details').notEmpty().withMessage('details cannot be empty.').isString().withMessage("details must be a string."),
]

export const fetUserAssVal = [
    body('emp_id').notEmpty().withMessage('emp_id cannot be empty.').isAlphanumeric().withMessage('emp_id must be alphanumeric.'),
]

export const addTrnVal = [
    body('course_name').notEmpty().withMessage('course_name cannot be empty.').isString().withMessage("course_name must be a string."),
    body('course_description').notEmpty().withMessage('course_description cannot be empty.').isString().withMessage("course_description must be a string."),
    body('roadmap_url').notEmpty().withMessage('roadmap_url cannot be empty.').isString().withMessage("roadmap_url must be a string."),
    body('details').notEmpty().withMessage('details cannot be empty.').isString().withMessage("details must be a string."),
]

export const reqTrnVal = [
    body('emp_id').notEmpty().withMessage('emp_id cannot be empty.').isAlphanumeric().withMessage('emp_id must be alphanumeric.'),
    body('request_type').notEmpty().withMessage('request_type cannot be empty.').isString().withMessage("request_type must be a string."),
    body('progress_status').notEmpty().withMessage('progress_status cannot be empty.').isString().withMessage("progress_status must be a string."),
    body('training_id').notEmpty().withMessage('training_id cannot be empty.').isAlphanumeric().withMessage('training_id must be alphanumeric.'),
]
export const getTrnVal = [
    body('emp_id').notEmpty().withMessage('emp_id cannot be empty.').isAlphanumeric().withMessage('emp_id must be alphanumeric.'),
]

export const delholidayVal = [
    body('training_id').notEmpty().withMessage('training_id cannot be empty.').isAlphanumeric().withMessage('training_id must be alphanumeric.'),
]

export const upTrnVal =[
    param('id').notEmpty().withMessage('id cannot be empty.').isAlphanumeric().withMessage('id must be an alphanumeric')
]

const passwordValidation = (value) => {
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(value)) {
        throw new Error('Password must contain at least one lowercase letter, one uppercase letter, and one special character.');
    }
    return true;
};

const isValidBloodGroup = (value) => /^(A|B|AB|O)[+-]$/.test(value);

export const userRegVal = [
    body('username').notEmpty().withMessage('username cannot be empty.').isString().withMessage("username must be a string."),
    body('first_name').notEmpty().withMessage('first_name cannot be empty.').isString().withMessage("first_name must be a string."),
    body('last_name').notEmpty().withMessage('last_name cannot be empty.').isString().withMessage("last_name must be a string."),
    body('email').isEmail().withMessage('Invalid email input.').notEmpty().withMessage('Email cannot be empty.'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long').notEmpty().withMessage('Password cannot be empty.').custom(passwordValidation),
    body('gender').notEmpty().withMessage('gender cannot be empty.').isString().withMessage("gender must be a string."),
    body('profile_picture').optional().notEmpty().withMessage('profile_picture cannot be empty.').isURL().withMessage('Invalid URL format'),
    body('blood_group').custom((value) => isValidBloodGroup(value)).withMessage('Invalid blood group format'),
    body('mobile_number').notEmpty().withMessage('mobile_number cannot be empty').isInt().withMessage('mobile_number should be an integer').isLength({ min: 10, max: 10 }).withMessage('mobile_number must be of 10 digits.'),
    body('emergency_contact_number').notEmpty().withMessage('emergency_contact_number cannot be empty.')
    .isInt().withMessage('emergency_contact_number should be an integer.').isLength({ min: 10, max: 10 }).withMessage('emergency_contact_number must be of 10 digits.'),
    body('emergency_contact_person_info').optional().notEmpty().withMessage('emergency_contact_person_info cannot be empty.')
    .isString().withMessage('emergency_contact_person_info must be a string.'),
    body('address').notEmpty().withMessage('address cannot be empty.').isString().withMessage('address must be a string.'),
    body('dob').notEmpty().withMessage('dob cannot be empty.').isDate().withMessage("dob must be a date."),
    body('designation').notEmpty().withMessage('designation cannot be empty.').isString().withMessage('designation must be a string.'),
    body('designation_type').notEmpty().withMessage('designation_type cannot be empty.').isString().withMessage('designation_type must be a string.'),
    body('joining_date').notEmpty().withMessage('joining_date cannot be empty.').isDate().withMessage("joining_date must be a date."),
    body('experience').notEmpty().withMessage('experience cannot be empty.').isNumeric().withMessage("experience must be an integer."),
    body('completed_projects').optional().notEmpty().withMessage('completed_projects cannot be empty.').isInt().withMessage("completed_projects must be an integer."),
    body('performance').optional().notEmpty().withMessage('performance cannot be empty.').isNumeric().withMessage("performance must be an integer."),
    body('teams').optional().notEmpty().withMessage('teams cannot be empty.').isInt().withMessage("teams must be an integer."),
    body('client_report').optional().notEmpty().withMessage('client_report cannot be empty.').isInt().withMessage("client_report must be an integer."),
]

export const userLogVal = [
    body('username').notEmpty().withMessage('username cannot be empty.'),
    body('password').notEmpty().withMessage('password cannot be empty.')
]

export const logOutVal = [
    param('id').notEmpty().withMessage('id cannot be empty.').isAlphanumeric().withMessage('id must be alphanumeric.')
]

export const checkUserNameAvailabilityVal = [
    body('user_name').notEmpty().withMessage('username cannot be empty.').isString().withMessage("username must be a string."),
]

export const upPassVal = [
    body('email').isEmail().withMessage('Invalid email input.').notEmpty().withMessage('Email cannot be empty.'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long').notEmpty().withMessage('Password cannot be empty.').custom(passwordValidation),
    body('confirm_password').isLength({ min: 8 }).withMessage('confirm_Password must be at least 8 characters long').notEmpty().withMessage('confirm_Password cannot be empty.').custom(passwordValidation)
]

export const addHolidayVal = [
    body('date').isDate().withMessage('Invalid date input.').notEmpty().withMessage('Date cannot be empty.'),
    body('holiday').isString().withMessage('Invalid holiday input.').notEmpty().withMessage('holiday cannot be empty.')
]

export const updateHolidayVal = [
    body('date').optional().isDate().withMessage('Invalid date input.').notEmpty().withMessage('Date cannot be empty.'),
    body('holiday').optional().isString().withMessage('Invalid holiday input.').notEmpty().withMessage('holiday cannot be empty.')
]

export const addLeaveCountVal = [
    body('leave_type').isString().withMessage('Invalid leave type input.').notEmpty().withMessage('leave type cannot be empty.'),
    body('leave_count').isInt().withMessage('Invalid leave count input.').notEmpty().withMessage('leave count cannot be empty.'),
    body('gender').isString().withMessage('Invalid gender input.').isIn(['male', 'female', 'both']).withMessage('Invalid gender input.').notEmpty().withMessage('gender cannot be empty.'),
    body('description').isString().withMessage('Invalid description input.').notEmpty().withMessage('gender cannot be empty.')
]
export const updateLeaveTypeAndCountVal = [
    param('id').isInt().withMessage('Invalid id input.').notEmpty().withMessage('id cannot be empty.'),
    param('leave_type_id').isInt().withMessage('Invalid leave_type_id input.').notEmpty().withMessage('leave_type_id cannot be empty.'),
    body('leave_type').optional().isString().withMessage('Invalid leave type input.').notEmpty().withMessage('leave type cannot be empty.'),
    body('leave_count').optional().isInt().withMessage('Invalid leave count input.').notEmpty().withMessage('leave count cannot be empty.'),
    body('gender').optional().isString().withMessage('Invalid gender input.').isIn(['male', 'female', 'both']).withMessage('Invalid gender input.').notEmpty().withMessage('gender cannot be empty.')
]
export const deleteLeaveTypeAndCountVal = [
    param('id').isInt().withMessage('Invalid id input.').notEmpty().withMessage('id cannot be empty.'),
    param('leave_type_id').isInt().withMessage('Invalid leave_type_id input.').notEmpty().withMessage('leave_type_id cannot be empty.')
]

export const leaveRequestVal = [
    body('leave_type').isString().withMessage('Invalid leave type input.').notEmpty().withMessage('leave type cannot be empty.'),
    body('subject').isString().withMessage('Invalid subject input.').notEmpty().withMessage('subject cannot be empty.'),
    body('body').isString().withMessage('Invalid body input.').notEmpty().withMessage('body cannot be empty.'),
    body('emp_id').notEmpty().withMessage('emp_id cannot be empty.').isAlphanumeric().withMessage('emp_id must be alphanumeric.'),
    body('from_date').notEmpty().withMessage('from_date cannot be empty.').isDate().withMessage("from_date must be a date."), 
    body('to_date').notEmpty().withMessage('to_date cannot be empty.').isDate().withMessage("to_date must be a date."),
]
export const getUserLeaveDashboardData= [
    param('id').isAlphanumeric().withMessage('Invalid id input.').notEmpty().withMessage('id cannot be empty.'),
]

export const fetchLeaveOverviewVal=[
    body('emp_id').notEmpty().withMessage('emp_id cannot be empty.').isAlphanumeric().withMessage('emp_id must be alphanumeric.'),
    body('status').optional().notEmpty().withMessage('status cannot be empty.').isString().withMessage('status must be a string.'),
    body('from_date').optional().notEmpty().withMessage('from_date cannot be empty.').isDate().withMessage("from_date must be a date.")
]
export const createWorksheetVal = [
    body('emp_id').notEmpty().withMessage('emp_id cannot be empty.').isAlphanumeric().withMessage('emp_id must be alphanumeric.'),
    body('team_id').notEmpty().withMessage('Team id cannot be empty.').isInt().withMessage('Invalid team id input.'),
    body('category_id').notEmpty().withMessage('Category id cannot be empty.').isInt().withMessage('Invalid category id input.'),
    body('skill_set_id').isString().withMessage('Invalid skill set input.').notEmpty().withMessage('skill set cannot be empty.'),
    body('description').isString().withMessage('Invalid description input.').notEmpty().withMessage('description cannot be empty.'),
]

export const updateWorksheetVal = [
    param('id').isInt().withMessage('Invalid id input.').notEmpty().withMessage('id cannot be empty.'),
    param('emp_id').notEmpty().withMessage('emp_id cannot be empty.').isAlphanumeric().withMessage('emp_id must be alphanumeric.'),
]

export const createTeamVal = [
    body('team').isString().withMessage('Invalid team input.').notEmpty().withMessage('team cannot be empty.'),
]

export const updateTeamVal = [
    param('id').isInt().withMessage('Invalid id input.').notEmpty().withMessage('id cannot be empty.'),
    body('team').optional().isString().withMessage('Invalid team input.').notEmpty().withMessage('team cannot be empty.'),
]

export const createSkillVal = [
    body('skill').isString().withMessage('Invalid team input.').notEmpty().withMessage('team cannot be empty.'),
]

export const updateSkillVal = [
    param('id').isInt().withMessage('Invalid id input.').notEmpty().withMessage('id cannot be empty.'),
    body('skill').optional().isString().withMessage('Invalid skill input.').notEmpty().withMessage('skill cannot be empty.'),
]

export const createProjectVal = [
    body('project').isString().withMessage('Invalid project input.').notEmpty().withMessage('project cannot be empty.'),
    body('category_id').notEmpty().withMessage('Category id cannot be empty.').isInt().withMessage('Invalid category id input.'),
    body('client_name').isString().withMessage('Invalid client name input').notEmpty().withMessage('client name cannot be empty'),
    body('project_status').isString().withMessage('Invalid project status input').notEmpty().withMessage('project status cannot be empty'),
    body('project_lead').isString().withMessage('Invalid project lead input').notEmpty().withMessage('project lead cannot be empty'),
    body('start_month').optional().custom((value) => isValidMonthYearFormat(value)).withMessage('Invalid value format'),
    body('end_month').optional().custom((value) => isValidMonthYearFormat(value)).withMessage('Invalid value format')
]
export const updateProjectVal = [
    param('id').isInt().withMessage('Invalid id input.').notEmpty().withMessage('id cannot be empty.'),
    body('project').optional().isString().withMessage('Invalid project input.').notEmpty().withMessage('project cannot be empty.'),
    body('category_id').optional().notEmpty().withMessage('Category id cannot be empty.').isInt().withMessage('Invalid category id input.'),
    body('client_name').optional().isString().withMessage('Invalid client name input').notEmpty().withMessage('client name cannot be empty'),
    body('project_status').optional().isString().withMessage('Invalid project status input').notEmpty().withMessage('project status cannot be empty'),
    body('project_lead').optional().isString().withMessage('Invalid project lead input').notEmpty().withMessage('project lead cannot be empty'),
    body('start_month').optional().custom((value) => isValidMonthYearFormat(value)).withMessage('Invalid value format'),
    body('end_month').optional().custom((value) => isValidMonthYearFormat(value)).withMessage('Invalid value format')
]

export const createCategoryVal = [
    body('category').isString().withMessage('Invalid category input.').notEmpty().withMessage('category cannot be empty.'),
]
export const updateCategoryVal = [
    param('id').isInt().withMessage('Invalid id input.').notEmpty().withMessage('id cannot be empty.'),
    body('category').isString().withMessage('Invalid category input.').notEmpty().withMessage('category cannot be empty.'),
]
export const deleteUserWorksheetVal = [
    param('id').isInt().withMessage('Invalid id input.').notEmpty().withMessage('id cannot be empty.'),
    param('emp_id').isAlphanumeric().withMessage('Invalid emp id input.').notEmpty().withMessage('emp id cannot be empty.')
]
export const fetchUserWorksheetVal = [
    param('emp_id').isAlphanumeric().withMessage('Invalid emp id input.').notEmpty().withMessage('emp id cannot be empty.')
]

export const deleteIdVal = [
    param('id').isInt().withMessage('Invalid id input.').notEmpty().withMessage('id cannot be empty.')
]

export const sendOtpVal = [
    body('email').isEmail().withMessage('Invalid email input.').notEmpty().withMessage('Email cannot be empty.')
]
export const verifyOtpVal = [
    body('email').isEmail().withMessage('Invalid email input.').notEmpty().withMessage('Email cannot be empty.'),
    body('otp').isNumeric().withMessage('Invalid otp input.').notEmpty().withMessage('otp cannot be empty.')
]

export const addPolicyVal = [
    body('policy_heads').isString().withMessage('Invalid input.').notEmpty().withMessage('policy_heads cannot be empty.')
]

export const delPolicyVal = [
    param('id').isInt().withMessage('Invalid id input.').notEmpty().withMessage('id cannot be empty.')
]

export const upPolicyVal = [
    body('policy_type').isString().withMessage('Invalid policy_type input.').notEmpty().withMessage('policy type cannot be empty.'),
    body('policy_description').isString().withMessage('Invalid policy_description input.').notEmpty().withMessage('policy description cannot be empty.'),
]

export const adStiNoVal = [
    body('emp_id').isString().withMessage('Invalid emp_id input.').notEmpty().withMessage('emp_id cannot be empty.'),
    body('note').isString().withMessage('Invalid note input.').notEmpty().withMessage('note cannot be empty.'),
]

export const delStiNoVal = [
    param('id').isString().withMessage('Invalid id input.').notEmpty().withMessage('id cannot be empty.'),
    param('emp_id').isString().withMessage('Invalid emp_id input.').notEmpty().withMessage('emp_id cannot be empty.')
]

export const getStiNoVal = [
    param('emp_id').isString().withMessage('Invalid emp_id input.').notEmpty().withMessage('emp_id cannot be empty.')
]

export const activityDateVal = [
    param('date').isString().withMessage('Invalid date input.').notEmpty().withMessage('date cannot be empty.'),
]

export const createUserProjectVal = [
    body('project_id').isInt().withMessage('Invalid project id input.').notEmpty().withMessage('project id cannot be empty.'),
    body('emp_id').isString().notEmpty().withMessage('Employee id cannot be empty.').isAlphanumeric().withMessage('Invalid employee id input.'),
    body('tech').notEmpty().withMessage('technology cannot be empty.').isString().withMessage('Invalid technology  input.'),
    body('team_id').isInt().withMessage('Invalid team id input').notEmpty().withMessage('team id cannot be empty'),
    body('project_manager').isString().withMessage('Invalid project manager input').notEmpty().withMessage('project manager cannot be empty'),
    body('start_month').optional().custom((value) => isValidMonthYear(value)).withMessage('Invalid value format'),
    body('end_month').optional().custom((value) => isValidMonthYear(value)).withMessage('Invalid value format'),
]
export const userUpdateProjectVal = [
    body('start_month').optional().custom((value) => isValidMonthYear(value)).withMessage('Invalid value format'),
    body('end_month').optional().custom((value) => isValidMonthYear(value)).withMessage('Invalid value format'),
]
export const getActIdVal = [
    param('id').isInt().withMessage('Invalid id input.').notEmpty().withMessage('id cannot be empty.'),
]
export const getUserVal = [
    param('emp_id').isString().withMessage('Invalid emp_id input.').notEmpty().withMessage('emp_id cannot be empty.')
]

export const feedbackVal = [
    body('emp_id').isString().withMessage('Invalid emp_id input.').notEmpty().withMessage('emp_id cannot be empty.'),
    body('subject').isString().withMessage('Invalid input.').notEmpty().withMessage('subject cannot be empty.'),
    body('description').isString().withMessage('Invalid input.').notEmpty().withMessage('description cannot be empty.')
]

const isValidMonthYear = (value) => {
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    return regex.test(value);
};

function isValidMonthYearFormat(dateString) {
    const regex = /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{2}$/;
    return regex.test(dateString);
}