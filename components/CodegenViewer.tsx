import { csp_source_whitelist } from '@/utils/states';
import { useEffect, useRef, useState } from 'react';
const decodeString = (encodedString: string): string => {
  return encodedString
    .replace(/\\u003c/g, '<')
    .replace(/\\u003e/g, '>')
    .replace(/\\n/g, '\n')
    .replace(/\\"/g, '"');
};

const replaceLinksWithBlanks = (html: string): string => {
  // Replace anchor tags
  html = html.replace(/<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/g, '<a href="#"');

  // Replace window.location assignments
  html = html.replace(/window\.location(?:\.href)?\s*=\s*(['"])(.*?)\1/g, '');
  html = html.replace(/window\.location(?:\.assign)?\s*=\s*(['"])(.*?)\1/g, '');
  html = html.replace(/window\.location(?:\.replace)?\s*=\s*(['"])(.*?)\1/g, '');

  return html;
};

interface CodegenVisProps {
  encodedHtml: string;
}
const featurePolicy = `<meta http-equiv="Feature-Policy" content="
  camera 'none';
  microphone 'none';
  geolocation 'none';
  accelerometer 'none';
  gyroscope 'none';
  magnetometer 'none';
  payment 'none';
  usb 'none';
">`;
const decodedCSP = `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline' ${csp_source_whitelist.join(' ')}; style-src 'unsafe-inline'; media-src 'self' blob: data:; img-src data: blob: https://threejsfundamentals.org; connect-src 'none'; form-action 'none'; base-uri 'none';">`;
const iFrameStyles = `
body {


}
#content-wrapper {
}
/* Scrollbar styles */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: hsl(30, 3%, 15%) !important;
  border-radius: 12px;
  width: 10px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: hsla(175, 100%, 36%, 0.704);
  border-radius: 12px;
  border: 2px solid hsl(30, 3%, 15%); /* Add a border to create padding effect */
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: hsl(175, 100%, 36%);
}

/* Additional styles to ensure transparency */
::-webkit-scrollbar-track-piece {
  background: hsl(30, 3%, 15%);
}

::-webkit-scrollbar-corner {
  background: hsl(30, 3%, 15%);
}
`;
const decodedJsSecurity = `
      (function() {
        // Clear any existing globals if want to be eeven more finegrained. but some prompt response may fail to run
        // Object.keys(window).forEach(key => {
        //   if (['location'].includes(key)) {
        //     delete window[key];
        //   }
        // });

        // Remove or restrict access to navigation-related functions and properties
        const restrictedNavigation = [
          'location',
          'history',
          'navigate',
          'open',
          'postMessage',
          'pushState',
          'replaceState',
          'assign',
          'reload',
          'href'
        ];

        restrictedNavigation.forEach(prop => {
          if (prop in window) {
            delete window[prop];
          }
          if (prop in document) {
            delete document[prop];
          }
        });

        // Overwrite window.open
        window.open = function() {
          console.warn('window.open is disabled for security reasons');
          return null;
        };

        // Disable navigation events
        ['popstate', 'hashchange', 'beforeunload'].forEach(event => {
          window.addEventListener(event, function(e) {
            e.preventDefault();
            e.stopPropagation();
          }, true);
        });
        

        // Disable cookie access
        Object.defineProperty(document, 'cookie', {
        get: function() { return ''; },
        set: function() { return true; }
        });

        // Restrict access to parent window
        window.parent = null;
        window.top = null;

        // Disable potentially dangerous APIs
        delete window.XMLHttpRequest;
        delete window.fetch;
        delete window.WebSocket;

        // Attempt to detect and disable extension content scripts
        if (window.chrome && window.chrome.runtime) {
            delete window.chrome.runtime;
        }

        // Restrict access to sensitive globals
        const restrictedGlobals = ['localStorage', 'sessionStorage', 'indexedDB', 'webkitIndexedDB', 'mozIndexedDB', 'msIndexedDB'];
        restrictedGlobals.forEach(prop => {
            Object.defineProperty(window, prop, {
                get: function() { return 'Access denied'; },
                set: function() { return 'Access denied'; }
            });
        });

        // console.log("iframe eth in window",'ethereum' in window)
        // console.log("iframe has cookies",!!document.cookie)
        // console.log("iframe has localstorage",localStorage)
      })();
    `;

const htmlSanitize = (payload: string) => {
  return replaceLinksWithBlanks(payload);
  // return payload
  //   .replaceAll('<', '&lt;')
  //   .replaceAll('>', '&gt;')
  //   .replaceAll('&', '&amp;')
  //   .replaceAll("'", '&#39;')
  //   .replaceAll('"', '&quot;');
};

const CodegenViewer = ({ encodedHtml }: CodegenVisProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeSrc, setIframeSrc] = useState<string | null>(null);
  const [urlString, setUrlString] = useState('');
  useEffect(() => {
    // console.log('parent eth in window', 'ethereum' in window);
    // console.log('parent has cookies', !!document.cookie);
    // console.log('parent has localstorage', localStorage);
    let url = '';
    try {
      const decodedHtml = decodeString(encodedHtml);

      const blob = new Blob(
        [
          htmlSanitize(
            decodedHtml
              .replace(/<head>/, `<head>${decodedCSP}${featurePolicy}`)
              .replace(/<script/, `<script>${decodedJsSecurity}</script><script`)
              .replace(/<style>/, `<style>${iFrameStyles}`)
          ),
        ],
        { type: 'text/html' }
      );
      url = URL.createObjectURL(blob);
      setIframeSrc(url);
      setUrlString(url);
    } catch (err) {}
    return () => {
      url && URL.revokeObjectURL(url);
      setUrlString('');
    };
  }, [encodedHtml]);

  return (
    <iframe
      referrerPolicy="no-referrer"
      allowFullScreen={false}
      key={urlString}
      ref={iframeRef}
      sandbox="allow-scripts"
      src={iframeSrc || ''}
      title="Dynamic Visualization"
      style={{ border: 'none', display: 'block' }}
      className="aspect-square w-full min-w-[400px]"
    />
  );
};

export default CodegenViewer;
