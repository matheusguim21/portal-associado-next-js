/** Scopes solicitados no login — espelham o app mobile + integração do portal. */
export const OAUTH_SCOPES = [
  'READ',
  'titular:read',
  'obraMusical:read',
  'obraMusical:write',
  'fonograma:read',
  'fonograma:write',
  'arquivo_repertorio:read',
  'arquivo_repertorio:write',
  'app_foto:read',
  'app_titular:read',
  'app_obra_musical:read',
  'app_fonograma:read',
  'app_dem_soc:read',
  'app_dem_ecad:read',
  'app_estatistica_bi:read',
] as const
