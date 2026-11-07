const tones = {
  success: 'border-success/30 bg-green-50 text-success',
  danger: 'border-danger/30 bg-red-50 text-danger',
  info: 'border-info/30 bg-blue-50 text-info',
};

export function Toast({ message, tone = 'info' }) {
  return (
    <div
      className={`min-w-[240px] rounded-xl border px-4 py-3 text-sm shadow-soft ${tones[tone] || tones.info}`}
    >
      {message}
    </div>
  );
}
