#!/usr/bin/bash

# OAUTH_ID="36hxhvujQgH8a3RNLpui2LzEOfsEYTWCxZg9PEZA"
# OAUTH_SECRET="N4PX0XCeLDlqrE2JwCvxLF6gbibflSUldAi5EBh2s8S8xefzMgSrEXispFpeQbqQyh15nA2A8IMpUhtjXsWcdY5n2W6sesyvX3CBER7vVLaSbyrS3ZTfasoEwPQJKSoq"
# OAUTH_VERIFIER="TVpCWFM5RzgxS0c0TE42NVlGNk5KVklPTllaTERZQlZXTUcySUo1QjFNOUQzRkNOTFNKSUFZVTQ1NFZFQkVKM0MxTTZBNEVROFM5NkoxSThRQlQwUklSTkRG"
# OAUTH_CHALLENGE="a_ib595JSCkxVwx55kiIqxRn1kUPh-Os_2kltNw5bUs"
# OAUTH_CODE="KkaMvDRs7QS0WOZv27o9tBs9cT48Nb"

# curl -X POST \
#     -H "Cache-Control: no-cache" \
#     -H "Content-Type: application/x-www-form-urlencoded" \
#     "http://localhost:8000/oauth/token/" \
#     -d "client_id=$OAUTH_ID" \
#     -d "client_secret=$OAUTH_SECRET" \
#     -d "code=$OAUTH_CODE" \
#     -d "code_verifier=$OAUTH_VERIFIER" \
#     -d "redirect_uri=http://localhost:8000/noexist/callback" \
#     -d "grant_type=authorization_code"

curl \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"username": "davidattenborough", "password": "boatymcboatface"}' \
  http://localhost:8000/api/token/pair
