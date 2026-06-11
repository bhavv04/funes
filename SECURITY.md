# Security Policy

## Supported Versions

funes is currently in early development. Security fixes are applied to the latest version only.

| Version | Supported |
|---------|-----------|
| 0.x (latest) | ✅ |
| older | ❌ |

## Reporting a Vulnerability

If you find a security vulnerability in funes, please do not open a public GitHub issue.

Instead, report it privately by emailing:

**bhavdeeparora1@gmail.com**

Include as much detail as possible:
- A description of the vulnerability
- Steps to reproduce it
- The potential impact
- Any suggested fix if you have one

You can expect a response within 48 hours. If the issue is confirmed, a fix will be prioritized and released as soon as possible. You will be credited in the release notes unless you prefer to remain anonymous.

## Scope

funes is a local-only tool — no servers, no cloud, no external data transmission by default. That said, the following areas are in scope for security reports:

- **Local privilege escalation** — anything that allows funes to access files or directories beyond what the user explicitly configured
- **Sensitive file exposure** — bugs that cause funes to index files matching exclusion rules (e.g. `.env`, `*.secret`)
- **Ollama endpoint abuse** — anything that could cause funes to send unexpected data to the configured Ollama endpoint
- **Daemon vulnerabilities** — issues with the background process that could be exploited locally
- **Dependency vulnerabilities** — known CVEs in funes dependencies that have a credible exploit path

The following are out of scope:

- Vulnerabilities in Ollama itself — report those to the Ollama project
- Attacks that require physical access to the machine
- Social engineering

## Security Model

funes is designed with privacy and local control as core principles:

- All data stays on your machine — nothing is sent to external servers
- The vector database is stored at `~/.funes/db` and is only accessible by the current user
- funes respects exclusion rules defined in `~/.funes/config.toml`
- No telemetry, no analytics, no network calls except to the locally running Ollama instance

We take the local-first promise seriously. Any bug that compromises it is treated as a critical security issue.