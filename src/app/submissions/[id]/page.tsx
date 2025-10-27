
import SubmissionDetailPage from "@/components/app/submission-detail-page";

export default function Page({ params }: { params: { id: string } }) {
  return <SubmissionDetailPage id={params.id} />;
}
