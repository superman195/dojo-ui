import { wait } from '@/utils/general_helpers';
import { csp_source_whitelist } from '@/utils/states';
import { useEffect, useRef, useState } from 'react';
const decodeString = (encodedString: string): string => {
  return encodedString
    .replace(/\\u003c/g, '<')
    .replace(/\\u003e/g, '>')
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
const extractScriptContent = (html: string): { scriptContent: string; remainingHtml: string } => {
  const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
  let extractedContent = '';

  // Replace only script tags without src attribute and collect their content
  const remainingHtml = html.replace(scriptRegex, (match, content, offset) => {
    // Check if the script tag has a src attribute
    if (match.includes('src=')) {
      return match; // Keep external scripts intact
    }
    extractedContent += content + '\n';
    return ''; // Remove inline script tags from HTML
  });

  // Checking for domcontentloaded and extracting everything within it
  const domContentLoadedRegex = /document\.addEventListener\(['"]DOMContentLoaded['"],\s*\(\)\s*=>\s*\{([\s\S]*)\}\);/;
  const domContentLoadedMatch = html.match(domContentLoadedRegex);
  if (domContentLoadedMatch && remainingHtml.includes('<canvas')) {
    // This step is to ensure the initial generated script SHOULD NOT
    // be wrapped in domcontentloaded, because i will be manually wrapping it
    // in the codegen viewer
    extractedContent += domContentLoadedMatch[1];
  }

  // New regex to capture window load event listeners. Use while loop to loop through all matches.
  const windowLoadRegex =
    /window\.addEventListener\(['"]load['"],\s*(?:\(\)\s*=>|function\s*\(\)\s*)\s*\{([\s\S]*?)\}\);/g;
  let windowLoadMatch;
  while ((windowLoadMatch = windowLoadRegex.exec(html)) !== null) {
    extractedContent += windowLoadMatch[1] + '\n';
  }

  return {
    scriptContent: extractedContent.trim(),
    remainingHtml,
  };
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
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

canvas {

}

#content-wrapper {
  width: 100%;
  height: 100vh;
  /* Add this to ensure proper sizing */
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
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

const JSSecurityFull = `
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
`;
const decodedJsSecurityForCanvas = `
document.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => {      
(function() {
        ##JS_SECURITY_FULL##
        ##JS_CONTENT##
      })();
          }, 100);
      });
    `.replaceAll('##JS_SECURITY_FULL##', JSSecurityFull);

const decodedJsSecurityForNonCanvas = `
        ##JS_SECURITY_FULL##
        ##JS_CONTENT##
    `.replaceAll('##JS_SECURITY_FULL##', JSSecurityFull);

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

  // This is to ensure that the iframe is resized on load and set back to 100% width height
  // Because canvas cannot load sometimes if its 100%, so need to set static
  const handleIframeLoad = async () => {
    if (!iframeRef.current) return;
    // Initial size adjustment if needed
    const parent = iframeRef.current.parentElement;
    if (parent) {
      iframeRef.current.style.width = `${parent.offsetWidth}px`;
      iframeRef.current.style.height = `${parent.offsetHeight}px`;
      await wait(100);
      iframeRef.current.style.width = '100%';
      iframeRef.current.style.height = '100%';
    }
  };

  useEffect(() => {
    // console.log('parent eth in window', 'ethereum' in window);
    // console.log('parent has cookies', !!document.cookie);
    // console.log('parent has localstorage', localStorage);
    let url = '';
    try {
      let decodedHtml = decodeString(encodedHtml);
      const { scriptContent, remainingHtml } = extractScriptContent(decodedHtml);
      decodedHtml = remainingHtml;
      let modifiedJs = '';

      // The reason for detecting canvas is that canvas
      // nmight initialize with dimensions 0 on first load, so need to wrap it in
      // domcontentloaded to ensure it loads after the page has loaded
      if (decodedHtml.includes('<canvas')) {
        modifiedJs = decodedJsSecurityForCanvas.replace('##JS_CONTENT##', scriptContent);
      } else {
        modifiedJs = decodedJsSecurityForNonCanvas.replace('##JS_CONTENT##', scriptContent);
      }
      const blob = new Blob(
        [
          htmlSanitize(
            decodedHtml
              .replace(/<head>/, `<head>${decodedCSP}${featurePolicy}`)
              .replace(/<\/body/, `<script>${modifiedJs}</script></body`)
              // .replace(/<script/, `<script>${decodedJsSecurity}</script><script`)
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
      onLoad={handleIframeLoad}
    />
  );
};

export default CodegenViewer;
