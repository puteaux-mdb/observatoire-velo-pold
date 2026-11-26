import config from '~/config.json';

// Engagements : plans dans lesquels un tronçon est inscrit (VIF, plan vélo départemental,
// schéma directeur POLD…), chacun avec sa période et son échéance.

export interface Commitment {
  id: string;
  plan: string;
  label: string;
  short: string;
  owner: string;
  period: string;
  deadline: number;
  note?: string;
}

export const COMMITMENTS = (config as unknown as { commitments?: Commitment[] }).commitments ?? [];

export function getCommitment(id: string): Commitment | undefined {
  return COMMITMENTS.find((c) => c.id === id);
}

const DONE_STATUSES = ['done', 'variante'];

/** Échéance dépassée : l'année d'échéance est passée et le tronçon n'est pas réalisé */
export function isCommitmentOverdue(commitment: Commitment, status: string, now = new Date()): boolean {
  return !DONE_STATUSES.includes(status) && now.getFullYear() > commitment.deadline;
}

/** Le tronçon a au moins un engagement dont l'échéance est dépassée */
export function hasOverdueCommitment(engagements: string[] | undefined, status: string, now = new Date()): boolean {
  return (engagements ?? []).some((id) => {
    const c = getCommitment(id);
    return c ? isCommitmentOverdue(c, status, now) : false;
  });
}
