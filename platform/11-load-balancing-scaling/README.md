# 11 Load Balancing & Scaling

## Owns
- Horizontal scaling strategy.
- Request limits and backpressure.
- Separation of interactive and background workloads.

## Production Requirements
- Use managed platform scaling for web/serverless.
- Move heavy media and ML detection work to background queues.
- Keep checkout/payment confirmation idempotent so retries are safe.
