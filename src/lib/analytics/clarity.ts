/** Microsoft Clarity — ID del proyecto Somos Suyos */
export const CLARITY_PROJECT_ID = 'wtojh3ewr0';

/** Snippet oficial Clarity (sin etiquetas <script>). */
export function getClarityInlineScript(projectId: string = CLARITY_PROJECT_ID): string {
  return `
(function(c,l,a,r,i,t,y){
  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "${projectId}");
  `.trim();
}
