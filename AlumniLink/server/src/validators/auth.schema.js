import { ROLES } from '../utils/constants.js';
import { required, validEmail, passwordErrors } from '../middleware/validate.js';
export const registerSchema = (b) => {
 const e=[]; if(String(b.name||'').trim().length<2 || String(b.name||'').length>60)e.push({field:'name',message:'Name must be between 2 and 60 characters'});
 if(!validEmail(b.email))e.push({field:'email',message:'Enter a valid email'}); e.push(...passwordErrors(b.password));
 if(![ROLES.STUDENT,ROLES.ALUMNUS].includes(b.role))e.push({field:'role',message:'Select a valid role'});
 if(!required(b.batch))e.push({field:'batch',message:'Batch is required'});
 if(b.role===ROLES.ALUMNUS){if(!required(b.company))e.push({field:'company',message:'Company is required'});if(!required(b.designation))e.push({field:'designation',message:'Designation is required'});}
 return e;
};
export const loginSchema=(b)=>{const e=[];if(!validEmail(b.email))e.push({field:'email',message:'Enter a valid email'});if(!required(b.password))e.push({field:'password',message:'Password is required'});return e;};
export const changePasswordSchema=(b)=>[...(!required(b.currentPassword)?[{field:'currentPassword',message:'Current password is required'}]:[]),...passwordErrors(b.newPassword)];
export const forgotSchema=(b)=>validEmail(b.email)?[]:[{field:'email',message:'Enter a valid email'}];
export const resetSchema=(b)=>[...(!required(b.token)?[{field:'token',message:'Reset token is required'}]:[]),...passwordErrors(b.newPassword)];
