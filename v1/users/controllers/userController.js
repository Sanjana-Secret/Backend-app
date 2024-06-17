import jwt from "jsonwebtoken"
import { validationResult } from "express-validator";
import bcrypt from "bcrypt"
import dotenv from "dotenv"
import { successResponse, errorResponse, notFoundResponse, unAuthorizedResponse, internalServerErrorResponse } from "../../../utils/response.js"
import { incrementId, createDynamicUpdateQuery } from "../../helpers/functions.js"
import {sendMail} from "../../../config/nodemailer.js"
import {getTeamQuery} from "../../teams/models/query.js"
import {insertTeamToUser} from "../models/userTeamsQuery.js"
import {uploadImageToCloud, deleteImageFromCloud} from "../../helpers/cloudinary.js";
import {insertEmpImageQuery, deleteImageQuery} from "../../images/imagesQuery.js";
dotenv.config();

import {userRegistrationQuery, getUserDataByUsernameQuery, userDetailQuery, updateTokenQuery, updateUserProfileQuery,
        getLastEmployeeIdQuery, updateUserPasswordQuery, getAllLeaveCounts, insertUserLeaveCountQuery, checkUserNameAvailabilityQuery, insertOtpQuery, getOtpQuery,getUserDataByUserIdQuery
        ,checkUserDataByUserIdQuery, updateUserProfilePictureQuery, fetchAllEmployeeIdsQuery} from "../models/userQuery.js";

export const userRegistration = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        let id = ''
        let [emp_data] = await getLastEmployeeIdQuery();

        if (emp_data.length == 0) {
            id = 'AMEMP000'
        }else{
            id = emp_data[0].emp_id
        }
        const emp_id = await incrementId(id)
        let image_url

        const file = req.file;
        let { username, first_name, last_name, email, password,
            gender,
            blood_group,
            mobile_number,
            emergency_contact_number,
            emergency_contact_person_info,
            address,
            dob, 
            designation,
            designation_type,
            joining_date,
            experience,
            completed_projects,
            performance,
            teams,
            team_id,
            client_report, role = 'user' } = req.body;
        email = email.toLowerCase();
        const [existingUser] = await userDetailQuery([email]);
        const [existingUserName] = await checkUserNameAvailabilityQuery([username]);
        const [team_exists] = await getTeamQuery([team_id]);
        if (existingUserName.length) {
            return successResponse(res, {is_user_name_exists: true}, 'User name already exists, please choose another user name.');
        }
        if (existingUser.length) {
            return successResponse(res, '', 'User with this email already exists.');
        }
        if (team_exists.length == 0){
            return successResponse(res, '', 'No team with this name exists.');
        }

        if(file){
            const imageBuffer = file.buffer;
            let uploaded_data = await uploadImageToCloud(imageBuffer);
            await insertEmpImageQuery(["profile", uploaded_data.secure_url, uploaded_data.public_id, emp_id, file.originalname])
            image_url = uploaded_data.secure_url
        }

        const password_hash = await bcrypt.hash(password.toString(), 12);
        const [user_data] = await userRegistrationQuery([
            emp_id,
            username,
            password_hash,
            first_name,
            last_name,
            email,
            gender,
            image_url, 
            blood_group,
            mobile_number,
            emergency_contact_number,
            emergency_contact_person_info,
            address,
            dob, 
            designation,
            designation_type,
            joining_date,
            experience,
            completed_projects,
            performance,
            teams,
            client_report,
            role
        ]);

        const [data]= await insertTeamToUser([emp_id, team_id]);
    
        let [leaveTypeAndCount] = await getAllLeaveCounts();
        for(let i = 0; i < leaveTypeAndCount.length; i++) {
            let leaveType = leaveTypeAndCount[i].leave_type;
            let leaveCount = leaveTypeAndCount[i].leave_count;
            await insertUserLeaveCountQuery([emp_id, leaveType, leaveCount])
        }
        return successResponse(res, user_data, 'User successfully registered');
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
};

export const sendOtpForPasswordUpdate = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const { email } = req.body;
        const otp = Math.floor(1000 + Math.random() * 9000); // Generate a 4-digit OTP
        const otpdata = await insertOtpQuery([otp, email])
        if (otpdata[0].changedRows === 0) {
            return errorResponse(res, '', 'Sorry, User not found. Please take a moment to register for an account.');
        } else {
            const data = await sendMail(email, `${otp} is the OTP for password update. Enter the Otp and then change password after the OTP is verified!\n\n\n\nRegards,\nAmarya Business Consultancy`, 'Password Change Verification');
            return successResponse(res, data, 'OTP for password update has been sent successfully.');
        }
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
}

