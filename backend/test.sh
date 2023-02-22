#!/bin/sh
# depends on curl
# use 'rm cookie' to reset session
# example date: 2023-02-26T06:58:58.478232Z

rest() {
	method="$1"
	ep="$2"
	shift 2
	curl -b cookie -c cookie -vX $method "http://localhost:8080/$ep" "$@"
}
post() {
	rest POST "$1" -H 'Content-Type: application/json' -d @-
}

case "$1" in
'')
	cat <<- EOF
	usage: $0
	    NOT-AUTHENTICATED
	        register
	            [name] [email] [password]
	        login
	            [email] [password]
	    AUTHENTICATED
	        bill
	            [debtor] [amount] [description] [due]
	        delete
	            [id]
	        housemates
	        created
	        assigned
	EOF
;; register)
	post "$1" <<- EOF
	{
		"name": "$2",
		"email": "$3",
		"password": "$4"
	}
	EOF
;; login)
	post "$1" <<- EOF
	{
		"email": "$2",
		"password": "$3"
	}
	EOF
;; bill)
	post "$1" <<- EOF
	{
		"debtor": $2,
		"amount": "$3",
		"description": "$4",
		"due": "$5"
	}
	EOF
;; delete)
	rest DELETE "bill/$2"
;; housemates|created|assigned)
	rest GET "$1"
esac
