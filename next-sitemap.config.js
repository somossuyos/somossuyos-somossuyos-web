module.exports = {
    siteUrl:'https://somossuyos.com/',
    generateRobotsTxt: true, //Genera un archivo robots.txt
    robotsTxtOptions: {
      policies: [{ userAgent: '*', allow: '/' }],
      additionalSitemaps: [
        'https://somossuyos.com/sitemap.xml',
      ],
    },
  };