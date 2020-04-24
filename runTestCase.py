"""
New Shield Case Stable checker Utility V1.0
So far support below functions:
1.	customize run times , test files etc.
2.	run tests in parallel
3.  statistic run status ,include total/fail/pass numbers
4.	support failure log view (generate logs for failed tests )
5.  support record mode and mock mode
6.  other features to be added(e.g  email notification after run?)
Usage :
Set your test cases run times , test command line (e.g node node_modules/nightwatch/bin/nightwatch --env funk-chrome-docker-blr-grid -t artifacts\\build\\tests\\Authentication\\LogInLogOut.js),
then run this script after build finished. If you want run in Mix mode(both record-mode and mock-mode, please change "withMixMode" into True).
Notification :
The Max process is 100 runs in browser lab, This tool is running in parallel mode, Please make sure testCases.length * runTimes < 200.
Programmers:
    dream.wu@ericsson.com
"""
import subprocess
import os
import threading
import time

###############Begin Configuration section #########################
runTimes=100
withMixMode = False
testCases = ["BingeBar\\BingeBarDismiss.js"]
testCmdLine = ".\\node_modules\\.bin\\wdio .\\configs\\wdio.conf.js --spec artifacts\\build\\tests\\"
###############End Configuration section######################

###############Below are the main program body, do not change it if you are not intended  ######
mylock = threading._allocate_lock()
allResult={}
recordErrorsLog=""
mockErrorsLog=""

def runTest(caseName, cmd):
    global allResult
    global mylock
    global recordErrorsLog
    global mockErrorsLog
    caseStatue = "Passed!"
    print("Start running: " + caseName)
    child = subprocess.Popen(cmd,stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    message=child.communicate()
    if child.returncode != 0:
        print("Error occurred with case {0}: {1}".format(caseName, message))
        recordErrorsLog=recordErrorsLog + "{0} \r\n \r\n".format(message)
        caseStatue="Failed!"
    else:
        allResult[caseName]["recordPassedCount"]=allResult[caseName]["recordPassedCount"]+1
    print("One test process ended: " + caseName + " " + caseStatue)

def runTestInOneProcess(caseName, cmd):
    global allResult
    global recordErrorsLog
    global mockErrorsLog
    for i in range(0, runTimes):
        recordStatu = ""
        mockStatu = ""
        print("Start running in record-mode: {0} : {1}".format(caseName, i))
        child = subprocess.Popen(cmd + " --var mockMode=record",stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        message=child.communicate()
        if child.returncode != 0:
            # print("Error occurred with case {0}: {1}".format(caseName, message))
            recordErrorsLog=recordErrorsLog + "{0} \r\n \r\n".format(message)
            recordStatu="Record-mode: Failed!"
        else:
            allResult[caseName]["recordPassedCount"]=allResult[caseName]["recordPassedCount"]+1
            recordStatu=" Record-mode: Passed!"
            print("Start running in mock-mode: " + caseName)
            mockChild = subprocess.Popen(cmd + " --var mockMode=mock",stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            mockMessage=mockChild.communicate()
            if mockChild.returncode != 0:
                # print("Error occurred with case {0} in mock-mode: {1}".format(caseName, mockMessage))
                mockErrorsLog=mockErrorsLog + "{0} \r\n \r\n".format(mockMessage)
                mockStatu="Mock-mode: Failed!"
            else:
                allResult[caseName]["mockPassedCount"]=allResult[caseName]["mockPassedCount"]+1
                mockStatu="Mock-mode: Passed!"
        print("One test process ended: " + caseName + " " + recordStatu + " " + mockStatu)

testThreads=[]
for caseName in testCases:
    allResult[caseName]={
        "name": caseName,
        "allCount": runTimes,
        "recordPassedCount":0,
        "mockPassedCount":0
    }
    if withMixMode:
            th = threading.Thread(target=runTestInOneProcess, args=(caseName, testCmdLine + caseName,))
            testThreads.append(th)
    else:
        for i in range(0, runTimes):
            th = threading.Thread(target=runTest, args=(caseName, testCmdLine + caseName,))
            testThreads.append(th)

print("Start All Test: ")
for th in testThreads:
    th.start()
    time.sleep(5)
for t in testThreads:
    t.join()
print("All Test Result :")
for caseKey in allResult:
    caseResultItem = allResult[caseKey]
    print("Total :{0} Passed: {1} Failed: {2}".format(caseResultItem["allCount"], caseResultItem["recordPassedCount"], (caseResultItem["allCount"]-caseResultItem["recordPassedCount"])))
    if withMixMode:
        print("Mock-mode Total: {0} Passed: {1} Failed: {2}".format(caseResultItem["allCount"], caseResultItem["mockPassedCount"],(caseResultItem["allCount"]-caseResultItem["mockPassedCount"]), ))
if recordErrorsLog:
    with open("StableCheckerFailLogs.log", 'w') as f:
        try:
            f.write(recordErrorsLog)
        except Exception as err:
           print("Error occurred when writing failed test logs")

print("Done, please see StableCheckerFailLogs.log file for detailed failed info if have  ")
