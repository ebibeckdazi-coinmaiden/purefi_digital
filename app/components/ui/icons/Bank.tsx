import { SVGProps } from "react";

export default function BankIcon(
    props: SVGProps<SVGSVGElement>
) {
  return (
    <svg {...props} viewBox="0 0 24 24">
      <path fill-rule="evenodd" d="M12 5.18 7.487 8h9.026zm-.535-2.025a1.01 1.01 0 0 1 1.07 0L20.5 8.134c.861.537.48 1.866-.535 1.866H19v9h2v2H3v-2h2v-9h-.965C3.02 10 2.639 8.671 3.5 8.134zM7 19h4v-9H7zm6 0h4v-9h-4z" clip-rule="evenodd"></path></svg>
  );
}
