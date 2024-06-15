FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt requirements.txt

RUN pip install -r requirements.txt --no-cache-dir

COPY . .

ENV ENVIRONMENT=production

EXPOSE 8000

CMD ["fastapi", "run"]
