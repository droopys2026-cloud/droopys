/**
 * Un administrateur porte `app_metadata.role = "admin"`.
 *
 * `app_metadata` et non `user_metadata` : le second est modifiable par
 * l'utilisateur lui-même (`auth.updateUser`), le premier seulement avec la clé
 * secrète. Un rôle lu dans `user_metadata` serait un rôle que chaque client
 * peut s'attribuer. Le rôle se pose avec `npm run grant-admin`.
 */
export function isAdmin(
  user: {
    app_metadata?: Record<string, unknown>;
    user_metadata?: Record<string, unknown>;
  } | null,
): boolean {
  return user?.app_metadata?.role === "admin";
}
