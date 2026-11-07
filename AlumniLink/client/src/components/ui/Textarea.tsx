import TextField from '@mui/material/TextField';
export function Textarea({ label, error, className='', maxLength, value, ...props }: any) {
 return <TextField label={label} error={Boolean(error)} helperText={error || (maxLength!=null?`${(value||'').length}/${maxLength}`:'')} size="small" fullWidth multiline minRows={3} value={value} inputProps={{maxLength}} className={className} {...props}/>;
}
