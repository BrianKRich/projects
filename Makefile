.PHONY: run build clean test db-start db-stop db-reset frontend backend

# Backend commands
run:
	cd backend && go run main.go

build:
	cd backend && go build -o server main.go

start: build
	cd backend && ./server

clean:
	rm -f backend/server

test:
	cd backend && go test -v ./...

# Frontend commands
frontend-dev:
	cd frontend && npm run dev

frontend-build:
	cd frontend && npm run build

frontend-install:
	cd frontend && npm install

# Database commands
db-start:
	sudo service postgresql start

db-stop:
	sudo service postgresql stop

db-status:
	sudo service postgresql status

db-connect:
	psql -U xc_app -h localhost -d jones_county_xc

db-reset:
	sudo -u postgres psql -c "DROP DATABASE IF EXISTS jones_county_xc;"
	sudo -u postgres psql -c "CREATE DATABASE jones_county_xc;"
	sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE jones_county_xc TO xc_app;"
