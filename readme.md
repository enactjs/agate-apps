# agate-apps

This is a collection of several apps that interact with each other and an autonomous driving simulator.

## Parts

* communication-server - *A standalone message relaying service that apps use to communicate with each other.** components - *Shared common components that each of the apps use.** console - *Main front seat interaction screen. Plays videos, choose destinations on a map, control your AC.** copilot - *Rear-seat entertainment. Receives videos chosen from the front seat and can display ETA and time until destination.** sampler - *A testing/development environment to try out each of the components separately.*

## Setup

There's a small setup process to get all of the parts talking to each other after each is installed.

1. If you've never setup Enact CLI before, start with our [Enact CLI setup tutorial](http://enactjs.com/docs/tutorials/setup/).
2. Install each of the apps by switching to the app folder using `cd` then running `npm install`.
3. `npm run start` in `communication-server` to get it up and running first.
4. `console` and `copilot`, the two frontend apps, have "config" files that store their configuration data. The config files don't exist yet, but on first-run, the `config.sample.js` is cloned into the final location `config.js`, and can be safely edited from there. It includes instructions on where to get API keys for maps and for weather. The app will work just fine without these, except that those specific parts will not function.
	1. Add your new API keys to the `config.js` file.
	2. If you'll be running Console and Copilot on different machines, you can set your IP addresses or host names in this file as well. Otherwise, you can leave these as "localhost".
	3. `npm run serve` in each of the app folders. You'll see output printed after it's ready that says what port the app is being served on.
	4. Now that it's running, you can load the served URL in your browser and see changes as you alter the app code.
5. (Optional) Run `sampler` with `npm run serve` as well. It usually runs on port 8080, so may be necessary to run it before running the others (from step 2)

### Console
The `console` app in particular has some interesting integration with our autonomous driving simulator, which you can download and set up on your own by leaning more at its website: https://www.lgsvlsimulator.com/ 
