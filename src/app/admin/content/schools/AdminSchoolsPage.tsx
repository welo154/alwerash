"use client";

import { useRouter } from "next/navigation";
import { AddCard } from "../components/AddCard";
import { Modal } from "../components/Modal";

interface AdminSchoolsPageClientProps {
  showAddModal: boolean;
  createForm: React.ReactNode;
}

export function AdminSchoolsPageClient({ showAddModal, createForm }: AdminSchoolsPageClientProps) {
  const router = useRouter();

  return (
    <>
      <AddCard label="Add School" onClick={() => router.push("/admin/content/schools?add=1")} />
      <Modal
        open={showAddModal}
        onClose={() => router.push("/admin/content/schools")}
        title="Create School"
      >
        {createForm}
      </Modal>
    </>
  );
}
