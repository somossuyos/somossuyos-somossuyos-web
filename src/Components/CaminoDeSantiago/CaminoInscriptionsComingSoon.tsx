import CaminoCommunityActions from './CaminoCommunityActions';

const CaminoInscriptionsComingSoon = () => (
  <div
    id="registro"
    className="rounded-[20px] border border-pale-skin/40 bg-white/5 p-8 sm:p-10 max-w-3xl w-full"
    role="status"
  >
    <p className="font-dark-twenty text-pale-skin text-2xl sm:text-3xl mb-4">Inscripciones próximamente</p>
    <p className="font-futura text-white/90 text-base leading-relaxed mb-8">
      Inscripciones próximamente. Estamos preparando todos los detalles de esta experiencia. Mientras tanto, el primer
      paso es unirte al grupo de WhatsApp de la peregrinación.
    </p>
    <CaminoCommunityActions variant="dark" compact />
  </div>
);

export default CaminoInscriptionsComingSoon;