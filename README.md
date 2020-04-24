# React Reach Shield

Shield is the test tool suite for [Selenium2](http://www.seleniumhq.org/)&& [Appium](http://appium.io/) testing of the MediaKind MediaFirst ReachClient with [WebdriverIO](https://webdriver.io)(wdio.js).

Shield is for Webdriver V5, Shield run Appium||Selenium tests together with WebdriverIO for:

-   iOS/Android Native Apps
-   iOS/Android Hybrid Apps
-   Android Chrome and iOS Safari browser ([check here](./README.md#automating-chrome-or-safari))
-   Chrome Safari FireFox IE Edge
-   (Browser Lab not done yet, Currently run for local chrome.)

Shield executes browser tests on [Browser Labs](https://conf-fe-p01.mr.ericsson.se:8443/pages/viewpage.action?pageId=30187101) and devices tests on internal device lab.

Although `wdio` by itself can execute all tests in parallel by environment, `wdio` runs tests in parallel by triggering multiple `wdio` processes that executes 1 test per process. `wdio` thus is used mainly for sending tests to browserLabs or device lab.

## Prerequisites

To proceed you need a Mac, Windows, or Linux machine, and:

1. Access to the React Reach Client git repository.
2. [node](https://nodejs.org/) installed. (version: at least v10.12.0 or higher, this is needed in webdriverio).
3. [npm](https://www.npmjs.com/) installed. (version: 6.\*, usually installed along with `node` by using `npm install npm -g`, check the version, upgraded it if it's very old).
4. [appium](http://appium.io/) installed global if you need run locally. (version: 1.14.\*).
5. Java Development Kit (JDK version: Java 8, required for Selenium Standalone Server) and ensure Java binaries are added to your path.
6. install gulp-cli package globally by `npm install --global gulp-cli`, this is needed in gulp version 4.\*.

### Prerequisites for Android

1. Install the [Android SDK](http://developer.android.com/sdk). The supported way of doing this nowadays is to use Android Studio. Use the provided GUI to install the Android SDK to a path of your choosing.
2. **JAVA_HOME** and **ANDROID_HOME** environment variable is also set to the path.
3. The emulator which can be created by AVD Manager.
4. The test APK downloaded and available on your local filesystem.
5. [More Info...](http://appium.io/docs/en/drivers/android-uiautomator2/)

### Prerequisites for IOS

1. [Requirements and Support](http://appium.io/docs/en/drivers/ios-xcuitest/index.html)

## Integrated Development Environment

### Visual Studio Code

Visual Studio Code is a source code editor for Windows, Linux and OS X. It includes support for debugging, and embedded Git control, syntax highlighting. It is free open-source, and much faster than Visual Studio 2013.

1. Build Manualy: `npm run build` or `gulp`
2. Auto Build: Press Ctrl+Shift+B/⇧⌘B to define a new task runner, press on "Configure Task Runner" option. This will present you with the `tasks.json` file.

```
{
    "version": "0.1.0",
    "command": "gulp",
    "isShellCommand": true,
    "args": [
        "--no-color"
    ],
    "tasks": [
        {
            "taskName": "default",
            "args": [],
            "isBuildCommand": true,
            "isWatching": true,
            "problemMatcher": [
                "$lessCompile",
                "$tsc",
                "$jshint"
            ]
        }
    ]
}
```

Then type Ctrl+Shift+P/⇧⌘P and then type Run Task, you'll be presented with a drop-down with watch option. Select the watch task and let it run. You'll notice that the Output Window is brought to focus with build information and Every time you do a change to a _.js or _.ts file and you save the file, the change will trigger the corresponding task to execute.

3. Debug: Press on Debug menu, update the `launch.json`

```
{
    "version": "0.2.0",
	"configurations": [
		{
			"name": "Launch",
			"type": "node",
			"request": "launch",
			"program": "${workspaceRoot}/node_modules/@wdio/cli/bin/wdio.js",
			"stopOnEntry": false,
			"args": [
				"./configs/wdio.conf.js", "--spec",
				"artifacts/build/tests/LoginLogout.js", "--dep", "ofunk-local-chrome-windows"
            ],
			"cwd": "${workspaceRoot}",
			"runtimeExecutable": null,
			"runtimeArgs": [
			],
			"env": {
				"NODE_ENV": "development"
			},
			"externalConsole": false,
			"sourceMaps": false,
			"outDir": null
		},
		{
			"name": "Attach",
			"type": "node",
			"request": "attach",
			"port": 5858
		}
	]
}
```

4. Shortcuts: VS Code lets you perform most tasks directly from the keyboard. This [Link](https://code.visualstudio.com/docs/customization/keybindings#_customizing-shortcuts) is for the default bindings and describes how you can update them.
5. [typescript](http://www.typescriptlang.org)installed. (minimum version is 3.5.1, this is ndded in webdriverio).

## Install

Get Shield and its dependencies:

    git clone http://tfsmr:8080/tfs/IEB/MRGIT/_git/ReachClient
    cd ReachClient/Shield
    npm i && npm install --global gulp-cli

(note 'npm i' does a node package manager install of all the packages as defined in the packages.json file.
Once executed, it only need's to be re-executed if there is a change in packages.json file, or node_modules folder is deleted)

Set up your individual Browser Labs credentials (Not needed if you use 'npm run test' commands with local platforms) :

    cd configs
    cp credentials.template.json5 credentials.json5

Now edit `credentials.json5` with your browser Labs credentials. This file should be ignored by `git`, remain local to your set up, and should not be committed.

If you don't have your own labs credentials, you can use Jared's account. Just don't touch any settings because this is the official automation account.
LABS_USER: jaredjordan
LABS_KEY: c4472bc7-16ad-4def-ab88-8143e6c82c82

## Shield File system

    ├── artifacts                       Reports, logs, screenshots, transpiled js
    ├── configs                         See configs/README.md
    ├── docs                            Keep the auto-generated documentations
    │   ├── sdk                         Configs and scripts for generating Shield Docs
    │   └── tests                       Reachclient Shield Document
    ├── lib                             Libraries
    │   ├── cli                         Shield code, wrappers of wdio
    │   ├── common
    │   ├── custom-assertions
    │   ├── custom-commands             custom commands used in tests
    │   ├── custom-reporters            test result reporter
    │   ├── data-generation
    │   ├── endpoint-mocking
    │   └── page-objects                Reachclient pages objects
    ├── mockData                        Mock data configuration files
    ├── node_modules
    ├── Performance                     Reachclient performance tests using WebPageTest
    ├── ShieldLog                       Tests local run Logs, organized by run id
    ├── tests
    │   ├── testsuite-1
    │   │   └── VerifyThisThenThat.js
    │   ├── testsuite-2                 Camel case test files so that they
    │   │   └── VerifySomething.js      Show up as "Verify Something" etc.
    │   └── testsuite-n
    │       └── GoNuts.js
    ├── TIP                             Test-In-Production related code
    └── typings                         typescript definitions

Keep all filenames, except test files, in lowercase.

## WebdriverIO Usage (npm run test)

TO BE CONTINUE...

.\node_modules\.bin\wdio .\configs\wdio.conf.js --spec .\artifacts\build\tests\Browser\LogInBrowser.js --env ofunk-local-chrome-windows

.\node_modules\.bin\wdio .\configs\wdio.conf.js --spec .\artifacts\build\tests\DemoTestAPP.js --env ofunk-local-android-emu

.\node_modules\.bin\wdio .\configs\wdio.conf.js --spec .\artifacts\build\tests\Login.js --env ofunk-local-android-selenium

# Guideline to write shield tests:

## Platform specific supports

1. React Native App:
    - browser.react$(), browser.react$\$() not support on react native app, we can't use react selectors in this kind of app. refer to https://github.com/appium/appium/issues/12600

# References

-   [Selenium PageObjects wiki](https://code.google.com/p/selenium/wiki/PageObjects)
-   [Selenium DesiredCapabilities](https://code.google.com/p/selenium/wiki/DesiredCapabilities)
-   [Gulp](https://gulpjs.com/)
-   [TypeScript Website](http://www.typescriptlang.org/docs/handbook/tsconfig-json.html).
-   [EsLint Rules Website](https://eslint.org/docs/rules/).
-   [Adding Custom Commands](https://webdriver.io/docs/typescript.html).


# Setup Issues

## Somethings you need to know
1. please make the local selenium-standalone version same with browserLab selenium-standalone. selenium-standalone,will be auto setup by  @wdio\selenium-standalone-service, you can check the version in .\shield\node_modules\@wdio\selenium-standalone-service\package.json

TO BE CONTINUE...

# Todo

1. TO BE CONTINUE...
2.

# debug config

```
{
    // Use IntelliSense to learn about possible attributes.
    // Hover to view descriptions of existing attributes.
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
			"type": "node",
			"request": "launch",
            "name": "Launch Program",
            "program": "${workspaceRoot}/node_modules/@wdio/cli/bin/wdio.js",
            "stopOnEntry": false,
			"args": [
				"./configs/wdio.conf.js", "--spec", 
				"artifacts/build/tests/LogIn.js", "--env", "ofunk-local-android-selenium", "DEBUG=true"
            ],
            "cwd": "${workspaceRoot}",
            "console": "integratedTerminal"
        }
    ]
}

// run shield 
{
    // Use IntelliSense to learn about possible attributes.
    // Hover to view descriptions of existing attributes.
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "Launch Program",
            "program": "${workspaceRoot}//artifacts//build/lib//cli//index.js",
            "stopOnEntry": false,
            "args": ["--env", "ofunk-local-chrome-windows", "--tag", "CI"],
            "cwd": "${workspaceRoot}",
            "console": "integratedTerminal"
        }
    ]
}

```
# How to run local android emu by using selenium server
1. Start selenium hub by command.
```
java -jar selenium-server-standalone-3.0.1.jar  -role hub
``` 
2. Regist android divice on selenium hub server by using appium command.
```
appium --nodeconfig .\emu_4723.json --port 4723


// emu_4724.json

{
    "capabilities": [
        {
            "deviceName": "Pixel3",
            "maxInstances": 1,
            "platformName": "Android"
        }
    ],
    "configuration": {
        "cleanUpCycle": 2000,
        "timeout": 30000,
        "proxy": "org.openqa.grid.selenium.proxy.DefaultRemoteProxy",
        "url": "wd/hub",
        "host": "0.0.0.0",
        "port": 4724,
        "maxSession": 1,
        "register": true,
        "registerCycle": 5000,
        "hubPort": 4444,
        "hubHost": "0.0.0.0"
    }
}

```

after registe, you will see the config device in selenium server: http://10.164.102.137:4444/grid/console
3. Start wdio by using command: 
```
.\node_modules\.bin\wdio .\configs\wdio.conf.js --spec .\artifacts\build\tests\LogInAPP.js --env ofunk-local-android-selenium
```