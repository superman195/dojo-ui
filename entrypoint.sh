#! /bin/bash
set -e  # Exit immediately if a command exits with a non-zero status

echo "NEXT_PUBLIC_BACKEND_URL: $NEXT_PUBLIC_BACKEND_URL"

# Replace placeholders in JS files
find /dojo-ui/.next/static -type f -name "*.js" -exec sed -i "s|PLACEHOLDER_BACKEND_URL|${NEXT_PUBLIC_BACKEND_URL}|g" {} \;

# Replace placeholders in HTML files for CSP
find /dojo-ui/.next -type f -name "*.html" -exec sed -i "s|PLACEHOLDER_BACKEND_URL|${NEXT_PUBLIC_BACKEND_URL}|g" {} \;

# Start the application
echo "Starting Next.js application..."
npm run start