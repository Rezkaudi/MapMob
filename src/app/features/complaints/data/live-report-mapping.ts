import { toIsoDay } from '../../../shared/formatting/iso-day';
import { Complaint } from '../models/complaint';
import { ComplaintDetail } from '../models/complaint-detail';
import { ComplaintStatus } from '../models/complaint-status';
import { ReportedPlace } from '../models/reported-place';
import { LiveReport } from './live-report';
import { LiveReportedStore } from './live-reported-store';

const LIVE_STATUS: Record<ComplaintStatus, string> = {
  new: 'new',
  inReview: 'under_review',
  resolved: 'resolved',
  rejected: 'rejected',
};

export function toComplaintStatus(liveStatus: string): ComplaintStatus {
  const known = (Object.keys(LIVE_STATUS) as ComplaintStatus[]).find(
    (status) => LIVE_STATUS[status] === liveStatus,
  );
  return known ?? 'new';
}

export function toLiveReportStatus(status: ComplaintStatus): string {
  return LIVE_STATUS[status];
}

function toReportedPlace(report: LiveReport, store: LiveReportedStore | null): ReportedPlace {
  return {
    id: String(report.store.id),
    name: report.store.name,
    categoryName: store?.mainCategory?.name ?? '',
    address: store?.location?.address ?? '',
    rating: store?.rating ?? 0,
    reviewCount: store?.reviewCount ?? 0,
    imageUrl: store?.logoUrl ?? null,
  };
}

function toComplaintWith(report: LiveReport, store: LiveReportedStore | null): Complaint {
  return {
    id: String(report.id),
    reference: `#${report.id}`,
    reason: report.reason,
    status: toComplaintStatus(report.status),
    reportedOn: toIsoDay(report.created_at),
    reporter: {
      id: String(report.user.id ?? ''),
      name: report.user.name ?? '',
      email: report.user.email ?? '',
      phone: report.user.phone ?? '',
    },
    place: toReportedPlace(report, store),
  };
}

/** The list only names the store, so the place card fields stay empty here. */
export function toComplaint(report: LiveReport): Complaint {
  return toComplaintWith(report, null);
}

/** The short reason fills the grey box; the reporter's longer text goes under it. */
export function toComplaintDetail(
  report: LiveReport,
  store: LiveReportedStore | null,
): ComplaintDetail {
  return {
    ...toComplaintWith(report, store),
    description: report.reason,
    userDetails: report.description ?? '',
    attachmentUrls: report.images.map((image) => image.image),
    adminNotes: report.admin_notes ?? '',
  };
}
