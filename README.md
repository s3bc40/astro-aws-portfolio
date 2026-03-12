# portfolio-astro

Personal developer portfolio for s3bc40 / Sébastien Claro.
Live at [s3bc40.com](https://www.s3bc40.com)

## Stack

- **Framework**: Astro 5 (static output, zero JS framework)
- **Fonts**: Inter + JetBrains Mono
- **Deployment**: AWS S3 + CloudFront
- **CI/CD**: GitHub Actions with OIDC authentication (no static credentials)
- **DNS**: Vercel DNS → CloudFront

## Architecture

```
GitHub (push to main)
        |
        v
GitHub Actions
├── npm run build (Astro → dist/)
├── OIDC token → AWS STS → IAM Role (scoped)
├── aws s3 sync dist/ → S3 (private bucket, OAC)
└── CloudFront invalidation /*
        |
        v
CloudFront (HTTPS, TLS 1.3, EU price class)
├── Origin: S3 via OAC (never public)
├── ACM cert (us-east-1)
└── Custom error: 403/404 → index.html
        |
        v
s3bc40.com (Vercel DNS CNAME → CloudFront)
```

## Deploy

Push to `main` — pipeline runs automatically.

Required GitHub secrets:
- `AWS_ROLE_ARN`
- `AWS_S3_BUCKET`
- `CLOUDFRONT_DISTRIBUTION_ID`

## Local dev

```bash
npm install
npm run dev
```

## Security notes

- S3 bucket is fully private — no public access
- CloudFront accesses S3 via OAC only
- GitHub Actions uses OIDC (short-lived tokens, no stored credentials)
- IAM role scoped to S3 read/write + CloudFront invalidation only
