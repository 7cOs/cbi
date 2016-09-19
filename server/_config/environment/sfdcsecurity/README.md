This directory contains the certificate and private key used to connect with salesforce.com.  DO NOT REMOVE OR REPLACE ANY OF THESE FILES UNLESS YOU KNOW WHAT YOU'RE DOING.

The certificates and keys were generated in the following manner:

Go to Certificate and Key Management in SFDC (i.e. for Dev: https://<yoururl>/0P1?retURL=%2Fui%2Fsetup%2FSetup%3Fsetupid%3DSecurity&setupid=CertificatesAndKeysManagement)

Generate a certificate - for Dev and Test, a self-signed certificate will work, but for Production you must create a CA-Signed Certificate.  Create it as a 2048 byte key and select "Exportable Private Key".

Go back out to the main Certificate and Key Management page and click "Export to Keystore".  You will be asked for a password.

Dev: U@kR4v6'nj'+,t>"ZX\/2c3QAp_9
Full: }{~#L488euK?s'sVq$3su[~p#.8L
Prod: w&\ggNf/3}[^eN`#qP#txPn!-.4(gag5YBNvNS!q-Gx&&tn-zk

Download the java keystore file and place in the correct environment directory (i.e. sfdcsecurity/development and sfdcsecurity/local for dev, sfdcsecurity/loadtest and sfdcsecurity/test for full, and sfdcsecurity/production for prod)

Use the following instructions to create the certificate and private key files:

You can use a tool to extract the certificate and key file from the .jks file.  I used KeyStore Explorer v 5.2.1.

Import the .jks file and then use the tool to extract the certificate and PRIVATE keyfile.

Extract the key pair = Right-Click --> Export -->  Export Key Pair

use the above password to export the key pair

To convert to .pem from .p12 use the openssl command:

openssl pkcs12 -in compass_portal.p12 -out certificate.crt -clcerts -nokeys
openssl pkcs12 -in compass_portal.p12 -out signingKey.pem -nocerts -nodes


Then, import the certificate (the .crt file) into the SAML Single Sign-On Settings.
