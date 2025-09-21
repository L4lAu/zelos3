export function verificaPermissao(user, rolesPermitidas = []) {
  if (!user || !user.role) return false;
  return rolesPermitidas.includes(user.role);
}