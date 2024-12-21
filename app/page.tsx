import Link from "next/link";

export default function Home() {
  const sortAlgorithms = [
    "bubble",
    "insertion",
    "selection",
    //
  ];

  const searchAlgorithms = ["binary", "linear"];

  return (
    <main className="max-w-screen-xl p-2 md:p-4 mx-auto flex flex-col gap-4 min-h-screen">
      <h1 className="text-2xl my-10">Learn and visualize algorithms</h1>

      <div>
        <p>Sorting</p>
        <ul className="capitalize pl-10">
          {sortAlgorithms.map((algo) => (
            <li key={algo}>
              <Link href={`/sort/${algo}`}>{algo} sort</Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p>Searching</p>
        <ul className="capitalize pl-10">
          {searchAlgorithms.map((algo) => (
            <li key={algo}>
              <Link href={`/search/${algo}`}>{algo} search</Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
