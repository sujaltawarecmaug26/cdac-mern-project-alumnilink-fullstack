import env from '../config/env.js';
export function errorHandler(err, req, res, next) {
 if(res.headersSent)return next(err);
 if(err.statusCode)return res.status(err.statusCode).json({success:false,message:err.message,errors:err.errors||[]});
 if(err.name==='MulterError')return res.status(err.code==='LIMIT_FILE_SIZE'?413:400).json({success:false,message:err.message});
 if(err.code==='ER_DUP_ENTRY')return res.status(409).json({success:false,message:'This record already exists'});
 console.error(err);
 return res.status(500).json({success:false,message:env.isProd?'Server error':err.message||'Server error'});
}
