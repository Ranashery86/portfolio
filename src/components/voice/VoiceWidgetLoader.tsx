"use client";

import dynamic from "next/dynamic";

const VoiceWidget = dynamic(
  () =>
    import("@/components/voice/VoiceWidget").then(
      (module) => module.VoiceWidget,
    ),
  { ssr: false },
);

export function VoiceWidgetLoader() {
  return <VoiceWidget />;
}
