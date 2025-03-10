#!/bin/sh

# Print environment variables
echo "Environment variables:"
env | sort

# Replace environment variables in nginx.conf
echo "Replacing environment variables in nginx.conf..."
envsubst '${BACKEND_URL} ${PORT}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# Print the generated nginx configuration
echo "Generated nginx configuration:"
cat /etc/nginx/conf.d/default.conf

# Start nginx
echo "Starting nginx..."
exec nginx -g 'daemon off;' 