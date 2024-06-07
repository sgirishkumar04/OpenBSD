let queue = [];
const numChairs = 10;
let processing = false;
let customerCount = 1;

function addCustomer() {
    
    if (queue.length < numChairs) {
        queue.push(`Customer ${customerCount}`);
        customerCount++;
        updateQueueDisplay();
        setTimeout(() => {
            processQueue();
        }, 1500); 
        hideFullMessage(); // Hide full queue message if there's space available
    } else {
        document.getElementById('fullMessage').textContent = "Queue is full."; // Display full queue message
        document.getElementById('fullMessage').style.display = 'block'; // Show full queue message
    }
}


function hideFullMessage() {
    document.getElementById('fullMessage').textContent = ""; // Clear full queue message
    document.getElementById('fullMessage').style.display = 'none'; // Hide full queue message
}



function resetQueue() {
    queue = [];
    customerCount = 1;
    updateQueueDisplay();
    hideFullMessage(); // Clear and hide full queue message
}

function updateQueueDisplay() {
    let lastBoxEmpty = true; // Assume last box is empty
    for (let i = 1; i <= numChairs; i++) {
        if (lastBoxEmpty) {
            hideFullMessage(); // Hide full queue message if the last box is empty
        }
        const chair = document.getElementById(`chair${i}`);
        if (queue[i - 1]) {
            chair.textContent = queue[i - 1];
            chair.classList.add('occupied');
            if (i === numChairs) {
                document.getElementById('fullMessage').textContent = "Queue is full."; // Display full queue message
                document.getElementById('fullMessage').style.display = 'block'; // Show full queue message
            }
            lastBoxEmpty = false; // Set to false if any box is occupied
        } else {
            chair.textContent = '';
            chair.classList.remove('occupied');
        }

    }

}


function processQueue() {
    if (!processing && queue.length > 0) {
        processing = true;
        const customer = queue.shift();
        updateQueueDisplay();
        document.getElementById('status').textContent = `Status: Processing ${customer}...`;
        setTimeout(function(){
            document.getElementById('status').textContent = `Status: ${customer} completed.`;
            setTimeout(function(){
                 processing = false;
                processQueue();
            }, 1500); 
        }, 3000); // Simulate processing time
    } else if (queue.length === 0) {
        document.getElementById('status').textContent = "Status: Waiting for customers...";
    }
}
