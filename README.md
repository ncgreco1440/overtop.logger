# overtop.logger
---

Author: Nico Greco

Contact: nico@nicogreco.com

Version: 1.1.1

Logging mechanism for Overtop NodeJS applications
---

This package is a wrapper for the winston logging api, which also interfaces with mongodb client api to store logs as documents within specified collections.

| Dependencies |
|--------------|
| [winston](https://github.com/winstonjs/winston) |
| [moment]() |

| Dev Dependencies |
|------------------|
| [mocha](https://github.com/mochajs/mocha) |
| [chai](https://github.com/chaijs/chai) |
| [chai-fs]() |
| [sinon]() |
| [lolex]() |

## Roadmap 

1. dotenv support
     1. Add process.env support
     2. dotenv is a good use for the time being
     3. allow for production proven methods as well.
2. Email support
     1. MailgunJS api
     2. Emails should be delivered to IT team when errors occur
3. Database support
     1. MongoDB support.
     2. Other databases are *possible* but not a priority.
