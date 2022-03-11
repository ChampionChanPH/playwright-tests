class MyReporter {
    onBegin(config, suite) {
        console.log(`Running a total of ${suite.allTests().length} test/s`);
    }

    onTestBegin(test) {
        console.log(`Starting test: ${test.title}`);
    }

    onTestEnd(test, result) {
        console.log(`Finished test: ${test.title} (${result.status})`);
    }

    onEnd(result) {
        console.log(`Finished the run: ${result.status}`);
    }
}

module.exports = MyReporter;