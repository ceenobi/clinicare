import UploadImage from "@/features/settings/UploadImage";

export default function Account() {
  return (
    <div className="space-y-6">
      <h1 className="font-bold text-2xl border-b border-gray-300 pb-2">
        Account
      </h1>
      <>
        <UploadImage />
      </>
    </div>
  );
}
