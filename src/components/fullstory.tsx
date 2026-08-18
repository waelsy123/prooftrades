"use client";

import { init, isInitialized } from "@fullstory/browser";
import { useEffect } from "react";

const FULLSTORY_ORG_ID = "Q3B15";

export function Fullstory() {
  useEffect(() => {
    if (isInitialized()) return;

    init({ orgId: FULLSTORY_ORG_ID });
  }, []);

  return null;
}
