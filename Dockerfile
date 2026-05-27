# --- Stage 1: Build Frontend and Emails ---
FROM node:22-slim AS builder

WORKDIR /app

# Inject public Vite variables during build
ARG VITE_DEV_BASE_URL="https://trendflowai.com"
ARG VITE_DEV_PARENT_URL="https://onflowai.com"
ARG VITE_GITHUB_URL="github.com/"
ARG VITE_FULL_GITHUB_URL="http://github.com/"
ARG VITE_TRENDS_LABEL_BASE_1="'google trends US:'"
ARG VITE_TRENDS_LINK_BASE_1="https://trends.google.com/trends/explore"
ARG VITE_TRENDS_LINK_GEO_1="US"
ARG VITE_TRENDS_LINK_LANG_1="en"
ARG VITE_TRENDS_LABEL_BASE_2="'google trends GB:'"
ARG VITE_TRENDS_LINK_BASE_2="https://trends.google.com/trends/explore"
ARG VITE_TRENDS_LINK_GEO_2="GB"
ARG VITE_TRENDS_LINK_LANG_2="en"

ENV VITE_DEV_BASE_URL=$VITE_DEV_BASE_URL
ENV VITE_DEV_PARENT_URL=$VITE_DEV_PARENT_URL
ENV VITE_GITHUB_URL=$VITE_GITHUB_URL
ENV VITE_FULL_GITHUB_URL=$VITE_FULL_GITHUB_URL
ENV VITE_TRENDS_LABEL_BASE_1=$VITE_TRENDS_LABEL_BASE_1
ENV VITE_TRENDS_LINK_BASE_1=$VITE_TRENDS_LINK_BASE_1
ENV VITE_TRENDS_LINK_GEO_1=$VITE_TRENDS_LINK_GEO_1
ENV VITE_TRENDS_LINK_LANG_1=$VITE_TRENDS_LINK_LANG_1
ENV VITE_TRENDS_LABEL_BASE_2=$VITE_TRENDS_LABEL_BASE_2
ENV VITE_TRENDS_LINK_BASE_2=$VITE_TRENDS_LINK_BASE_2
ENV VITE_TRENDS_LINK_GEO_2=$VITE_TRENDS_LINK_GEO_2
ENV VITE_TRENDS_LINK_LANG_2=$VITE_TRENDS_LINK_LANG_2

# Copy root dependency files
COPY package*.json ./

# Install root dependencies (needed for babel, emails build)
RUN npm ci

# Copy configuration and source files needed for emails build
COPY babel.config.json ./
COPY emails/ ./emails/

# Build emails
RUN npm run build:emails

# Copy client folder structure
COPY client/ ./client/

# Install client dependencies
RUN cd client && npm ci

# Build client production assets (both client and server SSR bundles)
RUN cd client && npm run build:client && npm run build:ssr

# --- Stage 2: Runtime ---
FROM node:22-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5100

# Copy root dependency files
COPY package*.json ./

# Install only production dependencies for the backend
RUN npm ci --only=production

# Copy backend files and directories
COPY server.js redisClient.js trendUploader.js ./
COPY api/ ./api/
COPY config/ ./config/
COPY controllers/ ./controllers/
COPY errors/ ./errors/
COPY middleware/ ./middleware/
COPY models/ ./models/
COPY routes/ ./routes/
COPY schedulers/ ./schedulers/
COPY services/ ./services/
COPY utils/ ./utils/

# Copy built email templates and static assets from builder stage
COPY --from=builder /app/dist/emails/ ./dist/emails/
COPY --from=builder /app/client/dist/ ./client/dist/

# Expose backend port
EXPOSE 5100

CMD ["node", "server.js"]
