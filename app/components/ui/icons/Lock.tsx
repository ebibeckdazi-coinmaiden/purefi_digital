import { SVGProps } from "react";

export default function LockIcon(
    props: SVGProps<SVGSVGElement>
) {
  return (
    <svg {...props} viewBox="0 0 24 24">
      <path fill-rule="evenodd" d="M12 3a5 5 0 0 0-5 5v1H5.01A1.01 1.01 0 0 0 4 10.01V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8.99A1.01 1.01 0 0 0 18.99 9H17V8a5 5 0 0 0-5-5m3 6V8a3 3 0 0 0-6 0v1zm-9 2v8h12v-8zm5 6v-4h2v4z" clip-rule="evenodd"></path></svg>
  );
}
