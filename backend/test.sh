#!/bin/sh
# depends on curl
# use 'rm cookie' to reset session
# example date: 2023-03-26T06:58:58.478232Z

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
;; register)
	post "register" <<- EOF
	{
		"name": "$2",
		"email": "$3",
		"password": "$4"
	}
	EOF
;; unregister)
	rest DELETE "register"

;; login)
	post "login" <<- EOF
	{
		"email": "$2",
		"password": "$3"
	}
	EOF
;; logout)
	rest DELETE "login"

;; create_household)
	post "household" <<- EOF
	{
		"name": "$2"
	}
	EOF
;; invite)
	post "household/invite" <<- EOF
	{
		"email": "$2"
	}
	EOF
;; housemates)
	rest GET "household/roommates"
;; household)
	rest GET "household"
;; leave)
	rest DELETE "household"

;; bill)
	post "bills" <<- EOF
	{
		"debtor": "$2",
		"amount": "$3",
		"description": "$4",
		"due": "$5"
	}
	EOF
;; created)
	rest GET "bills/created"
;; assigned)
	rest GET "bills/assigned"
;; delete_bill)
	rest DELETE "bills/$2"

;; create_payment)
	post "payments" <<- EOF
	{
		"bill": "$2",
		"amount": "$3"
	}
	EOF
;; validate)
	post "payments/validate" <<- EOF
	{
		"id": "$2",
		"bill": "$3",
		"valid": $4
	}
	EOF
;; payments)
	rest GET "payments/$2"
;; delete_payment)
	rest DELETE "payments/$2/$3"
esac
