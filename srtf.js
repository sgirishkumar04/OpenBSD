let processes = [];
let processId = 1;
let timelineInterval;

function addProcess() {
    const arrivalTime = document.getElementById('arrival-time').value;
    const burstTime = document.getElementById('burst-time').value;
    
    if (arrivalTime === '' || burstTime === '') {
        alert('Please enter both arrival and burst times.');
        return;
    }
    
    processes.push({
        id: processId++,
        arrivalTime: parseInt(arrivalTime),
        burstTime: parseInt(burstTime),
        remainingTime: parseInt(burstTime)
    });

    document.getElementById('arrival-time').value = '';
    document.getElementById('burst-time').value = '';
    displayProcesses();
}

function undoProcess() {
    if (processes.length > 0) {
        processes.pop();
        processId--;
        displayProcesses();
    } else {
        alert('No processes to undo.');
    }
}

function resetSimulation() {
    processes = [];
    processId = 1;
    clearInterval(timelineInterval);
    document.querySelector('#process-table tbody').innerHTML = '';
    document.getElementById('timeline').innerHTML = '';
    document.getElementById('avg-waiting-time').textContent = '0.00';
    document.getElementById('avg-turnaround-time').textContent = '0.00';
}

function displayProcesses() {
    const tbody = document.querySelector('#process-table tbody');
    tbody.innerHTML = '';
    processes.forEach((process, index) => {
        const row = `<tr>
                        <td>${process.id}</td>
                        <td>${process.arrivalTime}</td>
                        <td>${process.burstTime}</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                    </tr>`;
        tbody.innerHTML += row;
    });
}

function startSimulation() {
    let currentTime = 0;
    let completedProcesses = 0;
    let totalWaitingTime = 0;
    let totalTurnaroundTime = 0;
    const timeline = document.getElementById('timeline');
    timeline.innerHTML = '';

    function updateTimeline() {
        let shortest = null;
        processes.forEach(process => {
            if (process.arrivalTime <= currentTime && process.remainingTime > 0) {
                if (shortest === null || process.remainingTime < shortest.remainingTime) {
                    shortest = process;
                }
            }
        });

        if (shortest === null) {
            const idleBlock = document.createElement('div');
            idleBlock.style.width = '40px';
            idleBlock.style.backgroundColor = '#f0f0f0';
            idleBlock.textContent = 'Idle';
            timeline.appendChild(idleBlock);
            currentTime++;
            return;
        }

        shortest.remainingTime--;
        const processBlock = document.createElement('div');
        processBlock.style.width = '40px';
        processBlock.style.backgroundColor = '#ADD8E6';
        processBlock.textContent = `P${shortest.id}`;
        timeline.appendChild(processBlock);
        currentTime++;

        if (shortest.remainingTime === 0) {
            completedProcesses++;
            const completionTime = currentTime;
            const turnaroundTime = completionTime - shortest.arrivalTime;
            const waitingTime = turnaroundTime - shortest.burstTime;

            totalWaitingTime += waitingTime;
            totalTurnaroundTime += turnaroundTime;

            const row = document.querySelector(`#process-table tbody tr:nth-child(${shortest.id})`);
            row.cells[3].innerText = completionTime;
            row.cells[4].innerText = waitingTime;
            row.cells[5].innerText = turnaroundTime;
        }

        if (completedProcesses === processes.length) {
            clearInterval(timelineInterval);
            const averageWaitingTime = totalWaitingTime / processes.length;
            const averageTurnaroundTime = totalTurnaroundTime / processes.length;

            document.getElementById('avg-waiting-time').textContent = averageWaitingTime.toFixed(2);
            document.getElementById('avg-turnaround-time').textContent = averageTurnaroundTime.toFixed(2);
        }
    }

    timelineInterval = setInterval(updateTimeline, 500);
}