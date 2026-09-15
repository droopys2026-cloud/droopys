/** Pastille de promotion posée sur une image produit. */
export function Badge({ children }: { children: React.ReactNode }) {
  return <span className="box-badge-outline">{children}</span>;
}
