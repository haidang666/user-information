export interface SendMailParams {
  mailType?: string;
  from?: string;
  to: string;
  subject: string;
  text: string;
  html?: string;
  attachments?: string[];
}
