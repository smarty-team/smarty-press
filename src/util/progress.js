const term = require('terminal-kit').terminal;


const progressBar = term.progressBar({
    width: 80,
    title: '🚀 Reloading the page...',
    percent: true,
    barHeadChar: '█',
    barChar: '█',
    barStyle: term.green,
});

let progress = 0

function step() {
    // Add random progress
    progress += Math.random() / 5;
    progressBar.update(progress);

    if (progress < 1) {
        setTimeout(step, 100 + Math.random() * 100);
    }
}

module.exports = {
    step,
    init: () => {
        progress = 0;
    }
}


