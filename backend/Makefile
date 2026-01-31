.PHONY: run build clean test db-start db-stop db-reset

# Run the server
run:
	go run main.go

# Build the binary
build:
	go build -o server main.go

# Run the compiled binary
start: build
	./server

# Clean build artifacts
clean:
	rm -f server

# Run tests
test:
	go test -v ./...

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
