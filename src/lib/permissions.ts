export type PermissionsMap = Record<string, string[]>;

export function can(
  permissions: PermissionsMap | null | undefined,
  resource: string,
  action: string,
): boolean {
  if (!permissions) return false;
  const actions = permissions[resource];
  if (!actions) return false;
  return actions.includes(action);
}

export function flattenPermissions(
  response: Record<string, Array<Record<string, string[]>>> | undefined,
): PermissionsMap {
  const map: PermissionsMap = {};
  if (!response) return map;

  for (const moduleGroup of Object.values(response)) {
    for (const section of moduleGroup) {
      for (const [resource, actions] of Object.entries(section)) {
        const key = toResourceKey(resource);
        map[key] = actions.map((a) => a.toLowerCase());
      }
    }
  }

  return map;
}

function toResourceKey(key: string): string {
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .toUpperCase();
}
