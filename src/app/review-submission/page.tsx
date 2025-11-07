import ReviewSubmissionPage from "@/components/app/review-submission-page";
import { Suspense } from "react";

function ReviewSubmissionPageComponent() {
    return <ReviewSubmissionPage />;
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReviewSubmissionPageComponent />
    </Suspense>
  );
}
