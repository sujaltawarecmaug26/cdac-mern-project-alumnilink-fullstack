import ButtonBase from '@mui/material/Button';
const variants = { primary:'contained', secondary:'outlined', outline:'outlined', ghost:'text', gold:'contained', success:'contained', danger:'contained', white:'outlined' } as const;
export function Button({ children, variant='primary', className='', type='button', ...props }: any) {
 const color = variant==='danger'?'error':variant==='success'?'success':variant==='gold'?'secondary':'primary';
 return <ButtonBase type={type} variant={variants[variant] || 'contained'} color={color} className={className} disableElevation {...props}>{children}</ButtonBase>;
}
