#! /bin/bash
set -e  # Exit immediately if a command exits with a non-zero status

# Check if NEXT_PUBLIC_BACKEND_URL is set
if [ -z "$NEXT_PUBLIC_BACKEND_URL" ]; then
    echo "Warning: NEXT_PUBLIC_BACKEND_URL is not set. Using default value."
    export NEXT_PUBLIC_BACKEND_URL="http://worker-api:8080"
fi

echo "Replacing PLACEHOLDER_BACKEND_URL with: $NEXT_PUBLIC_BACKEND_URL"

# Replace the placeholder with the actual BACKEND_URL value
# Using find to handle potential limitations with shell globbing
find /dojo-ui/.next/static -type f -name "*.js" -exec sed -i "s|PLACEHOLDER_BACKEND_URL|${NEXT_PUBLIC_BACKEND_URL}|g" {} \;

# Start the application
echo "Starting Next.js application..."
npm run start