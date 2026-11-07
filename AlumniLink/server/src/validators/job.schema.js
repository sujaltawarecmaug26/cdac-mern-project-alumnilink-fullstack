import { EXPERIENCE } from '../utils/constants.js';
import { validUrlOrEmpty } from '../middleware/validate.js';
const validateJob = (b, partial = false) => {
 const e=[]; const checks=[['company',1,100],['title',2,120],['description',10,5000],['location',1,120]];
 for(const [field,min,max] of checks){if(partial && !(field in b))continue;const n=String(b[field]||'').trim().length;if(n<min||n>max)e.push({field,message:`${field} must be between ${min} and ${max} characters`});}
 if(!partial || 'experience' in b)if(!Object.values(EXPERIENCE).includes(b.experience))e.push({field:'experience',message:'Select an experience level'});
 if('skills' in b && (!Array.isArray(b.skills)||b.skills.length>20))e.push({field:'skills',message:'Add up to 20 skills'});
 if('jobUrl' in b&&!validUrlOrEmpty(b.jobUrl))e.push({field:'jobUrl',message:'Job URL must start with http:// or https://'});
 return e;
};
const makeRule=(partial=false)=>{const rule=(b)=>validateJob(b,partial);rule.safeParse=(b)=>{const errors=rule(b);return errors.length?{success:false,error:{errors}}:{success:true,data:b};};rule.partial=()=>makeRule(true);return rule;};
export const jobSchema=makeRule();
export const applicationSchema=(b)=>String(b.note||'').length<=500?[]:[{field:'note',message:'Note must be under 500 characters'}];
const decisionRule=(b)=>['approved','rejected'].includes(b.status)?(String(b.decisionNote||'').length<=500?[]:[{field:'decisionNote',message:'Decision note is too long'}]):[{field:'status',message:'Select approved or rejected'}];
decisionRule.safeParse=(b)=>{const errors=decisionRule(b);return errors.length?{success:false,error:{errors}}:{success:true,data:b};};
export const decisionSchema=decisionRule;
export const idParamSchema=(b)=>/^\d+$/.test(String(b.id||''))?[]:[{field:'id',message:'Invalid id'}];
export const jobQuerySchema=(b)=>{const e=[];if(String(b.q||'').length>100)e.push({field:'q',message:'Search is too long'});if(b.page&&Number(b.page)<1)e.push({field:'page',message:'Page must be positive'});if(b.limit&&(Number(b.limit)<1||Number(b.limit)>30))e.push({field:'limit',message:'Limit must be between 1 and 30'});return e;};
export const applicationQuerySchema=(b)=>{const e=[];if(b.status&&!['pending','approved','rejected'].includes(b.status))e.push({field:'status',message:'Invalid status'});if(b.jobId&&!/^\d+$/.test(String(b.jobId)))e.push({field:'jobId',message:'Invalid job id'});return e;};
