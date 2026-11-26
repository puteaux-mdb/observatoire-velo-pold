import { VIF_LOGOS, type VifLogo } from "./vif-logos";
import { getLineCode, getLineNetwork } from "~/composables/useConfig";

/** Logo officiel VIF de la ligne, ou null si la ligne n'est pas une ligne VIF */
export function getVifLogo(line: number): VifLogo | null {
  if (getLineNetwork(line) !== "vif") {
    return null;
  }
  const match = /^V(\d+)$/i.exec(getLineCode(line));
  if (!match) {
    return null;
  }
  return VIF_LOGOS[Number(match[1])] ?? null;
}
