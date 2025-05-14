let tape = [];
let head = 0;
let currentState = "";
let transitions = {};
let finalStates = [];
let interval = null;

function parseTransitions(input) {
  const lines = input.trim().split('\n');
  const rules = {};
  for (let line of lines) {
    const match = line.match(/^(\w+)\s+(\S)\s*->\s*(\w+)\s+(\S)\s+([LR])$/);
    if (match) {
      const [_, fromState, readSymbol, toState, writeSymbol, move] = match;
      rules[`${fromState},${readSymbol}`] = { toState, writeSymbol, move };
    }
  }
  return rules;
}

function startSimulation() {
  tape = document.getElementById("inputTape").value.split('');
  head = 0;
  currentState = document.getElementById("initialState").value;
  transitions = parseTransitions(document.getElementById("transitions").value);
  finalStates = document.getElementById("finalStates").value.split(',');
  renderTape();
  updateStateDisplay();
}

function step() {
  const symbol = tape[head] || '_';
  const rule = transitions[`${currentState},${symbol}`];

  if (!rule) {
    alert("No transition found. Machine halted.");
    clearInterval(interval);
    return;
  }

  tape[head] = rule.writeSymbol;
  currentState = rule.toState;
  head += rule.move === 'R' ? 1 : -1;

  if (head < 0) {
    tape.unshift('_');
    head = 0;
  } else if (head >= tape.length) {
    tape.push('_');
  }

  renderTape();
  updateStateDisplay();

  if (finalStates.includes(currentState)) {
    alert("Machine reached a final state.");
    clearInterval(interval);
  }
}

function autoRun() {
  if (interval) clearInterval(interval);
  interval = setInterval(step, 800);
}

function renderTape() {
  const tapeDiv = document.getElementById("tape");
  tapeDiv.innerHTML = '';
  tape.forEach((symbol, index) => {
    const cell = document.createElement("div");
    cell.className = "cell" + (index === head ? " head" : "");
    cell.innerText = symbol;
    tapeDiv.appendChild(cell);
  });
}

function updateStateDisplay() {
  document.getElementById("currentState").innerText = currentState;
}

function loadExample(example) {
  let tape = "";
  let transitions = "";
  let initial = "q0";
  let finals = "q_accept";

  if (example === "increment") {
    tape = "1011";
    transitions = `q0 1 -> q0 1 R
q0 0 -> q0 0 R
q0 _ -> q1 _ L
q1 0 -> q_accept 1 R
q1 1 -> q1 0 L
q1 _ -> q_accept 1 R`;
  } else if (example === "onlyOnes") {
    tape = "1111";
    transitions = `q0 1 -> q0 1 R
q0 _ -> q_accept _ R`;
  } else if (example === "evenZeros") {
    tape = "10100";
    transitions = `q0 0 -> q1 0 R
q0 1 -> q0 1 R
q0 _ -> q_accept _ R
q1 0 -> q0 0 R
q1 1 -> q1 1 R
q1 _ -> q_reject _ R`;
    finals = "q_accept";
  }

  document.getElementById("inputTape").value = tape;
  document.getElementById("transitions").value = transitions;
  document.getElementById("initialState").value = initial;
  document.getElementById("finalStates").value = finals;
}
