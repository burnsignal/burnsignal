# Burn Signal
## Got an opinion? Burn some ETH to prove it.
### A general purpose signaling mechanism built on Ethereum.

Anyone can create an issue on which anyone can signal their preference for or against by sending any amount of ETH to the corresponding Ethereum address.

Signals are interpreted client-side.

Initially, our frontend will interpret the signals quadratically, using BrightID as a proof of uniqueness. But we hope to build out a variety of different methods for analyzing signals.

---

Currently, all ether collected from signaling is burned so as to prevent feedback. However, future iterations may reallocate collected funds via some fund allocation mechanism.

Burn Signal operates under the premise that any arbitrary definition of stakeholder groups will necessarily disenfranchise some people. Rather than attempting to define stakeholder groups and weight their input against one and other, Burn Signal attempts to create a signaling environment that is permissionless, non-exclusive, collusion resistant, and minimally impacted by plutocracy.

---

Specification and issues can currently be found in this repo: https://github.com/burnSignal/burnSignal-Spec

BurnerVote consists of three main parts:

* A smart contract factory that allows users to create new proposals to vote/signal on
* A GraphQL backend built with [The Graph](https://thegraph.com/) to analyze the contract data; and a React.js frontend
* An "Ethereum Address Service" web app for [BrightID](https://www.brightid.org/) to allow users to map their BrightID accounts to Ethereum addresses. BrightID aims to be a global, unique identity network uses graph theory to determine the likelihood that an account or individual is unique.

## To Do

VoteHelper.js - Add BrightID check.

NewVote.js - Deadline needs implemented.
