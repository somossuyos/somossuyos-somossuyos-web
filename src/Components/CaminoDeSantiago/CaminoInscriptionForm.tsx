import LoadingSVG from '../SVG/LoadingSVG';
import { useCaminoInscriptionForm } from '@/src/customHooks/useCaminoInscriptionForm';
import {
  CAMINO_CIVIL_STATE_OPTIONS,
  CAMINO_DOCUMENT_TYPES,
  CAMINO_SEX_OPTIONS,
} from '@/src/lib/caminoDeSantiago/inscriptionTypes';
import { caminoDeSantiagoContent } from '@/src/lib/caminoDeSantiago/content';
import { countryNames } from '@/src/utils/countryNames';
import {
  CAMINO_FORM_DOM_NAMES,
  caminoSensitiveInputProps,
} from '@/src/lib/caminoDeSantiago/formDomFieldNames';

const caminoAutofillUnlock = {
  readOnly: true,
  onFocus: (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.readOnly = false;
  },
} as const;

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
      autoComplete="off"
      data-lpignore="true"
    >
      <SectionTitle>Seccion A — Datos personales</SectionTitle>

      <div className="sm:col-span-2 flex flex-col">
        <label htmlFor="scs_cam_nombre_completo" className="text-pale-skin text-[14px] mb-2">
          Nombre completo *
        </label>
        <input
          id="scs_cam_nombre_completo"
          name={CAMINO_FORM_DOM_NAMES.nombreCompleto}
          type="text"
          required
          {...caminoSensitiveInputProps}
          {...caminoAutofillUnlock}
          value={fields.nombreCompleto}
          onChange={handleChange}
          className={inputClass(false)}
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="scs_cam_tipo_documento" className="text-pale-skin text-[14px] mb-2">
          Tipo de identificacion (CC, pasaporte, etc.) *
        </label>
        <select
          id="scs_cam_tipo_documento"
          name={CAMINO_FORM_DOM_NAMES.tipoDocumento}
          autoComplete="off"
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
        <label htmlFor="scs_cam_numero_documento" className="text-pale-skin text-[14px] mb-2">
          Numero de documento (solo el numero, sin fotos ni archivos) *
        </label>
        <input
          id="scs_cam_numero_documento"
          name={CAMINO_FORM_DOM_NAMES.numeroDocumento}
          type="text"
          inputMode="text"
          required
          {...caminoSensitiveInputProps}
          {...caminoAutofillUnlock}
          value={fields.numeroDocumento}
          onChange={handleChange}
          className={inputClass(false)}
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="scs_cam_fecha_nacimiento" className="text-pale-skin text-[14px] mb-2">
          Fecha de nacimiento *
        </label>
        <input
          id="scs_cam_fecha_nacimiento"
          name={CAMINO_FORM_DOM_NAMES.fechaNacimiento}
          type="date"
          required
          autoComplete="off"
          value={fields.fechaNacimiento}
          onChange={handleChange}
          className={inputClass(false)}
        />
        {edadHint && (
          <p className={`text-xs mt-1 ${edadHint.includes('Solo') ? 'text-red-400' : 'text-white/60'}`}>{edadHint}</p>
        )}
      </div>

      <div className="flex flex-col">
        <label htmlFor="scs_cam_sexo" className="text-pale-skin text-[14px] mb-2">
          Sexo *
        </label>
        <select
          id="scs_cam_sexo"
          name={CAMINO_FORM_DOM_NAMES.sexo}
          required
          autoComplete="off"
          value={fields.sexo}
          onChange={handleChange}
          className={inputClass(false)}
        >
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
        <label htmlFor="scs_cam_nacionalidad" className="text-pale-skin text-[14px] mb-2">
          Nacionalidad *
        </label>
        <input
          id="scs_cam_nacionalidad"
          name={CAMINO_FORM_DOM_NAMES.nacionalidad}
          list="camino-paises"
          autoComplete="off"
          required
          value={fields.nacionalidad}
          onChange={handleChange}
          className={inputClass(false)}
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="scs_cam_ciudad_residencia" className="text-pale-skin text-[14px] mb-2">
          Ciudad de residencia *
        </label>
        <input
          id="scs_cam_ciudad_residencia"
          name={CAMINO_FORM_DOM_NAMES.ciudadResidencia}
          type="text"
          autoComplete="off"
          required
          value={fields.ciudadResidencia}
          onChange={handleChange}
          className={inputClass(false)}
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="scs_cam_pais_residencia" className="text-pale-skin text-[14px] mb-2">
          Pais de residencia *
        </label>
        <select
          id="scs_cam_pais_residencia"
          name={CAMINO_FORM_DOM_NAMES.paisResidencia}
          autoComplete="off"
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
        <label htmlFor="scs_cam_profesion" className="text-pale-skin text-[14px] mb-2">
          Profesion u ocupacion *
        </label>
        <input
          id="scs_cam_profesion"
          name={CAMINO_FORM_DOM_NAMES.profesion}
          type="text"
          autoComplete="off"
          required
          value={fields.profesion}
          onChange={handleChange}
          className={inputClass(false)}
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="scs_cam_estado_civil" className="text-pale-skin text-[14px] mb-2">
          Estado civil *
        </label>
        <select
          id="scs_cam_estado_civil"
          name={CAMINO_FORM_DOM_NAMES.estadoCivil}
          autoComplete="off"
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
        <label htmlFor="scs_cam_correo" className="text-pale-skin text-[14px] mb-2">
          Correo electronico principal *
        </label>
        <input
          id="scs_cam_correo"
          name={CAMINO_FORM_DOM_NAMES.correo}
          type="text"
          inputMode="email"
          required
          value={fields.correo}
          onChange={handleChange}
          className={inputClass(false)}
          {...caminoSensitiveInputProps}
          {...caminoAutofillUnlock}
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="scs_cam_telefono_movil" className="text-pale-skin text-[14px] mb-2">
          Telefono movil (WhatsApp) *
        </label>
        <p className="text-white/50 text-xs mb-2">
          Escribe tu propio numero. Si el navegador sugiere otro telefono, borralo y escribe el tuyo.
        </p>
        <input
          id="scs_cam_telefono_movil"
          name={CAMINO_FORM_DOM_NAMES.telefonoMovil}
          type="text"
          inputMode="tel"
          placeholder="+57 3001234567"
          required
          value={fields.telefonoMovil}
          onChange={handleChange}
          className={inputClass(false)}
          {...caminoSensitiveInputProps}
          {...caminoAutofillUnlock}
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="scs_cam_telefono_alternativo" className="text-pale-skin text-[14px] mb-2">
          Telefono alternativo
        </label>
        <input
          id="scs_cam_telefono_alternativo"
          name={CAMINO_FORM_DOM_NAMES.telefonoAlternativo}
          type="text"
          inputMode="tel"
          value={fields.telefonoAlternativo}
          onChange={handleChange}
          className={inputClass(false)}
          {...caminoSensitiveInputProps}
          {...caminoAutofillUnlock}
        />
      </div>

      <div className="absolute -left-[9999px] w-px h-px overflow-hidden" aria-hidden="true">
        <label htmlFor="camino_hp_field">No completar</label>
        <input id="camino_hp_field" name="scs_cam_hp" type="text" tabIndex={-1} autoComplete="off" />
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