import TextField from '@mui/material/TextField';
export function Input({ label, error, className='', id, ...props }: any) {
 const inputId=id || label?.toLowerCase().replace(/\s+/g,'-');
 return <TextField id={inputId} label={label} error={Boolean(error)} helperText={error || ''} size="small" fullWidth className={className} {...props}/>;
}
