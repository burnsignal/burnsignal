# Burn Signal
## Got an opinion? Burn some ETH to prove it.
### A general purpose signaling mechanism built on Ethereum.
[![Sponsor Burn Signal](https://res.cloudinary.com/dvargvav9/image/upload/v1581842794/button2_w5exua.svg)](https://flowerpot.network/burnsignal?trigger=true)

Anyone can create an poll on which anyone can signal their preference for or against by sending any amount of ETH to the corresponding Ethereum address.

Signals are interpreted client-side.

Initially, our frontend will interpret the signals quadratically, using BrightID as a proof of uniqueness. But we hope to build out a variety of different methods for analyzing signals.

---

Currently, all ether collected from signaling is burned so as to prevent feedback. However, future iterations may reallocate collected funds via some fund allocation mechanism.

Burn Signal operates under the premise that any arbitrary definition of stakeholder groups will necessarily disenfranchise some people. Rather than attempting to define stakeholder groups and weight their input against one and other, Burn Signal attempts to create a signaling environment that is permissionless, non-exclusive, collusion resistant, and minimally impacted by plutocracy.

---

PoC Specification: https://github.com/burnsignal/burnSignal-Spec/blob/master/PoCSpec.md

BurnerVote consists of four main parts:

* A smart contract factory that allows users to create new polls to vote in.
* A GraphQL backend built with [The Graph](https://thegraph.com/) to analyze the contract data.
* A React.js frontend.
* An [Ethereum Address Service](https://ethereum.brightid.org/index) web app for [BrightID](https://www.brightid.org/) to allow users to map their BrightID accounts to Ethereum addresses. BrightID aims to be a global, unique identity network uses graph theory to determine the likelihood that an account or individual is unique.

## Run Burn Singal Locally

**Clone this repo**

using https `git clone https://github.com/burnsignal/burnsignal.git`

using ssh `git clone git@github.com:burnsignal/burnsignal.git`

**Open the cloned directory**

`cd burnSignal`

**Install dependencies**

`npm install`

**Run the app**

`npm start`

## To Do

VoteHelper.js - Add BrightID check.

NewVote.js - Deadline needs implemented.

## Want to contribute?
Burn Signal operates on a novel and meritocratic funding model. We aim to reward all contributions with non-transferable 🔥🧧 tokens on a 1:1 ratio with the equivalent USD value of their work. When we hit milestones, you can claim a relative portion of the grant funding that we have received.

[Learn More](https://github.com/burnsignal/contribute)

[![Sponsor Burn Signal](https://res.cloudinary.com/dvargvav9/image/upload/v1581842794/button2_w5exua.svg)](https://flowerpot.network/burnsignal?trigger=true)
