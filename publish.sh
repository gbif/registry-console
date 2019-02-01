# die on error
set -e

# https://www.netlify.com/docs/webhooks/
curl -X POST -d {} https://api.netlify.com/build_hooks/$NETLIFY_DEPLOY_WEBHOOK