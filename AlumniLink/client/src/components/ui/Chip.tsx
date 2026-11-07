import ChipBase from '@mui/material/Chip';
const colors={neutral:'default',primary:'primary',success:'success',warning:'warning',danger:'error',info:'info',gold:'warning',pink:'primary'};
export function Chip({children,tone='neutral',className='',onRemove}: any) { return <ChipBase size="small" label={children} color={colors[tone]||'default'} onDelete={onRemove} className={className}/>; }
