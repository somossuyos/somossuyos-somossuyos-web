import Head from 'next/head';
import type { GetServerSideProps } from 'next';
import { getMemoriasCongresoCourseSlug } from '@/src/lib/shop/memoriasCongresoCourse';
import { validateSharedBenefitKey } from '@/src/lib/renaserBenefit/validateKey';
import {
  benefitSessionCookieHeader,
  createBenefitSessionValue,
} from '@/src/lib/renaserBenefit/session';

type Props = { state: 'invalid' | 'misconfigured' };

export default function RenaserBeneficioPage({ state }: Props) {
  return (
    <>
      <Head>
        <title>RenaSER 2026 | Somos Suyos</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <main className="mx-auto max-w-lg px-6 py-16 font-futura text-[#1d1d1f]">
        <p className="rounded-lg bg-[#f5f5f7] p-4 text-[15px] text-[#6e6e73]">
          {state === 'misconfigured'
            ? 'El beneficio no está disponible en este momento. Intenta más tarde o contacta a Somos Suyos.'
            : 'Este enlace no es válido o ha expirado.'}
        </p>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const k = typeof ctx.query.k === 'string' ? ctx.query.k : '';
  if (!validateSharedBenefitKey(k)) {
    ctx.res.statusCode = 403;
    return { props: { state: 'invalid' } };
  }

  const sessionValue = createBenefitSessionValue();
  if (!sessionValue) {
    ctx.res.statusCode = 503;
    return { props: { state: 'misconfigured' } };
  }

  ctx.res.setHeader('Set-Cookie', benefitSessionCookieHeader(sessionValue));
  const slug = getMemoriasCongresoCourseSlug();
  return {
    redirect: {
      destination: `/tienda/curso/${slug}?renaserBeneficio=1`,
      permanent: false,
    },
  };
};
