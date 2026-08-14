---
trigger: always_on
---

always use solar icons or alternatively use phosphor icons

"example"
import { HorseIcon, HeartIcon, CubeIcon } from "@phosphor-icons/react";

const App = () => {
  return (
    <main>
      <HorseIcon />
      <HeartIcon color="#AE2983" weight="fill" size={32} />
      <CubeIcon color="teal" weight="duotone" />
    </main>
  );
};