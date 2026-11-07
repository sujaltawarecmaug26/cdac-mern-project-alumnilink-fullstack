import { Button } from './Button.tsx';

export function EmptyState({ title, message, actionLabel, onAction }) {
  return (
    <div className="rounded-card border border-dashed border-sand bg-white px-6 py-10 text-center">
      <h3 className="font-display text-xl text-cocoa">{title}</h3>
      <p className="mt-2 text-sm text-muted">{message}</p>
      {actionLabel ? (
        <Button className="mt-4" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
