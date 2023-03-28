import { css } from "../../mod.ts";

export const inputStyles = css`
  input:not([type=checkbox]) {
    color: white;
    vertical-align: top;
    box-sizing: border-box;
    min-width: var(--xl);
    height: var(--l);
    padding: 0 var(--s);
    background: var(--element-color);
    border-radius: var(--border-radius);
    box-shadow: 0 1px 1px rgba(0,0,0,.4);
    text-shadow: 1px 1px 1px rgba(0,0,0,.4);
    outline: none;
    transition: all .1s;
    border: 1px solid transparent;
    font-size: var(--m);
  }
  input:not([type=checkbox]):hover {
    background: var(--element-hover-color);
  }
  input:not([type=checkbox]):active {
    transform: translateY(1px);
  }
  input:not([type=checkbox]):focus {
    border: 1px solid var(--element-focus-color);
  }

  [type=text], [type=time] {
    width: 200px;
    border: none;
  }
  input[type=text]::placeholder {
    font-style: italic;
    color: #333;
    text-shadow: none;
  }

  input:not([type=text]), label {
    cursor: pointer;
  }
  
  label {
    display: inline-block;
    height: var(--l);
    line-height: var(--l);
  }

  label, [type=button], [type=submit] {
    cursor: pointer;
    color: white;
  }
`;
