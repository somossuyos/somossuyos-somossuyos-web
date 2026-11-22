import LoadingSVG from '../SVG/LoadingSVG';
import { useCaminoInscriptionForm } from '@/src/customHooks/useCaminoInscriptionForm';
import {
  CAMINO_CIVIL_STATE_OPTIONS,
  CAMINO_DOCUMENT_TYPES,
  CAMINO_PASSPORT_VALID_OPTIONS,
  CAMINO_SEX_OPTIONS,
} from '@/src/lib/caminoDeSantiago/inscriptionTypes';
import { caminoDeSantiagoContent } from '@/src/lib/caminoDeSantiago/content';
import { countryNames } from '@/src/utils/countryNames';

const inputClass = (invalid: boolean) =>
  `${invalid ? 'border-red-500' : 'border-transparent'} border-2 outline-none px-3 py-2 text-[14px] rounded-[10px] text-black bg-white w-full`;

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="font-stretch-pro text-pale-skin text-lg sm:text-xl col-span-full mt-4 mb-2">{children}</h3>
);

const CaminoInscriptionForm = () => {
  const { fields, edadHint, loading, completed, errorMessage, handleChange, handleSubmit } =
    useCaminoInscriptionForm();
  const { inscription } = caminoDeSantiagoContent;

  if (completed) {
    return (
      <div
        id="registro"
        className="rounded-[20px] border border-pale-skin/40 bg-white/5 p-8 max-w-xl w-full"
        role="status"
      >
        <p className="font-dark-twenty text-pale-skin text-3xl mb-4">{inscription.successTitle}</p>
        <p className="font-futura text-white/90 text-base leading-relaxed">{inscription.successMessage}</p>
      </div>
    );
  }

  return (
    <form
      id="registro"
      className="grid sm:grid-cols-2 gap-4 w-full max-w-3xl"
      onSubmit={handleSubmit}
      noValidate
    >
      <p className="sm:col-span-2 font-futura text-sm text-white/70">{inscription.ageNotice}</p>

      <SectionTitle>Seccion A — Datos personales</SectionTitle>

      <div className="sm:col-span-2 flex flex-col">
        <label htmlFor="nombreCompleto" className="text-pale-skin text-[14px] mb-2">
          Nombre completo *
        </label>
        <input
          id="nombreCompleto"
          name="nombreCompleto"
          type="text"
          autoComplete="name"
          required
          value={fields.nombreCompleto}
          onChange={handleChange}
          className={inputClass(false)}
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="tipoDocumento" className="text-pale-skin text-[14px] mb-2">
          Tipo de documento *
        </label>
        <select
          id="tipoDocumento"
          name="tipoDocumento"
          required
          value={fields.tipoDocumento}
          onChange={handleChange}
          className={inputClass(false)}
        >
          <option value="" disabled>
            Seleccione
          </option>
          {CAMINO_DOCUMENT_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label htmlFor="numeroDocumento" className="text-pale-skin text-[14px] mb-2">
          Numero de documento *
        </label>
        <input
          id="numeroDocumento"
          name="numeroDocumento"
          type="text"
          inputMode="text"
          autoComplete="off"
          required
          value={fields.numeroDocumento}
          onChange={handleChange}
          className={inputClass(false)}
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="fechaNacimiento" className="text-pale-skin text-[14px] mb-2">
          Fecha de nacimiento *
        </label>
        <input
          id="fechaNacimiento"
          name="fechaNacimiento"
          type="date"
          required
          value={fields.fechaNacimiento}
          onChange={handleChange}
          className={inputClass(false)}
        />
        {edadHint && (
          <p className={`text-xs mt-1 ${edadHint.includes('Solo') ? 'text-red-400' : 'text-white/60'}`}>{edadHint}</p>
        )}
      </div>

      <div className="flex flex-col">
        <label htmlFor="sexo" className="text-pale-skin text-[14px] mb-2">
          Sexo *
        </label>
        <select id="sexo" name="sexo" required value={fields.sexo} onChange={handleChange} className={inputClass(false)}>
          <option value="" disabled>
            Seleccione
          </option>
          {CAMINO_SEX_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label htmlFor="nacionalidad" className="text-pale-skin text-[14px] mb-2">
          Nacionalidad *
        </label>
        <input
          id="nacionalidad"
          name="nacionalidad"
          list="camino-paises"
          required
          value={fields.nacionalidad}
          onChange={handleChange}
          className={inputClass(false)}
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="ciudadResidencia" className="text-pale-skin text-[14px] mb-2">
          Ciudad de residencia *
        </label>
        <input
          id="ciudadResidencia"
          name="ciudadResidencia"
          type="text"
          required
          value={fields.ciudadResidencia}
          onChange={handleChange}
          className={inputClass(false)}
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="paisResidencia" className="text-pale-skin text-[14px] mb-2">
          Pais de residencia *
        </label>
        <select
          id="paisResidencia"
          name="paisResidencia"
          required
          value={fields.paisResidencia}
          onChange={handleChange}
          className={inputClass(false)}
        >
          {countryNames.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label htmlFor="profesion" className="text-pale-skin text-[14px] mb-2">
          Profesion u ocupacion *
        </label>
        <input
          id="profesion"
          name="profesion"
          type="text"
          required
          value={fields.profesion}
          onChange={handleChange}
          className={inputClass(false)}
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="estadoCivil" className="text-pale-skin text-[14px] mb-2">
          Estado civil *
        </label>
        <select
          id="estadoCivil"
          name="estadoCivil"
          required
          value={fields.estadoCivil}
          onChange={handleChange}
          className={inputClass(false)}
        >
          <option value="" disabled>
            Seleccione
          </option>
          {CAMINO_CIVIL_STATE_OPTIONS.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
      </div>

      <SectionTitle>Seccion B — Informacion de contacto</SectionTitle>

      <div className="sm:col-span-2 flex flex-col">
        <label htmlFor="correo" className="text-pale-skin text-[14px] mb-2">
          Correo electronico principal *
        </label>
        <input
          id="correo"
          name="correo"
          type="email"
          autoComplete="email"
          required
          value={fields.correo}
          onChange={handleChange}
          className={inputClass(false)}
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="telefonoMovil" className="text-pale-skin text-[14px] mb-2">
          Telefono movil (WhatsApp) *
        </label>
        <input
          id="telefonoMovil"
          name="telefonoMovil"
          type="tel"
          placeholder="+57 3001234567"
          autoComplete="tel"
          required
          value={fields.telefonoMovil}
          onChange={handleChange}
          className={inputClass(false)}
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="telefonoAlternativo" className="text-pale-skin text-[14px] mb-2">
          Telefono alternativo
        </label>
        <input
          id="telefonoAlternativo"
          name="telefonoAlternativo"
          type="tel"
          value={fields.telefonoAlternativo}
          onChange={handleChange}
          className={inputClass(false)}
        />
      </div>

      <SectionTitle>Seccion C — Aspectos migratorios</SectionTitle>

      <div className="sm:col-span-2 flex flex-col">
        <span className="text-pale-skin text-[14px] mb-2">
          Pasaporte vigente minimo hasta diciembre de 2027 *
        </span>
        <div className="flex flex-wrap gap-4">
          {CAMINO_PASSPORT_VALID_OPTIONS.map((opt) => (
            <label key={opt} className="flex items-center gap-2 font-futura text-sm text-white/90">
              <input
                type="radio"
                name="pasaporteVigente"
                value={opt}
                checked={fields.pasaporteVigente === opt}
                onChange={handleChange}
                required
              />
              {opt}
            </label>
          ))}
        </div>
      </div>

      <SectionTitle>Seccion D — Proteccion de datos</SectionTitle>

      <div className="sm:col-span-2 flex items-start gap-3">
        <input
          id="aceptoDatos"
          name="aceptoDatos"
          type="checkbox"
          checked={fields.aceptoDatos}
          onChange={handleChange}
          className="mt-1"
          required
        />
        <label htmlFor="aceptoDatos" className="font-futura text-sm text-white/85">
          Acepto el{' '}
          <a
            href={inscription.privacyPolicyHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-pale-skin underline"
          >
            tratamiento de datos personales
          </a>{' '}
          de Somos Suyos. *
        </label>
      </div>

      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {errorMessage && (
        <p className="sm:col-span-2 text-red-400 text-sm" role="alert">
          {errorMessage}
        </p>
      )}

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto text-black bg-pale-skin px-12 py-3 rounded-full font-bold disabled:opacity-50"
        >
          {loading ? <LoadingSVG /> : 'ENVIAR INSCRIPCION'}
        </button>
      </div>

      <datalist id="camino-paises">
        {countryNames.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>
    </form>
  );
};

export default CaminoInscriptionForm;