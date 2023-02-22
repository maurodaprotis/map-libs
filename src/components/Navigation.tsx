import Link from "next/link";

export const Navigation = () => {
  return (
    <ul className="mt-12 ml-8">
      <li>
        <Link href="/react-simple-maps" className="text-blue-600 underline">
          React Simple Maps
        </Link>
      </li>
      <li>
        <Link href="/react-map-gl" className="text-blue-600 underline">
          React Map GL
        </Link>
      </li>
    </ul>
  );
};
