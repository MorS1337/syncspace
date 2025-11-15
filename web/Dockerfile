FROM node:20-alpine
WORKDIR /app
RUN npm init -y && npm pkg set scripts.dev="node -e 'console.log(`Web placeholder on :5173`)'; sleep 3650d"
EXPOSE 5173
CMD ["npm","run","dev"]

