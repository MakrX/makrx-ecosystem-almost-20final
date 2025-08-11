import { describe, it, expect } from 'vitest';
import FeatureFlagEngine, { DEFAULT_FLAGS } from './FeatureFlagEngine';

describe('FeatureFlagEngine role gating', () => {
  it('enforces enabledForRoles even for global scope flags', () => {
    const engine = new FeatureFlagEngine(DEFAULT_FLAGS);

    const noRoleContext = { environment: 'development', roles: ['user'] };
    const disabled = engine.evaluate('global.announcements.banner', noRoleContext);
    expect(disabled.enabled).toBe(false);

    const superadminContext = { environment: 'development', roles: ['superadmin'] };
    const enabled = engine.evaluate('global.announcements.banner', superadminContext);
    expect(enabled.enabled).toBe(true);
  });
});
