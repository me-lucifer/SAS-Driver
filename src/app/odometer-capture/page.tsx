import OdometerCapturePage from "@/components/app/odometer-capture-page";
import { Suspense } from "react";

function OdometerCapturePageComponent() {
  return <OdometerCapturePage />;
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OdometerCapturePageComponent />
    </Suspense>
  );
}
