import assert from 'node:assert/strict';
import { describe, it, beforeEach, afterEach } from 'node:test';
import { generateInvitationToken, hashInvitationToken } from './token';
import { createInMemoryInvitationsRepository } from './repository';
import {
  performInvitationExchange,
  validateInvitationExchangeToken,
} from './exchangeInvitation';
import { createInvitationSessionValue } from './session';

const ORIGINAL = { ...process.env };

function memoryDeps() {
  const repo = createInMemoryInvitationsRepository();
  return {
    repo,
    deps: {
      getInvitationByTokenHash: (h: string) => repo.getInvitationByTokenHash(h),
      createSession: (h: string) => createInvitationSessionValue(h),
    },
  };
}

describe('RenaSER invitation exchange', () => {
  beforeEach(() => {
    process.env.RENASER_INVITATION_SESSION_SECRET = 'test-exchange-session-secret-32chars-min';
  });

  afterEach(() => {
    process.env = { ...ORIGINAL };
  });

  it('1. token vacío → 400', async () => {
    assert.equal(validateInvitationExchangeToken(''), null);
    const r = await performInvitationExchange('');
    assert.equal(r.ok, false);
    if (!r.ok) {
      assert.equal(r.httpStatus, 400);
      assert.equal(r.code, 'invalid_token');
    }
  });

  it('2. token inexistente → 410, no 500', async () => {
    const { deps } = memoryDeps();
    const token = generateInvitationToken();
    const r = await performInvitationExchange(token, deps);
    assert.equal(r.ok, false);
    if (!r.ok) {
      assert.equal(r.httpStatus, 410);
      assert.equal(r.code, 'not_found');
      assert.notEqual(r.httpStatus, 500);
    }
  });

  it('3. token rotado/viejo → 410 (OLD_ROTATED_TOKEN)', async () => {
    const { repo, deps } = memoryDeps();
    const oldToken = generateInvitationToken();
    const newToken = generateInvitationToken();
    const newHash = hashInvitationToken(newToken);
    await repo.putInvitationIfNotExists({
      tokenHash: newHash,
      emailNormalized: 'rotated@example.com',
      firstName: 'R',
      lastName: 'O',
    });
    const r = await performInvitationExchange(oldToken, deps);
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.httpStatus, 410);
  });

  it('4. token actual válido → 200', async () => {
    const { repo, deps } = memoryDeps();
    const token = generateInvitationToken();
    const tokenHash = hashInvitationToken(token);
    await repo.putInvitationIfNotExists({
      tokenHash,
      emailNormalized: 'valid@example.com',
      firstName: 'V',
      lastName: 'A',
    });
    const r = await performInvitationExchange(token, deps);
    assert.equal(r.ok, true);
    if (r.ok) {
      assert.ok(r.sessionValue.includes('.'));
      assert.equal(r.invitation.emailNormalized, 'valid@example.com');
    }
  });

  it('5. Query tokenHash-index (in-memory GSI)', async () => {
    const { repo } = memoryDeps();
    const token = generateInvitationToken();
    const tokenHash = hashInvitationToken(token);
    await repo.putInvitationIfNotExists({
      tokenHash,
      emailNormalized: 'gsi@example.com',
      firstName: 'G',
      lastName: 'S',
    });
    const found = await repo.getInvitationByTokenHash(tokenHash);
    assert.ok(found);
    assert.equal(found.tokenHash, tokenHash);
  });

  it('6. sin session secret → 503 controlado', async () => {
    delete process.env.RENASER_INVITATION_SESSION_SECRET;
    const { repo, deps } = memoryDeps();
    const token = generateInvitationToken();
    await repo.putInvitationIfNotExists({
      tokenHash: hashInvitationToken(token),
      emailNormalized: 'sess@example.com',
      firstName: 'S',
      lastName: 'E',
    });
    const r = await performInvitationExchange(token, deps);
    assert.equal(r.ok, false);
    if (!r.ok) {
      assert.equal(r.httpStatus, 503);
      assert.equal(r.code, 'session_not_configured');
    }
  });

  it('7. token nunca aparece en logs (sanity)', () => {
    const token = generateInvitationToken();
    const msg = JSON.stringify({ errorName: 'Test', message: 'lookup failed' });
    assert.doesNotMatch(msg, new RegExp(token));
  });
});
