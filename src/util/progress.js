const term = require('terminal-kit').terminal;

// TODO: 强行退出程序 + 使用watch 会造成命令行出现莫名其妙的字符
// const progressBar = term.progressBar({
//     width: 80,
//     title: '🚀 Reloading the page...',
//     percent: true,
//     barHeadChar: '█',
//     barChar: '█',
//     barStyle: term.green,
// });

let progress = 0

function step() {
    // Add random progress
    progress += Math.random() / 5;
    // progressBar.update(progress);

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


