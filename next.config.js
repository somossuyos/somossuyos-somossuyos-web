/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    API_URL: process.env.API_URL,
    /**
     * Clave pública y redirect: pueden vivir como NEXT_PUBLIC_* o como WOMPI_* en Amplify.
     * El build inyecta ambas formas para el widget en el cliente.
     */
    NEXT_PUBLIC_WOMPI_PUBLIC_KEY:
      process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY || process.env.WOMPI_PUBLIC_KEY,
    NEXT_PUBLIC_WOMPI_REDIRECT_URL:
      process.env.NEXT_PUBLIC_WOMPI_REDIRECT_URL || process.env.WOMPI_REDIRECT_URL,
    WOMPI_PUBLIC_KEY: process.env.WOMPI_PUBLIC_KEY || process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY,
    WOMPI_REDIRECT_URL: process.env.WOMPI_REDIRECT_URL || process.env.NEXT_PUBLIC_WOMPI_REDIRECT_URL,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    WHATSAPP_NUMBER: process.env.WHATSAPP_NUMBER,
    NOV_ID: process.env.NOV_ID,
  },
  images:{
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'somos-suyos-cms-data-dev.s3.us-east-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'somossuyos-cms-data.s3.us-east-1.amazonaws.com',
        port: '',
        pathname: '/**',
      }
    ],
  }
}

module.exports = nextConfig
