export function animateIn (
  element: HTMLElement,
): void {
  element.animate(
    [
      {height: "0px"},
      {height: "var(--l)"},
    ],
    {duration: 300, easing: "ease"},
  ).play();
}

export async function animateOut (
  element: HTMLElement,
): Promise<void> {
  const animation = element.animate(
    [
      {height: "var(--l)"},
      {height: "0px"},
    ],
    {duration: 300, easing: "ease", fill: "forwards"},
  );
  animation.play();
  await animation.finished;
}
