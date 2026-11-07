import Paper from '@mui/material/Paper';
export function Card({ children, className='', as: Tag, ...props }: any) {
 if (Tag) return <Tag className={`rounded-card border border-sand/80 bg-white shadow-soft ${className}`} {...props}>{children}</Tag>;
 return <Paper elevation={0} className={`rounded-card border border-sand/80 bg-white shadow-soft ${className}`} {...props}>{children}</Paper>;
}
