"use client";

import { useRouter } from "next/navigation";
import { AddCard } from "../components/AddCard";
import { Modal } from "../components/Modal";

interface AdminCoursesPageClientProps {
  showAddModal: boolean;
  createForm: React.ReactNode;
}

export function AdminCoursesPageClient({ showAddModal, createForm }: AdminCoursesPageClientProps) {
  const router = useRouter();

  return (
    <>
      <AddCard label="Add Course" onClick={() => router.push("/admin/content/courses?add=1")} />
      <Modal
        open={showAddModal}
        onClose={() => router.push("/admin/content/courses")}
        title="Create Course"
      >
        {createForm}
      </Modal>
    </>
  );
}
