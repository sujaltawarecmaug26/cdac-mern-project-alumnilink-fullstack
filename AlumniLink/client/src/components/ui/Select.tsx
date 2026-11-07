import TextField from '@mui/material/TextField';
export function Select({ label, error, children, className = '', ...props }: any) {
  return <TextField select label={label} error={Boolean(error)} helperText={error || ''} size="small" fullWidth SelectProps={{ native: true }} className={className} {...props}>{children}</TextField>;
}
