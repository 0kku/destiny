import { Component, xml, reactive, computed } from "/dist/mod.js";

import { inputStyles } from "./inputStyles.js";

function formatTimeFragment (
  input: number,
) {
  return String(input).padStart(2, "0");
}

function formatTime (
  duration: number,
) {
  const days    = Math.floor(duration / 1000 / 60 / 60 / 24);
  const hours   = Math.floor(duration / 1000 / 60 / 60 % 24);
  const minutes = Math.floor(duration / 1000 / 60 % 60);
  const seconds = Math.floor(duration / 1000 % 60);
  const daysString = days ? `${days}, ` : "";
  const hoursString = `${hours}:`;
  const minutesString = formatTimeFragment(minutes);
  const secondsString = seconds ? `:${formatTimeFragment(seconds)}`: "";
  return [daysString, hoursString, minutesString, secondsString].join("");
}

function createTask () {
  return {
    start: new Date(0),
    end: new Date(0),
    name: "new task",
  };
}

export class TimeDiff extends Component {
  #tasks = reactive([createTask()]); //initialize an array of tasks, with one task in it

  static styles = inputStyles;

  template = xml`
    ${this.#tasks.map(task => xml`
      <div>
        <label>
          Start:
          <input
            type="time"
            prop:valueAsDate="${task.start}"
          />
        </label>
        <label>
          End: 
          <input
            type="time"
            prop:valueAsDate="${task.end}"
          />
        </label>
        <label>
          Name:
          <input
            type="text"
            prop:value="${task.name}"
          />
        </label>
        <p>
          Duration of "${task.name}": ${computed(() => 
            formatTime(Number(task.end.value) - Number(task.start.value))
          )}
        </p>
      </div>`
    )}
    <input
      type="button"
      on:click="${() => this.#tasks.push(createTask())}"
      value="New task"
    />
  `;
}
