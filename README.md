# Cloudflare worker staging auth

This repo is designed as an example of how to protect a staging environment in a zero trust environment using cloudflare workers.

## Why?

_Why would you want to do this? Why isn't normal authentication enough?_

There are parts of a web presence that need to be public in production environments. Think brochure pages, announcement pages and even the home page of your website. These are important parts of your web presence and it's important that you are able to develop new features in private and only show them to the correct people.
Historically this has been done using allow lists of IP addresses. This works OK but requires that the lists are maintained. Over time they grow and it means that any traffic coming from an IP address on the allow list is able to access your protected sites.

What this repo does is protect https://stage.saladsimulator.com using Auth0 authentication. It doesn't matter what IP address a request is coming from the user must have a cookie present on the request. This cookie can only be obtained by logging in with Auth0. This means it doesn't matter where you are coming from you have to be able to prove who you are before you are able to access the staging environment.

# Deploying

This is deployed via Github Actions on push to the main branch.
