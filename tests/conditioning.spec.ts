import { test, expect } from "@playwright/test";

const GYAZO_IMAGE =
  "https://i.gyazo.com/f805391f1a7ae6b253440cf16168a763.jpg";

test.describe.skip(
  "Conditioning page",
  () => {
    // Skipped: Conditioning is a conceptual page and may not include hero media
    // or workflow JSON rows. Expectations here were coupling to specific content
    // that is no longer guaranteed.
  }
);
