const CaminoPaymentSection = () => {
  return (
    <section id="pago" className="scroll-mt-32 py-16 border-t border-white/10 font-futura text-white/90">
      <h2 className="font-stretch-pro text-pale-skin text-2xl sm:text-3xl mb-4">RESERVAS Y FORMAS DE PAGO:</h2>
      <ul className="list-disc pl-5 space-y-3 mb-6 max-w-3xl">
        <li>PAGO ÚNICO: 1.670 € (Con descuento incluido) Hasta el 30 de Enero de 2027)</li>
        <li>
          Pago Diferido:
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Pago 1: 531 € (Inscripción y reserva del cupo) – Hasta el 30 de diciembre de 2026</li>
            <li>Pago 2: 413 € - Hasta el 30 de enero de 2027</li>
            <li>Pago 3: 413 € – Hasta el 28 de febrero de 2027</li>
            <li>Pago 4: 413 € - Hasta el 30 de Marzo de 2027</li>
          </ul>
        </li>
      </ul>
      <div className="space-y-3 max-w-3xl text-sm sm:text-base leading-relaxed">
        <p>*** Cupos limitados.</p>
        <p>No te quedes sin vivir esta maravillosa experiencia espiritual con nosotros.</p>
        <p>Diligencia el formulario, únete al grupo de whatspp y recibirás toda la información.</p>
        <p>
          El pago se recibe en pesos de acuerdo con el valor en euros vigente en casas de cambio, al momento de
          realizar la transacción.
        </p>
      </div>
    </section>
  );
};

export default CaminoPaymentSection;