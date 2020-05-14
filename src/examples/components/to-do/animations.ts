export function animateIn (
  element: HTMLElement,
) {
  element.animate(
    [
      {height: "0px"},
      {height: "32px"},
    ],
    {duration: 300, easing: "ease"},
  ).play()
}

export async function animateOut (
  element: HTMLElement,
) {
  const animation = element.animate(
    [
      {height: "32px"},
      {height: "0px"},
    ],
    {duration: 300, easing: "ease", fill: "forwards"},
  );
  animation.play();
  await animation.finished;
}