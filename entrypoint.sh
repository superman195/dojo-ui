#! /bin/bash
set -e  # Exit immediately if a command exits with a non-zero status

# Check if NEXT_PUBLIC_BACKEND_URL is set
if [ -z "$NEXT_PUBLIC_BACKEND_URL" ]; then
    echo "Warning: NEXT_PUBLIC_BACKEND_URL is not set. Using default value."
    export NEXT_PUBLIC_BACKEND_URL="http://worker-api:8080"
fi

echo "Building Dojo UI with backend URL: $NEXT_PUBLIC_BACKEND_URL"

# Clear the .next folder to ensure clean build
rm -rf .next

# Build with the environment variable from docker-compose
NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL npm run build || {
    echo "Error: Build failed!"
    exit 1
}

# Start the application
echo "Starting Next.js application..."
npm run start