export const verifyEmailForPasswordUpdate = async (req, res, next)=> {
    try{
        let { otp, email } = req.body;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        otp = parseInt(otp, 10);
        const [user_exist] = await userDetailQuery([email])

        if (user_exist.length > 0) {
            const [user_otp] = await getOtpQuery([email]);
            if (otp === user_otp[0].otp) {
                return successResponse(res, [{ email: email}], 'OTP verified successfully.');
            } else {
                return errorResponse(res, '', 'Invalid OTP');
            }
        }else{
            return errorResponse(res, '', 'User not found');
        }
        
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
}

export const userLogin = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }

        const { username, password } = req.body;
        const [user] = await getUserDataByUsernameQuery([username]);
        if (user.length == 0 ){
            return notFoundResponse(res, '', 'User not found');
        }else{
            let message = '';
            let token = '';
            if (username && password) {
                const isPasswordValid = await bcrypt.compare(password, user[0].password);
                if (isPasswordValid) {
                    message = 'You are successfully logged in';
                } else {
                    return unAuthorizedResponse(res, '', 'Authentication failed');
                }
            } else {
                return notFoundResponse(res, '', 'Input fields are incorrect!');
            }
            token = jwt.sign({ user_id: user[0].emp_id, name: user[0].first_name, role:user[0].role }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRATION_TIME,
            });
            await updateTokenQuery([ token, user[0].emp_id]);
            return successResponse(res, [{ user_id: user[0].emp_id, token: token, profile_picture:user[0].profile_picture, user_name: user[0].username, role:user[0].role }], message);
        }
    }
    catch(error){
        return internalServerErrorResponse(res, error);
    }
}

export const userLogout = async (req, res, next) => {
    try {
        const user_id = req.params.id;
        console.log(user_id)
        await updateTokenQuery(["", user_id]);
        return successResponse(res, '', `You have successfully logged out!`);
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
}

export const updateUserPassword = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const { email, password, confirm_password } = req.body;
        let [user_data] = await userDetailQuery([email]);
        if (user_data.length == 0) {
            return notFoundResponse(res, '', 'User not found');
        }
        if (password === confirm_password) {
            const password_hash = await bcrypt.hash(password.toString(), 12);
            await updateUserPasswordQuery([password_hash, email]);
            return successResponse(res, 'User password updated successfully');
        } else {
            return notFoundResponse(res, '', 'Password and confirm password must be same, please try again.');
        }
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
}

export const getUserProfile = async(req,res,next) => {
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const emp_id = req.params.emp_id;
        const [user] = await getUserDataByUserIdQuery([emp_id]);
        if (user.length == 0 ){
            return notFoundResponse(res, '', 'User not found');
        }
        else{
            return successResponse(res, [user]);
        }
    }
    catch(error){
        return internalServerErrorResponse(res, error);;
    }
}

export const updateUserProfile = async(req, res, next) => {
    try{
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const id = req.params.id;
        const file = req.file;
        let table = 'users';
        const condition = {
            emp_id: id
        };
        const req_data = req.body;

        let [exist_id] = await checkUserDataByUserIdQuery([id])

        if (exist_id.length > 0) {
            if((req_data.public_id).length > 0){
                await deleteImageFromCloud(req_data.public_id);
                await deleteImageQuery([req_data.public_id])
            }
            delete req_data.public_id;
            delete req_data.file;

            if(file){
                const imageBuffer = file.buffer;
                let uploaded_data = await uploadImageToCloud(imageBuffer);
                await insertEmpImageQuery(["profile", uploaded_data.secure_url, uploaded_data.public_id, id, file.originalname])
                await updateUserProfilePictureQuery([uploaded_data.secure_url, id])
            }
            let query_values = await createDynamicUpdateQuery(table, condition, req_data)
            let [data] = await updateUserProfileQuery(query_values.updateQuery, query_values.updateValues);
            return successResponse(res, data, 'User profile updated successfully.');
        }else{
            return notFoundResponse(res, '', 'User not found.');
        }
    }
    catch(error){
        return internalServerErrorResponse(res, error);;
    }
}

export const fetchAllEmployeeIds = async(req, res, next) => {
    try{
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
       
        let [emp_ids] = await fetchAllEmployeeIdsQuery()
        return successResponse(res, emp_ids, 'Emp ids fetched successfully.');
    }
    catch(error){
        return internalServerErrorResponse(res, error);;
    }
}