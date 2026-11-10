import React, {useMemo, useState} from 'react';
import styles from './lab.module.css';

/**
 * Educational JWT decoder.
 *
 * - Decodes header and payload only (base64url → JSON). It does NOT verify the
 *   signature, because verification needs the issuer's key — the lesson is that
 *   anyone can READ a signed JWT.
 * - Runs entirely in the browser; nothing is transmitted or stored.
 * - The sample token is fabricated for this site and signed with a dummy value.
 */
const SAMPLE_HEADER = {alg: 'RS256', typ: 'JWT', kid: 'lab-demo-key-1'};
const SAMPLE_PAYLOAD = {
  iss: 'https://login.example-idp.test/lab-tenant/v2.0',
  aud: 'api://lab-hr-portal',
  sub: 'a1b2c3d4-0000-4000-8000-lab000000001',
  name: 'Lab User One',
  roles: ['HR.Reader'],
  iat: 1793990400,
  nbf: 1793990400,
  exp: 1793994000,
};

function b64urlEncode(obj: object): string {
  const json = JSON.stringify(obj);
  const b64 = btoa(json); // ASCII-only sample, so btoa is safe (available in browsers and Node 16+)
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export const SAMPLE_TOKEN = `${b64urlEncode(SAMPLE_HEADER)}.${b64urlEncode(SAMPLE_PAYLOAD)}.ZHVtbXktc2lnbmF0dXJlLWZvci1lZHVjYXRpb24`;

function b64urlDecode(part: string): string {
  if (!/^[A-Za-z0-9_-]*$/.test(part)) throw new Error('Contains characters that are not base64url.');
  const b64 = part.replace(/-/g, '+').replace(/_/g, '/');
  const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

type Decoded =
  | {ok: true; header: Record<string, unknown>; payload: Record<string, unknown>}
  | {ok: false; error: string};

export function decodeJwt(token: string): Decoded {
  const t = token.trim();
  if (t.length === 0) return {ok: false, error: 'Paste a token to decode.'};
  if (t.length > 16000) return {ok: false, error: 'Token is too long for this tool (max 16,000 characters).'};
  const parts = t.split('.');
  if (parts.length !== 3) return {ok: false, error: `A JWS-format JWT has 3 parts separated by dots; found ${parts.length}.`};
  try {
    const header = JSON.parse(b64urlDecode(parts[0]));
    const payload = JSON.parse(b64urlDecode(parts[1]));
    if (typeof header !== 'object' || header === null || typeof payload !== 'object' || payload === null) {
      return {ok: false, error: 'Header and payload must be JSON objects.'};
    }
    return {ok: true, header, payload};
  } catch (e) {
    return {ok: false, error: `Could not decode: ${(e as Error).message}`};
  }
}

const CLAIM_HELP: Record<string, string> = {
  iss: 'Issuer — who created the token. The API must check it matches the expected issuer.',
  aud: 'Audience — who the token is for. An API must reject tokens issued for another audience.',
  sub: 'Subject — a stable identifier for the user or app.',
  exp: 'Expiry (seconds since 1970-01-01 UTC). Reject the token after this time.',
  nbf: 'Not before — reject the token before this time.',
  iat: 'Issued at.',
  roles: 'Application roles assigned to the user — used for authorization decisions.',
  scp: 'Delegated permission scopes granted to the client app.',
  nonce: 'Binds an ID token to the client request to stop replay.',
};

function fmtTime(v: unknown): string | null {
  return typeof v === 'number' ? new Date(v * 1000).toISOString().replace('.000Z', 'Z') : null;
}

export default function JwtDecoder(): React.JSX.Element {
  const [token, setToken] = useState(SAMPLE_TOKEN);
  const result = useMemo(() => decodeJwt(token), [token]);

  const warnings: string[] = [];
  if (result.ok) {
    const alg = String(result.header.alg ?? '');
    if (alg.toLowerCase() === 'none') warnings.push('alg is "none" — an unsigned token. Never accept it.');
    if (!('exp' in result.payload)) warnings.push('No exp claim — the token never expires.');
    if (!('aud' in result.payload)) warnings.push('No aud claim — the token could be replayed against other APIs.');
  }

  return (
    <section className={styles.jwt} aria-label="JWT decoder exercise">
      <label className={styles.jwtLabel} htmlFor="jwt-input">
        Token (a fabricated sample is preloaded)
      </label>
      <textarea
        id="jwt-input"
        className={styles.jwtInput}
        value={token}
        spellCheck={false}
        rows={4}
        onChange={(e) => setToken(e.target.value)}
      />
      <div className={styles.jwtActions}>
        <button type="button" className="button button--sm button--secondary" onClick={() => setToken(SAMPLE_TOKEN)}>
          Reset sample
        </button>
        <small>Decoded in your browser only. Never paste a real production token into any website.</small>
      </div>

      {!result.ok ? (
        <p className={styles.jwtError} role="alert">
          {result.error}
        </p>
      ) : (
        <div className={styles.jwtGrid}>
          <div>
            <h4>Header</h4>
            <pre tabIndex={0} aria-label="Decoded JWT header">{JSON.stringify(result.header, null, 2)}</pre>
          </div>
          <div>
            <h4>Payload (claims)</h4>
            <table className={styles.jwtClaims}>
              <tbody>
                {Object.entries(result.payload).map(([k, v]) => (
                  <tr key={k}>
                    <th scope="row">
                      <code>{k}</code>
                    </th>
                    <td>
                      <code>{JSON.stringify(v)}</code>
                      {['exp', 'nbf', 'iat'].includes(k) && fmtTime(v) && <div>{fmtTime(v)}</div>}
                      {CLAIM_HELP[k] && <div className={styles.jwtHelp}>{CLAIM_HELP[k]}</div>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.jwtSig}>
            <h4>Signature</h4>
            <p>
              Not verified here. A resource server must verify it with the issuer&apos;s public key (from the
              issuer&apos;s published keys), then validate <code>iss</code>, <code>aud</code>, <code>exp</code> and{' '}
              <code>nbf</code> before trusting any claim.
            </p>
            {warnings.length > 0 && (
              <ul className={styles.jwtWarnings}>
                {warnings.map((w) => (
                  <li key={w}>⚠ {w}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
