import styles from "./Certificate.module.css";

export type CertificateDocumentProps = {
  recipientName: string;
  courseTitle: string;
  mentorName: string | null;
  mentorTitle: string | null;
  signatureImage: string | null;
  issuedAt: Date;
  code: string;
  verifyUrl: string;
};

function formatIssuedDate(date: Date): string {
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export function CertificateDocument({
  recipientName,
  courseTitle,
  mentorName,
  mentorTitle,
  signatureImage,
  issuedAt,
  code,
  verifyUrl,
}: CertificateDocumentProps) {
  const verifyLabel = verifyUrl.replace(/^https?:\/\//, "");

  return (
    <article className={styles.sheet} aria-label={`Certificate for ${recipientName}`}>
      <div className={styles.ribbon} aria-hidden />
      <div className={styles.seal} aria-hidden>
        Course
        <br />
        Certificate
      </div>
      <div className={styles.frame} aria-hidden />

      <div className={styles.content}>
        <div className={styles.brand}>Alwerash</div>
        <div className={styles.issued}>{formatIssuedDate(issuedAt)}</div>
        <div className={styles.recipient}>{recipientName}</div>
        <div className={styles.statement}>has successfully completed</div>
        <div className={styles.course}>{courseTitle}</div>

        <div className={styles.footer}>
          <div className={styles.signature}>
            {signatureImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={signatureImage}
                alt={mentorName ? `Signature of ${mentorName}` : "Mentor signature"}
                className={styles.signatureImage}
              />
            ) : (
              <div className={styles.signaturePlaceholder} />
            )}
            <div className={styles.signatureLine}>
              <div className={styles.signatureName}>{mentorName ?? "Alwerash Mentor"}</div>
              <div className={styles.signatureTitle}>{mentorTitle ?? "Course Mentor"}</div>
            </div>
          </div>

          <div className={styles.verify}>
            Verify at <a href={verifyUrl}>{verifyLabel}</a>
            <br />
            Final assignment reviewed and approved by the course mentor.
            <br />
            Certificate ID: {code}
          </div>
        </div>
      </div>
    </article>
  );
}
