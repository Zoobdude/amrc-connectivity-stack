#
# AMRC ACS UNS Ingester
# Copyright "2023" AMRC
#

# bin/bash
tmpfile=$(mktemp)
export CLIENT_KEYTAB="$(kubectl --kubeconfig ~/.kube/p2.yaml get -n factory-plus secret krb5-keytabs -o jsonpath="{.data.sv1warehouse}" | base64 -d >"$tmpfile" && echo "$tmpfile")"
npm run start:shell