import { BreadcrumbItem, Breadcrumbs, Link } from "@nextui-org/react";

export default function Header() {
  const description =
    "Bubble sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order." +
    "The pass through the list is repeated until the list is sorted." +
    'The algorithm, which is a comparison sort, is named for the way smaller elements "bubble" to the top of the list.' +
    "Although the algorithm is simple, it is too slow and impractical for most problems even when compared to insertion sort." +
    "It can be practical if the input is usually in sort order." +
    "\n" +
    "";
  return (
    <>
      <Breadcrumbs>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/sort/bubble">Bubble Sort</BreadcrumbItem>
      </Breadcrumbs>

      <h1 className="text-2xl my-5">Bubble sort</h1>
      <p className="text-slate-300 text-sm">{description}</p>
      <p className="text-slate-300 text-sm mt-2">
        Visit the following resource to learn more:{" "}
        <Link href="https://roadmap.sh/computer-science">
          https://roadmap.sh/computer-science
        </Link>
      </p>
    </>
  );
}
