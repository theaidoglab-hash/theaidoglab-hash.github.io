# Data contract and public-source route

## Why this project does not start with a dashboard

An official series can look tidy while still being unsafe to interpret. A value without its reference period, unit, adjustment method, geography, release/revision state, and source receipt is not enough to support a human brief. This reference makes those fields part of the contract before any model-shaped step exists.

## The local fixture

`data/series.fixture.json` is intentionally synthetic. It has a fictional geography, a synthetic adjustment label, and synthetic values. `data/source-manifest.fixture.json` marks it `synthetic_source_shaped_not_live_acquired`.

That distinction is not cosmetic. It prevents a reader from accidentally presenting toy values as an official statistic or using a local passing test as evidence of a live-data pipeline.

## A later public-data acquisition design

The recorded route is the ABS [Data API user guide](https://www.abs.gov.au/statistics/application-programming-interfaces-apis/data-api-user-guide), the [Labour Force, Australia release collection](https://www.abs.gov.au/statistics/labour/employment-and-unemployment/labour-force-australia), and the [ABS citation guide](https://www.abs.gov.au/how-cite-abs-sources). The API guide says the service uses an SDMX REST interface and is freely accessible without an API key at the time of writing. It also states that availability can change and that the API may not be the most up-to-date source.

Before an independently authorised acquisition, record:

1. exact release URL, dataflow, series code, reference period, geography, unit, adjustment, and status;
2. access time, source version or release marker, parser version, checksum, and any revisions noted by the publisher;
3. the dataset-specific attribution and terms check, rather than assuming a generic site licence covers every source;
4. allowed fields and explicitly excluded fields; and
5. the human owner, permitted question, stop conditions, and deletion/retention decision.

Do not collect microdata, employer data, candidate data, salary data, personal records, or private operational data simply because they could make a demo feel more realistic.

## Deterministic reject rules

The local parser stops when it sees an unrecognised field, absent required metadata, fewer than two observations, unparseable monthly periods, unordered periods, an invalid synthetic status, a stale receipt, a private/operational field name, a prompt-injection wrapper, or a request for an action.

The point is not that every real source needs the same rules. The point is that a portfolio repository should show which conditions are facts, which are policy decisions, and which must stop the pipeline.
