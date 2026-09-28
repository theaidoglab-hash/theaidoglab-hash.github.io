# Decision brief

Status: local training record. Every record and number in this package is invented.

## The bounded decision

A fictional retail-support reviewer receives a question about a demonstration item. The system may create a **draft** only when an approved synthetic rule is current at a fixed date and can be cited. Otherwise the case goes to a human policy owner.

This is deliberately not a customer-service bot. The decision is narrower:

> Is there enough current, approved policy evidence to prepare a cited draft for a reviewer, or should the case stop for human review?

## Owner, user, and authority

| Role | Responsibility in this exercise | Authority that remains outside the starter |
| --- | --- | --- |
| Policy owner | Decides whether an exception or unclear rule can be used | Approving or changing any policy |
| Support reviewer | Reads a cited draft and decides whether it is useful | Sending a reply, changing an order, or issuing a refund |
| Starter code | Selects fixture evidence and returns a draft or handoff | Reading an account, taking payment, creating a case, or making an external change |

## Baseline and intended improvement

The baseline is a reviewer manually looking through a policy file. The local code does not claim to improve that process. It gives the reader a deterministic way to inspect one possible assistive step: filter sources by approval state and effective date, then either cite one source or stop.

The intended business value to investigate later is reduced time spent locating a valid rule **without** increasing unsupported statements. This package does not measure review time, customer outcomes, cost, revenue, conversion, or policy accuracy on real work.

## Non-goals

- No customer conversation, case handling, recommendation, or decision automation.
- No private, employer, customer, or live policy data.
- No model, API, database, credential, webhook, integration, or network request.
- No claim of policy compliance, privacy review, security approval, production readiness, or business impact.
