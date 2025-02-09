# official Python image
FROM python:3.11-slim

RUN apt-get update && apt-get install -y \
    wget \
    unzip \
    curl \
    gnupg2 \
    && rm -rf /var/lib/apt/lists/*

# Install Chrome with dependencies
RUN apt-get update && apt-get install -y wget gnupg2 && \
    wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add - && \
    echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" | tee /etc/apt/sources.list.d/google-chrome.list && \
    apt-get update && \
    apt-get install -y google-chrome-stable --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*


# Install ChromeDriver (match version with installed Chrome)
RUN CHROME_DRIVER_VERSION=$(curl -s https://chromedriver.storage.googleapis.com/LATEST_RELEASE) && \
    wget https://chromedriver.storage.googleapis.com/${CHROME_DRIVER_VERSION}/chromedriver_linux64.zip && \
    unzip chromedriver_linux64.zip && \
    mv chromedriver /usr/local/bin/chromedriver && \
    rm chromedriver_linux64.zip

RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

WORKDIR /app

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/package*.json .
RUN npm install

COPY backend/ .

COPY backend/.env .

RUN mkdir -p /app/data

COPY backend/data/*.csv /app/data/

# startup script
COPY start.sh .
RUN chmod +x start.sh

EXPOSE 5000

CMD ["./start.sh"]