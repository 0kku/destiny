import { DestinyElement, xml, reactive } from "/dist/mod.js";

type TPost = {
  postId: number,
  id: number,
  name: string,
  email: string,
  body: string,
};
type TPosts = Array<TPost>;

function getComments (): Promise<TPosts> {
  return (
    fetch("https://jsonplaceholder.typicode.com/comments")
    .then(r => r.json() as Promise<TPosts>)
  );
}

export class FilterDemo extends DestinyElement {
  #searchTerm = reactive("quam");
  #posts = reactive<TPosts>([]);
  #limit = reactive(500);
  #filteredData = this.#posts.filter(
    ({ name, email, body }) => (name.value + email.value + body.value).includes(this.#searchTerm.value),
    [this.#searchTerm],
  );
  #slicedData = this.#filteredData.slice(0, this.#limit);
  
  async connectedCallback (): Promise<void> {
    this.#posts.push(...await getComments());
  }
  
  template = xml`
    <style>
      :host {
        display: block;
        width: 100%;
      }
      table {
        margin: 5px;
      }
      table, td, th {
        border: 1px solid black;
        border-collapse: collapse;
      }
      td, th {
        padding: var(--s);
      }

      td > div {
        width: 300px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    </style>

    Filter: <input type="text" prop:value="${this.#searchTerm}" /> <br />

    Showing ${this.#slicedData.length}/${this.#posts.length} items <br />
    Max items shown: 
    <input type="number" min="1" max="500" prop:value-as-number="${this.#limit}" />
    <input type="range"  min="1" max="500" prop:value-as-number="${this.#limit}" style="width: 250px;" />

    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>id</th>
          <th>Name</th>
          <th>Email</th>
          <th>Body</th>
        </tr>
      </thead>
      <tbody>
        ${this.#slicedData.map((row, i) => xml`
          <tr>
            <td>${i}</td>
            <td>${row.id}</td>
            <td><div>${row.name}</div></td>
            <td>${row.email}</td>
            <td><div>${row.body}</div></td>
          </tr>
        `)}
      </tbody>
    </table>
  `;
}
