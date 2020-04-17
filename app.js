// VIZ AND STOP BUTTONS
let btn = document.querySelector("#viz");
let stopBtn = document.querySelector("#stop");

// Algorithm Title
let algTitle = document.querySelector("#sortType");

// ALGORITHM BUTTONS
let bubbleButton = document.getElementById("bubbleBtn");
let mergeButton = document.getElementById("mergeBtn");
let quickButton = document.getElementById("quickBtn");

// MAIN GRAPH DIV
let graph = document.querySelector(".inner");

// Global Stop Variable
let stop = false;

// Global Active Alg Object
let activeAlg = {
  bubble: false,
  merge: false,
  quick: false,
};

// Initialize Active Algorithm to bubble
activateSort("bubble");
algTitle.innerHTML = "Bubble Sort";
bubbleButton.style.boxShadow = "0px 0px 20px 1px rgb(255, 96, 184, .8)";

// Make Each Alg button change the state of the active Alg object
bubbleButton.addEventListener("click", () => {
  activateSort("bubble");
  algTitle.innerHTML = bubbleButton.textContent;
  changeColor(bubbleButton, mergeButton, quickButton);
});

mergeButton.addEventListener("click", () => {
  activateSort("merge");
  algTitle.innerHTML = mergeButton.textContent;
  changeColor(mergeButton, bubbleButton, quickButton);
});

quickButton.addEventListener("click", () => {
  activateSort("quick");
  algTitle.innerHTML = quickButton.textContent;
  changeColor(quickButton, mergeButton, bubbleButton);
});

// STOP VISUALIZATION
stopBtn.addEventListener("click", () => {
  stop = true;
});

// START VISUALIZATION
btn.addEventListener("click", () => {
  stop = false;
  function drawLoop() {
    let next = iterator.next(); // pull from yield
    if (!next.done) {
      draw(next.value);
    } else {
      clearInterval(intervalId);
      document
        .querySelectorAll(".bar")
        .forEach((bar) => (bar.style.backgroundColor = "#41d6ff;"));
    }
  }

  let numEls = document.querySelector("#choose").value;

  let bubbleDelayTimes = {
    "30": 25,
    "20": 60,
    "15": 75,
  };

  let mergeDelayTimes = {
    "30": 220,
    "20": 250,
    "15": 300,
  };

  // let delay = delayTimes[`${numEls}`];
  let array = generateArray();

  let delay;
  let iterator;

  if (activeAlg["bubble"]) {
    delay = bubbleDelayTimes[`${numEls}`];
    iterator = bubbleSort(array);
  } else if (activeAlg["merge"]) {
    delay = mergeDelayTimes[`${numEls}`];
    iterator = mergeSort(array);
  } else if (activeAlg["quick"]) {
    delay = bubbleDelayTimes[`${numEls}`];
    iterator = quickSort(array);
  }

  let intervalId = setInterval(drawLoop, delay);
  drawLoop(); // so no wait for first paint
});

// Function to change the global active algorithm object
function activateSort(alg) {
  activeAlg = {
    bubble: false,
    merge: false,
    quick: false,
  };
  activeAlg[alg] = "true";
}

// Function to change button colors when picked
function changeColor(btn1, btn2, btn3) {
  btn1.style.boxShadow = "0px 0px 20px 1px rgb(255, 96, 184, .8)";
  btn2.style.boxShadow = "";
  btn3.style.boxShadow = "";
}

// --- DRAW FUNCTION ---
function draw(array) {
  document.querySelectorAll(".bar").forEach((bar) => bar.remove());

  let container = document.querySelector(".inner");
  array.forEach((value) => {
    let bar = container.appendChild(document.createElement("div"));
    let val = bar.appendChild(document.createElement("h1"));
    val.textContent = value;
    val.className = "arr-val";
    bar.className = "bar";
    bar.style.height = 20 + value * 3 + "px";
    bar.style.width = Math.round(350 / array.length) + "px";
  });
}

// --- GENERATE RANDOM ARRAY ---
function generateArray() {
  let numEls = document.querySelector("#choose").value;
  let newArr = [];
  for (let i = 0; i < numEls; i++) {
    let foundUnique = false;
    while (foundUnique != true) {
      let randNum = Math.round(Math.random() * 98) + 1;
      if (newArr.includes(randNum) != true) {
        newArr.push(randNum);
        foundUnique = true;
      }
    }
  }

  if (isSorted(newArr) === true) {
    newArr = [];
    generateArray(numEls);
  }

  return newArr;
}

// --- HELPER TO SEE IF ARRAY IS CORRECTLY SORTED ---
function isSorted(newArr) {
  let sorted = true;
  for (let i = 0; i < newArr.length - 1; i++) {
    if (newArr[i] > newArr[i + 1]) {
      sorted = false;
      break;
    }
  }
  return sorted;
}

// --- BUBBLE SORT ---
function* bubbleSort(array) {
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length; j++) {
      if (array[j] > array[j + 1]) {
        let temp = array[j];
        array[j] = array[j + 1];
        array[j + 1] = temp;
      }
      yield array;
      if (stop == true) {
        return;
      }
    }
  }
}

// --- MERGE SORT ---
// Merge Sort Helper
function merge(A, temp, start, middle, last) {
  let k = start,
    i = start,
    j = middle + 1;

  while (i <= middle && j <= last) {
    if (A[i] < A[j]) {
      temp[k++] = A[i++];
    } else {
      temp[k++] = A[j++];
    }
  }

  while (i < A.length && i <= middle) {
    temp[k++] = A[i++];
  }

  for (i = start; i <= last; i++) {
    A[i] = temp[i];
  }
}

// Merge Sort Generator
function* mergeSort(A) {
  let low = 0,
    high = A.length - 1;

  let temp = A.slice(A, A.length);

  for (m = 1; m <= high - low; m = 2 * m) {
    for (i = low; i < high; i += 2 * m) {
      let start = i,
        mid = i + m - 1,
        last = Math.min(i + 2 * m - 1, high);

      merge(A, temp, start, mid, last);
      yield A;
    }

    if (stop == true) {
      return;
    }
  }
}

// --- QUICK SORT ---
function swap(array, a, b){
  let temp = array[a]; 
  array[a] = array[b]; 
  array[b] = temp; 
  return array;
}

function partition(array, a, b){
  let x = array[b];
  let i = (a - 1);

  for(j = a; j <= b; j++){
    if(array[j] <= x){
      i += 1;
      array = swap(array, i, j);
    }
  }
  array = swap(array, i + 1, b);
  return (i + 1);
}

function quickSort(array, a, b){
  let stack = new Array();

  stack.push(a);
  stack.push(b);

  while(stack.length >= 0){
    b = stack.pop();
    a = stack.pop();

    let p = partition(array, a, b);

    if(p - 1 > a){
      stack.push(a);
      stack.push(p - 1)
    }

    if(p + 1 < b){
      stack.push(p + 1);
      stack.push(b);
    }
  }  
  return array;
}


arr = [1, 5, 4, 2];
quickSort(arr, 0, arr.length - 1);