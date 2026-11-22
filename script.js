
// Page Replacement Simulator

document.getElementById("simulateBtn").addEventListener("click", function () {

    // Get user input
    const pageInput = document.getElementById("pages").value;
    const frameCount = parseInt(document.getElementById("frames").value);

    // Convert page reference string into an array
    const pages = pageInput.split(",").map(page => page.trim()).map(Number);

    // Validate input
    if (
        pageInput.trim() === "" ||
        pages.some(page => !Number.isInteger(page) || page < 0) ||
        !Number.isInteger(frameCount) ||
        frameCount < 1
    ) {
        alert("Please enter a valid page reference string and frame count.");
        return;
    }

    // Run all three algorithms
    const fifoResult = fifo(pages, frameCount);
    const lruResult = lru(pages, frameCount);
    const optimalResult = optimal(pages, frameCount);

    // Display results
    document.getElementById("results").innerHTML = `
        <h2>Simulation Results</h2>

        <table border="1" cellpadding="10" cellspacing="0">
            <tr>
                <th>Algorithm</th>
                <th>Page Faults</th>
                <th>Page Hits</th>
            </tr>

            <tr>
                <td>FIFO</td>
                <td>${fifoResult.faults}</td>
                <td>${fifoResult.hits}</td>
            </tr>

            <tr>
                <td>LRU</td>
                <td>${lruResult.faults}</td>
                <td>${lruResult.hits}</td>
            </tr>

            <tr>
                <td>Optimal</td>
                <td>${optimalResult.faults}</td>
                <td>${optimalResult.hits}</td>
            </tr>
        </table>
    `;
});


// FIFO Algorithm
function fifo(pages, frameCount) {

    let frames = [];
    let faults = 0;
    let hits = 0;
    let pointer = 0;

    for (let page of pages) {

        if (frames.includes(page)) {
            hits++;
        } else {

            faults++;

            if (frames.length < frameCount) {
                frames.push(page);
            } else {
                frames[pointer] = page;
                pointer = (pointer + 1) % frameCount;
            }
        }
    }

    return { faults, hits };
}


// LRU Algorithm
function lru(pages, frameCount) {

    let frames = [];
    let faults = 0;
    let hits = 0;

    for (let page of pages) {

        if (frames.includes(page)) {
            hits++;

            frames.splice(frames.indexOf(page), 1);
            frames.push(page);

        } else {

            faults++;

            if (frames.length >= frameCount) {
                frames.shift();
            }

            frames.push(page);
        }
    }

    return { faults, hits };
}


// Optimal Page Replacement Algorithm
function optimal(pages, frameCount) {

    let frames = [];
    let faults = 0;
    let hits = 0;

    for (let i = 0; i < pages.length; i++) {

        let page = pages[i];

        if (frames.includes(page)) {
            hits++;

        } else {

            faults++;

            if (frames.length < frameCount) {
                frames.push(page);

            } else {

                let farthest = -1;
                let replaceIndex = 0;

                for (let j = 0; j < frames.length; j++) {

                    let nextUse = pages.indexOf(frames[j], i + 1);

                    if (nextUse === -1) {
                        replaceIndex = j;
                        break;
                    }

                    if (nextUse > farthest) {
                        farthest = nextUse;
                        replaceIndex = j;
                    }
                }

                frames[replaceIndex] = page;
            }
        }
    }

    return { faults, hits };
}
