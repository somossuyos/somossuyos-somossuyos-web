import assert from 'node:assert/strict';
import test from 'node:test';
import { computeAgeFromBirthDate, isAgeInAllowedRange } from './age';
import { validateCaminoInscriptionPayload } from './validateInscription';

const validBase = {
  nombreCompleto: 'Maria Lopez Garcia',
  tipoDocumento: 'CC',
  numeroDocumento: '1234567890',
  fechaNacimiento: '1995-06-15',
  sexo: 'Mujer',
  nacionalidad: 'Colombia',
  ciudadResidencia: 'Bogota',
  paisResidencia: 'Colombia',
  profesion: 'Ingeniera',
  estadoCivil: 'Soltero',
  correo: 'maria@example.com',
  telefonoMovil: '+57 3001234567',
  pasaporteVigente: 'Si',
  aceptoDatos: true,
  website: '',
  formStartedAt: Date.now() - 5000,
};

test('computeAgeFromBirthDate', () => {
  const age = computeAgeFromBirthDate('2000-01-01', new Date('2026-06-01'));
  assert.equal(age, 26);
  assert.equal(isAgeInAllowedRange(26), true);
  assert.equal(isAgeInAllowedRange(17), false);
  assert.equal(isAgeInAllowedRange(46), false);
});

test('validateCaminoInscriptionPayload accepts valid data', () => {
  const result = validateCaminoInscriptionPayload(validBase, { now: Date.now() });
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.ok(result.edad >= 18 && result.edad <= 45);
  }
});

test('validateCaminoInscriptionPayload rejects underage', () => {
  const result = validateCaminoInscriptionPayload(
    { ...validBase, fechaNacimiento: '2010-01-01' },
    { now: Date.now() },
  );
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.code, 'edad');
});

test('validateCaminoInscriptionPayload rejects honeypot', () => {
  const result = validateCaminoInscriptionPayload({ ...validBase, website: 'spam' });
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.code, 'spam_detected');
});

test('validateCaminoInscriptionPayload rejects fast submit', () => {
  const result = validateCaminoInscriptionPayload(
    { ...validBase, formStartedAt: Date.now() - 100 },
    { now: Date.now() },
  );
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.code, 'spam_detected');
});

test('validateCaminoInscriptionPayload requires privacy checkbox', () => {
  const result = validateCaminoInscriptionPayload({ ...validBase, aceptoDatos: false });
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.code, 'acepto_datos');
});