FROM node:22-alpine AS dependencies
WORKDIR /app

# Some public icon packages are pinned to Git repositories over SSH in the lockfile.
RUN apk add --no-cache git \
    && git config --global url."https://github.com/".insteadOf "ssh://git@github.com/" \
    && git config --global url."https://gitlab.com/".insteadOf "ssh://git@gitlab.com/"

COPY package.json package-lock.json ./
RUN npm ci

FROM dependencies AS build
ARG CSRF_TRUSTED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
ENV CSRF_TRUSTED_ORIGINS=${CSRF_TRUSTED_ORIGINS}
COPY . .
RUN npm run build

FROM node:22-alpine AS runtime
ENV NODE_ENV=production HOST=0.0.0.0 PORT=3000
WORKDIR /app

COPY --from=build /app/build ./build
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

EXPOSE 3000
CMD ["node", "build"]
