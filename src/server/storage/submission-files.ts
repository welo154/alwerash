/** Submission files live under one prefix of the private bucket. */
export function submissionObjectKey(fileKey: string): string {
  return `submissions/${fileKey}`;
}
