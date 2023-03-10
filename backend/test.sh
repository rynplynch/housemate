#!/bin/sh
# depends on curl
# use "rm cookie" to reset session
# example date: 2023-03-26T06:58:58.478232Z

rest() {
	method="$1"
	ep="$2"
	shift 2
	curl -b cookie -c cookie -vX $method "http://localhost:8080/$ep" "$@"
}
post() {
	rest POST "$1" -H "Content-Type: application/json" -d @-
}

case "$1" in
"")
	cat <<- EOF
	usage: $0
	    NOT-AUTHENTICATED
	        register
	            [name] [email] [password]
	        login
	            [email] [password]
	    AUTHENTICATED
	        mkhousehold
	            [name]
	        invite
	            [email]
	        mkbill
	            [debtor] [amount] [description] [due]
	        mkpayment
	            [bill] [amount]
	        validate
	            [date] [bill] [valid]
	        payments
	            [bill]
	        rmbill
	            [bill]
	        rmpayment
	            [bill] [date]
	        housemates
	        household
	        created
	        assigned
	        unregister
	        logout
	        leave
	EOF
;; register)
	post "register" <<- EOF
	{
		"name": "$2",
		"email": "$3",
		"password": "$4"
	}
	EOF
;; login)
	post "login" <<- EOF
	{
		"email": "$2",
		"password": "$3"
	}
	EOF
;; mkhousehold)
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
;; mkbill)
	post "bills" <<- EOF
	{
		"debtor": "$2",
		"amount": "$3",
		"description": "$4",
		"due": "$5"
	}
	EOF
;; mkpayment)
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
;; housemates)
	rest GET "household/roommates"
;; household)
	rest GET "household"
;; created)
	rest GET "bills/created"
;; assigned)
	rest GET "bills/assigned"
;; payments)
	rest GET "payments/$2"
;; unregister)
	rest DELETE "register"
;; logout)
	rest DELETE "login"
;; leave)
	rest DELETE "household"
;; rmbill)
	rest DELETE "bills/$2"
;; rmpayment)
	rest DELETE "payments/$2/$3"
esac
