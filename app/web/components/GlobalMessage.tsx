import { Alert as MuiAlert } from "@mui/material";
import { useFeatureValue } from "experimentation";
import { usePersistedState } from "platform/usePersistedState";
import React from "react";

// type (not interface) so it satisfies useFeatureValue's JsonValue constraint
type GlobalMessageData = {
  // the unix timestamp (as a string with milliseconds) when the message was issued
  epoch: string;
  severity: "success" | "info" | "warning" | "error";
  message: string;
};

export function GlobalMessage() {
  const data = useFeatureValue<GlobalMessageData | null>(
    "global_message",
    null,
  );
  // the epoch value of the last message we dismissed
  const [dismissedEpoch, setDismissedEpoch] = usePersistedState<string | null>(
    "globalmessage.dismissed",
    null,
  );

  const dismiss = () => {
    if (!data) return;
    setDismissedEpoch(data.epoch);
  };

  return data && data.epoch && data.epoch != dismissedEpoch ? (
    <MuiAlert severity={data.severity} onClose={dismiss}>
      <span dangerouslySetInnerHTML={{ __html: data.message }} />
    </MuiAlert>
  ) : null;
}
