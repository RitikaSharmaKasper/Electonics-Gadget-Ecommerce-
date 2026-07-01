# FROM node:20-alpine

# WORKDIR /app

# # Install Chromium dependencies
# RUN apt-get update && apt-get install -y \
#     chromium \
#     fonts-liberation \
#     libatk-bridge2.0-0 \
#     libatk1.0-0 \
#     libcups2 \
#     libdbus-1-3 \
#     libdrm2 \
#     libgbm1 \
#     libgtk-3-0 \
#     libnspr4 \
#     libnss3 \
#     libx11-xcb1 \
#     libxcomposite1 \
#     libxdamage1 \
#     libxfixes3 \
#     libxrandr2 \
#     xdg-utils \
#     wget \
#     ca-certificates \
#     && rm -rf /var/lib/apt/lists/*

# COPY package*.json ./

# RUN npm install --omit=dev

# COPY . .

# EXPOSE 5000

# CMD ["node", "server.js"]


FROM node:22

WORKDIR /app

# Install Chromium dependencies
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-liberation \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    xdg-utils \
    wget \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]