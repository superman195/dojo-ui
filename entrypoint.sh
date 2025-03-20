#! /bin/bash
set -e  # Exit immediately if a command exits with a non-zero status

echo "NEXT_PUBLIC_BACKEND_URL: $NEXT_PUBLIC_BACKEND_URL"
echo "NEXT_PUBLIC_GA_TAG: $NEXT_PUBLIC_GA_TAG"

# Replace placeholders in JS files
find /dojo-ui/.next/static -type f -name "*.js" -exec sed -i "s|PLACEHOLDER_BACKEND_URL|${NEXT_PUBLIC_BACKEND_URL}|g" {} \;

# Replace placeholders in HTML files for CSP
find /dojo-ui/.next -type f -name "*.html" -exec sed -i "s|PLACEHOLDER_BACKEND_URL|${NEXT_PUBLIC_BACKEND_URL}|g" {} \;

# Fix Google Analytics initialization errors
find /dojo-ui/.next/static -type f -name "*.js" -exec sed -i "s|NEXT_PUBLIC_GA_TAG|${NEXT_PUBLIC_GA_TAG}|g" {} \;

# Conditionally remove CSP restrictions if needed
if [ "$DISABLE_CSP" = "true" ]; then
  echo "Disabling Content Security Policy..."
  find /dojo-ui/.next -type f -name "*.html" -exec sed -i 's/<meta[^>]*Content-Security-Policy[^>]*>//g' {} \;
fi

# Start the application
echo "Starting Next.js application..."
npm run start