"use client";

import { useRouter } from "next/navigation";
import { AddCard } from "../components/AddCard";
import { Modal } from "../components/Modal";

interface AdminTracksPageClientProps {
  showAddModal: boolean;
  createForm: React.ReactNode;
}

export function AdminTracksPageClient({ showAddModal, createForm }: AdminTracksPageClientProps) {
  const router = useRouter();

  return (
    <>
      <AddCard label="Add Track" onClick={() => router.push("/admin/content/tracks?add=1")} />
      <Modal
        open={showAddModal}
        onClose={() => router.push("/admin/content/tracks")}
        title="Create Track"
      >
        {createForm}
      </Modal>
    </>
  );
}
