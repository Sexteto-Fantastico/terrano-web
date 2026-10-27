FROM node:24.13.1-alpine3.22 AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

# The API base URL is embedded at build time (e.g. https://api.example.com/api).
ARG VITE_API_BASE_URL
RUN test -n "$VITE_API_BASE_URL" || (echo "VITE_API_BASE_URL build arg is required" && exit 1)
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build


FROM nginx:stable-alpine AS production

# Origin of the API (scheme://host[:port]) allowed by the Content-Security-Policy; rendered at container start.
ENV API_ORIGIN=http://localhost:3000

COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
