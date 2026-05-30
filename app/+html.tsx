import { ScrollViewStyleReset } from "expo-router/html"
import { type PropsWithChildren } from "react"

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <ScrollViewStyleReset />
      </head>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
              const m = window.matchMedia('(prefers-color-scheme: dark)');
              const scheme = m.matches ? 'dark' : 'light';
              window.__FREEAAC_INITIAL_SCHEME__ = scheme;
              document.documentElement.style.colorScheme = scheme;
              const overlay = document.createElement('div');
              overlay.id = '__freeaac_theme_blocker__';
              overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:99999;';
              overlay.style.backgroundColor = scheme === 'dark' ? '#141313' : '#FCF8F8';
              document.body.appendChild(overlay);
            })();`,
          }}
        />
        {children}
      </body>
    </html>
  )
}